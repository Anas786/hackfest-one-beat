<?php
namespace app\modules\api\v1\controllers;

use yii\rest\Controller;
use app\modules\api\models\ServiceResult;
use app\modules\api\models\RecordFilter;
use app\modules\api\v1\models\ActivityLog\ActivityLogCrud;
use app\modules\api\models\AuthToken\AuthTokenCrud;

use Yii;

class ActivityLogController extends Controller
{
    private $response;
    private $authUser;
    
    public function init() {
        parent::init();
        $this->response = Yii::$app->response;
        $this->response->format = \yii\web\Response::FORMAT_JSON;
        $this->response->headers->set('Content-type', 'application/json; charset=utf-8');
    }
    
//    Write before action method
    
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
            $crud = new ActivityLogCrud();
            $this->response->data = $crud->readAll($recordFilter);
        } 
        catch (\Exception $ex) {
            $this->response->statusCode = 500;
            $serviceResult = new ServiceResult(false, $data = array(), 
                $errors = array("exception" => $ex->getMessage()));
            $this->response->data = $serviceResult;
        }
        
        
    }
	
	
    public function actionView($id){
        $this->response->statusCode = 405;
        $serviceResult = new ServiceResult(false, $data = array(), 
            $errors = array("message" => "View method not implemented for this resource" ));
        $this->response->data = $serviceResult;
	}
	
    public function actionCreate(){
        $this->response->statusCode = 405;
        $serviceResult = new ServiceResult(false, $data = array(), 
            $errors = array("message" => "Create method not implemented for this resource" ));
        $this->response->data = $serviceResult;
        
    }
    
    public function actionUpdate($id){
        $this->response->statusCode = 405;
        $serviceResult = new ServiceResult(false, $data = array(), 
            $errors = array("message" => "Update method not implemented for this resource" ));
        $this->response->data = $serviceResult;
    }
	
    public function actionDelete($id){
        $this->response->statusCode = 405;
        $serviceResult = new ServiceResult(false, $data = array(), 
            $errors = array("message" => "Delete method not implemented for this resource" ));
        $this->response->data = $serviceResult;
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
                if ($user['category'] === 'AS'){
                    return array("success" => true, "message" => "");
                }else{
                    return array("success" => false, "message" => "Invalid Permissions");
                }
                
            }
        }
    }
 
}
