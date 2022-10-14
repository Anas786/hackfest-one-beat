<?php

    return [
        'class' => 'yii\rest\UrlRule', 
        'controller' => ['api/v1/user-category'], 
        'tokens' => [
                '{id}' => '<id:\d+>'
            ],
    ];

