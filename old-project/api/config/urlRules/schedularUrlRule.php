<?php

return [
		'class' => 'yii\rest\UrlRule',
		'controller' => ['api/v1/schedular'],
		'tokens' => [
		//          '{id}' => '<id:\d+>'
				'{id}' => '<id:[0-9,]+>'
		]
];
