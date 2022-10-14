<?php

namespace app\modules\api\models;
use Yii;
use yii\db\Query;
use app\modules\api\models\AuthToken\AuthTokenCrud;

class ActivityLog
{
	public static function userLog()
	{
		$authHeader = Yii::$app->request->headers->get('Authorization');
		$token = sizeof(explode('Basic', $authHeader)) >= 2 ?
		trim(explode('Basic', $authHeader)[1]) : null;
		$user = AuthTokenCrud::read($token);
		
		$db = Yii::$app->db;
		$command = $db->createCommand()->insert('activity_log', array(
				"username" => $user[user_name],
				"ipaddress" => Yii::$app->request->getUserIP(),
				"controller" => Yii::$app->controller->id,
				"action" => Yii::$app->controller->action->id,
				"details" => serialize(Yii::$app->request->getBodyParams()),
				"logtime" => date("Y-m-d H:i:s", time())
		));
		
        $command->execute();
		
	}
	
}

/*

 Table script to create is not exist
 
 CREATE TABLE IF NOT EXISTS `activity_log` (
  `username` varchar(50) NOT NULL,
  `ipaddress` varchar(50) NOT NULL,
  `logtime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `controller` varchar(255) NOT NULL DEFAULT '',
  `action` varchar(255) NOT NULL DEFAULT '',
  `details` text,
  `id` int(16) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;
  
 */

