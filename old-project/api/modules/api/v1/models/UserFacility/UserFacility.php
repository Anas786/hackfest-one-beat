<?php


namespace app\modules\api\v1\models\UserFacility;

use app\modules\api\v1\models\Facility\Facility;
use \yii\db\ActiveRecord;

class UserFacility extends ActiveRecord{
    public static function tableName()
    {
        return 'user_health_care_facility';
    }
    
    /*
     * group_id and facility_id will be mandatory
     * facility_id will not be massively assigned
     */
 
    /**
     * @inheritdoc
     */
    public static function primaryKey()
    {
        return ['id'];
    }
    
    public function scenarios() {
        return [
            'default' => ['facility_id', '!user_id'],
            'clinic' => ['facility_id', '!user_id'],
            'hospital' => ['facility_id', '!user_id']
        ];
    }
    
    public function rules() {
        
        return [ 
            [['user_id', 'facility_id' ], 'required', 
                 'message' => '{attribute} required',  ],
//          Apply integer rule for user_id and facility_id     
            [['facility_id'], 'exist',  'targetClass' => Facility::className(), 
                'targetAttribute' => 'id', 'on' => ['default', 'clinic', 'hospital'], 
                'filter'=> function ($query){
                    $query->andWhere(["deactivate" => "F"]);
                    if($this->scenario === "hospital") { $query->andWhere(["type" => "HL"]); }
                    else if($this->scenario === "clinic") { $query->andWhere(["type" => array("CC", "FT", "ET")]); }
                },
                'message' => 'Facility does not exist or Facility deactivated or '
                . 'User with this role can\'t associate to this facility '],
            

            
        ];
    }
    
    
    
    public static function deleteUsersFacilities($user_id){
        self::deleteAll('user_id = :id', ['id' => $user_id]);
    }
    
    public function getFacility()
    {
        // UserFacility has_one Facility via Facility.id -> facility_id
        return $this->hasOne(Facility::className(), ['id' => 'facility_id']);
    }
    
    public static function filterUsersExistInMultipleHospitals($userIds){
        /*
         * Filter users who are exist in multiple hospitals
         */
        return self::find()->innerJoinWith('facility', false)
            ->where(["health_care_facility.type" => "HL", 
                    "user_health_care_facility.user_id" => $userIds])
            ->groupBy(["user_health_care_facility.user_id"])
            ->having("count(user_health_care_facility.user_id) < 2")
            ->all();
    }
    
    public static function filterUsersExistInMultipleClinics($userIds){
        /*
         * Filter users who are exist in multiple Clinics, FSEDs and EDs
         */
        
        return self::find()->innerJoinWith('facility', false)
            ->where(["health_care_facility.type" => array("CC", "ET", "FT"), 
                    "user_health_care_facility.user_id" => $userIds])
            ->groupBy(["user_health_care_facility.user_id"])
            ->having("count(user_health_care_facility.user_id) < 2")
            ->all();
    }
}