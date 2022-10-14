<?php

    return [
        'class' => 'yii\rest\UrlRule', 
        'controller' => ['api/v1/group'], 
        'tokens' => [
//          '{id}' => '<id:\d+>'
            '{id}' => '<id:[0-9,]+>'
        ]
    ];

