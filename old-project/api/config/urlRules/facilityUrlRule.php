<?php

    return [
        'class' => 'yii\rest\UrlRule', 
        'controller' => ['api/v1/facility'], 
        'tokens' => [
//                '{id}' => '<id:\w+>'
                '{id}' => '<id:[0-9,]+>'
            
            ]
    ];

