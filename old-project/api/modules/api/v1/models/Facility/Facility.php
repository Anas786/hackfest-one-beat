<?php

namespace app\modules\api\v1\models\Facility;

use app\modules\api\models\AppQueries;
use app\modules\api\models\AppEnums;
use yii\db\ActiveRecord;
use app\modules\api\v1\models\Group\Group;
use app\modules\api\v1\models\User\User;
//use app\modules\api\v1\models\FacilityType\FacilityType;
use app\modules\api\v1\models\State\State;
use yii\helpers\Json;

class Facility extends ActiveRecord
{
    
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'health_care_facility';
    }
 
    /**
     * @inheritdoc
     */
    public static function primaryKey()
    {
        return ['id'];
    }
    
    /**
     * Define rules for validation
     */
    public function rules() {
        
        return [ 
            [['name', 'address1', 'city', 'zip_code', 'state',  
                            'type',  'npi', 'phone', 'email', 'representative_name',  
                            'representative_contact_number', 'representative_email', 'isReal' ], 
                'required', 'on' => ['post', 'put'], 
                'message' => 'You cannot leave this field blank',  ],
            [['name',  'npi'],  'unique', 'on' => ['post', 'put'], 
                'message' => '{attribute} should be unique' ],
            [['email', 'representative_email' ], 'email', 'on' => ['post', 'put'] ],
            [ ['zip_code'], 'string', 'length' => [5, 5], 'on' => ['post', 'put'] ],
            [['npi', 'phone', 'representative_contact_number'], 
                'string', 'length' => [10, 10], 'on' => ['post', 'put']  ],
            [['city'], 'match', 'pattern' => '/^[A-Za-z\s.,0-9]+$/' ,  
                'message' => "Please enter alphabets only", 
                'on' => ['post', 'put'] ],
            [['state'], 'hasValidState', 'on' => ['post', 'put'] ],
            [['type'], 'hasValidFacilityType', 'on' => ['post', 'put'] ],
            [['representative_name'], 'match', 'pattern' => "/^[A-Za-z\s-'.,]+$/", 
                'message' => "Please enter a representative's "
                . "name at the healthcare facility", 
                'on' => ['post', 'put'] ],
            [['deactivate'], 'in', 'range' => ['F', 'T'], 'strict' => true, 
                'on' => ['put'], "message" => "Please enter valid deactivate value"],
            [['isReal'], 'in', 'range' => ['F', 'T'], 'strict' => true, 
                'on' => ['post', 'put'], "message" => "Please enter valid {attribute} value"],
            
            [['quicare_representative'], 'hasValidRepresentative', 'on' => ['post', 'put'] ],
            
        ];
    }
    
    public function hasValidRepresentative($attribute,$params){
        $value = $this->$attribute;
        if(!User::isSalesReprestative($value)){
            $this->quicare_representative = null; 
        }
        
    }
    
    public function hasValidState($attribute,$params){
        /*
         * State should be valid 2 character code which exist in state table
         */
        
        $value = $this->$attribute;
        if(!State::isStateExist($value)){
            $this->addError($attribute, "Please enter valid state");
        }
    }
    
    public function hasValidFacilityType($attribute,$params){
        /*
         * Facility type should be valid 2 character code which exist in 
         * health_care_facility_type table
         */
        
        $value = $this->$attribute;
        if(!AppEnums::getCategoryText($value)){
            $this->addError($attribute, "Please enter valid facility type");
        }
        
    }
    
    public function scenarios()
    {
        $scenarios = parent::scenarios();
        $scenarios['post'] = ['name', 'address1', 'address2', 'city', 'zip_code', 'state',  
                            'type', 'npi', 'phone', 'email', 'representative_name',  
                            'representative_contact_number',  'representative_email',  
                            'quicare_representative', 'default_group', 'isReal' ];
        
        $scenarios['put'] = ['name', 'address1', 'address2', 'city', 'zip_code', 'state',  
                            'type', 'npi', 'phone', 'email', 'representative_name',  
                            'representative_contact_number',  'representative_email',  
                            'quicare_representative', 'default_group', 'deactivate', 'isReal' ];
        return $scenarios;
        
    }
    public function beforeSave($insert)
    {
        if (parent::beforeSave($insert)) {
            // Set current date in created_on and updated_on
            if ($insert){
                $this->created_on = date("Y-m-d H:i:s", time());
            }

            $this->updated_on = date("Y-m-d H:i:s", time());
            return true;
        } else {
            return false;
        }
    }
    
    public function getGroups()
    {
        return $this->hasMany(Group::className(), ['id' => 'group_id'])
            ->viaTable('health_care_facility_group', ['facility_id' => 'id']);
    }
    
    public function getUsers()
    {
        return $this->hasMany(User::className(), ['id' => 'user_id'])
            ->viaTable('user_health_care_facility', ['facility_id' => 'id']);
    }

    public static function addFilters($query, $filters){
        if(isset($filters))
        {
            $filter_object = Json::decode($filters, true);
            $search_type = isset($filter_object['search_type']) ? 
                $filter_object['search_type'] : null;
            $search_by = isset($filter_object['search_by']) ? 
                $filter_object['search_by'] : null;
            
            $search_text = isset($filter_object['search_text']) ?
                $filter_object['search_text'] : null;
            
            $search_category = isset($filter_object['search_category']) ?
                $filter_object['search_category'] : null;
            
            $search_op = isset($filter_object['search_op']) ?
                strtolower($filter_object['search_op']) : null;
            
            $deactivate = $search_type === "deactive_hf" ? 'T' : 'F';
            $validSearchTypeValues = array("active_hf", "deactive_hf");
            
            if($search_category !== null){
                $isReal = $search_category === "test" ? 'F' : 'T';
                $query->where(["health_care_facility.isReal" => $isReal]);
            }
            
            if(isset($search_text) && ($search_by == "hf_type" || $search_by == "hg_name")){
                $search_text = explode(",", $search_text);
                
            }
            
            if($search_type == "all_hf" && $search_by == "all"){
                // Use query builder expressions for performance improvement
//              This condition and else condition is same.
            }
            else if($search_type == "all_hf" && $search_by == "hf_name" && $search_text){
                if($search_op === 'equal'){
                    $query->andWhere(["name" => $search_text]);
                }
                else{
                    $query->andWhere("[[name]] LIKE :search_text");
                    $query->addParams([":search_text" => "%{$search_text}%"]);
                }
            }
            else if($search_type == "all_hf" && $search_by == "hf_type" && $search_text ){
                $query->andWhere(["type" => $search_text]);
            }
            else if($search_type == "all_hf" && $search_by == "hg_name" && $search_text){
                $query->innerJoinWith('groups', false)
                    ->andWhere(["group.name" => $search_text]);
//                    ->andWhere("[[group.name]] LIKE :search_text");
//                $query->addParams([":search_text" => "%{$search_text}%"]);
            }
            else if($search_type == "all_hf" && $search_by == "npi" && $search_text){
                $query->andWhere(["npi" => $search_text]);
            }

//          Active Healthcare Facilities / In active Healthcare Facilities
            
            else if(in_array($search_type, $validSearchTypeValues) && $search_by == "all"){
                $query->andWhere(["deactivate" => $deactivate]);
            }
            else if(in_array($search_type, $validSearchTypeValues) && $search_by == "hf_name" && $search_text){
                $query ->andWhere(["deactivate" => $deactivate]);
                if($search_op === 'equal'){
                    $query->andWhere(["name" => $search_text]);
                }
                else{
                    $query->andWhere("[[name]] LIKE :search_text");
                    $query->addParams([":search_text" => "%{$search_text}%"]);
                }
            }
            else if(in_array($search_type, $validSearchTypeValues) && $search_by == "hf_type" && $search_text){
                $query->andWhere(["type" => $search_text])
                    ->andWhere(["deactivate" => $deactivate]);
                      
            }
            else if(in_array($search_type, $validSearchTypeValues) && $search_by == "hg_name" && $search_text){
                $query->innerJoinWith('groups', false)
                    ->andWhere(["health_care_facility.deactivate" => $deactivate, "group.name" => $search_text]);
//                    ->andWhere("[[group.name]] LIKE :search_text");
//                $query->addParams([":search_text" => "%{$search_text}%"]);
            }
            else{
                $query->andWhere(["deactivate" => 'F']);
            }
            
            
        }
    }
    
    public static function addOffsetAndLimit($query, $page, $limit){
        if(isset($page) && isset($limit)){
            $offset = $limit * ($page-1);
            $query->offset($offset)->limit($limit);
        }
    }
    
    public static function addSortFilter($query, $orderby, $sort){
        $facilityTableCols = self::getTableSchema()->columnNames;
        
        if( !(isset($orderby) && isset($sort)) || (!in_array($orderby, $facilityTableCols)) ) {
            $orderby = 'health_care_facility.updated_on';
            $sort = SORT_DESC;
        }
        else{
            $orderby = 'health_care_facility.' . $orderby;
            $sort = strtoupper($sort) === 'ASC' ? SORT_ASC : SORT_DESC;
        }
        $query->orderBy([$orderby => $sort]);

    }
    
    public function fields() {
        return [
            'id',
            'name', 
            'type',
            'email',
            'phone',
            'address1',
            'created' => 'created_on',
            'updated' => 'updated_on',
        ];
    }
    
    public function extraFields() {
        return [
            'address1',
            'address2',
            'city',
            'zip_code',
            'state',
            'npi',
            'phone',
            'email',
            'representative_name',
            'representative_contact_number',
            'representative_email',
            'quicare_representative',
            'default_group',
            'deactivate',
            'isReal',
        ];
    }
    
    public function getActiveUsers($filterAll = true)
    {
        $query = $this->hasMany(User::className(), ['id' => 'user_id'])
            ->viaTable('user_health_care_facility', ['facility_id' => 'id']);
        if($filterAll){
            $query->where(["and", "user.deactivate='F'"]);
        }
        else{
            $query->where(["and", "user.category!='AS'", "user.category!='HR'", "user.deactivate='F'"]);
        }
        return $query;
    }
    
    public function getActiveGroups()
    {
        return $this->hasMany(Group::className(), ['id' => 'group_id'])
            ->viaTable('health_care_facility_group', ['facility_id' => 'id'])
            ->where(["group.deactivate" => "F"]);
    }
}

