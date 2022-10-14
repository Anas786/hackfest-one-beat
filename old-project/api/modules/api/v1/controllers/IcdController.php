<?php
namespace app\modules\api\v1\controllers;

use yii\rest\Controller;
use app\modules\api\v1\models\Icd\IcdCrud;
use app\modules\api\models\ServiceResult;
use app\modules\api\models\RecordFilter;

use Yii;

class IcdController extends Controller
{
    private $response;
    private $icdCrud;
    
    public function init() {
        parent::init();
        $this->icdCrud = new IcdCrud();
        $this->response = Yii::$app->response;
        $this->response->format = \yii\web\Response::FORMAT_JSON;
        $this->response->headers->set('Content-type', 'application/json; charset=utf-8');
    }
    
    public function actionIndex(){
        try {
            $params = Yii::$app->request->get();
        
            $this->response->statusCode = 200;

            $recordFilter = new RecordFilter();

            $recordFilter->attributes = $params;
            
            $this->response->data = $this->icdCrud->readAll($recordFilter);
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
 
}
