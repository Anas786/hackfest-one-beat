<?php

namespace app\modules\api\models;

class AppEnums{
    
    public static function getSpecialtyText($code){
		$specialties = array(1 => "Anaesthesia",
                            2 => "Allergy and Immunology",
                            3 => "Cardiovascular surgery",
                            4 => "Clinical laboratory sciences",
                            5 => "Cardiology",
                            6 => "Dietetics",
                            7 => "Dermatology",
                            8 => "Emergency medicine",
                            9 => "Endocrinology",
                            10 => "Family Medicine",
                            11 => "Forensic Medicine",
                            12 => "Gynecology",
                            13 => "General surgery",
                            14 => "Geriatrics",
                            15 => "Gastroenterology",
                            16 => "Hepatology",
                            17 => "Intensive care medicine",
                            18 => "Infectious disease",
                            19 => "Medical research",
                            20 => "Neurology",
                            21 => "Neurosurgery",
                            22 => "Nephrology",
                            23 => "Otorhinolaryngology",
                            24 => "Oral and maxillofacial surgery",
                            25 => "Oncology",
                            26 => "Ophthalmology",
                            27 => "Orthopedic surgery",
                            28 => "Obstetrics and gynecology",
                            29 => "Pathology",
                            30 => "Palliative care",
                            31 => "Pediatrics",
                            32 => "Physical medicine and rehabilitation Or Physiatry",
                            33 => "Plastic surgery",
                            34 => "Pulmonology",
                            35 => "Podiatry",
                            36 => "Proctology",
                            37 => "Pediatric surgery",
                            38 => "Psychiatry",
                            39 => "Radiology",
                            40 => "Rheumatology",
                            41 => "Stomatology",
                            42 => "Surgical oncology",
                            43 => "Thoracic surgery",
                            44 => "Transplant surgery",
                            45 => "Urgent Care Medicine",
                            46 => "Urology",
                            47 => "Vascular surgery",
                        );
        return $specialties[strtoupper($code)];
    }
	public static function getSpecialties(){
		$specialties = array(1 => "Anaesthesia",
                            2 => "Allergy and Immunology",
                            3 => "Cardiovascular surgery",
                            4 => "Clinical laboratory sciences",
                            5 => "Cardiology",
                            6 => "Dietetics",
                            7 => "Dermatology",
                            8 => "Emergency medicine",
                            9 => "Endocrinology",
                            10 => "Family Medicine",
                            11 => "Forensic Medicine",
                            12 => "Gynecology",
                            13 => "General surgery",
                            14 => "Geriatrics",
                            15 => "Gastroenterology",
                            16 => "Hepatology",
                            17 => "Intensive care medicine",
                            18 => "Infectious disease",
                            19 => "Medical research",
                            20 => "Neurology",
                            21 => "Neurosurgery",
                            22 => "Nephrology",
                            23 => "Otorhinolaryngology",
                            24 => "Oral and maxillofacial surgery",
                            25 => "Oncology",
                            26 => "Ophthalmology",
                            27 => "Orthopedic surgery",
                            28 => "Obstetrics and gynecology",
                            29 => "Pathology",
                            30 => "Palliative care",
                            31 => "Pediatrics",
                            32 => "Physical medicine and rehabilitation Or Physiatry",
                            33 => "Plastic surgery",
                            34 => "Pulmonology",
                            35 => "Podiatry",
                            36 => "Proctology",
                            37 => "Pediatric surgery",
                            38 => "Psychiatry",
                            39 => "Radiology",
                            40 => "Rheumatology",
                            41 => "Stomatology",
                            42 => "Surgical oncology",
                            43 => "Thoracic surgery",
                            44 => "Transplant surgery",
                            45 => "Urgent Care Medicine",
                            46 => "Urology",
                            47 => "Vascular surgery",
                        );
        return $specialties;
    }
    public static function getStatusArray(){
        return array(AppStatus::initiated, 
                    AppStatus::bedAvailable,
                    AppStatus::bedNotAvailable,
                    AppStatus::accepted,
                    AppStatus::denied,
                    AppStatus::bedAssigned,
                    AppStatus::patientArrived,
                    AppStatus::patientNoShow,
                    AppStatus::closed,
                    AppStatus::patientDischarged);
    }

    public static function getStatusIconsText($code){
        $iconsText = array(1 => "initiated_admission.png",
                              2 => "bed_available.png",
                              3 => "admission_denied.png",
                              4 => "accepted_admission.png",
                              5 => "admission_denied.png",
                              6 => "bed_allocated.png",
                              7 => "patient_arrived.png",
                              8 => "closed_admission.png",
                              9 => "closed_admission.png",
                              10=> "patient_discharged.png"
                              
            );
        
        return $iconsText[strtoupper($code)];
    }
	
	public static function getStatusText($code){
        $statusText = array(1 => "Initiated",
                              2 => "Bed Available",
                              3 => "Bed Not Available",
                              4 => "Accepted",
                              5 => "Denied",
                              6 => "Bed Assigned",
                              7 => "Patient Arrived",
                              8 => "Patient No-Show",
                              9 => "Closed",
                              10=> "Discharged"
                              
                              
            );
        
        return $statusText[strtoupper($code)];
    }
    public static function getUserCategories(){
        $categories = array("AS" => "App Users",
                              "CC" => "Clinic",
                              "ET" =>  "Emergency Department",
                              "FT" => "Free Standing Emergency Department",
                              "HL" => "Hospital",
                              "HR" => "Healthcare Center" );
        
        return $categories;
    }
    public static function getCategories(){
        $categories = array("CC" => "Clinic",
                              "ET" =>  "Emergency Department",
                              "FT" => "Free Standing Emergency Department",
                              "HL" => "Hospital");
        
        return $categories;
    }
    public static function getCategoryText($categoryCode){
        $categoryText = array("AS" => "App Users",
                              "CC" => "Clinic",
                              "ET" =>  "Emergency Department",
                              "FT" => "Free Standing Emergency Department",
                              "HL" => "Hospital",
                              "HR" => "Healthcare Center" );
        
        return $categoryText[strtoupper($categoryCode)];
    }
    
    public static function getRoleText($roleCode){
        
       $roleText = array( "SR" => "Sub administrator",
                           "AR" => "Administrator",
                           "AT" => "App Support",
                           "RE" => "Registered Nurse",
                           "PT" => "Physician Assistant",
                           "PN" => "Physician",
                           "SF" => "Staff",
                           "SN" => "Self-accepting Physician",
                           "BR" => "Bed Flow Coordinator",
                           "AK" => "Admission Desk User",
                           "UR" => "User");
        
        return $roleText[strtoupper($roleCode)];
    }
    
    public static function getFacilityText($facilityCode){
        $facilityText = array("CC" => "Clinic",
                              "ET" => "Emergency department",
                              "FT" => "Free standing emergency department",
                              "HL" => "Hospital"
            );
        
        return $facilityText[strtoupper($facilityCode)];
    }
    
    public static function getTranportationText($code){
        $transportationText = array(1 => "Ambulance",
                              2 => "Personal Transportation",
                              3 => "Unknown",
                              4 => "Air Medical Transport",
                              5 => "Helicopter"
            );
        
        return $transportationText[strtoupper($code)];
    }
    
    public static function getBedTypeText($code){
        $bedTypeText = array(1 => "Outpatient/ Observation 24H w Telemetry",
                            2 => "Outpatient/ Observation 24H w/o Telemetry",
                            3 => "Med/Surg  w Telemetry",
                            4 => "Med/Surg w/o Telemetry",
                            5 => "Intermediate Medical Unit",
                            6 => "Intensive Care Unit",
                            7 => "Pediatrics Bed",
            );
        
        return $bedTypeText[strtoupper($code)];
    }
    
    public static function getCodeSatusText($code){
        $codeStatusText = array(1 => "Full Code",
                              2 => "Do NOT Resuscitate",
                              3 => "Comfort Measures Only",
                              
            );
        
        return $codeStatusText[strtoupper($code)];
    }
    
    
    public static function getRecordTypeText($code){
        $recordTypeText = array(1 => "Xray",
                              2 => "CT Scan",
                              3 => "Ultrasound",
                              4 => "ECG",
                              5 => "MRI",                              
            );
        
        return $recordTypeText[strtoupper($code)];
    }

    public static function getRecordTypes(){
        $recordTypes = array(1 => "Xray",
                              2 => "CT Scan",
                              3 => "Ultrasound",
                              4 => "ECG",
                              5 => "MRI",                              
            );
        
        return $recordTypes;
    }
	
	public static function getActivityLogActions($code){
        $logActions = array(1 => "Viewed",
                              2 => "Created",
                              3 => "Updated",
                              4 => "List Viewed",
                              5 => "Initiated",
                              6 => "Accepted",
                              7 => "Denied",
                              8 => "Bed Assigned",
                              9 => "Patient Arrived",
                              10=> "Patient No-Show",
                              11 => "Closed",
                              12=> "Discharged"
                              
            );
        
        return $logActions[strtoupper($code)];
    }
	public static function getDegreeText($degreeCode){
        $degreeCodeText = array("DO" => "Doctor of Osteopathic Medicine",
                              "MD" => "Doctor of Medicine",
                              "NP" => "Nurse Practitioner",
                              "PA" => "Physician Assistant"
            );
        
        return $degreeCodeText[strtoupper($degreeCode)];
    }
	public static function getDegrees(){
        $degrees = array("DO" => "Doctor of Osteopathic Medicine",
                              "MD" => "Doctor of Medicine",
                              "NP" => "Nurse Practitioner",
                              "PA" => "Physician Assistant"
            );
        
        return $degrees;
    }


  public static function getUserRoles($category){
    $outputRoles = array();
    $roles = array(array('name' => 'Admission Desk User','value'=>'AK','category'=> 'HL'),
                array('name' => 'Administrator','value'=>'AR','category' => 'AS'),
                array('name' => 'Administrator','value'=>'AR','category' => 'CC'),
                array('name' => 'Administrator','value'=>'AR','category' => 'ET'),
                array('name' => 'Administrator','value'=>'AR','category' => 'FT'),
                array('name' => 'Administrator','value'=>'AR','category' => 'HL'),
                array('name' => 'Administrator','value'=>'AR','category' => 'HR'),
                array('name' => 'Bed Flow Coordinator','value'=>'BR','category' => 'HL'),
                array('name' => 'Physician','value'=>'PN','category' => 'CC'),
                array('name' => 'Physician','value'=>'PN','category' => 'ET'),
                array('name' => 'Physician','value'=>'PN','category' => 'FT'),
                array('name' => 'Physician','value'=>'PN','category' => 'HL'),
                array('name' => 'Physician Assistant','value'=>'PT','category' => 'CC'),
                array('name' => 'Physician Assistant','value'=>'PT','category' => 'ET'),
                array('name' => 'Physician Assistant','value'=>'PT','category' => 'FT'),
                array('name' => 'App Spport','value'=>'AT','category' => 'AS'),
                array('name' => 'Registered Nurse','value'=>'RE','category' => 'CC'),
                array('name' => 'Registered Nurse','value'=>'RE','category' => 'ET'),
                array('name' => 'Registered Nurse','value'=>'RE','category' => 'FT'),
                array('name' => 'Staff','value'=>'SF','category' => 'CC'),
                array('name' => 'Staff','value'=>'SF','category' => 'ET'),
                array('name' => 'Staff','value'=>'SF','category' => 'FT'),
                array('name' => 'Self-accepting Physician','value'=>'SN','category' => 'CC'),
                array('name' => 'Sub Administrator','value'=>'SR','category' => 'AS'),
                array('name' => 'User','value'=>'UR','category' => 'HR' )

      );
      foreach ($roles as $key => $value) {
        if ($value['category'] === $category){
          $outputRoles[]= array('value' => $value['value'], 'name' => $value['name']);
        }
      }
    return $outputRoles;
  }
    
}



