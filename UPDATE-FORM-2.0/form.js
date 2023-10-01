//fetch data from api and shown it according to the ID
const formHidden = document.querySelector('#json-form');

async function formSync(){
try{
   
    formHidden.hidden = true;
    const apiDataFetch = await fetch ('https://local-engineer.cyclic.app/multitask/read');
    var apiData = await apiDataFetch.json();
    console.log(apiData[0].Asset);
    //console.log(apiData[0].Asset);
    formHidden.hidden = false;
}
catch (error){
 console.log("error geting info from API")
 formHidden.hidden = true;
 alert(error);
}


};

formSync();













//click to submit
        document.getElementById('submit-button').addEventListener('click', function () {
            // Get form data
            const id = document.getElementById('id').value;
            const name = document.getElementById('name').value;
            const location = document.getElementById('location').value;
            const datasheet = document.getElementById('datasheet').value;
            const analogInputName1 = document.getElementById('analogInputName1').value;
            const analogInputName2 = document.getElementById('analogInputName2').value;
            const analogInputName3 = document.getElementById('analogInputName3').value;
            const inputName1 = document.getElementById('inputName1').value;
            const inputName2 = document.getElementById('inputName2').value;
            const outputName1 = document.getElementById('outputName1').value;
            const outputName2 = document.getElementById('outputName2').value;
            const output1 = document.getElementById('output1').value;
            const output2 = document.getElementById('output2').value;

            const data = {id: id};
            
            try{
            
            if (name !== null && name !== undefined && name !== "") {
                data.name = name;
            }



            if (location !== null && location !== undefined && location !== "") {
            // Define a regular expression pattern for coordinate validation
                            const coordinatePattern = /^[-+]?\d+(\.\d+)?,\s*[-+]?\d+(\.\d+)?$/;

                            // Check if the location is a string and matches the coordinate pattern
                            if (typeof location === 'string' && location.length <= 39 && location.length >= 16 && coordinatePattern.test(location)) {
                                // Valid coordinate location
                                data.location = location;
                            } else {
                                // Invalid location
                                console.log("Invalid coordinate location:", location);
                                throw new Error("Invalid coordinate location")
                            }
        }


        if (datasheet !== null && datasheet !== undefined && datasheet !== "") {
            data.datasheet = datasheet;
        }


        if (analogInputName1 !== null && analogInputName1 !== undefined && analogInputName1 !== "") {
            if(typeof analogInputName1 === 'string' && analogInputName1.length <= 30){
                data.analogInputName1 = analogInputName1;
            }else{throw new Error("analogInputName1 must be a string & no longer than 30ch")}
        }

        if (analogInputName2 !== null && analogInputName2 !== undefined && analogInputName2 !== "") {
            if(typeof analogInputName2 === 'string' && analogInputName2.length <= 30){
                data.analogInputName2 = analogInputName2;
            }else{throw new Error("analogInputName2 must be a string & no longer than 30ch")}   
        }

        if (analogInputName3 !== null && analogInputName3 !== undefined && analogInputName3 !== "") {
            if(typeof analogInputName3 === 'string' && analogInputName3.length <= 30){
                data.analogInputName3 = analogInputName3;
            }else{throw new Error("analogInputName3 must be a string & no longer than 30ch")}   
        }

        if (inputName1 !== null && inputName1 !== undefined && inputName1 !== "") {
            if(typeof inputName1 === 'string' && inputName1.length <= 30){
                data.inputName1 = inputName1;
            }else{throw new Error("inputName1 must be a string & no longer than 30ch")}   
        }

        if (inputName2 !== null && inputName2 !== undefined && inputName2 !== "") {
            if(typeof inputName2 === 'string' && inputName2.length <= 30){
                data.inputName2 = inputName2;
            }else{throw new Error("inputName2 must be a string & no longer than 30ch")}   
        }

        if (outputName1 !== null && outputName1 !== undefined && outputName1 !== "") {
            if(typeof outputName1 === 'string' && outputName1.length <= 30){
                data.outputName1 = outputName1;
            }else{throw new Error("outputName1 must be a string & no longer than 30ch")}   
        }


        if (outputName2 !== null && outputName2 !== undefined && outputName2 !== "") {
            if(typeof outputName2 === 'string' && outputName2.length <= 30){
                data.outputName2 = outputName2;
            }else{throw new Error("outputName2 must be a string & no longer than 30ch")}   
        }


        // toggle box 1


        //toggle box 2

//console.log(data);

        }catch(error){
            alert(error);
            return;
        }
         

/*

            // Send the JSON object to the API route using fetch
           fetch('https://local-engineer.cyclic.app/multitask/FORM-RM-BOX-UPDATE', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(response => {
                if (response.ok) {
                    alert('Data sent successfully!');
                    // You can add more handling here if needed
                    
                } else {
                    // Extract and display the error message from the response
                    return response.text();
                }
            })
            .then(errorResponse => {
                // Show an alert with the API error message
                if(errorResponse){
                alert(`API Error: ${errorResponse}`);
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
*/




        });
 