<?php


namespace app\modules\api\v1\models\AdmissionAttachment;

use app\modules\api\v1\models\Admission\Admission;
use app\modules\api\v1\models\User\User;
use \yii\db\ActiveRecord;

class AdmissionAttachment extends ActiveRecord{
    public static function tableName()
    {
        return 'admission_attachment';
    }
    
    
    public function scenarios() {
        return [
            'default' => ['!admission_id', '!file_name', '!record_type', '!uploaded_by']
        ];
    }
    
    public function beforeSave($insert){
        if (parent::beforeSave($insert)) {
            // Set current date in created_on and updated_on
            if ($insert){
                $this->created_on = date("Y-m-d H:i:s", time());
            }
            return true;
        } else {
            return false;
        }
    }
    
    public function rules() {
        
        return [ 
            [['admission_id', 'file_name', 'record_type', 'uploaded_by' ], 'required', 
                 'message' => '{attribute} required',  ],
//            [['admission_id'], 'exist',  'targetClass' => Admission::className(), 
//                'targetAttribute' => 'transaction_number',
//                'message' => 'Admission does not exist'],
//            [['uploaded_by'], 'exist',  'targetClass' => User::className(), 
//                'targetAttribute' => 'id', 'filter' => ["deactivate" => "F"],
//                'message' => 'User does not exist or deactivated']
            
        ];
    }
    
    
}