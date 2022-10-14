<?php


namespace app\modules\api\v1\models\FacilityGroup;

use app\modules\api\v1\models\Group\Group;
use \yii\db\ActiveRecord;

class FacilityGroup extends ActiveRecord{
    public static function tableName()
    {
        return 'health_care_facility_group';
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
            'default' => ['group_id', '!facility_id']
        ];
    }
    
    public function rules() {
        
        return [ 
            [['facility_id', 'group_id' ], 'required', 
                 'message' => '{attribute} required',  ],
            [['group_id'], 'exist',  'targetClass' => Group::className(), 
                'targetAttribute' => 'id', 'filter' => ["deactivate" => "F"],
                'message' => 'Foreign key violation. Group id does not exist']
            
        ];
    }
    
    public static function deleteFacilityGroups($facility_id){
        self::deleteAll('facility_id = :facility_id', [':facility_id' => $facility_id]);
    }
    
}