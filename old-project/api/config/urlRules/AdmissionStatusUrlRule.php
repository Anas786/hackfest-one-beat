<?php

    return [
        'class' => 'yii\rest\UrlRule', 
        'controller' => ['api/v1/admission-status'], 
        'tokens' => [
                '{id}' => '<id:\d+-\d+>'
            ],
    ];

