startSync();
document.getElementById("buttonForm").disabled = true; //to disable button 
document.getElementById("alarmAct").disabled = true;
document.getElementById("serial").disabled = true;
document.getElementById("setpoint").disabled = true;
document.getElementById("buttonForm").style.display = 'none';

function alertButton(){
  alert("done!");
};
 
//function myScript(){
 // element = document.querySelector('.buttonform');
  //element.style.setProperty('background', 'yellow');
//}  
 

async function startSync(){
  const response = await fetch('https://api-5-2.herokuapp.com/sensors');
  const data = await response.json();

  const deviceName0 = data[0].name;
  const deviceName1 = data[1].name;
  const deviceId0 = data[0]._id;
  const deviceId1 = data[1]._id;

  document.getElementById('op1').textContent = deviceName0;
  document.getElementById('op2').textContent = deviceName1;
  document.getElementById('op1').value = deviceId0;
  document.getElementById('op2').value = deviceId1;

};

async function validate() {
  const response = await fetch('https://api-5-2.herokuapp.com/sensors');
  const data = await response.json();
  const deviceId0 = data[0]._id;
  const deviceId1 = data[1]._id;
  const highAlarm0 = data[0].highAlarm;
  const highAlarm1 = data[1].highAlarm;
  const alarmAct0 = data[0].alarmAct;
  const alarmAct1 = data[1].alarmAct;

//this is for the SELECT options
  var htmlElement = document.getElementById("devices");
  var selectedValue = htmlElement.options[htmlElement.selectedIndex].value;
 
//no selection
if (selectedValue == "none"){

  document.getElementById("serial").value = null;
  document.getElementById("setpoint").value = null;
  document.getElementById("buttonForm").disabled = true;
  document.getElementById("alarmAct").disabled = true;
  document.getElementById("serial").disabled = true;
  document.getElementById("setpoint").disabled = true;
  document.getElementById("buttonForm").style.display = 'none';
 }
 
  //1st selection
  if (selectedValue == deviceId0){

   document.getElementById("serial").value = deviceId0;
   document.getElementById("setpoint").value = highAlarm0;
   document.getElementById("buttonForm").disabled = false;
   document.getElementById("alarmAct").disabled = false;
   document.getElementById("serial").disabled = false;
  document.getElementById("setpoint").disabled = false;
  document.getElementById("buttonForm").style.display = 'initial';
   if(alarmAct0 == false) {
    document.getElementById("alarmAct").checked = false;
    }
    if(alarmAct0 == true) {
        document.getElementById("alarmAct").checked = true;
    }
  }   
  

//2nd scenario
  if (selectedValue == deviceId1){

     document.getElementById("serial").value = deviceId1;
     document.getElementById("setpoint").value = highAlarm1;
     document.getElementById("buttonForm").disabled = false;
     document.getElementById("alarmAct").disabled = false;
     document.getElementById("serial").disabled = false;
  document.getElementById("setpoint").disabled = false;
  document.getElementById("buttonForm").style.display = 'initial';
     if(alarmAct1 == false) {
      document.getElementById("alarmAct").checked = false;
      }
      if(alarmAct1 == true) {
          document.getElementById("alarmAct").checked = true;
      }
    }

 
 };


    /*//document.getElementById('span1').textContent = value1;
    */
   
  //setInterval(formSync, 1000);
  //if(document.getElementById("device2").value == "pepe") {
    //document.getElementById('device2').textContent = "aqui";};


