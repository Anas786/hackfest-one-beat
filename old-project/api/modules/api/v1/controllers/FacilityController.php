<?php
namespace app\modules\api\v1\controllers;

use yii\rest\Controller;
use app\modules\api\v1\models\Facility\FacilityCrud;
use app\modules\api\v1\models\Facility\Facility;
use app\modules\api\v1\models\FacilityGroup\FacilityGroup;
use app\modules\api\models\ServiceResult;
use app\modules\api\models\RecordFilter;
use app\modules\api\models\AuthToken\AuthTokenCrud;

use Yii;

class FacilityController extends Controller
{
    private $response;
    private $facilityCrud;
    private $authUser;
    
    public function init() {
        parent::init();
        $this->facilityCrud = new FacilityCrud();
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
            
            $result = $this->facilityCrud->readAll($recordFilter);
            
            if(isset($params["export_csv"])){
                $result = $result->data["records"];
                $this->downloadCSV($result, 'facilities');
                
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
            if(is_numeric($id)){
                $recordFilter->id = $id;
            }
            $recordFilter->attributes = $params;
            $facility = null;
            
            if(is_numeric($id)){
                $facility = FacilityCrud::read($recordFilter, $findModel = false);
            }
            else if(is_string($id)){
                $facilityIds = array_filter(explode(',', $id));
                if(sizeof($facilityIds)){
                    $facility = [];
                    foreach ($facilityIds as $value) {
                        $recordFilter->id = $value;
                        $tempFacility = FacilityCrud::read($recordFilter, $findModel = false);
                        if($tempFacility !== null){
                            array_push($facility, $tempFacility);
                        }
                    }
                }
            }

            $serviceResult = new ServiceResult(true, 
                $data = $facility , 
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

            $facility = new Facility();
            $facility->scenario = 'post';
            $facility->attributes = $params;

            $facilityGroups = $this->getFacilityGroup($params);

            $this->response->data = $this->facilityCrud->create($facility, $facilityGroups);
            
        } 
        catch (\Exception $ex) {
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
            
            $recordFilter = new RecordFilter();
            $recordFilter->id = $id;
                        
            $facility = FacilityCrud::read($recordFilter);
            $facility->scenario = 'put';
            $params = $this->trimParams($params);
            $facility->attributes = $params;
            
            $facilityGroups = $this->getFacilityGroup($params);

            $this->response->data = $this->facilityCrud->update($facility, $facilityGroups);
                
            
            
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
        if(isset($params["deactivate"])){
            $params["deactivate"] = strtoupper(trim($params["deactivate"]));
        }
        
        if(isset($params["state"])){
            $params["state"] = strtoupper(trim($params["state"]));
        }
        
        if(isset($params["type"])){
            $params["type"] = strtoupper(trim($params["type"]));
        }
        
        if(isset($params["representative_name"])){
            $params["representative_name"] = trim($params["representative_name"]);
        }
        
        if(isset($params["city"])){
            $params["city"] = trim($params["city"]);
        }
        
        if(isset($params["npi"])){
            $params["npi"] = trim($params["npi"]);
        }
        
        if(isset($params["phone"])){
            $params["phone"] = trim($params["phone"]);
        }
        
        if(isset($params["representative_contact_number"])){
            $params["representative_contact_number"] = 
                trim($params["representative_contact_number"]);
        }
        
        if(isset($params["ein"])){
            $params["ein"] = trim($params["ein"]);
        }
        
        if(isset($params["zip_code"])){
            $params["zip_code"] = trim($params["zip_code"]);
        }
        
        if(isset($params["isReal"])){
            $params["isReal"] = strtoupper(trim($params["isReal"]));
        }
    
        return $params;
    }
    
    private function getFacilityGroup($params){
        $facilityGroups = null;
//      Refactor this and return array only
        if(isset($params["group_id"]) && 
            ( is_int($params["group_id"]) || is_array($params["group_id"]) ) ){
            $facilityGroups = array();
            $groups_ids = is_int($params["group_id"]) ? array($params["group_id"]) :
                                                        $params["group_id"];
            
            foreach ($groups_ids as $value) {
                    $tempFgObject = new FacilityGroup();
                    $tempFgObject->group_id = $value;
                    array_push($facilityGroups, $tempFgObject);
                }
        }
      
        return $facilityGroups;
    }
    
    private function downloadCSV($data, $fileName){
        $validFields = ['name' => 'name', 'type' => 'type', 
            'created' => 'created', 'updated' => 'updated'];
        if(sizeof(array_filter(array_intersect_key($validFields, $data[0]))) != 4){
            throw new \Exception('Data could not contain required fields for csv');
        }
        
        header('Content-Type: text/csv; charset=utf-8');
        header("Content-Disposition: attachment; filename=$fileName.csv");

        // create a file pointer connected to the output stream
        $output = fopen('php://output', 'w');

        // output the column headings
        fputcsv($output, array('Healthcare Facility Name', 'Facility Type', 'Created', 'Updated'));
        foreach ($data as $r) {
            fputcsv($output, array($r['name'], $r['type'], $r['created'], $r['updated']));
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
