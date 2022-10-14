<?php

namespace app\modules\api\v1\models\User;

use app\modules\api\models\ServiceResult;
use app\modules\api\models\RecordFilter;
use app\modules\api\v1\models\UserGroup\UserGroup;
use Yii;
use app\modules\api\v1\models\UserFacility\UserFacility;
use app\modules\api\v1\models\User\User;
use app\modules\api\models\AppEnums;
use app\modules\api\v1\models\UserOnCallGroup\UserOnCallGroup;
use app\modules\api\models\AppQueries;
use app\modules\api\components\CryptoLib;

class UserCrud{
    /*
     * param: User
     * param: UserGroup
     * param: UserFacility
     */
    
    private function verifyCreateOrUpdateParams(User $user, $userGroups, $userFacilities, $onCallUserGroups){
        /*
         * Function checks for valid params and throws exception if it has not valid params
         * E.g. Check if user is hospital physician it has groups and facilities
         */
        $errors = array();
        $checkUserGroup = isset($userGroups);
        $checkUserFacilities = isset($userFacilities);
        $checkOnCallUserGroups = isset($onCallUserGroups);
        if($checkUserGroup && !(is_array($userGroups) && !empty($userGroups)) ){
            $errors['groups'] = ['You cannot leave this field blank'];
        }
        if($checkUserFacilities && !(is_array($userFacilities) && !empty($userFacilities)) ){
            $errors['facilities'] = ['You cannot leave this field blank'];
        }
        if ($checkUserGroup && $checkUserFacilities) {
            $groupIds = $this->getGroupIds(AppQueries::getFacilitiesGroups($userFacilities));
            $commonGroups = array_intersect($userGroups,$groupIds);
            $groupDiff = array_diff($userGroups,$commonGroups);
            if(sizeof($groupDiff) != 0){
                $errors['groups'] = ['One of the group is not exist in selected facility'];
            }
        }
        if($checkOnCallUserGroups && !(is_array($onCallUserGroups) && !empty($onCallUserGroups)) ){
            $errors['on_call_groups'] = ['On call groups should be array'];
        }
        if (sizeof($errors) == 0) {
            if( (isset($user->category) && isset($user->role)) ){
                if( ( ($user->category == "HL" && $user->role == "PN") || 
                      ($user->category == "CC" && $user->role == "SN") ) && 
                    !( $checkUserGroup && $checkUserFacilities)  ){
                    $errors['groups'] = ["User should have groups"];
                    $errors['facilities'] = ['User should have facilities'];
                }
                else if( !( ($user->category == "HL" && $user->role == "PN") || 
                      ($user->category == "CC" && $user->role == "SN") || 
                      ($user->category == "HR") || 
                    ($user->category == "AS" ) ) ){

                    if(!$checkUserFacilities){
                        $errors['facilities'] = ["User should have facilities"];
                    }
                    else if($checkUserGroup){
                        $errors['groups'] = ["User should not have groups"];
                    }

                }
                else if( ( ($user->category == "AS" ) || $user->category == "HR") 
                    && ($checkUserGroup || $checkUserFacilities)  ){
                        $errors['groups'] = ["User should not have groups"];
                        $errors['facilities'] = ["User should not have facilities"];
                }
            }
        }
        
        return $errors;
        
    }
    
    public function create(User $user, $userGroups, $userFacilities, $onCallGroupIds){
        /*
         * $userGroups is not mandatory for all users
         * $userFacilities is not mandatory for all users
         */
        $errors = $this->verifyCreateOrUpdateParams($user, $userGroups, $userFacilities, $onCallGroupIds);
        
        /*
         * Get groups of facilities then check $userGroups are matched with 
         * facility's group
         */
        
        $transaction = Yii::$app->db->beginTransaction();
        $validate = $user->validate();
        
        if((sizeof($errors) == 0) && $validate)
        {
            
            $user->password = CryptoLib::hash('12345678');
            $isSaved = $user->save();
            if ($isSaved) {
                if (isset($userGroups)){
                    foreach ($userGroups as $ug) {
                        $tempUgObject = new UserGroup();
                        $tempUgObject->group_id = $ug;
                        $tempUgObject->user_id = $user->id;
                        $isSaved = $tempUgObject->save();
                        if(!$isSaved){
    //                        Collect Errors
                            $errors = $tempUgObject->getErrors();
                            break;
                        }
                    }

                }
    //          if no errors in previous operation then proceed  
                if ( (sizeof($errors) == 0) && isset($userFacilities) ){
                    foreach ($userFacilities as $uf) {
                        $tempUfObject = new UserFacility();
                        if($user->category === "HL"){
                            $tempUfObject->scenario = "hospital";
                        }
                        else if(in_array ($user->category, array("CC", "FT", "ET")) &&
                                !($user->category === "CC" && $user->role === "SN")   ){
                            $tempUfObject->scenario = "clinic";
                        }
                        $tempUfObject->facility_id = $uf;
                        $tempUfObject->user_id = $user->id;
                        $isSaved = $tempUfObject->save();
                        if(!$isSaved){
    //                        Collect Errors
                            $errors = $tempUfObject->getErrors();
                            break;
                        }
                    }

                }


            }
            else {
    //            Collect errors
                    $errors = $user->getErrors();
            }
        }
        else{
            $userErrors = $user->getErrors();
            $errors = array_merge($errors,$userErrors);
            
        }
        
        $serviceResult = null;
        
        if ((sizeof($errors) == 0)) {
            $transaction->commit();
            $data = array("id" => $user->id);
            $serviceResult = new ServiceResult(true, $data, $errors = array());
        } 
        else{
            $transaction->rollBack();
            $serviceResult = new ServiceResult(false, $data = array(), $errors = $errors);

        }
        
        return $serviceResult;
    }
    
    public function update(User $user, $userGroups, $userFacilities, $onCalluserGroups){
        /*
         * $userGroups is not mandatory for all users
         * $userFacilities is not mandatory for all users
         */
        $errors = $this->verifyCreateOrUpdateParams($user, $userGroups, $userFacilities, 
                $onCalluserGroups);

        $transaction = Yii::$app->db->beginTransaction();
        if(strtoupper($user->deactivate) === 'T'){
           $user->enable_two_step_verification = 'F'; 
        }

        $validate = $user->validate();
        
        if((sizeof($errors) == 0) && $validate)
        {
            $isSaved = $user->save();
            UserGroup::deleteUsersGroups($user->id);
            UserFacility::deleteUsersFacilities($user->id);
            UserOnCallGroup::deleteUsersGroups($user->id);

            if ($isSaved) {
                if (isset($onCalluserGroups)){
                    $commonGroups = array_intersect($userGroups, $onCalluserGroups);
                    foreach ($commonGroups as $OnCallUg) {
                        $tempUgOnCallObject = new UserOnCallGroup();
                        $tempUgOnCallObject->group_id = $OnCallUg;
                        $tempUgOnCallObject->user_id = $user->id;
                        $isSaved = $tempUgOnCallObject->save();
                        if(!$isSaved){
    //                        Collect Errors
                            $errors = $tempUgOnCallObject->getErrors();
                            break;
                        }
                    }

                }
                if ( (sizeof($errors) == 0) && isset($userGroups)){
                    foreach ($userGroups as $ug) {
                        $tempUgObject = new UserGroup();
                        $tempUgObject->user_id = $user->id;
                        $tempUgObject->group_id = $ug;
                        $isSaved = $tempUgObject->save();
                        if(!$isSaved){
    //                        Collect Errors
                            $errors = $tempUgObject->getErrors();
                            break;
                        }
                    }

                }
    //          if no errors in previous operation then proceed  
                if ( (sizeof($errors) == 0) && isset($userFacilities) ){
                    foreach ($userFacilities as $uf) {
                        $tempUfObject = new UserFacility();
                        $tempUfObject->user_id = $user->id;
                        $tempUfObject->facility_id = $uf;
                        $isSaved = $tempUfObject->save();
                        if(!$isSaved){
    //                        Collect Errors
                            $errors = $tempUfObject->getErrors();
                            break;
                        }
                    }

                }


            }
            else {
    //            Collect errors
                    $errors = $user->getErrors();
            }
        }
        else{
            $userErrors = $user->getErrors();
            $errors = array_merge($errors,$userErrors);
            
        }
        
        
        $serviceResult = null;
        
        if ((sizeof($errors) == 0)) {
            $transaction->commit();
            $data = array("message" => "Record has been updated");
            $serviceResult = new ServiceResult(true, $data, $errors = array());
        } 
        else{
            $transaction->rollBack();
            $serviceResult = new ServiceResult(false, $data = array(), $errors = $errors);

        }
        
        return $serviceResult;
    }
    
    public function verifyReadParams($facilities){
        $checkFacilities = isset($facilities);
        
        if($checkFacilities && !is_bool($facilities) ){
            throw new \Exception("Facilities should be true of false");
        }
        
        
    }
    
    public function readAll(RecordFilter $recordFilter, $affiliatedFacilities = false){
        $this->verifyReadParams($affiliatedFacilities);
        $serviceResult = null;
        if ($recordFilter->validate()) {
            
            $query = User::find();
            
            $filteredFields;
            if (isset($recordFilter->fields)){
                $filteredFields = array_filter(explode(',', $recordFilter->fields));
            }
            else{
                $filteredFields = array();
            }
            
            if($affiliatedFacilities){
                $query->with(['facilities']);
            }
            
            
            User::addSortFilter($query, $recordFilter->orderby, $recordFilter->sort);

            User::addFilters($query, $recordFilter->filter);

            $record_count = $query->distinct()->count();
            User::addOffsetAndLimit($query, $recordFilter->page, $recordFilter->limit);
            
            $result = $query->all();
            
            if($affiliatedFacilities){
                $resultArray = array();
                foreach ($result as $value){
                    $value->category = AppEnums::getCategoryText($value->category);
                    $value->role = AppEnums::getRoleText($value->role);
                    $valueArray = $value->toArray($filteredFields, $filteredFields);    
                    if(sizeof($filteredFields)){
                        if(in_array('facility', $filteredFields)){
                            $valueArray['facility'] = $this->getFacilitiesString($value->facilities);
                        }
                    }
                    else{
                        $valueArray['facility'] = $this->getFacilitiesString($value->facilities);
                    }
                    array_push($resultArray, $valueArray);
                }
                
                $result = $resultArray;

            }

            $data = array("total_records" => $record_count, "records" => $result);
            $serviceResult = new ServiceResult(true, $data, $errors = array());
            return $serviceResult;
            
        } 
        else {
            $serviceResult = new ServiceResult(false, $data = array(), $errors = $recordFilter->getErrors());
            return $serviceResult;
        }
    }
    
    public function read(RecordFilter $recordFilter, $findModel = true){
/*
 *      This will be changed because it is an extra call to db if we need
 *      some user realted fields. 
 *      E.g. if we need user facilities we fetch user object first.
 */        
        $user = User::findOne($recordFilter->id);
        if($user !== null ){
            if($findModel){
                return $user;
            }
            else{
                $filteredFields;
                if (isset($recordFilter->fields)){
                    $filteredFields = array_filter(explode(',', $recordFilter->fields));
                }
                else{
                    $filteredFields = array();
                }
                $user_array = $user->toArray($filteredFields, $filteredFields);
                $user_array["groups"] = $user->groups;
                $user_array["facilities"] = $user->facilities;
                if($user->category == "HL" && $user->role == "PN" ||
                    $user->category == "CC" && $user->role == "SN"){
                        $user_array["on_call_groups"] = $user->onCallGroups;
                }
                else{
                    $user_array["on_call_groups"] = array();
                }
                return $user_array;
            }
            
        }
        else{
            throw new \Exception("User is not exist");
        }
    }
    
    private function getFacilitiesString($facilities){
        return implode(",", array_filter(array_map(function($fac){
            return $fac->name; 
        }, $facilities)) );
    }
    
    private function getGroupIds($facilityGroups){
        $tempGroups = array();
        foreach ($facilityGroups as $fg) {
            array_push($tempGroups, $fg["group_id"]);
        }
        return $tempGroups;
    }
    
    public function updateUserPassword($user){
        $isSaved = false;
        $errors = array();
        $transaction = Yii::$app->db->beginTransaction();
        if(strtoupper($user->deactivate) !== 'T'){
           $isSaved = $user->save();
           if(!$isSaved){
//              Collect Errors
                $errors = $user->getErrors();
           }
           
        }
        else{
            $errors["deactivate"] = "Cannot update user. It is already deactivated";
        }
        
        $serviceResult = null;
        
        if ($isSaved) {
            $transaction->commit();
            $data = array("message" => "Record has been updated");
            $serviceResult = new ServiceResult(true, $data, $errors = array());
        } 
        else{
            $transaction->rollBack();
            $serviceResult = new ServiceResult(false, $data = array(), $errors = $errors);

        }

        return $serviceResult;
        
        
    }
    
}
