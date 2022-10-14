<?php

    return [
        'class' => 'yii\rest\UrlRule', 
        'controller' => ['api/v1/user-role'], 
        'tokens' => [
                '{id}' => '<id:\d+>'
            ],
    ];

