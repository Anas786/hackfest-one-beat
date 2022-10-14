<?php

    return [
        'class' => 'yii\rest\UrlRule', 
        'controller' => ['api/v1/degree'], 
        'tokens' => [
                '{id}' => '<id:\d+>'
            ],
    ];

