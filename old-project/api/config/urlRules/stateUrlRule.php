<?php

    return [
        'class' => 'yii\rest\UrlRule', 
        'controller' => ['api/v1/state'], 
        'tokens' => [
                '{id}' => '<id:\d+>'
            ],
    ];

