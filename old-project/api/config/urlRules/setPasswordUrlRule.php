<?php

    return [
        'class' => 'yii\rest\UrlRule', 
        'controller' => ['api/v1/set-password'], 
        'pluralize' => false,
        'patterns' => ['PUT,PATCH' => 'update']
    ];