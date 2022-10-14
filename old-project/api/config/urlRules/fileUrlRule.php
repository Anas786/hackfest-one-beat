<?php

    return [
        'class' => 'yii\rest\UrlRule', 
        'controller' => ['api/file'], 
        'tokens' => [
            '{id}' => '<id:\d+>'
        ],
        'patterns' => ['PUT,PATCH {id}' => 'update',
            'DELETE' => 'delete', 
            'GET,HEAD {id}' => 'view', 
            'POST' => 'create', 
            'GET,HEAD' => 'index', 
            '{id}' => 'options', '' => 'options']
    ];

