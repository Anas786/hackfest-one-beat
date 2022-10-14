<?php


namespace app\modules\api\v1\models\UserGroup;

use app\modules\api\v1\models\Group\Group;
use \yii\db\ActiveRecord;

class UserGroup extends ActiveRecord{
    public static function tableName()
    {
        return 'user_group';
    }
    
    /*
     * group_id and facility_id will be mandatory
     * facility_id will not be massively assigned
     */
 
    /**
     * @inheritdoc
     */
    public static function primaryKey()
    {
        return ['id'];
    }
    
    public function scenarios() {
        return [
            'default' => ['group_id', '!user_id']
        ];
    }
    
    public function rules() {
        
        return [ 
//          Apply integer rule for user_id and group_id
            [['user_id', 'group_id' ], 'required', 
                 'message' => '{attribute} required',  ],
//            [['group_id'], 'exist',  'targetClass' => Group::className(), 
//                'targetAttribute' => 'id', 'filter' => ["deactivate" => "F"],
//                'message' => 'Group does not exist or deactivated']
            
        ];
    }
    
    public static function deleteUsersGroups($user_id){
        self::deleteAll('user_id = :id', ['id' => $user_id]);
    }
    
    public static function filterUsersExistInMultipleGroups($user_ids){
        return self::find()->where(["user_id" => $user_ids])->asArray()
           ->groupBy(["user_id"])
           ->having("count(user_id) < 2")->all();
    }
    
}