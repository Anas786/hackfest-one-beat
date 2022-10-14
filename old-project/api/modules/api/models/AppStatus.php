<?php

namespace app\modules\api\models;

class AppStatus{
    const initiated = 1;
    const bedAvailable = 2;
    const bedNotAvailable = 3;
    const accepted = 4;
    const denied = 5;
    const bedAssigned = 6;
    const patientArrived = 7;
    const patientNoShow = 8;
    const closed = 9;
    const patientDischarged = 10;
}



