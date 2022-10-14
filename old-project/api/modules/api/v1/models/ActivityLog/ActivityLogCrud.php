<?php

namespace app\modules\api\v1\models\ActivityLog;

use app\modules\api\models\ActivityLogQueries;
use app\modules\api\models\ServiceResult;
use app\modules\api\models\RecordFilter;
use app\modules\api\models\AppEnums;

use yii\helpers\Json;

class ActivityLogCrud{
    
    public function create(){}
    
    public function readAll(RecordFilter $recordFilter){
        $serviceResult = null;
        if ($recordFilter->validate()) {
            
            $search_by = null;
            $search_text = null;
            if(isset($recordFilter->filter))
            {
                $filter_object = Json::decode($recordFilter->filter, true);
                $search_by = isset($filter_object['search_by']) ? 
                    $filter_object['search_by'] : null;

                $search_text = isset($filter_object['search_text']) ?
                    $filter_object['search_text'] : null;
                
                if( ($search_by == "u_name") || ($search_by == "u_ip") ){
                    ;
                }
                else if($search_by == "u_action"){
                    $search_text = array_filter(explode(",", $search_text));
                    
                }
                else{
                    ;
                }
            }
            
            
            $query = ActivityLogQueries::getActivityLogsQuery($recordFilter, $search_by, $search_text);
            $record_count = $query->count();
            ActivityLogQueries::addOffsetAndLimit($query, $recordFilter->page, $recordFilter->limit);
            ActivityLogQueries::addSortFilter($query, $recordFilter->orderby, $recordFilter->sort);
            $result = $query->all();
			$resultArray = array();
            foreach ($result as $value){
                $value['action'] = AppEnums::getActivityLogActions($value['action']);
                array_push($resultArray, $value);
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
    
    
}