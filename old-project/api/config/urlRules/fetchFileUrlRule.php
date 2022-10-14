<?php

    return [
        'class' => 'yii\rest\UrlRule', 
        'controller' => ['api/fetch-file'],
        'tokens' => [
                '{id}' => '<id:\d+>'
            ],
    ];

