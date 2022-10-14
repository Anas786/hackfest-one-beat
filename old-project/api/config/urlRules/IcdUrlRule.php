<?php

    return [
        'class' => 'yii\rest\UrlRule', 
        'controller' => ['api/v1/icd'], 
        'tokens' => [
                '{id}' => '<id:\d+>'
            ],
    ];

