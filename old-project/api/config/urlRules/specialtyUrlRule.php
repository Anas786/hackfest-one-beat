<?php

    return [
        'class' => 'yii\rest\UrlRule', 
        'controller' => ['api/v1/specialty'], 
        'tokens' => [
                '{id}' => '<id:\d+>'
            ],
    ];

