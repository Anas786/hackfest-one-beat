<?php

namespace app\modules\api\v1\models\User;

use yii\db\ActiveRecord;
use \app\modules\api\v1\models\Degree\Degree;
use app\modules\api\v1\models\Specialty\Specialty;
use app\modules\api\v1\models\UserRole\UserRole;
use app\modules\api\v1\models\Group\Group;
use app\modules\api\v1\models\Facility\Facility;
use yii\helpers\Json;
use app\modules\api\v1\models\UserFacility\UserFacility;
use app\modules\api\v1\models\UserGroup\UserGroup;
use app\modules\api\v1\models\UserOnCallGroup\UserOnCallGroup;
use app\modules\api\models\ActivityLog;
use app\modules\api\models\AppEnums;



class User extends ActiveRecord
{
    
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'user';
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
            
            [[ 'first_name', 'last_name', 'user_name', 'email',
                'cell_phone', 'category', 'role', 'isReal'], 'required', 
                'on' => ['post', 'put'], 'message' => 'You cannot leave this field blank',  ],

            [['first_name', 'middle_name', 'last_name',], 'match', 
                'pattern' => "/^[A-Za-z\s-'.,]+$/", 
                'message' => "{attribute} should contain alphabets and (-'.,) set "
                . "of characters", 
                'on' => ['post', 'put'] ],
            
            [ ['user_name'], 'unique', 'on' => ['post', 'put']  ],
            [ ['user_name'], 'string', 'length' => [6, 23], 'on' => ['post', 'put'] ],
            [['user_name'], 'match', 
                'pattern' => "/^[^0-9.][a-z.]+[a-z0-9]+$/", 
                'message' => "{attribute} should contain alphabets and periods", 
                'on' => ['post', 'put'] ],
            
            [['email'], 'email', 'on' => ['post', 'put'] ],
            
//            [[ 'npi', 'cell_phone'], 
//                'compare', 'compareValue' => 0, 'operator' => '>', 
//                'on' => ['post', 'put'], "message" => "{attribute} should be 10 digits"  ],
            [[ 'npi', 'cell_phone'],
                'string', 'length' => [10, 10], 'on' => ['post', 'put']  ],
            
            [['npi'], 'unique', 'message' => '{attribute} should be unique',
                'on' => ['post', 'put'] ],
            
            [['category'], 'hasValidCategoryAndRole', 'on' => ['post', 'put'] ],
            
            [['notify', 'enable_two_step_verification', 'deactivate'], 
                'in', 'range' => ['F', 'T'], 'strict' => true, 
                'on' => ['put'], "message" => "Please enter valid {attribute} value"],
            
            [['npi', 'degree'], 'required', 'when' => function($model) {
                return in_array($this->role, ["PN", "RE", "PT", "BR", "SN"]) ;
            }, 
                'on' => ['post', 'put'], 'message' => "You cannot leave this field blank"],
                
            [['degree'], 'hasValidDegree', 'on' => ['post', 'put'] ],
            
            [['npi'], 'isNpiNeeded', 'on' => ['post', 'put'] ],
            
            [['specialty'], 'required', 'when' => function($model) {
                return ( ($this->category == "HL" && $this->role == "PN") || 
                         ($this->category == "CC" && ($this->role == "SN" || $this->role == "PN")) );

            }, 
                'message' => "You cannot leave this field blank",
                'on' => ['post', 'put'] ],
            
            [['specialty'], 'hasValidSpecialty', 'on' => ['post', 'put'] ],

            [['isReal'], 'in', 'range' => ['F', 'T'], 'strict' => true, 
                'on' => ['post', 'put'], "message" => "Please enter valid {attribute} value"],
            
        ];
    }
    
    public function isNpiNeeded($attribute,$params){
        if (!in_array($this->role, ["PN", "RE", "PT", "BR", "SN"])){
            $this->npi = null;
        }
    }
    
    public function hasValidCategoryAndRole($attribute,$params){
        /*
         * Category should be valid 2 character code which exist in category table
         */
        $category = $this->category;
        $role = $this->role;
        /*
		if(!AppEnums::isUserRoleExist($category, $role)){
			$this->addError("user_type", "Category or role is not exist");
        }
		*/
    }
    
    public function hasValidDegree($attribute,$params){
        /*
         * Degree should be valid 2 character code which exist in degree table
         */
        if (in_array($this->role, ["PN", "RE", "PT", "BR", "SN"])){
            $value = $this->$attribute;
            if(!AppEnums::getDegreeText($value)){
                $this->addError($attribute, "Please enter valid degree");
            }
            else if( in_array($this->role, ["PN", "SN"]) && !($value == "DO" || $value == "MD")  ){
                $this->addError($attribute, "Please enter valid degree");
            }
            else if( $this->role == "BR" && !($value == "NP" || $value == "PA")  ){
                $this->addError($attribute, "Please enter valid degree");
            }
            else if( $this->role == "RE" && !($value == "NP")  ){
                $this->addError($attribute, "Please enter valid degree");
            }
            else if( $this->role == "PT" && !($value == "PA") ){
                $this->addError($attribute, "Please enter valid degree");
            }
            
        }
        else{
            $this->degree = null;
        }
    }
    
    public function hasValidSpecialty($attribute,$params){
        /*
         * Specialty should be valid 2 character code which exist in specialty table
         */
        
        if( ($this->category == "HL" && $this->role == "PN") || 
            ($this->category == "CC" && ($this->role == "SN" || $this->role == "PN") ) ){
            $value = $this->$attribute;
            if(!AppEnums::getSpecialtyText($value)){
                $this->addError($attribute, "Please enter valid specialty");
            }
        }
        else{
            $this->specialty = null;
        }
    }
    
    public function scenarios()
    {
        $scenarios = parent::scenarios();
        $scenarios['post'] = [ 'first_name', 'middle_name', 'last_name', 'user_name', 'email',
                                'cell_phone', 'category', 'role', 'degree', 'npi', 'specialty', 
                                'isReal'];
        
        $scenarios['put'] = [ 'first_name', 'middle_name', 'last_name', 'user_name', 'email',
                                'cell_phone', 'category', 'role', 'degree', 'npi', 'specialty',
                                'notify', 'enable_two_step_verification', 'deactivate', 
                                'time_zone', 'isReal'];
        
        $scenarios['initUser'] = ['password'];
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
            ->viaTable('user_group', ['user_id' => 'id']);
    }
    
    public function getOnCallGroups()
    {
        return $this->hasMany(UserOnCallGroup::className(), ['user_id' => 'id']);
    }
    
    public function getFacilities()
    {
        
        return $this->hasMany(Facility::className(), ['id' => 'facility_id'])
            ->viaTable('user_health_care_facility', ['user_id' => 'id']);
    }
    
    public static function getUser($userName){
        return self::find()->where(["user_name" => $userName])->one();
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
            
            $userCategroy = isset($filter_object['search_sub_category']) ?
                $filter_object['search_sub_category'] : null;
            $userRole = isset($filter_object['search_role']) ?
                $filter_object['search_role'] : null;
            
            $search_main_category = isset($filter_object['search_main_category']) ?
                $filter_object['search_main_category'] : null;
            
            $search_op = isset($filter_object['search_op']) ?
                strtolower($filter_object['search_op']) : null;
            
            $deactivate = $search_type === "deactive_users" ? 'T' : 'F';
            $validSearchTypeValues = array("active_users", "deactive_users");
            
            if($search_main_category !== null){
                $isReal = $search_main_category === "test" ? 'F' : 'T';
                $query->where(["user.isReal" => $isReal]);
            }
            
            if(isset($search_text) && ($search_by == "u_group" || $search_by == "u_facility")){
                $search_text = explode(",", $search_text);
                
            }
            
            if($search_type == "all_users" && $search_by == "all"){
                // Use query builder expressions for performance improvement
//              This condition and else condition is same.
            }
            else if($search_type == "all_users" && $search_by == "u_name" && $search_text){
                if($search_op === 'equal'){
                    $query->andWhere(["user_name" => $search_text]);
                }
                else{
                    $query->andWhere("[[user_name]] LIKE :search_text");
                    $query->addParams([":search_text" => "%{$search_text}%"]);
                }
            }
            else if($search_type == "all_users" && $search_by == "u_fname" && $search_text ){
                $query->andWhere("[[first_name]] LIKE :search_text");
                $query->addParams([":search_text" => "%{$search_text}%"]);
            }
            else if($search_type == "all_users" && $search_by == "u_lname" && $search_text){
                $query->andWhere("[[last_name]] LIKE :search_text");
                $query->addParams([":search_text" => "%{$search_text}%"]);
            }
            else if($search_type == "all_users" && $search_by == "u_role" && 
                $userCategroy){
                if($userRole){
                    $query->andWhere(["category" => $userCategroy, "role" => $userRole]);
                }
                else{
                    $query->andWhere(["category" => $userCategroy]);
                }
                
            }
            else if($search_type == "all_users" && $search_by == "u_group" && $search_text ){
                $query->innerJoinWith('groups', false)
                    ->andWhere(["group.name" => $search_text]);
//                    ->andWhere("[[group.name]] LIKE :search_text");
//                $query->addParams([":search_text" => "%{$search_text}%"]);
            }
            else if($search_type == "all_users" && $search_by == "u_facility" && $search_text){
                $query->innerJoinWith('facilities', false)
                        ->andWhere(["health_care_facility.name" => $search_text]);
//                    ->andWhere("[[health_care_facility.name]] LIKE :search_text");
//                $query->addParams([":search_text" => "%{$search_text}%"]);
            }
            else if($search_type == "all_users" && $search_by == "npi" && $search_text){
                $query->andWhere(["npi" => $search_text]);
            }

//          Active and Test Users
            else if(in_array($search_type, $validSearchTypeValues) && 
                $search_by == "all"){
                $query->andWhere(["deactivate" => $deactivate]);
            }
            else if(in_array($search_type, $validSearchTypeValues) && 
                $search_by == "u_name" && $search_text){
                $query->andWhere(["deactivate" => $deactivate]);
                if($search_op === 'equal'){
                    $query->andWhere(["user_name" => $search_text]);
                }
                else{
                    $query->andWhere("[[user_name]] LIKE :search_text");
                    $query->addParams([":search_text" => "%{$search_text}%"]);
                }
            }
            else if(in_array($search_type, $validSearchTypeValues) 
                && $search_by == "u_fname" && $search_text ){
                $query->andWhere("[[first_name]] LIKE :search_text")
                      ->andWhere(["deactivate" => $deactivate]);
                $query->addParams([":search_text" => "%{$search_text}%"]);
            }
            else if(in_array($search_type, $validSearchTypeValues) && 
                $search_by == "u_lname" && $search_text){
                $query->andWhere("[[last_name]] LIKE :search_text")
                      ->andWhere(["deactivate" => $deactivate]);
                $query->addParams([":search_text" => "%{$search_text}%"]);
            }
            else if(in_array($search_type, $validSearchTypeValues) && 
                $search_by == "u_role" && $userCategroy){
                if($userRole){
                    $query->andWhere(["deactivate" => $deactivate,
                        "category" => $userCategroy, "role" => $userRole]);
                }
                else{
                    $query->andWhere(["deactivate" => $deactivate,
                        "category" => $userCategroy]);
                }
                
            }
            else if(in_array($search_type, $validSearchTypeValues) && 
                $search_by == "u_group" && $search_text ){
                $query->innerJoinWith('groups', false)
                    ->andWhere(["user.deactivate" => $deactivate, "group.name" => $search_text]);
//                    ->andWhere("[[group.name]] LIKE :search_text");
//                $query->addParams([":search_text" => "%{$search_text}%"]);
            }
            else if(in_array($search_type, $validSearchTypeValues) && 
                $search_by == "u_facility" && $search_text){
                $query->innerJoinWith('facilities', false)
                    ->andWhere(["user.deactivate" => $deactivate, "health_care_facility.name" => $search_text]);
//                    ->andWhere("[[health_care_facility.name]] LIKE :search_text");
//                $query->addParams([":search_text" => "%{$search_text}%"]);
            }
            else{
                $query->andWhere(["user.deactivate" => 'F']);
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
        $userTableCols = self::getTableSchema()->columnNames;
        
        if( !(isset($orderby) && isset($sort)) || (!in_array($orderby, $userTableCols))  ) {
            $orderby = 'user.updated_on';
            $sort = SORT_DESC;
        }
        else{
            $orderby = 'user.' . $orderby;
            $sort = strtoupper($sort) === 'ASC' ? SORT_ASC : SORT_DESC;
        }
        $query->orderBy([$orderby => $sort]);

    }
    
    public function fields() {
        return [
            'id',
            'first_name',
            'last_name',
            'user_name',
            'category',
            'role',
            'created' => 'created_on',
            'updated' => 'updated_on',
            'middle_name',
            'email',
            'cell_phone',
            'degree',
            'npi',
            'specialty',
            'notify',
            'enable_two_step_verification',
            'deactivate',
            'time_zone',
            'isReal',
        ];
    }
    
//    public function extraFields() {
//        return [
//            'middle_name',
//            'email',
//            'cell_phone',
//            'degree',
//            'npi',
//            'specialty',
//            'notify',
//            'enable_two_step_verification',
//            'deactivate',
//            'time_zone',
//            'isReal',
//        ];
//    }
    
    public static function isSalesReprestative($userId){
        return self::find()->where(["id" => $userId, "deactivate" => "F", 'category' => 'AS'])
                ->andWhere(["OR", "role='SR'", "role='QT'"])
                ->exists();
        
            
    }
    
    public function getFacilityIds(){
        return $this->hasMany(UserFacility::className(), ['user_id' => 'id']);
    }
    
    public function getGroupIds(){
        return $this->hasMany(UserGroup::className(), ['user_id' => 'id']);
    }
}

