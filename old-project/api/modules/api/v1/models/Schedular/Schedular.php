<?php

namespace app\modules\api\v1\models\Schedular;

use yii\db\ActiveRecord;
use yii\helpers\Json;
use app\modules\api\models\AppQueries;

class Schedular extends ActiveRecord
{
    
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'schedular';
    }
 
    /**
     * @inheritdoc
     */
    public static function primaryKey()
    {
        return ['id'];
    }
    public function scenarios()
    {
    	$scenarios = parent::scenarios();
    	$scenarios['post'] = ['user_id', 'group_id', 'tz_id', 'start_time', 'end_time', 'title', 'description'];
    	return $scenarios;
    
    }
    public function beforeSave($insert)
    {
        if (parent::beforeSave($insert)) {
            // Set current date in created_on and updated_on
        	
        	
            if ($insert){
                $this->created_on = date("Y-m-d H:i:s", time());
            }

            $this->updated_on = date("Y-m-d H:i:s", time());
            return true;
        } else {
            return false;
        }
    }

}

