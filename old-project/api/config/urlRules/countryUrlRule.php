<?php

    return [
        'class' => 'yii\rest\UrlRule', 
        'controller' => ['api/v1/country'], 
        'tokens' => [
                '{id}' => '<id:\\w+>'
            ]
    ];