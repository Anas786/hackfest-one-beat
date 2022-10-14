<?php

namespace app\modules\api\v1\models\Admission;

use app\modules\api\v1\models\Admission\Admission;
use app\modules\api\models\ServiceResult;
use app\modules\api\models\RecordFilter;
use app\modules\api\v1\models\Facility\FacilityCrud;
use app\modules\api\models\AppEnums;
use app\modules\api\v1\models\Group\GroupCrud;
use Yii;
use app\modules\api\v1\models\AdmissionStatus\AdmissionStatusCrud;
use app\modules\api\models\AppQueries;
use app\modules\api\models\AppStatus;
//use app\modules\api\v1\models\AdmissionAttachment\AdmissionAttachmentCrud;

class AdmissionCrud{
    
    private function verifyCreateParams(Admission $admission, $facility, $facilityGroupIds, $admissionDiagnosis){
        $errors = array();
        /*if(!isset($admissionDiagnosis) || !(is_array($admissionDiagnosis) && !empty($admissionDiagnosis))){
            $errors["diagnosis"] = "You cannot leave this field blank";
        }*/
        if(!isset($admission)){
            $errors["admission"] = "Admission should not be null";
        }
        
        if($facility->deactivate === "T" || $facility->type !== "HL"){
            $errors["facility"] = "Selected facility should be activated hospital";
        }
        
        if(!in_array($admission->group, $facilityGroupIds)){
            $errors["group"] = "Selected group should activated and exist in hospital";
        }
        
        return $errors;
    }
    
    private function verifyUpdateParams(Admission $admission, $facilityGroupIds, $groupPhysiciansIds){
        $errors = array();
        if(!in_array($admission->group, $facilityGroupIds)){
            $errors["group"] = "Selected group should activated and affiliated to clinic";
        }
        
        if(isset($groupPhysiciansIds) && !in_array($admission->physician, $groupPhysiciansIds)){
            $errors["physician"] = "Selected physician should activated and exist in group";
        }
        
        return $errors;
    }
    
    public function update(Admission $admission, $user){
        $recordFilter = new RecordFilter();
        $recordFilter->id = $admission->sent_by_facility;
        $facility = FacilityCrud::read($recordFilter, true);
        $facilityGroups = $facility->getActiveGroups()->all();
        $facilityGroupIds = $this->getGroupsIds($facilityGroups);
        if($admission->physician != 0){
            $recordFilter->id = $admission->group;
            $group = GroupCrud::read($recordFilter, true);
            $groupPhysicians = $group->getActiveHospitalPhysicianUsers()->all();
            $groupPhysiciansIds = $this->getGroupPhysicianIds($groupPhysicians);
        }
        else{
            $groupPhysiciansIds = null;
        }
        $errors = $this->verifyUpdateParams($admission, $facilityGroupIds, $groupPhysiciansIds);
        
        $db = Yii::$app->db;
        $transaction = $db->beginTransaction();
        
        if((sizeof($errors) == 0))
        {
            $isSaved = $admission->save();
            if(!$isSaved){
//          Collect Errors
                $errors = $admission->getErrors();
            }
            if((sizeof($errors) == 0) && $admission->last_status == AppStatus::denied){
                $lastStatus = $admission->last_status;    //Denied
                $currentStatus = AppStatus::initiated; //Initiated
                $admissionStatusCrud = new AdmissionStatusCrud();
                $createStatusSuccess = $admissionStatusCrud->create($db, $admission, $lastStatus, 
                        $currentStatus, $user["id"]);
                if(!$createStatusSuccess){
                    $errors['status'] = 'Valid Status should be given';
                }
            }
        }
        
        $serviceResult = null;
        
        if ((sizeof($errors) == 0)) {
            $transaction->commit();
            $data = array();
            $serviceResult = new ServiceResult(true, $data, $errors = array());
        } 
        else{
            $transaction->rollBack();
            $serviceResult = new ServiceResult(false, $data = array(), 
                $errors = $errors);
        }
        
        return $serviceResult;
    }
    
    public function create(Admission $admission, $admissionDiagnosis, $user, $fileAttachments, $admissionDiagnostics, $admissionInsurance, $admissionHistory, $admissionMedication, $admissionSpecialty){
        
        $recordFilter = new RecordFilter();
        $recordFilter->id = $admission->sent_to_facility;
        $facility = FacilityCrud::read($recordFilter, true);
        $facilityGroups = $facility->getActiveGroups()->all();
        $facilityGroupIds = $this->getGroupsIds($facilityGroups);
        /*
         * Create Admission diagnosis table to store diagnosis
         * Diagnosis is mandatory for creating admission
         * Diagnosis should be array which sent through service
         * Use verifyCreateOrUpdateParams method to verify admission diagnosis field
         * 
         */
        $errors = $this->verifyCreateParams($admission, $facility, $facilityGroupIds, $admissionDiagnosis);
        
        $db = Yii::$app->db;
        $transaction = $db->beginTransaction();
        $admission->transaction_number = $this->generateTransactionNumber();
        $admission->diagnostic_orders = $admissionDiagnostics;
        $admission->medication_orders = $admissionMedication;
        $admission->insurance_info = $admissionInsurance;
        $admission->medical_history = $admissionHistory;
        $admission->specialty_consult = $admissionSpecialty;
        $validate = $admission->validate();
        
        if((sizeof($errors) == 0) && $validate)
        {
            $admission->intiated_on = date("Y-m-d H:i:s", time());
            $isSaved = $admission->save();
            if ($isSaved) {
                $lastStatus = -1;
                $currentStatus = AppStatus::initiated;
                $admissionStatusCrud = new AdmissionStatusCrud();
                $admissionStatusCrud->create($db, $admission, $lastStatus, $currentStatus, 
                        $user["id"]);

                foreach ($admissionDiagnosis as $admDiag) {
                    $admDiag->admission_id = $admission->transaction_number;
                    $isSaved = $admDiag->save();
                    if(!$isSaved){
                        $errors = $admDiag->getErrors();
                        break;
                    }
                }
                if(sizeof($errors == 0) && $fileAttachments != null){
                    $admissionAttachmentCrud = new AdmissionAttachmentCrud();
                    $fileAttachments = $admissionAttachmentCrud->filterFileAttachmentArray($fileAttachments);
                    $createAdmAttachmentSuccess = $admissionAttachmentCrud->
                            create($admission->transaction_number, $fileAttachments, $user["id"]);
                    if($createAdmAttachmentSuccess){
                        if(!$this->moveAdmissionAttachment($fileAttachments, $admission->transaction_number)){
                            $errors["file"] = "File(s) cannot be associated to admission";
                        }
                            
                    }
                    else {
                            $errors["file"] = "File(s) cannot be associated to admission";
                    }
                    
                }
            }
            
        }
        else{
            $admissionErrors = $admission->getErrors();
            $errors = array_merge($errors,$admissionErrors);
        }
        $serviceResult = null;
        
        if ((sizeof($errors) == 0)) {
            $transaction->commit();
            $data = array("transaction_number" => $admission->transaction_number);
            $serviceResult = new ServiceResult(true, $data, $errors = array());
            $message = "Transfer#:".$admission->transaction_number." received on ".date("l jS \of F Y h:i:s A");
            $name = "Patient Transfer Alert";
            $phone = "12144703235";
            AppQueries::sendAdmissionAlert($name, $phone, $message);
        } 
        else{
            $transaction->rollBack();
            $serviceResult = new ServiceResult(false, $data = array(), 
                $errors = $errors);
        }
        
        return $serviceResult;
    }
    
    private function generateTransactionNumber(){
        $todayDate = date("mdY");
        $admission = Admission::getLastTransactionId($todayDate);
        
        if(sizeof($admission)){
            $transactionIdArray = explode("-", $admission->transaction_number)[1];
            $newTransactionCount = (int)$transactionIdArray + 1;
            $newTransactionCountPadded = sprintf("%02s", $newTransactionCount);
            return $todayDate . "-". $newTransactionCountPadded;
            
        }
        else{
            return $todayDate . "-01";
        }
        
    }
    
    
    private function getGroupsIds($facilityGroups){
        
        return array_map(function($g){return $g->id;}, $facilityGroups);
        
    }
    
    private function getGroupPhysicianIds($groupPhysicians){
        
        return array_map(function($grpPhy){return $grpPhy->id;}, $groupPhysicians);
        
    }
    
    public function read(RecordFilter $recordFilter, $findModel = true){
        $admission = Admission::findOne($recordFilter->id);
        if($admission !== null ){
            if($findModel){
                return $admission;
            }
            else{
                $filteredFields;
                if (isset($recordFilter->fields)){
                    $filteredFields = array_filter(explode(',', $recordFilter->fields));
                }
                else{
                    $filteredFields = array();
                }
                $admissionArray = $admission->toArray($filteredFields, $filteredFields);
                $admissionArray["sent_to_facility"] = $admission->hospital;
                $admissionArray["sent_by_facility"] = $admission->clinic;
                $admissionArray["clinician_name"] = $admission->user->first_name.' '.$admission->user->last_name;
                $admissionArray["clinician_cell"] = $admission->user->cell_phone;
                $admissionArray["clinician_email"] = $admission->user->email;
                
                $admissionArray["group"] = $admission->groupObject;
                $admissionArray["admitting_physician"] = $admission->hospitalPhysician;
                $admissionArray['bed_type'] = array("id" => $admission->bed_type, 
                                                    "name" => AppEnums::getBedTypeText($admission->bed_type));
                $admissionArray['code_status'] = array("id" => $admission->code_status, 
                                                       "name" => AppEnums::getCodeSatusText($admission->code_status));
                $admissionArray['mode_of_tranportation'] = array("id" => $admission->mode_of_tranportation, 
                                                       "name" => AppEnums::getTranportationText($admission->mode_of_tranportation));
                $admissionArray['diagnosis'] = $admission->admissionDiagnosis;
                $admissionArray['status_icon'] = AppEnums::getStatusIconsText($admission->last_status);
                $admissionArray['status_text'] = AppEnums::getStatusText($admission->last_status);
                $admissionArray['files'] = AppQueries::getAdmissionAttachments($admission['transaction_number']);
                $admissionArray["diagnostic_orders"] = unserialize($admission->diagnostic_orders);
                $admissionArray["insurance_info"] = unserialize($admission->insurance_info);
                $admissionArray["medical_history"] = unserialize($admission->medical_history);
                $admissionArray["medication_orders"] = unserialize($admission->medication_orders);
                $admissionArray["specialty_consult"] = unserialize($admission->specialty_consult);

                
//                $admissionArray["users"] = $admission->users;
                return $admissionArray;
            }
            
        }
        else{
            throw new \Exception("Admission is not exist");
        }
    }

    public function readAll(RecordFilter $recordFilter, $withAdmissionDiagnosis = false){
        $serviceResult = null;
        if ($recordFilter->validate()) {
            
            $query = Admission::find();
            
            $filteredFields;
            if (isset($recordFilter->fields)){
                $filteredFields = array_filter(explode(',', $recordFilter->fields));
            }
            else{
                $filteredFields = array();
            }
            
            if($withAdmissionDiagnosis){
                $query->with(['admissionDiagnosis']);
            }
            
            Admission::addSortFilter($query, $recordFilter->orderby, $recordFilter->sort);

            Admission::addFilters($query, $recordFilter->filter);
            
            $record_count = $query->distinct()->count();
            Admission::addOffsetAndLimit($query, $recordFilter->page, $recordFilter->limit);
            
            $result = $query->all();
            
            if($withAdmissionDiagnosis){
                $resultArray = array();
                foreach ($result as $value){
                    $valueArray = $value->toArray($filteredFields, $filteredFields); 
                    $valueArray['bed_type'] = array("id" => $value->bed_type, "name" => AppEnums::getBedTypeText($value->bed_type));
                    $valueArray['code_status'] = array("id" => $value->code_status, "name" => AppEnums::getCodeSatusText($value->code_status));
                    $valueArray['sent_to_facility'] =  array("id" => $value->sent_to_facility, "name" => $value->hospital["name"]);
                    $valueArray['sent_by_facility'] = array("id" => $value->sent_by_facility, "name" => $value->clinic["name"]);
                    $valueArray['status_icon'] = AppEnums::getStatusIconsText($value->last_status);
                    $valueArray['status_text'] = AppEnums::getStatusText($value->last_status);
                    if(sizeof($filteredFields)){
                        if(in_array('diagnosis', $filteredFields)){
                            $valueArray['diagnosis'] = $this->getDiagnosisString($value->admissionDiagnosis);
                        }
                    }
                    else{
                        $valueArray['diagnosis'] = $this->getDiagnosisString($value->admissionDiagnosis);
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
    
    private function getDiagnosisString($diagnosis){
        return implode(",", array_filter(array_map(function($diag){
            return $diag->diagnosis_desc; 
        }, $diagnosis)) );
    }
    
    private function moveAdmissionAttachment($source, $destination){
        $baseUploadPath = '/var/www/uploaded_files/';
        $admissionId = $destination;
        $admissionFolderPath = $baseUploadPath . $admissionId . '/';
        $success = true;
        foreach ($source as $fa) {
            if(file_exists( $baseUploadPath . 'temp/' . $fa['file_name'])){
                if( file_exists( $admissionFolderPath) ){
                    rename($baseUploadPath . 'temp/' . $fa['file_name'], $admissionFolderPath . $fa['file_name']);
                }
                else{
                    if(mkdir($admissionFolderPath, 0740)) {
                        rename($baseUploadPath . 'temp/' . $fa['file_name'], $admissionFolderPath . $fa['file_name']);
                    }
                    else{
                        $success = false;
                        break;
                    }
                }
            }
        }
        
        return $success; 
        
    }

}