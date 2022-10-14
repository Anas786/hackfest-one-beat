<?php

namespace app\modules\api\v1\models\UserCategory;

use yii\db\ActiveRecord;

class UserCategory extends ActiveRecord
{
    
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'user_category';
    }
 
    /**
     * @inheritdoc
     */
    public static function primaryKey()
    {
        return ['short_name'];
    }
    
    public function fields() {
        return [
            'name' => 'full_name',
            'value' => 'short_name',
            
        ];
    }
}

