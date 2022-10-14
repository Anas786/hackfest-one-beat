<?php

namespace app\modules\api\models;

use yii\base\Model;
use yii\helpers\Json;

class RecordFilter extends Model{
    public $id;
    public $page;
    public $limit;
    public $sort;
    public $orderby;
    public $filter;
    public $fields;
    private $_pairedSortingFlag;
    private $_pairedLimitFlag;
    private $_checkPairedFilter;
    
    public function init() {
        parent::init();
        $this->_pairedSortingFlag = true;
        $this->_pairedLimitFlag = true;
        $this->_checkPairedFilter = array();
    }
    
    public  function scenarios() {
        return [
            'default' => ['page', 'limit', 'sort', 'orderby', 'filter', 'fields'],
        ];
    }
    
    public function rules() {
        return [
            [['page', 'limit'], 'checkValidLimitFilters'],
            [['sort', 'orderby'], 'checkValidSortFilters' ],
            [['filter'], 'checkValidFilter' ],
            
        ];
    }
    
    public function checkValidLimitFilters($attribute,$params){
        if ($this->_pairedLimitFlag){
            if (array_key_exists('page', $this->_checkPairedFilter) && 
                array_key_exists('limit', $this->_checkPairedFilter)){
                
                $value = (int) trim($this->$attribute);
                if($value <= 0){
                    $this->addError($attribute, ucfirst($attribute) . " should be positive number");
                }
                
            }
            else{
                $this->addError("limit_filter", "Page and limit both should be provided"); 
                $this->_pairedLimitFlag = false;
            }
        }
    }
    
    public function beforeValidate() {
        
        if($this->attributes !== null){
            $this->_checkPairedFilter = array_filter($this->attributes);
        }
        return parent::beforeValidate();
        
        
    }

    public function checkValidSortFilters($attribute,$params){
        if ($this->_pairedSortingFlag){
            if (array_key_exists('sort', $this->_checkPairedFilter) && 
                array_key_exists('orderby', $this->_checkPairedFilter)){
                
                $value = strtoupper(trim($this->$attribute));
                if($attribute == 'sort' && $value != 'ASC' && $value != 'DESC'){
                    $this->addError($attribute, "Sort should be ASC or DESC");
                }
                
            }
            else{
                $this->addError("sort_filter", "Sort and orderby both should be provided"); 
                $this->_pairedSortingFlag = false;
            }
        }

    }
    
    public function checkValidFilter($attribute,$params){
        $value = trim($this->$attribute);
        if(!$this->isValidJSON($value)){
            $this->addError($attribute, "Not a valid json");
        }
    }
    
    function isValidJSON($string){
        // Use Json::decode, it generates yii\base\InvalidParamException
        // Try to handle these exceptions by own exception class
        return is_string($string) && is_object(json_decode($string, false)) && 
        (json_last_error() == JSON_ERROR_NONE) ? true : false;
    }
}

