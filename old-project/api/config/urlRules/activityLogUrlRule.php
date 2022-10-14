<?php

    return [
        'class' => 'yii\rest\UrlRule', 
        'controller' => ['api/v1/activity-log'], 
        'tokens' => [
                '{id}' => '<id:\d+>'
            ],
    ];

