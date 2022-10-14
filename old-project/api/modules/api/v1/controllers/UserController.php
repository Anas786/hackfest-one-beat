<?php
namespace app\modules\api\v1\controllers;

use yii\rest\Controller;
use app\modules\api\v1\models\User\UserCrud;
use app\modules\api\v1\models\User\User;
use app\modules\api\models\ServiceResult;
use app\modules\api\models\RecordFilter;
use app\modules\api\v1\models\UserGroup\UserGroup;
use app\modules\api\v1\models\UserFacility\UserFacility;
use app\modules\api\components\CryptoLib;
use app\modules\api\models\AuthToken\AuthTokenCrud;
use app\modules\api\v1\models\UserOnCallGroup\UserOnCallGroup;
use Yii;

class UserController extends Controller
{
    private $response;
    private $userCrud;
    private $authUser;

    public function init() {
        parent::init();
        $this->userCrud = new UserCrud();
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
        try {
            $params = Yii::$app->request->get();
        
            $this->response->statusCode = 200;

            $recordFilter = new RecordFilter();

            $recordFilter->attributes = $params;
            
            $result = $this->userCrud->readAll($recordFilter, true);
            
            if(isset($params["export_csv"])){
                $result = $result->data["records"];
                $this->downloadCSV($result, 'users');

            }
            
            else{
                $this->response->data = $result;
            }
        } 
        catch (\Exception $ex) {
            $this->response->statusCode = 500;
            $serviceResult = new ServiceResult(false, $data = array(), 
                $errors = array("exception" => $ex->getMessage()));
            $this->response->data = $serviceResult;
        }
        
        
    }
	
	
	public function actionView($id){
        try {
            $params = Yii::$app->request->get();
            $this->response->statusCode = 200;
            $recordFilter = new RecordFilter();
            $recordFilter->id = $id;
            $recordFilter->attributes = $params;
            
            $user = $this->userCrud->read($recordFilter, $findModel = false);
            $serviceResult = new ServiceResult(true, 
                $data = $user , 
                $errors = array()); 
            $this->response->data = $serviceResult;
            
        } 
        catch (\Exception $ex) {
            $this->response->statusCode = 500;
            $serviceResult = new ServiceResult(false, $data = array(), 
                $errors = array("exception" => $ex->getMessage()));
            $this->response->data = $serviceResult;
        }
	}
	
	public function actionCreate(){
        try {
            $params = Yii::$app->request->post();
            date_default_timezone_set("UTC");

            $this->response->statusCode = 200;
            $params = $this->trimParams($params);

            $user = new User();
            $user->scenario = 'post';
            $user->attributes = $params;
            $userGroups = isset($params["group_id"]) ? $params["group_id"] : null;
            $userFailities = isset($params["facility_id"]) ? $params["facility_id"] : null;
            $onCallGroupIds = isset($params['on_call_group_ids']) ? 
                    $params['on_call_group_ids'] : null;

            $this->response->data = $this->userCrud->create($user, $userGroups, $userFailities, 
                    $onCallGroupIds);
            
        } 
        catch (\Exception $ex) {
            $this->response->statusCode = 500;
            $serviceResult = new ServiceResult(false, $data = array(), 
                $errors = array("exception" => $ex->getMessage()));
            $this->response->data = $serviceResult;
        }
        
        
    }
    
    private function generatePassword($password){
        $result = array();
        if(strlen($password) < 8 || strlen($password) > 23){
            $result["error"] = "Password has at least 8 characters or at most 23 characters";
        }
        else{
            $result['salt'] = CryptoLib::generateSalt();
            $result['hash'] = CryptoLib::hash($password);
        }
        return $result;
    }
    
    public function actionUpdate($id){
        try {
            $params = Yii::$app->request->post();
            date_default_timezone_set("UTC");

            $this->response->statusCode = 200;
            
            $saltAndHash = null;
            if(isset($params['password'])){
                $saltAndHash = $this->generatePassword($params['password']);
                if(isset($saltAndHash) && array_key_exists('error', $saltAndHash)){
                    $this->response->data = new ServiceResult(false, $data = array(), 
                    $errors = $saltAndHash['error']);
                    return;
                }
            }
            
            $recordFilter = new RecordFilter();
            $recordFilter->id = $id;
            
            $user = $this->userCrud->read($recordFilter);
                
            $user->scenario = 'put';
            $params = $this->trimParams($params);
            $user->attributes = $params;
            if(isset($saltAndHash) && array_key_exists('salt', $saltAndHash) 
                && array_key_exists('hash', $saltAndHash)){
                $user->salt = $saltAndHash['salt'];
                $user->password = $saltAndHash['hash'];
            }

            $userGroups = isset($params["group_id"]) ? $params["group_id"] : null;
            $userFailities = isset($params["facility_id"]) ? $params["facility_id"] : null;
            $onCallGroupIds = isset($params['on_call_group_ids']) ? 
                    $params['on_call_group_ids'] : null;

            $this->response->data = $this->userCrud->update($user, $userGroups, $userFailities, 
                    $onCallGroupIds );
        
            
        } 
        catch (\Exception $ex) {
            $this->response->statusCode = 500;
            $serviceResult = new ServiceResult(false, $data = array(), 
                $errors = array("exception" => $ex->getMessage()));
            $this->response->data = $serviceResult;    
        }
            
        
    }
	
    public function actionDelete($id){
        $this->response->statusCode = 405;
        $serviceResult = new ServiceResult(false, $data = array(), 
            $errors = array("message" => "Delete method not implemented for this resource" ));
        $this->response->data = $serviceResult;
    }
 
    private function trimParams($params){
        if(isset($params["user_name"])){
            $params["user_name"] = strtolower(trim($params["user_name"]));
        }
        
        if(isset($params["deactivate"])){
            $params["deactivate"] = strtoupper(trim($params["deactivate"]));
        }
        
        if(isset($params["isReal"])){
            $params["isReal"] = strtoupper(trim($params["isReal"]));
        }
        
        if(isset($params["enable_two_step_verification"])){
            $params["enable_two_step_verification"] = strtoupper(trim($params["enable_two_step_verification"]));
        }
        
        if(isset($params["notify"])){
            $params["notify"] = strtoupper(trim($params["notify"]));
        }
        
        if(isset($params["npi"])){
            $params["npi"] = trim($params["npi"]);
        }
        
        if(isset($params["degree"])){
            $params["degree"] = strtoupper(trim($params["degree"]));
        }
        
        if(isset($params["specialty"])){
            $params["specialty"] = strtoupper(trim($params["specialty"]));
        }
        
        if(isset($params["category"])){
            $params["category"] = strtoupper(trim($params["category"]));
        }
        
        if(isset($params["role"])){
            $params["role"] = strtoupper(trim($params["role"]));
        }
        
        if(isset($params["notify"])){
            $params["notify"] = strtoupper(trim($params["notify"]));
        }
        
        if(isset($params["enable_two_step_verification"])){
            $params["enable_two_step_verification"] = 
                strtoupper(trim($params["enable_two_step_verification"]));
        }
        
        
    
        return $params;
    }
    
    private function getUserGroup($params){
        $userGroups = null;

        if(isset($params["group_id"]) && 
            ( is_int($params["group_id"]) || is_array($params["group_id"]) ) ){
            $userGroups = array();
            $groups_ids = is_int($params["group_id"]) ? array($params["group_id"]) :
                                                        $params["group_id"];
            foreach ($groups_ids as $value) {
                    $tempUgObject = new UserGroup();
                    $tempUgObject->group_id = $value;
                    array_push($userGroups, $tempUgObject);
                }
        }
        
        return $userGroups;
    }
    
    private function getUserFacilities($params){
        $userfacilities = null;

        if(isset($params["facility_id"]) && 
            ( is_int($params["facility_id"]) || is_array($params["facility_id"]) ) ){
            $userfacilities = array();
            $facility_ids = is_int($params["facility_id"]) ? array($params["facility_id"]) : 
                                                             $params["facility_id"];
            foreach ($facility_ids as $value) {
                    $tempUfObject = new UserFacility();
                    $tempUfObject->facility_id = $value;
                    array_push($userfacilities, $tempUfObject);
                }
        }
        
        return $userfacilities;
    }
    
    private function downloadCSV($data, $fileName){
        $validFields = ['user_name' => 'user_name', 'first_name' => 'first_name',
            'last_name' => 'last_name', 'category' => 'category', 'role' => 'role',
            'facility' => 'facility', 
            'created' => 'created', 'updated' => 'updated'];
        if(sizeof(array_filter(array_intersect_key($validFields, $data[0]))) != 8){
            throw new \Exception('Data could not contain required fields for csv');
        }
        
        header('Content-Type: text/csv; charset=utf-8');
        header("Content-Disposition: attachment; filename=$fileName.csv");

        // create a file pointer connected to the output stream
        $output = fopen('php://output', 'w');

        // output the column headings
        fputcsv($output, array('User Name', 'First Name', 'Last Name', 'Category', 
                               'Role', 'Facility', 'Created', 'Updated'));
        foreach ($data as $r) {
            fputcsv($output, array($r['user_name'], $r['first_name'], $r['last_name'], 
                $r['category'], $r['role'], $r['facility'], 
                $r['created'], $r['updated']));
        }
    }

    private function isValidAuthData($authHeader){
        if(!isset($authHeader)){
                return array("success" => false, "message" => "Authorization header not found");
            }
        else {
            $token = sizeof(explode('Basic', $authHeader)) >= 2 ? 
                trim(explode('Basic', $authHeader)[1]) : null;
            $user = AuthTokenCrud::read($token);
            if($user === null){
                return array("success" => false, "message" => "Not a valid token");
            }
            else{
                $this->authUser = $user;
                return array("success" => true, "message" => "");
            }
        }
    }
    
}

