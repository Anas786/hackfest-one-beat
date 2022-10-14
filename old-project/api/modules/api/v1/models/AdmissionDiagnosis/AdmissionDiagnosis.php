<?php


namespace app\modules\api\v1\models\AdmissionDiagnosis;

use app\modules\api\models\AppQueries;
use \yii\db\ActiveRecord;

class AdmissionDiagnosis extends ActiveRecord{
    
    
    public static function tableName()
    {
        return 'admission_diagnosis';
    }
    
    /*
     * admission_id and diagnosis_code will be mandatory
     * diagnosis_code will not be massively assigned
     */
 
    /**
     * @inheritdoc
     */
//    public static function primaryKey()
//    {
//        return ['id'];
//    }
    
    public function scenarios() {
        return [
            'default' => ['!admission_id', '!diagnosis_code', '!diagnosis_desc']
        ];
    }
    
    public function rules() {
        
        return [ 
//          Apply integer rule for admission_id and diagnosis_code
            [['admission_id', 'diagnosis_code' ], 'required', 
                 'message' => '{attribute} required',  ],
            [['diagnosis_code'], 'hasValidDiagnosisCode' ]
            
        ];
    }
    
    public function hasValidDiagnosisCode($attribute,$params){
        $code = $this->diagnosis_code;
        $desc = $this->diagnosis_desc;
        if(!AppQueries::isValidIcdCode($code, $desc)){
            $this->addError($attribute, "Please enter valid ICD Code");
        }
        
    }
    
}