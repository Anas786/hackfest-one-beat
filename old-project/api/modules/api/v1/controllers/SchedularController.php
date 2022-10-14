<?php
namespace app\modules\api\v1\controllers;

use yii\rest\Controller;
use app\modules\api\v1\models\Schedular\SchedularCrud;
use app\modules\api\v1\models\Schedular\Schedular;
use Yii;
use app\modules\api\models\ServiceResult;
use app\modules\api\models\RecordFilter;
use app\modules\api\models\AuthToken\AuthTokenCrud;

class SchedularController extends Controller
{
    private $response;
    private $schedularCrud;
    private $authUser;

    public function init() {
        parent::init();
        $this->schedularCrud = new SchedularCrud();
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
            
            $result = $this->schedularCrud->readAll($recordFilter, true);
            
            $this->response->data = $result;
            
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
            if(is_numeric($id)){
                $recordFilter->id = $id;
            }
            $recordFilter->attributes = $params;
            $group = null;
            
            if(is_numeric($id)){
                $group = $this->schedularCrud->read($recordFilter, $findModel = false);
            }
            else if(is_string($id)){
                $groupIds = array_filter(explode(',', $id));
                if(sizeof($groupIds)){
                    $group = [];
                    foreach ($groupIds as $value) {
                        $recordFilter->id = $value;
                        $tempGroup = $this->groupCrud->read($recordFilter, $findModel = false);
                        if($tempGroup !== null){
                            array_push($group, $tempGroup);
                        }
                    }
                }
            }
            
            $serviceResult = new ServiceResult(true, 
                $data = $group, 
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
        try{
            $params = Yii::$app->request->post();
            date_default_timezone_set("UTC");

            $this->response->statusCode = 200;
//            $params = $this->trimParams($params);

            $group = new Schedular();
            $group->scenario= 'post';
            $group->attributes = array_filter($params);
                
        $this->response->data = $this->schedularCrud->create($group);
            
        } catch (\Exception $ex) {
            $this->response->statusCode = 500;
            $serviceResult = new ServiceResult(false, $data = array(), 
                $errors = array("exception" => $ex->getMessage()));
            $this->response->data = $serviceResult;
        }
        
        
    }
	
    public function actionUpdate($id){
        
        try {
            $params = Yii::$app->request->post();
            date_default_timezone_set("UTC");

            $this->response->statusCode = 200;
            $params = $this->trimParams($params);
            
            $recordFilter = new RecordFilter();
            $recordFilter->id = $id;
            
            $group = $this->groupCrud->read($recordFilter);
//            $params = $this->trimParams($params);
            $group->scenario = 'put';
            $group->attributes = array_filter($params);
            
            $this->response->data = $this->groupCrud->update($group);
        } catch (\Exception $ex) {
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
        if(isset($params["deactivate"])){
            $params["deactivate"] = strtoupper(trim($params["deactivate"]));
        }
        
        if(isset($params["isReal"])){
            $params["isReal"] = strtoupper(trim($params["isReal"]));
        }
        return $params;
    }
 
    private function downloadCSV($data, $fileName){
        $validFields = ['name' => 'name', 'facility' => 'facility', 
            'created' => 'created', 'updated' => 'updated'];
        if(sizeof(array_filter(array_intersect_key($validFields, $data[0]))) != 4){
            throw new \Exception('Data could not contain required fields for csv');
        }
        
        header('Content-Type: text/csv; charset=utf-8');
        header("Content-Disposition: attachment; filename=$fileName.csv");

        // create a file pointer connected to the output stream
        $output = fopen('php://output', 'w');

        // output the column headings
        fputcsv($output, array('Group Name', 'Affiliated Hospital', 'Created', 'Updated'));
        foreach ($data as $r) {
            fputcsv($output, array($r['name'], $r['facility'], $r['created'], $r['updated']));
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