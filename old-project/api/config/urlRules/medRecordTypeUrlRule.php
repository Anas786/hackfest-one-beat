<?php

    return [
        'class' => 'yii\rest\UrlRule', 
        'controller' => ['api/v1/med-record-type'],
        'tokens' => [
                '{id}' => '<id:\d+>'
            ],
    ];

