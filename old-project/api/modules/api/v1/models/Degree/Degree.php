<?php

namespace app\modules\api\v1\models\Degree;

use yii\db\ActiveRecord;

class Degree extends ActiveRecord
{
    
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'user_degree';
    }
 
    /**
     * @inheritdoc
     */
    public static function primaryKey()
    {
        return ['short_name'];
    }
    
    public static function isDegreeExist($degreeCode){
        return self::find()->where("short_name = :name", 
                        [":name" => $degreeCode])->exists();
    }
    
    public function fields() {
        return [
            'name' => 'full_name',
            'value' => 'short_name',
            
        ];
    }
    
}

