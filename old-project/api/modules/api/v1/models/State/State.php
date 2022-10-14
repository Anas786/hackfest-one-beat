<?php

namespace app\modules\api\v1\models\State;

use yii\db\ActiveRecord;

class State extends ActiveRecord
{
    
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'state';
    }
 
    /**
     * @inheritdoc
     */
    public static function primaryKey()
    {
        return ['short_name'];
    }
    
    public static function isStateExist($stateCode){
        return self::find()->where([ "short_name" => $stateCode ])->exists();
    }
    
    public function fields() {
        return [
            'name' => 'full_name',
            'value' => 'short_name',
            
        ];
    }
    
}

