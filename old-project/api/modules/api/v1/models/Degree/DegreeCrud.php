<?php

namespace app\modules\api\v1\models\Degree;

use app\modules\api\v1\models\Degree\Degree;
use app\modules\api\models\ServiceResult;
use app\modules\api\models\RecordFilter;
use yii\helpers\Json;

class DegreeCrud{
    
    public function readAll(RecordFilter $recordFilter){
        $serviceResult = null;
        if ($recordFilter->validate()) {
            
            $query = Degree::find();
//            Uncomment these lines if limit and orderby needed            
//            $this->addOffsetAndLimit($query, $recordFilter->page, $recordFilter->limit);
//            $this->addOrderBy($query, $recordFilter->orderby, $recordFilter->sort);
//
//            $this->addFilters($query, $recordFilter->filter);

            $record_count = $query->count();

            $data = array("total_records" => $record_count, "records" => $query->all());
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