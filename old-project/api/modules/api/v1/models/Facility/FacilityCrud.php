<?php

namespace app\modules\api\v1\models\Facility;

use app\modules\api\models\ServiceResult;
use app\modules\api\models\RecordFilter;
use Yii;
use app\modules\api\v1\models\FacilityGroup\FacilityGroup;
use app\modules\api\v1\models\UserFacility\UserFacility;
use app\modules\api\models\AppEnums;


class FacilityCrud{
        
    public function verifyCreateOrUpdateParams($facility, $facilityGroups) {
        $errors = array();
        $checkFacilityGroup = isset($facilityGroups);
        
        if(!$checkFacilityGroup || !is_array($facilityGroups) ||  empty($facilityGroups) ){
            $errors['groups'] = ['You cannot leave this field blank'];
        }
        
        return $errors;
    }
    
    public function create($facility, $facilityGroups){
        $errors = $this->verifyCreateOrUpdateParams($facility, $facilityGroups);
        $transaction = Yii::$app->db->beginTransaction();
        $validate = $facility->validate();
        if((sizeof($errors) == 0) && $validate)
        {

            $isSaved = $facility->save();

            if ($isSaved) {
                //$facility->id = $isSaved;
                if (isset($facilityGroups)){
                    if (is_array($facilityGroups)){
                        foreach ($facilityGroups as $fg) {
                            $fg->facility_id = $facility->id;
                            $isSaved = $fg->save();
                            if(!$isSaved){
                                $errors = $fg->getErrors();
                                break;
                            }
                        }
                    }
                    else{
                        $facilityGroups->facility_id = $facility->id;
                        $isSaved = $facilityGroups->save();
                        if(!$isSaved){
                            $errors = $facilityGroups->getErrors();
                        }

                    }
                }
                else{
                    // Facility Groups is not set
                    $isSaved = false;
                    $errors["facility_groups"] = "Facility groups should not be null";

                }

            }
            else {
    //            Collect errors
                    $errors = $facility->getErrors();
            }
        }
        else{
            $facilityErrors = $facility->getErrors();
            $errors = array_merge($errors,$facilityErrors);
            
        }
        
        $serviceResult = null;
        
        if ((sizeof($errors) == 0)) {
            $transaction->commit();
            $data = array("id" => $facility->id);
            $serviceResult = new ServiceResult(true, $data, $errors = array());
        } 
        else{
            $transaction->rollBack();
            $serviceResult = new ServiceResult(false, $data = array(), $errors = $errors);

        }
        
        return $serviceResult;
    }
    
    public function update(Facility $facility, $facilityGroups){
        $errors = $this->verifyCreateOrUpdateParams($facility, $facilityGroups);
        $transaction = Yii::$app->db->beginTransaction();
        $validate = $facility->validate();
        
        if((sizeof($errors) == 0) && $validate)
        {
            $isSaved = $facility->save();

            if ($isSaved) {
                if(strtoupper($facility->deactivate) === 'T'){
                    $facilityUsersToDeactive = $facility->getActiveUsers(false)
                        ->select(["user.id", "user.deactivate", 
                            "user.enable_two_step_verification", 
                            "user.category", "user.role"])
                        ->all();
                    $usersToDeactivateIds = sizeof($facilityUsersToDeactive) > 0 ? 
                        $this->getUserIdsFromUser($facilityUsersToDeactive) : array();
                    if(sizeof($usersToDeactivateIds)){

                        if(strtoupper($facility->type) === "HL"){
                            $filteredUserIds = $this->getUserIdsFromUserFacility(
                                UserFacility::
                                filterUsersExistInMultipleHospitals($usersToDeactivateIds));
                            foreach ($facilityUsersToDeactive as $u){
                            if(in_array($u->id, $filteredUserIds) ){
    //                            Create deactivate scenario
                                    $u->deactivate = 'T';
                                    $u->enable_two_step_verification = 'F';
                                    $isSaved = $u->save();
                                    if(!$isSaved){
            //                        Collect Errors
                                        $errors = $u->getErrors();
                                        break;
                                    }
                                }
                            }
                            if(sizeof($errors) == 0){
                                $groupsToDeactivate = $facility->getActiveGroups()
                                    ->select(["group.id", "group.deactivate" ])->all();
                                foreach ($groupsToDeactivate as $g){
                                    $g->deactivate = 'T';
                                    $isSaved = $g->save();
                                    if(!$isSaved){
            //                        Collect Errors
                                        $errors = $g->getErrors();
                                        break;
                                    }
                                }
                            }
                        }

                        else{
                            $filteredUserIds = $this->getUserIdsFromUserFacility(
                                UserFacility::
                                filterUsersExistInMultipleClinics($usersToDeactivateIds));
                            foreach ($facilityUsersToDeactive as $u){
                            if(in_array($u->id, $filteredUserIds) ){
                                    $u->deactivate = 'T';
                                    $u->enable_two_step_verification = 'F';
                                    $isSaved = $u->save();
                                    if(!$isSaved){
            //                        Collect Errors
                                        $errors = $u->getErrors();
                                        break;
                                    }
                                }
                            }

                        }
                    }

                }

                // This should be in else block
                else{
                    if (isset($facilityGroups)){
                        FacilityGroup::deleteFacilityGroups($facility->id);
                        if (is_array($facilityGroups)){
                            foreach ($facilityGroups as $fg) {
                                $fg->facility_id = $facility->id;
                                $isSaved = $fg->save();
                                if(!$isSaved){
        //                        Collect Errors
                                    $errors = $fg->getErrors();
                                    break;
                                }
                            }
                        }
                        else{
                            $facilityGroups->facility_id = $facility->id;
                            $isSaved = $facilityGroups->save();
                            if(!$isSaved){
        //                        Collect Errors
                                $errors = $facilityGroups->getErrors();
                            }

                        }
                    }
                }
            }
            else {
        //            Collect errors
                        $errors = $facility->getErrors();
                }
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
    
    public function readAll(RecordFilter $recordFilter){
        $serviceResult = null;
        if ($recordFilter->validate()) {
            
            $query = Facility::find();
            
            $filteredFields;
            if (isset($recordFilter->fields)){
                $filteredFields = array_filter(explode(',', $recordFilter->fields));
            }
            else{
                $filteredFields = array();
            }
            
            Facility::addSortFilter($query, $recordFilter->orderby, $recordFilter->sort);

            Facility::addFilters($query, $recordFilter->filter);
            
            $record_count = $query->distinct()->count();
            Facility::addOffsetAndLimit($query, $recordFilter->page, $recordFilter->limit);
            
            $result = $query->all();
            
            $resultArray = array();
            foreach ($result as $value){
                $value->type = AppEnums::getFacilityText($value->type);
                $valueArray = $value->toArray($filteredFields, $filteredFields);
                array_push($resultArray, $valueArray);
            }
            
            $result = $resultArray;
            

            $data = array("total_records" => $record_count, "records" => $result);
            $serviceResult = new ServiceResult(true, $data, $errors = array());
            return $serviceResult;
            
        } 
        else {
            $serviceResult = new ServiceResult(false, $data = array(), 
                $errors = $recordFilter->getErrors());
            return $serviceResult;
        }
    }
    
    public static function read(RecordFilter $recordFilter, $findModel = true){
/*
 *      This will be changed because it is an extra call to db if we need
 *      some facility realted fields. 
 *      E.g. if we need facility's groups we fetch facility object first.
 */        
        $facility = Facility::findOne($recordFilter->id);
        if($facility !== null ){
            if($findModel){
                return $facility;
            }
            else{
                $filteredFields;
                if (isset($recordFilter->fields)){
                    $filteredFields = array_filter(explode(',', $recordFilter->fields));
                }
                else{
                    $filteredFields = array();
                }
                $facility_array = $facility->toArray($filteredFields, $filteredFields);
//                Change facility call in client side application.
                if(sizeof($filteredFields)){
                    if(in_array('groups', $filteredFields)){
                        $facility_array["groups"] = $facility->groups;
                    }
                    if(in_array('users', $filteredFields)){
                        $facility_array["users"] = $facility->users;
                    }
                }
                else{
                    $facility_array["groups"] = $facility->groups;
                    $facility_array["users"] = $facility->users;
                }
//                $facility_array["groups"] = $facility->groups;
//                $facility_array["users"] = $facility->users;
                return $facility_array;
            }
            
        }
        else{
            throw new \Exception("Facility is not exist");
        }
    }
    
    private function getUserIdsFromUser($facilityUsers){
        return array_map(function($user){return $user->id;}, $facilityUsers);
    }
    
    private function getUserIdsFromUserFacility($facilityUserIds){
        
        return array_map(function($u){return $u['user_id'];}, $facilityUserIds);
        
    }

    

}
