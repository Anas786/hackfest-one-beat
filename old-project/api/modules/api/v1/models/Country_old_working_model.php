<?php

namespace app\modules\api\v1\models;

use yii\db\ActiveRecord;

class Country extends ActiveRecord
{
	
	/**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'country';
    }
 
    /**
     * @inheritdoc
     */
    public static function primaryKey()
    {
        return ['code'];
    }
 
    /**
     * Define rules for validation
     */
    public function rules()
    {
        return [
            [['code', 'name', 'population'], 'required']
        ];
    }
	
	public function fields()
	{
		return ['code','name'];
	}
}