<?php

    return [
        'class' => 'yii\rest\UrlRule', 
        'controller' => ['api/v1/admission'], 
        'tokens' => [
                '{id}' => '<id:\d+-\d+>'
            ],
    ];

