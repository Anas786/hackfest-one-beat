<?php
namespace app\modules\api\controllers;

use yii\rest\Controller;
use app\modules\api\models\ServiceResult;
use app\modules\api\models\AuthToken\AuthTokenCrud;
use app\modules\api\components\CryptoLib;
use app\modules\api\models\AppQueries;
use app\modules\api\v1\models\AdmissionAttachment\AdmissionAttachmentCrud;
use app\modules\api\models\AppEnums;
use app\modules\api\v1\models\User\UserCrud;
use app\modules\api\models\RecordFilter;
use app\modules\api\v1\models\Admission\AdmissionCrud;


use Yii;

class FileController extends Controller
{
    
    private $response;
    private $authUser;

    public function init() {
        parent::init();
        
        $this->response = Yii::$app->response;
        $this->response->format = \yii\web\Response::FORMAT_JSON;
        $this->response->headers->set('Content-type', 'application/json; charset=utf-8');
    }
    
    public function beforeAction($action){
        
        if (parent::beforeAction($action)) {
            $authHeader = Yii::$app->request->headers->get('Authorization');
            $checkAuthData = $this->isValidAuthData($authHeader);
            
            if($checkAuthData["success"]){
                return $checkAuthData["success"];
            }
            else{
                $this->response->statusCode = 500;
                $serviceResult = new ServiceResult($checkAuthData["success"], $data = array(), 
                    $errors = array("exception" => $checkAuthData["message"]));
                $this->response->data = $serviceResult;
                return $checkAuthData["success"];
            }
            
        } else {
            $this->response->statusCode = 500;
            $serviceResult = new ServiceResult(false, $data = array(), 
                $errors = array("exception" => "Unknown exception"));
            $this->response->data = $serviceResult;
            return false;
        }
    }
    
    
    public function actionIndex(){
        $this->response->statusCode = 405;
        $serviceResult = new ServiceResult(false, $data = array(), 
            $errors = array("message" => "Index method not implemented for this resource" ));
        $this->response->data = $serviceResult;
    }
	
    public function actionView($id){
        try{
            $params = Yii::$app->request->get();
            $serviceResult = null;
            $errors = array();
            $data = array();
            $success = false;
            
            $admission = null;
            $admissionId = isset($params['admission_id']) ? $params['admission_id'] : null;
            
            $db = Yii::$app->db;
            $transaction = $db->beginTransaction();
            
            if($admissionId == null){
                $errors['admission_id'] = 'Valid Admission Id should be given';
            }
            else{
                $recordFilter = new RecordFilter();
                $recordFilter->id = $admissionId;
                $admissionCrud = new AdmissionCrud();
                $admission = $admissionCrud->read($recordFilter);
                if($admission === null){
                    $errors['admission_id'] = 'Valid Admission Id should be given';
                }
            }
            
            if(sizeof($errors) == 0 ){
                if($this->checkPermission($admissionId)){
                    $fileRow = AppQueries::getFileById($id);
                    if(sizeof($fileRow) == 1){
                        $uniqueFileId = CryptoLib::randomString(64);
                        AppQueries::insertUniqueFileId($db, $uniqueFileId, $this->authUser["token"], $fileRow[0]["id"]);
                        $success = true;
                        $data["fl"] = $uniqueFileId;
                        $transaction->commit();
                    }
                }
                else{
                    $errors['file'] = "Don't have permission to download file";
                }
            }
            
            $serviceResult = new ServiceResult($success, $data = $data, $errors = $errors);
            $this->response->data = $serviceResult;
            
        } catch (\Exception $ex) {
            $transaction->rollBack();
            $this->response->statusCode = 500;
            $serviceResult = new ServiceResult(false, $data = array(), 
                $errors = array("exception" => $ex->getMessage()));
            $this->response->data = $serviceResult;
        }
    }
	
    public function actionCreate(){
        
        $params = Yii::$app->request->post();
        $this->response->statusCode = 200;
        
        
        $validMimeTypes = array('application/pdf' => '.pdf', 'text/plain' => '.txt', 
            'application/msword' => '.doc', 
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document' => '.docx',
            'image/png' => '.png', 'image/jpeg' => '.jpg' );
        
        $tempPath = '';
        
        $serviceResult = null;
        $errors = array();
        $baseUploadPath = '/var/www/uploaded_files/';
        try{    
            $admissionId = isset($params['admission_id']) ? $params['admission_id'] : null;
            $recordType = isset($params['record_type']) ? $params['record_type'] : null;

            if($admissionId != null && !AppQueries::isValidAdmission($admissionId)){
                $errors['admission_id'] = 'Valid Admission Id should be given';
                $serviceResult = new ServiceResult(false, $data = array(), $errors = $errors);
            }
            else if ( sizeof( $_FILES ) > 1 ) {
                $errors['file'] = 'Cannot upload multiple files';
                $serviceResult = new ServiceResult(false, $data = array(), $errors = $errors);
            }
            else if ( !file_exists($baseUploadPath) ) {
                $errors['file'] = 'Uploaded folder is not setup';
                $serviceResult = new ServiceResult(false, $data = array(), $errors = $errors);
            }
//            Also check if $recordType is not null then record type must exist in db
            else if($recordType == null){
                $errors['file'] = 'Valid Record type should be given';
                $serviceResult = new ServiceResult(false, $data = array(), $errors = $errors);
            }
            else if ( !empty( $_FILES ) ) {
                $tempPath = $_FILES[ 'file' ][ 'tmp_name' ];
                $fileSize = $_FILES[ 'file' ][ 'size' ];
                $lastLine = exec('file -bi '. escapeshellarg($tempPath));
                $fileType = explode(";",$lastLine);

                if(sizeof($fileType) && array_key_exists($fileType[0] , $validMimeTypes)){
                    if($fileSize < 20971520){
                        $fileName = $_FILES[ 'file' ][ 'name' ];
                        if($admissionId != null){
                            if(!$this->checkPermission($admissionId)){
                                $errors['file'] = "Don't have permission to upload file";
                                $serviceResult = new ServiceResult(false, $data = array(), $errors = $errors);
                            }
//                            Refactor file upload code
                            else if (file_exists($baseUploadPath . $admissionId)) {
                                $admissionFolderPath = $baseUploadPath . $admissionId . '/';
                                move_uploaded_file( $tempPath, $admissionFolderPath . $fileName );
                                $uniqueFileName = CryptoLib::randomString(10) .  
                                        strtotime(date('Y-m-d H:i:s')) . $validMimeTypes[$fileType[0]];
                                rename($admissionFolderPath . $fileName, $admissionFolderPath . $uniqueFileName);
                                $admissionAttachmentCrud = new AdmissionAttachmentCrud();
                                $fileAttachment = array(array("file_name" => $uniqueFileName, "record_type" => $recordType));
                                $admissionAttachmentCrud->create($admissionId, $fileAttachment, $this->authUser["id"]);
                                $serviceResult = new ServiceResult(true, $data = array("file" => $uniqueFileName), $errors = array());
                            }
                            else{
                                $admissionFolderPath = $baseUploadPath . $admissionId . '/';
                                if(mkdir($admissionFolderPath, 0740)) {
                                    move_uploaded_file( $tempPath, $admissionFolderPath . $fileName );
                                    $uniqueFileName = CryptoLib::randomString(10) .  
                                            strtotime(date('Y-m-d H:i:s')) . $validMimeTypes[$fileType[0]];
                                    rename($admissionFolderPath . $fileName, $admissionFolderPath . $uniqueFileName);
                                    $admissionAttachmentCrud = new AdmissionAttachmentCrud();
                                    $fileAttachment = array(array("file_name" => $uniqueFileName, "record_type" => $recordType));
                                    $admissionAttachmentCrud->create($admissionId, $fileAttachment, $this->authUser["id"]);
                                    $serviceResult = new ServiceResult(true, $data = array("file" => $uniqueFileName), $errors = array());
                                    
                                }
                            }
                            
                        }
                        else{
                            $internalTempDirPath = $baseUploadPath . '/temp/';
                            move_uploaded_file( $tempPath, $internalTempDirPath . $fileName );
                            $uniqueFileName = CryptoLib::randomString(10) .  
                                    strtotime(date('Y-m-d H:i:s')) . $validMimeTypes[$fileType[0]];
                            rename($internalTempDirPath . $fileName, $internalTempDirPath . $uniqueFileName);
                            $data = array("file" => $uniqueFileName, "record_type" => AppEnums::getRecordTypeText($recordType));
                            $serviceResult = new ServiceResult(true, $data = $data, $errors = array());
                        }

                    }
                    else{
                        $errors['file'] = 'File size exceed from 20 MB';
                        $serviceResult = new ServiceResult(false, $data = array(), $errors = $errors);
                    }
                }
                else{
                    $errors['file'] = 'File type not allowed';
                    $serviceResult = new ServiceResult(false, $data = array(), $errors = $errors);
                }
            }
            else{
                $errors['file'] = 'File not found';
                $serviceResult = new ServiceResult(false, $data = array(), $errors = $errors);
            }

            $this->response->data = $serviceResult;

        
        }
        catch (\Exception $ex) {
            $this->response->statusCode = 500;
            $serviceResult = new ServiceResult(false, $data = array(), 
                $errors = array("exception" => $ex->getMessage()));
            $this->response->data = $serviceResult;
        }

    }
    
    public function actionUpdate($id){
        $this->response->statusCode = 405;
        $serviceResult = new ServiceResult(false, $data = array(), 
            $errors = array("message" => "Update method not implemented for this resource" ));
        $this->response->data = $serviceResult;
    }
	
    public function actionDelete(){
        $params = Yii::$app->request->get();
        $this->response->statusCode = 200;
        
        $serviceResult = null;
        $errors = array();
        $baseUploadPath = '/var/www/uploaded_files/';
        $tempFolderPath = $baseUploadPath . 'temp/';
        $db = Yii::$app->db;
        $transaction = $db->beginTransaction();
        try{ 
            $fileRow = array();
            $fileName = isset($params['file_name']) ? $params['file_name'] : null;
            if($fileName != null){
                $fileRow = AppQueries::getFileByName($fileName);
                if(sizeof($fileRow) == 1){
                    if($fileRow[0]['uploaded_by'] == $this->authUser["id"]){
                        $filePath = $baseUploadPath . $fileRow[0]['admission_id'] . '/' . $fileRow[0]['file_name'];
                        if (file_exists($filePath)) {
                            $success = AppQueries::deleteFileAttachment($db, $fileRow[0]['file_name']);
                            if($success){
                                $success = unlink($filePath);
                                $serviceResult = new ServiceResult(true, $data = array(), $errors = array());
                                $transaction->commit();
                            }
                            else{
                                $errors['file'] = 'File cannot be deleted';
                                $serviceResult = new ServiceResult(false, $data = array(), $errors = array());
                                $transaction->rollBack();
                            }
                        }
                        else{
                            $errors['file'] = 'File not exist';
                            $serviceResult = new ServiceResult(false, $data = array(), $errors = $errors);
                        }
                    }
                    else {
                        $errors['file'] = "You don't have permission to delete file ";
                        $serviceResult = new ServiceResult(false, $data = array(), $errors = $errors);
                    }
                }
                else if (file_exists($tempFolderPath . $fileName)) {
                    unlink($tempFolderPath . $fileName);
                    $serviceResult = new ServiceResult(true, $data = array(), $errors = array());
                }
                else{
                    $errors['file'] = 'File not exist';
                    $serviceResult = new ServiceResult(false, $data = array(), $errors = $errors);
                }
            }
            else{
                $errors['file'] = 'File name should be given';
                $serviceResult = new ServiceResult(false, $data = array(), $errors = $errors);
            }
            
            $this->response->data = $serviceResult;
            
        } catch (\Exception $ex) {
            $transaction->rollBack();
            $this->response->statusCode = 500;
            $serviceResult = new ServiceResult(false, $data = array(), 
                $errors = array("exception" => $ex->getMessage()));
            $this->response->data = $serviceResult;
        }
        
    }
    
    private function isValidAuthData($authHeader){
        if(!isset($authHeader)){
                return array("success" => false, "message" => "Authorization header not found");
            }
        else {
            $token = sizeof(explode('Basic', $authHeader)) >= 2 ? 
                trim(explode('Basic', $authHeader)[1]) : null;
            $tokenModel = AuthTokenCrud::read($token, false, true);
            if($tokenModel === null){
                return array("success" => false, "message" => "Not a valid token");
            }
            else{
                $recordFilter = new RecordFilter();
                $recordFilter->id = $tokenModel->user_id;
                $userCrud = new UserCrud();
                $user = $userCrud->read($recordFilter, false);
                $this->authUser = $user;
                $this->authUser["token"] = $tokenModel->token;
                return array("success" => true, "message" => "");
            }
        }
    }
    
    private function getIdsArray($fac){
        return array_map(function($fac){return $fac['id'];}, $fac);
    }
    
    private function checkPermission($admissionId){
        $clinicCategories = ["CC", "ET", "FT"];
        $recordFilter = new RecordFilter();
        $recordFilter->id = $admissionId;
        $admissionCrud = new AdmissionCrud();
        $admission = $admissionCrud->read($recordFilter);
        $userFacilityIds = $this->getIdsArray($this->authUser["facilities"]);
        $admSendFromFacility = $admission["sent_by_facility"];
        $admSendToFacility = $admission["sent_to_facility"];
        $admSendToGroup = $admission["group"];
        if(in_array($this->authUser["category"], $clinicCategories) && 
                !in_array($admSendFromFacility, $userFacilityIds)){
            return false;
        }

        else if( $this->authUser["category"] == "HL" ){
            if($this->authUser["role"] != "PN" && 
                !in_array($admSendToFacility, $userFacilityIds)){
                return false;
            }
            else{
                $userGroupIds = $this->getIdsArray($this->authUser["groups"]);
                if(!in_array($admSendToGroup, $userGroupIds)){
                    return false;
                }
            }
        }
        
        return true;
    }
	
	
	
 
}


