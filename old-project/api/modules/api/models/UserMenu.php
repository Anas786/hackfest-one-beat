<?php

namespace app\modules\api\models;

class UserMenu{
    
    public static function getUserMenu($category, $role, $username){
//      Replace category and role with User object
        
        $checkCategory = array("CC", "FT", "ET");
        
        if(strtoupper($category) === "AS"){
            return self::getAppUserMenu($role, $username);
        }
        else if(strtoupper($category) === "HR"){
            return self::getHealthCareCenterMenu($role, $username);
        }
        else if(strtoupper($category) === "HL"){
            return self::getHospitalMenu($role, $username);
        }
        else if(in_array(strtoupper($category), $checkCategory) ){
            return self::getClinicMenu($role, $username);
        }
    }
    
    private static function getAppUserMenu($role, $username){
//      This menu is currently same for all App Users
        $appUserMenu = array( 
                            array("name" => "Dashboard", "url" => "dashboard", "icon"=> "fa fa-dashboard"), 
                            array("name" => "Admissions", "url" => "admissions", "icon"=> "fa fa-ticket"),
                            array("name" => "Users", "url" => "users", "icon"=> "fa fa-user-md"), 
                            array("name" => "Healthcare Facilities", "url" => "facilities", "icon"=> "fa fa-h-square"),
                            array("name" => "Hospital Groups", "url" => "groups", "icon"=> "fa fa-group"), 
                            array("name" => $username, "url" => "", "icon"=> "fa fa-gear",
                                "childs" => array(
                                    array("name" => "Profile", "url" => "profile", "icon"=> "fa fa-user"),
                                    array("name" => "OnCall Scheduler", "url" => "schedular", "icon"=> "fa fa-gear"),
                                    //array("name" => "Transactions", "url" => "", "icon"=> ""),
                                    array("name" => "Activity Log", "url" => "activity_log", "icon"=> "fa fa-gear"),
                                    array("name" => "Support", "url" => "", "icon"=> "fa fa-gear"),
                                    array("name" => "Help", "url" => "", "icon"=> "fa fa-gear"),
                                    array("name" => "Logout", "url" => "signin", "icon"=> "fa fa-sign-out")
                                )
                            )
                            
                        );
            
            return $appUserMenu;

    }
    
    private static function getHealthCareCenterMenu($role, $username){
        $healthCareCenterMenu = array( 
            array("name" => "Admissions", "url" => "admissions", "icon"=> "fa fa-ticket"),
            array("name" => $username, "url" => "", "icon"=> "fa fa-gear",
                "childs" => array(
                    array("name" => "Account Settings", "url" => "profile", "icon"=> "fa fa-user"),
                    array("name" => "Support", "url" => "", "icon"=> ""),
                    array("name" => "Help", "url" => "", "icon"=> ""),
                    array("name" => "Logout", "url" => "signin", "icon"=> "fa fa-sign-out")    
                ) 
            )
        ); 
        
        if(strtoupper($role) === "AR"){
            array_splice($healthCareCenterMenu, 0, 0, 
                    array(array("name" => "Dashboard", "url" => "dashboard", "icon"=> "fa fa-dashboard")) );
            array_splice($healthCareCenterMenu, 2, 0, 
                    array(array("name" => "Users", "url" => "users", "icon"=> "fa fa-user-md"), 
                          array("name" => "Healthcare Facilities", "url" => "facilities", "icon"=> "fa fa-h-square"),
                          array("name" => "Hospital Groups", "url" => "groups", "icon"=> "fa fa-group")) );
            
            return $healthCareCenterMenu;
        }
        else if(strtoupper($role) === "UR"){
            array_splice($healthCareCenterMenu, 1, 0, 
                    array(array("name" => "Healthcare Facilities", "url" => "facilities", "icon"=> "fa fa-h-square"),
                          array("name" => "Hospital Groups", "url" => "groups", "icon"=> "fa fa-group")) );
            return $healthCareCenterMenu;
        }
        
        return null;
    }
    
    private static function getHospitalMenu($role, $username){
        $checkRoles = array("BR", "AK");
        
        $hospitalMenu = array( 
            array("name" => "Admissions", "url" => "admissions", "icon"=> "fa fa-ticket"),
            array("name" => $username, "url" => "", "icon"=> "fa fa-gear", 
                "childs" => array(
                    array("name" => "Account Settings", "url" => "profile", "icon"=> "fa fa-user"),
                    array("name" => "Support", "url" => "", "icon"=> ""),
                    array("name" => "Help", "url" => "", "icon"=> ""),
                    array("name" => "Logout", "url" => "signin", "icon"=> "fa fa-sign-out") 
                ) 
            )
        ); 
        
        if(strtoupper($role) === "AR"){
            array_splice($hospitalMenu, 0, 0, 
                    array(array("name" => "Dashboard", "url" => "dashboard", "icon"=> "fa fa-dashboard")) );
            array_splice($hospitalMenu, 2, 0, 
                    array(array("name" => "Users", "url" => "users", "icon"=> "fa fa-user-md"),
                          array("name" => "Hospital Groups", "url" => "groups", "icon"=> "fa fa-group") ) );
            array_splice($settingsChilds, 0, 0, 
                    array(array("name" => "OnCall Scheduler", "url" => "", "icon"=> "")) );
            
            return $hospitalMenu;
        }
        else if(strtoupper($role) === "PN"){
//            Check if user is group admin then add Users in main menu and
//            Quicare Scheduler in setting's child menu
            return $hospitalMenu;
            
        }
        else if( in_array(strtoupper($role), $checkRoles)){
            return $hospitalMenu;
        }
        
        return null;
        
    }
    
    private static function getClinicMenu($role, $username){
        /*
         * These menus are applicable on clinic type facilities (Clinic, FSED, ED)
         */
        $checkRoles = array("PN", "RE", "PT", "SF");
        
        $clinicMenu = array( 
            array("name" => "Admissions", "url" => "admissions", "icon"=> "fa fa-ticket"),
            array("name" => $username, "url" => "", "icon"=> "fa fa-gear", 
                "childs" => array(
                    array("name" => "Account Settings", "url" => "profile", "icon"=> "fa fa-user"),
                    array("name" => "Support", "url" => "", "icon"=> ""),
                    array("name" => "Help", "url" => "", "icon"=> ""),
                    array("name" => "Logout", "url" => "signin", "icon"=> "fa fa-sign-out") 
                ) 
            )
        ); 
        
        if(strtoupper($role) === "AR"){
            array_splice($clinicMenu, 0, 0, 
                    array(array("name" => "Dashboard", "url" => "dashboard", "icon"=> "fa fa-dashboard")) );
            array_splice($clinicMenu, 2, 0, 
                    array(array("name" => "Users", "url" => "users", "icon"=> "fa fa-user-md") ) );
            return $clinicMenu;
        }
        else if( in_array(strtoupper($role), $checkRoles)){
            array_splice($clinicMenu, 1, 0, 
                    array(array("name" => "Transfer Form", "url" => "transfer_form", "icon"=> "fa fa-file-text")) );
            return $clinicMenu;
            
        }
        else if(strtoupper($role) === "SN"){
//            Check if user is group admin then add Users in main menu and
//            Quicare Scheduler in setting's child menu
            array_splice($clinicMenu, 1, 0, 
                    array(array("name" => "Transfer Form", "url" => "transfer_form", "icon"=> "fa fa-file-text")) );
            return $clinicMenu;
        }
        
        return null;
        
    }
    
    
}

