<?php

    return [
        'class' => 'yii\rest\UrlRule', 
        'controller' => ['api/v1/user'], 
        'tokens' => [
                '{id}' => '<id:\d+>'
            ]
    ];