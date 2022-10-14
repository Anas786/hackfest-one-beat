<?php

namespace app\modules\api\v1\models\Icd;

use app\modules\api\models\AppQueries;
use app\modules\api\models\ServiceResult;
use app\modules\api\models\RecordFilter;
use yii\helpers\Json;

class IcdCrud{
    
    public function readAll(RecordFilter $recordFilter){
        $serviceResult = null;
        if ($recordFilter->validate()) {
            $filter_object = Json::decode($recordFilter->filter, true);
            $search_type = isset($filter_object['search_type']) ? 
                $filter_object['search_type'] : null;
            $search_by = isset($filter_object['search_by']) ? 
                $filter_object['search_by'] : null;
            $search_text = isset($filter_object['search_text']) ?
                $filter_object['search_text'] : null;
            
            $records = array();
            
            if($search_type == "icd9"){
                if($search_by == "code" && $search_text != null && $search_text != ""){
                    $records = AppQueries::getIcdNineByCodes($search_text);
                }
                elseif($search_by == "description" && $search_text && $search_text != ""){
                    $records = AppQueries::getIcdNineCodesByDescription($search_text);
                }
//                else{
//                    $records = AppQueries::getIcdNineNumericCodes();
//                }
            }
            else if($search_type == "icd10"){
                if($search_by == "code" && $search_text != null && $search_text != ""){
                    $records = AppQueries::getIcdTenByCodes($search_text);
                }
                elseif($search_by == "description" && $search_text && $search_text != ""){
                    $records = AppQueries::getIcdTenCodesByDescription($search_text);
                }
//                else{
////                    Send error description : Please refer api
//                    $records =array();
//                }
            }
//            else{
//                $records =array();  
//            }
            
            $data = array( "records" => $records);
            $serviceResult = new ServiceResult(true, $data, $errors = array());
            return $serviceResult;
            
        } 
        else {
            $serviceResult = new ServiceResult(false, $data = array(), 
                $errors = $recordFilter->getErrors());
            return $serviceResult;
        }
        
    }
    
    
    private function addFilters($query, $filters){
        if(isset($filters))
        {
            $filter_object = Json::decode($filters, true);
            if(isset($filter_object['search_text'])){
                // Use query builder expressions for performance improvement
                $query->where("name LIKE :name", 
                        [":name" => "%{$filter_object['search_text']}%"]);
            }
        }
    }
    
    private function addOffsetAndLimit($query, $page, $limit){
        if(isset($page) && isset($limit)){
            $offset = $limit * ($page-1);
            $query->offset($offset)->limit($limit);
        }
    }
    
    private function addOrderBy($query, $orderby, $sort){
        if(isset($orderby) && isset($sort)){
            $orderby_exp = $orderby . " " . $sort;
            $query->orderBy($orderby_exp);
        }
    }
    
    
}