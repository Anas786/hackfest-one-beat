<?php

$params = require(__DIR__ . '/params.php');

$config = [
    'id' => 'basic',
    'basePath' => dirname(__DIR__),
    'bootstrap' => ['log'],
	 'modules' => [
		'api' => [
            'class' => 'app\modules\api\Module',
        ],
        
    ],
    'components' => [
		'urlManager' => [
			'enablePrettyUrl' => true,
			'enableStrictParsing' => true,
//			'showScriptName' => false,
			'rules' => [
                /*
                 * All url rules names are starting with their controller name respectively
                 */
                // Country rule is only added for testing purpose
                // Remove all its components when there is no need of it
                require(__DIR__ . '/urlRules/loginUrlRule.php'),
                require(__DIR__ . '/urlRules/logoutUrlRule.php'),
                require(__DIR__ . '/urlRules/countryUrlRule.php'),
                require(__DIR__ . '/urlRules/userUrlRule.php'),
                require(__DIR__ . '/urlRules/groupUrlRule.php'),
                require(__DIR__ . '/urlRules/facilityUrlRule.php'),
                require(__DIR__ . '/urlRules/userCategoryUrlRule.php'),
                require(__DIR__ . '/urlRules/degreeUrlRule.php'),
                require(__DIR__ . '/urlRules/specialtyUrlRule.php'),
                require(__DIR__ . '/urlRules/userRoleUrlRule.php'),
                require(__DIR__ . '/urlRules/facilityTypeUrlRule.php'),
                require(__DIR__ . '/urlRules/stateUrlRule.php'),
                require(__DIR__ . '/urlRules/admissionUrlRule.php'),
                require(__DIR__ . '/urlRules/setPasswordUrlRule.php'),
                require(__DIR__ . '/urlRules/userMenuUrlRule.php'), 
                require(__DIR__ . '/urlRules/IcdUrlRule.php'),
                require(__DIR__ . '/urlRules/AdmissionStatusUrlRule.php'),
                require(__DIR__ . '/urlRules/fileUrlRule.php'),
                require(__DIR__ . '/urlRules/medRecordTypeUrlRule.php'),
                require(__DIR__ . '/urlRules/fetchFileUrlRule.php'),
                require(__DIR__ . '/urlRules/activityLogUrlRule.php'),
                require(__DIR__ . '/urlRules/logActionsUrlRule.php'),
		require(__DIR__ . '/urlRules/schedularUrlRule.php')
                            

            ],
		],
        'request' => [
            // !!! insert a secret key in the following (if it is empty) - this is required by cookie validation
            'cookieValidationKey' => '123456789ABCDEF',
			'parsers' => [
				'application/json' => 'yii\web\JsonParser',
			],
        ],
        'cache' => [
            'class' => 'yii\caching\FileCache',
        ],
        'user' => [
            'identityClass' => 'app\models\User',
            'enableAutoLogin' => true,
        ],
        'errorHandler' => [
            'errorAction' => 'site/error',
        ],
        'mailer' => [
            'class' => 'yii\swiftmailer\Mailer',
            // send all mails to a file by default. You have to set
            // 'useFileTransport' to false and configure a transport
            // for the mailer to send real emails.
            'useFileTransport' => true,
        ],
        'log' => [
            'traceLevel' => YII_DEBUG ? 3 : 0,
            'targets' => [
                [
                    'class' => 'yii\log\FileTarget',
                    'levels' => ['error', 'warning'],
                ],
            ],
        ],
        'db' => require(__DIR__ . '/db.php'),
    ],
    'params' => $params,
];

if (YII_ENV_DEV) {
    // configuration adjustments for 'dev' environment
    $config['bootstrap'][] = 'debug';
    $config['modules']['debug'] = 'yii\debug\Module';

    $config['bootstrap'][] = 'gii';
    $config['modules']['gii'] = 'yii\gii\Module';
}

return $config;
