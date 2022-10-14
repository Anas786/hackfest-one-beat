<?php

namespace app\modules\api\v1\models\AdmissionAttachment;

use app\modules\api\v1\models\AdmissionAttachment\AdmissionAttachment;
use app\modules\api\models\ServiceResult;
use app\modules\api\models\RecordFilter;
use Yii;

class AdmissionAttachmentCrud{
    /*
     * param: User
     * param: UserGroup
     * param: UserFacility
     */
    
    private function verifyCreateParams($admission_id, $fileAttachment, $uploadedBy){
        $errors = array();
        if(!(is_array($fileAttachment) && !empty($fileAttachment)) ){
            $errors['file_attachment'] = ['You cannot leave this field blank'];
        }
        
        return $errors;
    }
    
    public function create($admission_id, $fileAttachment, $uploadedBy){
        
//        Check file attachment should be array and it shouldn't be null
        
        $errors = $this->verifyCreateParams($admission_id, $fileAttachment, $uploadedBy);
        
        if(sizeof($errors) == 0){
            $fileAttachment = $this->filterFileAttachmentArray($fileAttachment);
        }
        
        $transaction = Yii::$app->db->beginTransaction();
        $isSaved = false;
/*
 *         Change this loop with a single query
 *         Pass file attachment, admission_id, record_type and uploaded_by
 *         to that query
 */
        foreach ($fileAttachment as $fa) {
            if( array_key_exists( 'file_name', $fa) && 
                array_key_exists('record_type', $fa) ){
                    $tempFaObject = new AdmissionAttachment();
                    $tempFaObject->admission_id = $admission_id;
                    $tempFaObject->file_name = $fa['file_name'];
                    $tempFaObject->record_type = $fa['record_type'];
                    $tempFaObject->uploaded_by = $uploadedBy;
                    $isSaved = $tempFaObject->save();
                    if(!$isSaved){
        //                        Collect Errors
                        $errors = $tempFaObject->getErrors();
                        break;
                    }
            }
        }
        
        $serviceResult = null;
        
        if ((sizeof($errors) == 0)) {
            $transaction->commit();
            return true;
//            $data = array();
//            $serviceResult = new ServiceResult(true, $data, $errors = array());
        } 
        else{
            $transaction->rollBack();
            return false;
//            $serviceResult = new ServiceResult(false, $data = array(), $errors = $errors);

        }
        
    }
    
    public function filterFileAttachmentArray($fileAttachmentArray){
        /*
         * This function filter out object which have only
         * file name and record type key
         */
        
        return array_filter($fileAttachmentArray, function($var){
                if(array_key_exists( 'file_name', $var) && array_key_exists('record_type', $var)){
                    if($var['file_name'] != null && $var['record_type'] != null && 
                            $var['file_name'] != '' && $var['record_type'] != ''){
                        return true;
                    }
                }
        });
        
    }
    
}
