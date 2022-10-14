<?php
namespace app\modules\api\controllers;

use yii\rest\Controller;
use app\modules\api\models\ServiceResult;
use app\modules\api\models\AppQueries;
use app\modules\api\models\AppEnums;

use Yii;

class FetchFileController extends Controller
{
    
    private $response;
    private $authUser;

    public function init() {
        parent::init();
        
        $this->response = Yii::$app->response;
    }    
    
    public function actionIndex(){
        $params = Yii::$app->request->get();
        $fId = isset($params['fid']) ? $params['fid'] : null;
        try {
            if($fId != null){
                $row = AppQueries::getUniqueFileId($fId);
                if(sizeof($row) &&  strtolower($row[0]["expired"]) == "f"){
                    $baseFilePath = '/var/www/uploaded_files/';
                    return $this->response->sendFile($baseFilePath . $row[0]["admission_id"] . "/" . $row[0]["file_name"]);
                }
            }
        } catch (\Exception $ex) {
            $this->response = false;
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
	
    public function actionDelete(){
        $this->response->statusCode = 405;
        $serviceResult = new ServiceResult(false, $data = array(), 
            $errors = array("message" => "Delete method not implemented for this resource" ));
        $this->response->data = $serviceResult;
    }
	
	
	
 
}


