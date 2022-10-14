<?php
namespace app\modules\api\v1\controllers;

use yii\rest\ActiveController;
use app\modules\api\v1\models\Country;
use Yii;
use yii\db\Query;

class CountryController extends ActiveController
{
    public $modelClass = 'app\modules\api\v1\models\Country';
	
	public function actions()
	{
		$actions = parent::actions();
	
		// disable the "delete" and "create" actions
		unset($actions['index'], $actions['view'], $actions['create'], $actions['update'], $actions['delete']);
	
		// customize the data provider preparation with the "prepareDataProvider()" method
		//$actions['index']['prepareDataProvider'] = [$this, 'prepareDataProvider'];
	
		return $actions;
	}
	
	public function actionIndex(){
 		$params= Yii::$app->request->get();
		
		$filter=array();
		$sort="";

		$page=1;
		$limit=10;
		
		if(isset($params['page']))
             $page=$params['page'];
 
 
           if(isset($params['limit']))
              $limit=$params['limit'];
 
            $offset=$limit*($page-1);
		
		$query=new Query;
		$query->from('country')->select("code,name,population")
		->offset($offset)
		->limit($limit)
			;
			
		/* Filter elements */
           if(isset($params['filter']))
            {
             $filter=(array)json_decode($params['filter']);
            }

           if(isset($params['sort']))
            {
              	$sort=$params['sort'];
				 if(isset($params['order']))
				{  
					if($params['order']=="false")
					 $sort.=" desc";
					else
					 $sort.=" asc";
		 
				}
            }
			
		$query->orderBy($sort);
 
 		
 		if(isset($filter['code'])){
			$query->andFilterWhere(['like', 'code', $filter['code']]);
		}
		
		if (isset($filter['name'])){
			$query->andFilterWhere(['like', 'name', $filter['name']]);
		}
		
		if (isset($filter['population'])){
			$query->andFilterWhere(['like', 'population', $filter['population']]);
		}
		
		$query1 = new Query;
		$command = $query->createCommand();
		$models = $command->queryAll();
		
                /*
		$command1 = Yii::$app->db->createCommand("CALL GetAllCountries()");
		$data = $command1->queryAll();
                */
        $totalItems=$query->count();
 
        $this->setHeader(200);
 
        echo json_encode(array('function'=> "In index method", "params"=>$params, 'status'=>1,'data'=>$models,'totalItems'=>$totalItems),JSON_PRETTY_PRINT);
        
		//echo json_encode(array('function'=> "In index method", "params"=>$params),JSON_PRETTY_PRINT);
	}
	
	
	public function actionView($id){
		
		$model=$this->findModel($id);
		
		$this->setHeader(200);
        echo json_encode(array('function'=>"in view method", 'status'=>1,'data'=>array_filter($model->attributes)),JSON_PRETTY_PRINT);
	}
	
	public function actionCreate(){
		$params= Yii::$app->request->post();
		
		$model = new Country();
		$model->attributes=$params;

		if ($model->save()) {
	 
			$this->setHeader(200);
	
			echo json_encode(array("function"=>'in create method', "params"=>$params, 'status'=>1,'data'=>array_filter($model->attributes)),JSON_PRETTY_PRINT);
	 
		} 
		else{
			$this->setHeader(400);
			echo json_encode(array("function"=>'in create method', "params"=>$params, 'status'=>0,'error_code'=>400,'errors'=>$model->errors),JSON_PRETTY_PRINT);
		}
	}
	
	public function actionUpdate($id){
		$params= Yii::$app->request->post();
		
		$model = $this->findModel($id);
 
		$model->attributes=$params;
		
	 
		if ($model->save()) {
	 
			$this->setHeader(200);
			echo json_encode(array("function"=>'in update method','params'=>$params, 'status'=>1,'data'=>array_filter($model->attributes)),JSON_PRETTY_PRINT);
	 
		} 
		else{
			$this->setHeader(400);
			echo json_encode(array("function"=>'in update method','params'=>$params, 'status'=>0,'error_code'=>400,'errors'=>$model->errors),JSON_PRETTY_PRINT);
		}

	}
	
	public function actionDelete($id){
		
		$model=$this->findModel($id);
 
		if($model->delete())
		{ 
			$this->setHeader(200);
			echo json_encode(array('function'=> "In delete method", 'status'=>1),JSON_PRETTY_PRINT);
	 
		}
		else
		{
	 
			$this->setHeader(400);
			echo json_encode(array('function'=> "In delete method", 'status'=>0,'error_code'=>400,'errors'=>$model->errors),JSON_PRETTY_PRINT);
		}
		
	}
	
	protected function findModel($id)
    {
		if (($model = Country::findOne($id)) !== null) {
			return $model;
		} else {
	 
		  $this->setHeader(400);
		  echo json_encode(array('status'=>0,'error_code'=>400,'message'=>'Bad request'),JSON_PRETTY_PRINT);
		  exit;
		}
    }
	
	private function setHeader($status)
    {

	  $status_header = 'HTTP/1.1 ' . $status . ' ' . $this->_getStatusCodeMessage($status);
	  $content_type="application/json; charset=utf-8";
	
	  header($status_header);
	  header('Content-type: ' . $content_type);
	  header('X-Powered-By: ' . "Nintriva <nintriva.com>");
  	}
    private function _getStatusCodeMessage($status)
    {
		// these could be stored in a .ini file and loaded
		// via parse_ini_file()... however, this will suffice
		// for an example
		$codes = Array(
			200 => 'OK',
			400 => 'Bad Request',
			401 => 'Unauthorized',
			402 => 'Payment Required',
			403 => 'Forbidden',
			404 => 'Not Found',
			500 => 'Internal Server Error',
			501 => 'Not Implemented',
		);
		return (isset($codes[$status])) ? $codes[$status] : '';
    }
	
}