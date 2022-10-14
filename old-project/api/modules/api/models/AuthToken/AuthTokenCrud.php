<?php

namespace app\modules\api\models\AuthToken;

use app\modules\api\models\AuthToken\AuthToken;
use app\modules\api\models\ServiceResult;
use app\modules\api\components\CryptoLib;
use app\modules\api\v1\models\User\User;

class AuthTokenCrud{
    
    private static function verifyCreateParams($userName, $password){
        if($userName == null || !is_string($userName)){
            throw new  \Exception("UserName should not be null and only base64 encoded string");
        }
        if($password == null || !is_string($password)){
            throw new \Exception("Password should not be null and only base64 encoded string");
        }
    }
    
    public static function create($userName, $password){
        AuthTokenCrud::verifyCreateParams($userName, $password);
        $userName = base64_decode($userName);
        $password =  base64_decode($password);
        
        $isSaved = false;
        $errors  = array();
        $user = User::getUser($userName);
        if(isset($user)){
            $salt = $user->salt;
            $hash = $user->password;
            if(CryptoLib::validateHash($hash, $password, $salt)){
                $authToken = new AuthToken();
                $authToken->scenario = "post";
                $authToken->user_id = $user->id;
                $authToken->token = CryptoLib::randomString(32);
                $isSaved = $authToken->save();
                if(!$isSaved){
                    $errors["message"] = $authToken->getErrors();
                }

            }
            else{
                $errors["message"] = "Invalid username or password";
            }
        }
        else{
            $errors["message"] = "Invalid username or password";

        }
        
        $serviceResult = null;
        
        if ($isSaved) {
            $data = array("auth_token" => $authToken->token, "user_name" => $user->user_name, 
                "id" => $user->id);
            $serviceResult = new ServiceResult(true, $data, $errors = array());
        } 
        else{
            $serviceResult = new ServiceResult(false, $data = array(), 
                $errors = $errors);
        }
        
        return $serviceResult;
    }
    
    private static function verifyUpdateParams($token){
        if($token == null){
            throw new  \Exception("Token should not be null or empty");
        }
        
    }
    
//  Use this function to update last request time
    public static function update($token, $expired){
        self::verifyUpdateParams($token, $expired);
        $errors;
        $isSaved = false;
        $authToken = AuthToken::findOne($token);
        if($authToken !== null ){
            $authToken->scenario = 'put';
//          Just update field updated_on in auth token
            if($expired != null){
                $expired = strtoupper(trim($expired));
                if(!empty($expired)){
                    $authToken->expired = $expired;
                }
            }
            $isSaved = $authToken->save();
            
        }
        else{
            throw new \Exception("Token is expired");
        }
        
        if(($isSaved)){
            $serviceResult = new ServiceResult(true, $data = array(), 
                            $errors = array());
            return $serviceResult;
        }
        else{
            $serviceResult = new ServiceResult(false, $data = array(), 
                            $errors = $authToken->getErrors());
            return $serviceResult;
        }
            
    }
    
    public static function read($token, $findUserModel = false, $findTokenOnly = false){
        /*
         * Set only parameter to true either $findUserModel or $findTokenOnly 
         */
        $authToken = AuthToken::findOne(['token' => $token, 'expired' => 'F']);
        
        if($authToken === null){
            return $authToken;
        }
        else{
            if($findTokenOnly){
                return $authToken;
            }
            else if($findUserModel){
                return $authToken->user;
            }
            else{
                return $authToken->user->toArray();
            }
            
            
        }
    }
    
    
}

