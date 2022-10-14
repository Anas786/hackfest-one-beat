<?php

namespace app\modules\api\models;

class ServiceResult{
    public $success;
    public $data;
    public $errors;
    
    public function __construct($success, $data, $errors) {
        $this->success = $success;
        $this->data = $data;
        $this->errors = $errors;
    }
    
    
    
}
