<?php

namespace app\modules\api\v1\models\Schedular;

use app\modules\api\v1\models\Schedular\Schedular;
use app\modules\api\models\ServiceResult;
use app\modules\api\models\RecordFilter;
use Yii;
//use app\modules\api\v1\models\UserGroup\UserGroup;
//use app\modules\api\v1\models\User\User;
use app\modules\api\models\AppEnums;

class SchedularCrud{
    
    public function create(Schedular $schedular){
        $isSaved = $schedular->save();
        $serviceResult = null;
        
        if ($isSaved) {
            $data = array("id" => $schedular->id);
            $serviceResult = new ServiceResult(true, $data, $errors = array());
        } 
        else{
            $serviceResult = new ServiceResult(false, $data = array(), 
                $errors = $schedular->getErrors());
        }
        
        return $serviceResult;
    }
    
    public function update(Schedular $schedular){
        $transaction = Yii::$app->db->beginTransaction();
        
        $isSaved = $schedular->save();
        $serviceResult = null;
        $errors = array();
        if (!$isSaved) {
            $errors = $schedular->getErrors();
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
    
    
    public function readAll(RecordFilter $recordFilter, $affiliatedHospital = false){
    	$query = Schedular::find();
    	$result = $query->all();
        $data = array("records" => $result);
        $serviceResult = new ServiceResult(true, $data, $errors = array());
        return $serviceResult;
    }


    public function read(RecordFilter $recordFilter, $findModel = true){
/*
 *      This will be changed because it is an extra call to db if we need
 *      some group realted fields. 
 *      E.g. if we need groups facilities we fetch group object first.
 */        
       
    }
    
    
    
    
}