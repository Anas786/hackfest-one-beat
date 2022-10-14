<?php

namespace app\modules\api\v1\models\FacilityType;

use yii\db\ActiveRecord;

class FacilityType extends ActiveRecord
{
    
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'health_care_facility_type';
    }
 
    /**
     * @inheritdoc
     */
    public static function primaryKey()
    {
        return ['short_name'];
    }
    
    public static function isFacilityTypeExist($facilityTypeCode){
        return self::find()->where([ "short_name" => $facilityTypeCode ])->exists();
    }
    
    public function fields() {
        return [
            'name' => 'full_name',
            'value' => 'short_name',
            
        ];
    }
    
}

