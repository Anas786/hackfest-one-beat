<?php

namespace app\modules\api\v1\controllers;
use app\modules\api\v1\models\User\UserCrud;
use app\modules\api\components\CryptoLib;
use app\modules\api\models\ServiceResult;
use yii\rest\Controller;
use app\modules\api\models\RecordFilter;

use Yii;

class SetPasswordController extends Controller
{
    private $response;
    private $crud;
        
    public function init() {
        parent::init();
        $this->crud = new UserCrud();
        $this->response = Yii::$app->response;
        $this->response->format = \yii\web\Response::FORMAT_JSON;
        $this->response->headers->set('Content-type', 'application/json; charset=utf-8');
    }
    
    private function generatePassword($password){
        $result = array();
        if(strlen($password) < 8 || strlen($password) > 23){
            $result["error"] = "Password has at least 8 characters or at most 23 characters";
        }
        else{
            $salt = CryptoLib::generateSalt();
            $hash = CryptoLib::hash($password);
            if( !empty($salt) && !empty($hash)){
                $result['salt'] = $salt;
                $result['hash'] = $hash;
            }
        }
        return $result;
    }
    
    public function actionUpdate(){
        try {
            $params = Yii::$app->request->post();
            
            $this->response->statusCode = 200;
            if( !isset($params) || !isset($params['password']) || !isset($params['id']) ){
                $this->response->data = new ServiceResult(false, $data = array(), 
                    $errors = "Either password or id is missing");
                return;
            }
            
            
            $saltAndHash = null;
            $saltAndHash = $this->generatePassword($params['password']);
            if(isset($saltAndHash) && array_key_exists('error', $saltAndHash)){
                $this->response->data = new ServiceResult(false, $data = array(), 
                $errors = $saltAndHash['error']);
                return;
            }
            else if(isset($saltAndHash) && !array_key_exists('salt', $saltAndHash) ){
                $this->response->data = new ServiceResult(false, $data = array(), 
                $errors = 'Unexpected result');
                return;
            }
            
            
            $recordFilter = new RecordFilter();
            $recordFilter->id = $params['id'];
            
            $user = $this->crud->read($recordFilter);
            $user->scenario = 'initUser';
            $user->salt = $saltAndHash['salt'];
            $user->password = $saltAndHash['hash'];
            
            $this->response->data = $this->crud->updateUserPassword($user);
        
            
        } 
        catch (\Exception $ex) {
            $this->response->statusCode = 500;
            $serviceResult = new ServiceResult(false, $data = array(), 
                $errors = array("exception" => $ex->getMessage()));
            $this->response->data = $serviceResult;    
        }
            
        
        }

    

}

