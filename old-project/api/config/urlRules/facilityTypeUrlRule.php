<?php

    return [
        'class' => 'yii\rest\UrlRule', 
        'controller' => ['api/v1/facility-type'], 
        'tokens' => [
                '{id}' => '<id:\d+>'
            ],
    ];

