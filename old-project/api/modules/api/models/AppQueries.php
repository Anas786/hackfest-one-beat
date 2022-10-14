<?php

namespace app\modules\api\models;

use yii\db\Query;
class AppQueries {
    
    static function getHospitalGroupsQuery(){
        /*
         * Get distinct groups query which are taken by hospitals
         */
        
        return (new Query())->select(['hcgf.group_id'])
              ->distinct()
              ->from(['health_care_facility_group hcgf'])
              ->innerJoin(['health_care_facility hcf'], '`hcgf`.`facility_id` = `hcf`.`id`')
              ->where(['hcf.type' => 'HL']);
    }
    
    static function getTimeZoneList(){
    	return (new Query())->select('*')->from('time_zone');
    }
    
    static function getIcdNineByCodes($code){
        $query = (new \yii\db\Query())
        ->select(["code", "CONCAT_WS(' : ', code, long_desc) AS long_desc"])
        ->from('icd_nine_codes')
        ->where("[[code]] LIKE :search_text")
        ->limit(15);
        $query->addParams([":search_text" => "%{$code}%"]);
        $rows = $query->all();
        return $rows;
    }

    
    static function getIcdNineCodesByDescription($desc){
        $query = (new \yii\db\Query())
        ->select(["code", "CONCAT_WS(' : ', code, long_desc) AS long_desc"])
        ->from('icd_nine_codes')
        ->where("[[long_desc]] LIKE :search_text")
        ->limit(15);
        $query->addParams([":search_text" => "%{$desc}%"]);
        $rows = $query->all();
        return $rows;
    }
    
    static function getIcdTenByCodes($code){
        $query = (new \yii\db\Query())
        ->select(["code", "CONCAT_WS(' : ', code, long_desc) AS long_desc"])
        ->from('icd_ten_codes')
        ->where("[[code]] LIKE :search_text")
        ->limit(15);
        $query->addParams([":search_text" => "%{$code}%"]);
        $rows = $query->all();
        return $rows;
    }
    
    static function getIcdTenCodesByDescription($desc){
        $query = (new \yii\db\Query())
        ->select(["code", "CONCAT_WS(' : ', code, long_desc) AS long_desc"])
        ->from('icd_ten_codes')
        ->where("[[long_desc]] LIKE :search_text")
        ->limit(15);
        $query->addParams([":search_text" => "%{$desc}%"]);
        $rows = $query->all();
        return $rows;
    }
    
    static function isValidIcdCode($code, $desc){
        $row = self::isValidIcdNineCode($code, $desc);
        
        if(!$row){
            $row = self::isValidIcdTenCode($code, $desc);
            return $row;
        }
        else{
            return $row;
        }
    }
    
    private static function isValidIcdNineCode($code, $desc){
        $query = (new \yii\db\Query())
        ->select(["1"])
        ->from('icd_nine_codes')
        ->where(["code" => $code, "long_desc" => $desc]);
        return $query->exists();
    }    
    
    private static function isValidIcdTenCode($code, $desc){
        $query = (new \yii\db\Query())
        ->select(["1"])
        ->from('icd_ten_codes')
        ->where(["code" => $code, "long_desc" => $desc]);
        return $query->exists();
    }

    static function insertAdmissionStatus($db, $admissionId, $status, $userId){
        $command = $db->createCommand()->insert('admission_status', 
                                    ["admission_id" => $admissionId, 
                                    "status" => $status, 
                                    "created_on" => date("Y-m-d H:i:s", time()),
                                    "user_id" => $userId]);
        $command->execute();
        
        self::updateAdmissionLastStatus($db, $admissionId, $status);
        
    }
    
    private static function updateAdmissionLastStatus($db, $admissionId, $status){
        $command = $db->createCommand()->update('admission', 
            ['last_status' => $status], 
            ['transaction_number' => $admissionId]);
        $command->execute();
    }

    static function sendAdmissionAlert($name, $phone, $message) {
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL,"https://api.tropo.com/1.0/sessions?action=create&token=784c744159676854664c62554d7753676856544b4f77644a4543516761746b684b44586362724c7264694653");
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query(array('numberToDial' => $phone, 'customerName' => $name, 'msg' => $message)));
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        $server_output = curl_exec ($ch);
        curl_close ($ch);
    }
    
    public static function isValidAdmission($admissionId){
        $query = (new \yii\db\Query())
        ->select(["1"])
        ->from('admission')
        ->where(["transaction_number" => $admissionId]);
        return $query->exists();
    }
    
    public static function getLastAdmissionStatus($admissionId){
        $query = (new \yii\db\Query())
        ->select(["*"])
        ->from('admission_status')
        ->where(["admission_id" => $admissionId])
        ->orderBy(['created_on' => SORT_DESC]);
        return $query->one();
    }
    
    public static function getAdmissionStatuses($admissionId){
        $query = (new \yii\db\Query())
        ->select(["adm_status.*", 'u.first_name', 'u.last_name', 'u.category', 'u.role'])
        ->from(['admission_status adm_status'])
        ->innerJoin(['user u'], 'adm_status.user_id = u.id')
        ->where(["adm_status.admission_id" => $admissionId])
        ->orderBy(['adm_status.created_on' => SORT_DESC]);
        return $query->all();
    }
    
    public static function getFacilitiesGroups($facilityIds){
        $query = (new Query())
                ->select(['hfg.group_id'])
                ->from('health_care_facility_group hfg')
                ->innerJoin('group g', 'hfg.group_id = g.id')
                ->where(["hfg.facility_id" => $facilityIds, "g.deactivate" => "F"]);
                
        $rows = $query->all();
        return $rows;
    }

    public static function isValidSAP($value){
        $query = (new Query())
                ->select('1')
                ->from('user')
                ->where(['and', 'id= :id', ['and', "category='CC'", "role='SN'"] ])
                ->addParams([':id' => $value])
                ->exists();
        return $query;
    }
    
    public static function isValidPhysician($value){
        $query = (new Query())
                ->select('1')
                ->from('user')
                ->where(['and', 'id= :id', ['or', ['and', "category='HL'", "role='PN'" ],  ['and', "category='CC'", "role='SN'"] ]])
                ->addParams([':id' => $value])
                ->exists();
        return $query;
    }
    
    public static function getAdmissionAttachments($admissionId){
        $query = (new Query())
                ->select([
                    'adm_attach.admission_id', 
                    // 'rec.name',
                    'adm_attach.file_name',  
                    'adm_attach.uploaded_by', 
                    'adm_attach.created_on',
                    'u.first_name',
                    'u.last_name',])
                ->from(['admission_attachment adm_attach'])
                ->innerJoin('user u', 'u.id = adm_attach.uploaded_by')
                //->innerJoin('record_type rec', 'rec.value = adm_attach.record_type')
                ->where(['adm_attach.admission_id' => $admissionId]);
        $rows = $query->all();
        return $rows;
    }
    
    public static function getFileById($fileId){
        $query = (new Query())
                ->select(['adm_attach.id',
                    'adm_attach.admission_id', 
                    'adm_attach.record_type',
                    'adm_attach.file_name',  
                    'adm_attach.uploaded_by', 
                    'adm_attach.created_on'])
                ->from(['admission_attachment adm_attach'])
                ->where(['adm_attach.id' => $fileId]);
        $rows = $query->all();
        return $rows;
    }
    
    public static function getFileByName($fileName){
        $query = (new Query())
                ->select(['adm_attach.id',
                    'adm_attach.admission_id', 
                    'adm_attach.record_type',
                    'adm_attach.file_name',  
                    'adm_attach.uploaded_by', 
                    'adm_attach.created_on'])
                ->from(['admission_attachment adm_attach'])
                ->where(['adm_attach.file_name' => $fileName]);
        $rows = $query->all();
        return $rows;
    }
    
    public static function deleteFileAttachment($db, $fileName){
        $command = $db->createCommand()->delete('admission_attachment', ["file_name" => $fileName]);
        return $command->execute();

    }
    
    static function insertUniqueFileId($db, $uniqueFileId, $token, $fileId){
        $command = $db->createCommand()->insert('temp_file_name', 
                                    ["unique_file_id" => $uniqueFileId, 
                                    "file_id" => $fileId, 
                                    "token" => $token,
                                    "created_on" => date("Y-m-d H:i:s", time())]);
        $command->execute();
        
    }
    
    public static function getUniqueFileId($fileId){
        $query = (new \yii\db\Query())
        ->select(["tfn.*", 'uat.expired', 'aa.admission_id', 'aa.file_name'])
        ->from(['temp_file_name tfn'])
        ->innerJoin(['user_auth_token uat'], 'tfn.token = uat.token')
        ->innerJoin(['admission_attachment aa'], 'tfn.file_id = aa.id')
        ->where(["tfn.unique_file_id" => $fileId]);
        
        return $query->all();
    }
    

}
