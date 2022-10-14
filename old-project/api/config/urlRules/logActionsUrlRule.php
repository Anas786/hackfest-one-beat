<?php

    return [
        'class' => 'yii\rest\UrlRule', 
        'controller' => ['api/v1/log-action'], 
        'tokens' => [
                '{id}' => '<id:\d+>'
            ],
    ];

