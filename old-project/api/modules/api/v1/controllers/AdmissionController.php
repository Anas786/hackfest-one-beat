<?php
namespace app\modules\api\v1\controllers;

use yii\rest\Controller;
use app\modules\api\models\ServiceResult;
use app\modules\api\models\RecordFilter;
use app\modules\api\models\AuthToken\AuthTokenCrud;
use app\modules\api\v1\models\Admission\Admission;
use app\modules\api\v1\models\Admission\AdmissionCrud;
use app\modules\api\v1\models\AdmissionDiagnosis\AdmissionDiagnosis;
use app\modules\api\models\ActivityLogQueries;
use app\modules\api\models\AppLogValues;

use Yii;

class AdmissionController extends Controller
{
    private $response;
    private $crud;
    private $authUser;
    
    public function init() {
        parent::init();
        $this->crud = new AdmissionCrud();
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
            
            $result = $this->crud->readAll($recordFilter, true);
            
            if(isset($params["export_csv"])){
                $result = $result->data["records"];
                $this->downloadCSV($result, 'facilities');
                
            }
            
            else{
                $this->response->data = $result;
                ActivityLogQueries::insertActivity($this->authUser["id"], AppLogValues::listViewed, 
                        Yii::$app->request->getUserIP(), Yii::$app->request->absoluteUrl, $params, 
                        "Admission");
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
            
            $admission = $this->crud->read($recordFilter, $findModel = false);
            $serviceResult = new ServiceResult(true, 
                $data = $admission , 
                $errors = array()); 
            $this->response->data = $serviceResult;
            ActivityLogQueries::insertActivity($this->authUser["id"], AppLogValues::viewed, 
                    Yii::$app->request->getUserIP(), Yii::$app->request->absoluteUrl, $params, 
                    "Admission");
            
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

            $admission = new Admission();
            $admission->scenario = 'post';
            $admission->attributes = $params;
            $admissionDiagnosis = $this->getAdmissionDiagnosis($params);
            $admissionDiagnostics = $this->getAdmissionDiagnostics($params);
            $admissionInsurance = $this->getAdmissionInsurance($params);
            $admissionHistory = $this->getAdmissionHistory($params);
            $admissionMedication = $this->getAdmissionMedication($params);
            $admissionSpecialty = $this->getAdmissionSpecialty($params);
            $fileAttachments = isset($params['files']) ? $params['files'] : null;
            $this->response->data = $this->crud->create($admission, 
                    $admissionDiagnosis, $this->authUser, $fileAttachments, $admissionDiagnostics, $admissionInsurance, $admissionHistory, $admissionMedication, $admissionSpecialty);
            ActivityLogQueries::insertActivity($this->authUser["id"], AppLogValues::created, Yii::$app->request->getUserIP(), Yii::$app->request->absoluteUrl, $params, "Admission");
            
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
            $allowedAdmissionOpList = ["update_grp_phy", "update_grp"];
            
//           Note: Make status of admission re routed then use it in Activity Log
            
            if(isset($params["admission_op"]) && 
                    in_array($params["admission_op"], $allowedAdmissionOpList)  ){
                
                $params = $this->trimParams($params);
                $recordFilter = new RecordFilter();
                $recordFilter->id = $id;
                $admission = $this->crud->read($recordFilter);
            }
            else{
                $serviceResult = new ServiceResult(false, $data = array(), 
                $errors = array("operation_error" => "Requested operation is not allowed"));
                $this->response->data = $serviceResult;
                return;
            }
            
            if($params["admission_op"] == "update_grp_phy" && 
                    isset($params["group"]) && isset($params["physician"])){
//                $admission->scenario = 'put_group_and_physician';
                $admission->group = is_int($params["group"]) ? $params["group"] : 0;
                $admission->physician = is_int($params["physician"]) ? $params["physician"]  : 0;
                $this->response->data = $this->crud->update($admission, $this->authUser);
            }
            
            else if($params["admission_op"] == "update_grp" && 
                    isset($params["group"])){
//                $admission->scenario = 'put_group';
                $admission->group =  is_int($params["group"]) ? $params["group"] : 0;
                $admission->physician = 0;
                $this->response->data = $this->crud->update($admission, $this->authUser);
            }
            else{
                $serviceResult = new ServiceResult(false, $data = array(), 
                $errors = array("params" => "params missing"));
                $this->response->data = $serviceResult;
            }
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
        if(isset($params["patient_gender"])){
            $params["patient_gender"] = strtoupper(trim($params["patient_gender"]));
        }
    
        return $params;
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
    
    private function getAdmissionDiagnosis($params){
        $admissionDiagnosis = null;

        if(isset($params["diagnosis"]) && (is_array($params["diagnosis"])) ){
            $admissionDiagnosis = array();
            $diagnosisArray = $params["diagnosis"];
            foreach ($diagnosisArray as $value) {
                    $tempAdmissionDiagnosisObject = new AdmissionDiagnosis();
                    $tempAdmissionDiagnosisObject->diagnosis_code = $value["code"];
                    $tempAdmissionDiagnosisObject->diagnosis_desc = $value["desc"];
                    array_push($admissionDiagnosis, $tempAdmissionDiagnosisObject);
                }
        }
        
        return $admissionDiagnosis;
    }


    private function getAdmissionDiagnostics($params){
        $admissionDiagnostics = null;
        if(isset($params["diagnosicOrders"])){
            $admissionDiagnostics = array();
            $admissionDiagnostics['Blood_Tests'] = (isset($params["diagnosicOrders"]['multipleBloodTests']))?implode(" ",$params["diagnosicOrders"]['multipleBloodTests']):'';
            $admissionDiagnostics['Urine_Tests'] = '';
            foreach ($params["diagnosicOrders"]['urineTest'] as $key => $value) {
                if ($value === true){
                    $admissionDiagnostics['Urine_Tests'].=$key;
                }
            }
            $admissionDiagnostics['Imaging_Tests'] = '';
            foreach ($params["diagnosicOrders"]['imagingTest'] as $key => $value) {
                if ($value === true){
                    $admissionDiagnostics['Imaging_Tests'].=$key.' ';
                }
            }
        }
        return ($admissionDiagnostics!=null)?serialize($admissionDiagnostics):null;
    }
    private function getAdmissionInsurance($params){
        $admissionInsurance = null;
        if(isset($params["insurance"])){
            $admissionInsurance = array(
                'Primary_Card_Holder_Name'=> (isset($params["insurance"]["firstName"]) && isset($params["insurance"]["lastName"]))?$params["insurance"]["firstName"]." ".$params["insurance"]["lastName"]:'',
                'Insurance' => (isset($params["insurance"]["insuranceDd"]))?$params["insurance"]["insuranceDd"]:'',
                'Primary_Card_Holder_SSN' => (isset($params["insurance"]["ssn"]))?$params["insurance"]["ssn"]:'',
                'Primary_Group_ID' => (isset($params["insurance"]["pgId"]))?$params["insurance"]["pgId"]:'',
                'Primary_Member_ID' => (isset($params["insurance"]["pmId"]))?$params["insurance"]["pmId"]:'',
                'Additional_Insurance_Info' => (isset($params["insurance"]["addlInsInfo"]))?$params["insurance"]["addlInsInfo"]:''
                );
        }
        return ($admissionInsurance!=null)?serialize($admissionInsurance):null;
    }
    private function getAdmissionHistory($params){
        $admissionHistory = null;
        if(isset($params["medicalHistory"])){
            $admissionHistory = array(
				'Temperature'=>(isset($params["medicalHistory"]['Temperature']))?$params["medicalHistory"]['Temperature']:'',
                'Glucose'=>(isset($params["medicalHistory"]['Glucose']))?$params["medicalHistory"]['Glucose']:'',
                'Blood_Pressure_Systolic'=>(isset($params["medicalHistory"]['Blood_Pressure']))?$params["medicalHistory"]['Blood_Pressure']:'',
                'Blood_Pressure_Diastolic'=>(isset($params["medicalHistory"]['Diastolic']))?$params["medicalHistory"]['Diastolic']:'',
                'Pulse'=>(isset($params["medicalHistory"]['Pulse']))?$params["medicalHistory"]['Pulse']:'',
                'O2_Level'=>(isset($params["medicalHistory"]['Oxygen_Level']))?$params["medicalHistory"]['Oxygen_Level']:''
            );
            $admissionHistory['Comorbidity'] = '';
			if(isset($params["medicalHistory"]['Comorbidity'])){
				foreach ($params["medicalHistory"]['Comorbidity'] as $key => $value) {
					if ($value === true){
						$admissionHistory['Comorbidity'].=$key.' ';
					}
				}
			}
            $admissionHistory['Allergies'] = '';
			if(isset($params["medicalHistory"]['Allergies'])){
				foreach ($params["medicalHistory"]['Allergies'] as $key => $value) {
					if ($value === true){
						$admissionHistory['Allergies'].=$key.' ';
					}
				}
			}
            $admissionHistory['Other_Allergies'] = (isset($params["medicalHistory"]['Other_Allergies']))?$params["medicalHistory"]['Other_Allergies']:'';
            $admissionHistory['Parient_Brief_Medical_Information'] = (isset($params["medicalHistory"]['Parient_Brief_Medical_Information']))?$params["medicalHistory"]['Parient_Brief_Medical_Information']:'';

        }
        return ($admissionHistory!=null)?serialize($admissionHistory):null;
    }
    private function getAdmissionMedication($params){
        $admissionMedication = null;
        if(isset($params["medicationOrders"]) && !empty($params["medicationOrders"])){
            $admissionMedication = array(
                'Diet' => (isset($params["medicationOrders"]["Diet"]))?$params["medicationOrders"]["Diet"]:'',
                'IV_Fluids' => (isset($params["medicationOrders"]["IV_Fluids"]))?$params["medicationOrders"]["IV_Fluids"]:'',
                'Resume_All_Home_Medications' => (isset($params["medicationOrders"]["Resume_All_Home_Medications"]))?"Yes":"No",
            );
            $admissionMedication['PRN_Meds'] = '';
			if (isset($params["medicationOrders"]['PRN_Meds'])){
				foreach ($params["medicationOrders"]['PRN_Meds'] as $key => $value) {
					if ($value === true){
						$admissionMedication['PRN_Meds'].=$key.' ';
					}
				}
			}
            $admissionMedication['Other_PRN_Meds'] = (isset($params["medicationOrders"]["Other_PRN_Meds"]))?$params["medicationOrders"]["Other_PRN_Meds"]:'';
            $admissionMedication['Other_Scheduled_Meds'] = (isset($params["medicationOrders"]["Other_Scheduled_Meds"]))?$params["medicationOrders"]["Other_Scheduled_Meds"]:'';
        }
        return ($admissionMedication!=null)?serialize($admissionMedication):null;
    }
    private function getAdmissionSpecialty($params){
        $admissionSpecialty = null;
        if(isset($params["specialtyConsult"]) && !empty($params["specialtyConsult"])){
            $admissionSpecialty = array();
            $admissionSpecialty['Consults'] = '';
            if(isset($params["specialtyConsult"]['Consults'])){
				foreach ($params["specialtyConsult"]['Consults'] as $key => $value) {
					if ($value === true){
						$admissionSpecialty['Consults'].=$key.' ';
					}
				}
			}
            $admissionSpecialty['Preferred_Consultant'] = (isset($params["specialtyConsult"]['Preferred_Consultant']))?$params["specialtyConsult"]['Preferred_Consultant']:'';
            $admissionSpecialty['Additional_Consults'] = (isset($params["specialtyConsult"]['Additional_Consults']))?$params["specialtyConsult"]['Additional_Consults']:'';
            $admissionSpecialty['Specialist_Consult_required_for_transfer'] = (isset($params["specialtyConsult"]['Specialist_Consult_required_for_transfer']))?'Yes':'No';
        }
        return ($admissionSpecialty!=null)?serialize($admissionSpecialty):null;
    }
    
}
