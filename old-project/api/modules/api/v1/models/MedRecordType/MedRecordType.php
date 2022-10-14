<?php

namespace app\modules\api\v1\models\MedRecordType;

use yii\db\ActiveRecord;

class MedRecordType extends ActiveRecord
{
    
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'record_type';
    }
 
    /**
     * @inheritdoc
     */
    public static function primaryKey()
    {
        return ['value'];
    }
    
    
}

