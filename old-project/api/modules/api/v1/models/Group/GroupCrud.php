<?php

namespace app\modules\api\v1\models\Group;

use app\modules\api\v1\models\Group\Group;
use app\modules\api\models\ServiceResult;
use app\modules\api\models\RecordFilter;
use Yii;
use app\modules\api\v1\models\UserGroup\UserGroup;
use app\modules\api\v1\models\User\User;
use app\modules\api\models\AppEnums;

class GroupCrud{
    
    public function create(Group $group){
        $isSaved = $group->save();
        $serviceResult = null;
        
        if ($isSaved) {
            $data = array("id" => $group->id);
            $serviceResult = new ServiceResult(true, $data, $errors = array());
        } 
        else{
            $serviceResult = new ServiceResult(false, $data = array(), 
                $errors = $group->getErrors());
        }
        
        return $serviceResult;
    }
    
    public function update(Group $group){
        $transaction = Yii::$app->db->beginTransaction();
        
        $isSaved = $group->save();
        $serviceResult = null;
        $errors = array();
        if ($isSaved) {
//            Refactor this deactivate logic            
            if(strtoupper($group->deactivate) === 'T'){
                $groupUsers = $group->getActiveUsers()
                    ->select(["user.id", "user.deactivate", 
                        "user.enable_two_step_verification"])->all();
                $groupUserIds = sizeof($groupUsers) > 0 ?
                    $this->getUserIdsFromUser($groupUsers) : array();
                if(sizeof($groupUserIds)){
                    $filteredUserIds = $this->getUserIdsFromUserGroup(
                        UserGroup::filterUsersExistInMultipleGroups($groupUserIds));
                    foreach ($groupUsers as $u){
                        if(in_array($u->id, $filteredUserIds)){
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

                }

            }
        }
        else{
//            Collect errors
                $errors = $group->getErrors();
        }
        if (sizeof($errors) == 0) {
            $transaction->commit();
            $data = array("message" => "Record has been updated");
            $serviceResult = new ServiceResult(true, $data, $errors = array());
        } 
        else{
            $transaction->rollBack();
            $serviceResult = new ServiceResult(false, $data = array(), $errors);
        }
        
        return $serviceResult;
    }
    
    private function getUserIdsFromUser($groupUsers){
        return array_map(function($users){return $users->id;}, $groupUsers);
    }
    
    private function getUserIdsFromUserGroup($groupUsers){
        
        return array_map(function($u){return $u['user_id'];}, $groupUsers);
        
    }
    
    public function verifyReadParams($facilities){
        $checkFacilities = isset($facilities);
        
        if($checkFacilities && !is_bool($facilities) ){
            throw new \Exception("Facilities should be true of false");
        }
        
        
    }
    
    public function readAll(RecordFilter $recordFilter, $affiliatedHospital = false){
        $this->verifyReadParams($affiliatedHospital);
        $serviceResult = null;
        if ($recordFilter->validate()) {
            
            $query = Group::find();
            
            $filteredFields;
            if (isset($recordFilter->fields)){
                $filteredFields = array_filter(explode(',', $recordFilter->fields));
            }
            else{
                $filteredFields = array();
            }
            
            if($affiliatedHospital){
                $query->with(['facilities']);
            }
            
            Group::addSortFilter($query, $recordFilter->orderby, $recordFilter->sort);

            Group::addFilters($query, $recordFilter->filter);
            
            $record_count = $query->distinct()->count();
            Group::addOffsetAndLimit($query, $recordFilter->page, $recordFilter->limit);
            
            $result = $query->all();
            
            if($affiliatedHospital){
                $resultArray = array();
                foreach ($result as $value){
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
            $serviceResult = new ServiceResult(false, $data = array(), 
                $errors = $recordFilter->getErrors());
            return $serviceResult;
        }
        
    }
    
    private function getFacilitiesString($facilities){
        return implode(",", array_filter(array_map(function($fac){
            return strtolower($fac->type) === 'hl' ?  $fac->name : null; 
        }, $facilities)) );
    }

    public function read(RecordFilter $recordFilter, $findModel = true){
/*
 *      This will be changed because it is an extra call to db if we need
 *      some group realted fields. 
 *      E.g. if we need groups facilities we fetch group object first.
 */        
        $group = Group::findOne($recordFilter->id);
        if($group !== null ){
            if($findModel){
                return $group;
            }
            else{
                $filteredFields;
                if (isset($recordFilter->fields)){
                    $filteredFields = array_filter(explode(',', $recordFilter->fields));
                }
                else{
                    $filteredFields = array();
                }
                $group_array = $group->toArray($filteredFields, $filteredFields);
                if(sizeof($filteredFields)){
                    if(in_array('facility', $filteredFields)){
                        $group_array["facilities"] = $group->facilities;
                    }
                    else if(in_array('hospital_facility', $filteredFields)){
                        $group_array["facilities"] = $group->hospitalFacilities;
                    }
                    if(in_array('users', $filteredFields)){
                        $group_array["users"] = $group->users;
                    }
                    if(in_array('on_call_users', $filteredFields)){
                        $onCallUsers = $group->onCallUsers;
                        foreach ($onCallUsers as $value){
                            $value->specialty = AppEnums::getSpecialtyText($value->specialty);
                        }
                        $group_array["on_call_users"] = $onCallUsers;
                    }
                }
                else{
                    $group_array["facilities"] = $group->facilities;
                    $group_array["users"] = $group->users;
                }
                
                return $group_array;
            }
        }
        else{
            throw new \Exception("Group is not exist");
        }   
    }
    
    
    
    
}