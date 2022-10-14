<?php

namespace app\modules\api\v1\models\UserRole;

use yii\db\ActiveRecord;

class UserRole extends ActiveRecord
{
    
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'user_role';
    }
 
    /**
     * @inheritdoc
     */
    public static function primaryKey()
    {
        return ['short_name'];
    }
    
    public static function isUserRoleExist($category, $role){
        return self::find()->andWhere(["category_short_name" => $category, 
            "short_name" => $role])->exists();
        
    }
    
    public function fields() {
        return [
            'name' => 'full_name',
            'value' => 'short_name',
            
        ];
    }
    
    public function extraFields() {
        return [
            'category' => 'category_short_name'
            
        ];
    }
    
}

