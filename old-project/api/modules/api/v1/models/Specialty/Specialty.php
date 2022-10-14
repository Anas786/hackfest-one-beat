<?php

namespace app\modules\api\v1\models\Specialty;

use yii\db\ActiveRecord;

class Specialty extends ActiveRecord
{
    
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'specialty';
    }
 
    /**
     * @inheritdoc
     */
    public static function primaryKey()
    {
        return ['short_code'];
    }
    
    public static function isSpecialtyExist($specialtyCode){
        return self::find()->where("short_code = :code", 
                        [":code" => $specialtyCode])->exists();
    }
    
    public function fields() {
        return [
            'name' => 'full_name',
            'value' => 'short_code',
            
        ];
    }
}

