require('dotenv').config();
const express = require('express');
const puppeteer = require('puppeteer');
const router = express.Router();
const Dbschema = require('../DBschema/DBschema');
const nodemailer = require('nodemailer');
var date;
var isoDateTime;
let idPost;

// Create a transporter
const transporter = nodemailer.createTransport({
  service: 'hotmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD 
  }
});

function localdate(){
  date = new Date();
  isoDateTime = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString()
  
}




    // Define your API secret key
    const apiSecretKey = process.env.API_KEY;

    // Middleware to validate the API secret key
    const validateApiKey = (req, res, next) => {
      const { apikey } = req.headers;
    
      if (!apikey || apikey !== apiSecretKey) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
    
      next();
    };



//get all  
router.get('/read', (req, resp) => {
  Dbschema.find({}).then((res) => {
    resp.send(res);
  }).catch((err) => {
    //catch error
  });

}); 





  // Protected route that requires the API secret key
router.post('/create', validateApiKey, async (req, res) => {
  localdate();
  var namePosted = req.body.name;
  var locationPosted = req.body.location;
  var datasheetPosted = req.body.datasheet;
  var analogInputName1Posted = req.body.analogInputName1;
  var analogInputName2Posted = req.body.analogInputName2;
  var analogInputName3Posted = req.body.analogInputName3;
  var inputName1Posted = req.body.inputName1;
  var inputName2Posted = req.body.inputName2;
  var outputName1Posted = req.body.outputName1;
  var outputName2Posted = req.body.outputName2;
 
 
  
   
  
  const newAsset = new Dbschema({
        
        Asset: {
            name: namePosted,
            location: locationPosted, 
            datasheet: datasheetPosted,
            status: false,
            errors: false,

            analogInputName1: analogInputName1Posted,
            analogInput1: {analogInput: 0, updated: isoDateTime},

            analogInputName2: analogInputName2Posted,
            analogInput2: {analogInput: 0, updated: isoDateTime},

            analogInputName3: analogInputName3Posted,
            analogInput3: {analogInput: 0, updated: isoDateTime},

            inputName1: inputName1Posted,
            input1: {input: false, updated: isoDateTime},

            inputName2: inputName2Posted,
            input2: {input: false, updated: isoDateTime},

            outputName1: outputName1Posted,
            output1: {output: false, updated: isoDateTime},

            outputName2: outputName2Posted,
            output2: {output: false, updated: isoDateTime},

              
          }  
  })
  try{
      const saveAsset = await newAsset.save();
      res.status(201).json(saveAsset);
      console.log("Create ok");
  } catch (err) {
      res.status(400).json({message: err.message});
  }
});






////////////////////////// RM-BOX-UPDATE route DONE WORKING

router.post('/RM-BOX-UPDATE', async (req, res) => {

  try
  { // it might be like this : let idPost = req[0].body.id;

  idPost = req.body.id;
  let analogInput1 = req.body.analogInput1;
  let analogInput2 = req.body.analogInput2;
  let analogInput3 = req.body.analogInput3;
  let input1 = req.body.input1;
  let input2 = req.body.input2;
 

//DATA INCOMING AND SAVED TO DB
  //ID VALIDATING
  const exists = await Dbschema.exists({ _id: idPost});
  if (idPost === undefined || idPost.length !== 24){ // VALIDATING ID
throw new Error ('ERROR ID INVALID')
  }  
  if(!exists){
  throw new Error ('ERROR ID NOT FOUND')
  }


  if(analogInput1 !== undefined){
    if(typeof analogInput1 !== "number"){
      analogInput1 = Number(analogInput1);
      if(isNaN(analogInput1) === true){
        throw new Error('analogInput1 is not a number')
      }
    }
    try{
      localdate();
    await Dbschema.updateOne({_id: idPost}, 
    {$push:{"Asset.analogInput1.analogInput": analogInput1, "Asset.analogInput1.updated": isoDateTime}})
    }
    catch(err){
      throw new Error('analogInput1 ERROR updating to DB')
    }
  }
  
  if(analogInput2 !== undefined){
    if(typeof analogInput2 !== "number"){
      analogInput2 = Number(analogInput2);
      if(isNaN(analogInput2) === true){
        throw new Error('analogInput2 is not a number')
      }
    }
    try{
      localdate();
    await Dbschema.updateOne({_id: idPost}, 
    {$push:{"Asset.analogInput2.analogInput": analogInput2, "Asset.analogInput2.updated": isoDateTime}})
    }
    catch(err){
      throw new Error('analogInput2 ERROR updating to DB')
    }
  }

  if(analogInput3 !== undefined){
    if(typeof analogInput3 !== "number"){
      analogInput3 = Number(analogInput3);
      if(isNaN(analogInput3) === true){
        throw new Error('analogInput3 is not a number')
      }
    }
    try{
      localdate();
    await Dbschema.updateOne({_id: idPost}, 
    {$push:{"Asset.analogInput3.analogInput": analogInput3, "Asset.analogInput3.updated": isoDateTime}})
    }
    catch(err){
      throw new Error('analogInput3 ERROR updating to DB')
    }
  }

  if(input1 !== undefined){
    if(input1 instanceof Boolean || typeof input1 === 'boolean'){
      try{
        localdate();
      await Dbschema.updateOne({_id: idPost}, 
        {$push:{"Asset.input1.input": input1, "Asset.input1.updated": isoDateTime}})
      }
      catch(err){
        throw new Error('input1 ERROR updating to DB')
      }
          
  }
  else{throw new Error('input1 is not a boolean');}
  }

  if(input2 !== undefined){
    if(input2 instanceof Boolean || typeof input2 === 'boolean'){
      try{
        localdate();
      await Dbschema.updateOne({_id: idPost}, 
        {$push:{"Asset.input2.input": input2, "Asset.input2.updated": isoDateTime}})
      }
      catch(err){
        throw new Error('input2 ERROR updating to DB')
      }
          
  }
  else{throw new Error('input2 is not a boolean');}
  }


//DATA OUTGOING TO RM-BOX LATESTED 
  try{
    let updatedData = await Dbschema.findById(idPost).exec();
    updatedData = updatedData.Asset
    await Dbschema.updateOne({_id: idPost}, {$set:{"Asset.errors": false}});
    res.status(200).json(updatedData);
    console.log(`Info updated from RM-BOX ID=  ${idPost}`)
  }
  catch(err){
    throw new Error('ERROR AT RESPONSE SCRIPT')
  }

  
  }
  catch(Error) {
    console.error(`Error handling POST request: => ${Error}`);
                    try{//update error status
                      await Dbschema.updateOne({_id: idPost}, {$set:{"Asset.errors": true}});
                    }
                    catch(err){
                      //email to notify the error
                      console.error(`Sending Email due no updating error status`);

                           // Compose email
                      const mailOptions = {
                        from: process.env.EMAIL_USER,
                        to: process.env.EMAIL_TO, 
                        subject: 'Your Server API Info',
                        text: `Error on ID = ${idPost} trying to send the error status to the DB, the error is:  ${Error}`
                    };

                    // Send email
                    transporter.sendMail(mailOptions, function(error, info){
                        if (error) {
                        console.log(error);
                        } else {
                        console.log('error status Email sent: ' + info.response);
                        }
                    });
                    }
    res.status(500).send(`Error handling POST request: => ${Error}`);
  }
  
  }); 

///////////////////////// RM-BOX-UPDATE ends



//  FORM ROUTE

router.post('/FORM-RM-BOX-UPDATE', async (req, res) => {

try{

  idPost = req.body.id;
  var namePosted = req.body.name;
  var locationPosted = req.body.location;
  var datasheetPosted = req.body.datasheet;
  var analogInputName1Posted = req.body.analogInputName1;
  var analogInputName2Posted = req.body.analogInputName2;
  var analogInputName3Posted = req.body.analogInputName3;
  var inputName1Posted = req.body.inputName1;
  var inputName2Posted = req.body.inputName2;
  var outputName1Posted = req.body.outputName1;
  var outputName2Posted = req.body.outputName2;
  var output1Posted = req.body.output1;
  var output2Posted = req.body.output2;

              //VALIDATING
    //ID 
    const exists = await Dbschema.exists({ _id: idPost});
    if (idPost === undefined || idPost.length !== 24){ // VALIDATING ID
  throw new Error ('ERROR ID INVALID')
    }  
    if(!exists){
    throw new Error ('ERROR ID NOT FOUND')
    }
  
    //NAME
    if (namePosted !== undefined){
    if(typeof namePosted === 'string' && namePosted.length <= 40){
      try{
        const namePostedInsert = await Dbschema.updateOne({_id: idPost}, {$set:{"Asset.name": namePosted}});
        if (namePostedInsert.acknowledged == false){
          throw new Error(`Error inserting data to DB at ${namePosted} with the ID ${idPost}`) 
        }
      }
      catch(err){
      throw new Error(`Error inserting data to DB at ${namePosted} with the ID ${idPost}`) }  

    }else{ throw new Error (`The Name is not a string or longer than 40 charc. => ${namePosted}`)}
}

  //LOCATION
  if (locationPosted !== undefined){
    if(typeof locationPosted === 'string' && locationPosted.length <= 39){
      try{
        const locationPostedInsert = await Dbschema.updateOne({_id: idPost}, {$set:{"Asset.location": locationPosted}});
        if (locationPostedInsert.acknowledged == false){
          throw new Error(`Error inserting data to DB at ${locationPosted} with the ID ${idPost}`) 
        }
      }
      catch(err){
      throw new Error(`Error inserting data to DB at ${locationPosted} with the ID ${idPost}`) }  

    }else{ throw new Error (`The Name is not a string or longer than 40 charc. => ${locationPosted}`)}
  }


    //DATASHEET
    if (datasheetPosted !== undefined){
      if(typeof datasheetPosted === 'string'){
        try{
          const datasheetPostedInsert = await Dbschema.updateOne({_id: idPost}, {$set:{"Asset.datasheet": datasheetPosted}});
          if (datasheetPostedInsert.acknowledged == false){
            throw new Error(`Error inserting data to DB at ${datasheetPosted} with the ID ${idPost}`) 
          }
        }
        catch(err){
        throw new Error(`Error inserting data to DB at ${datasheetPosted} with the ID ${idPost}`) }  
  
      }else{ throw new Error (`The Name is not a string => ${datasheetPosted}`)}
    }
    


    //ANALOG INPUT NAME 1
    if (analogInputName1Posted !== undefined){
      if(typeof analogInputName1Posted === 'string' && analogInputName1Posted.length <= 30){
        try{
          const analogInputName1PostedInsert = await Dbschema.updateOne({_id: idPost}, {$set:{"Asset.analogInputName1": analogInputName1Posted}});
          if (analogInputName1PostedInsert.acknowledged == false){
            throw new Error(`Error inserting data to DB at ${analogInputName1Posted} with the ID ${idPost}`) 
          }
        }
        catch(err){
        throw new Error(`Error inserting data to DB at ${analogInputName1Posted} with the ID ${idPost}`) }  
  
      }else{ throw new Error (`The Name is not a string => ${analogInputName1Posted} or length <= 30`)}
    }


    //ANALOG INPUT NAME 2
    if (analogInputName2Posted !== undefined){
      if(typeof analogInputName2Posted === 'string' && analogInputName2Posted.length <= 30){
        try{
          const analogInputName2PostedInsert = await Dbschema.updateOne({_id: idPost}, {$set:{"Asset.analogInputName2": analogInputName2Posted}});
          if (analogInputName2PostedInsert.acknowledged == false){
            throw new Error(`Error inserting data to DB at ${analogInputName2Posted} with the ID ${idPost}`) 
          }
        }
        catch(err){
        throw new Error(`Error inserting data to DB at ${analogInputName2Posted} with the ID ${idPost}`) }  
  
      }else{ throw new Error (`The Name is not a string => ${analogInputName2Posted} or length <= 30`)}
    }


    //ANALOG INPUT NAME 3
    if (analogInputName3Posted !== undefined){
      if(typeof analogInputName3Posted === 'string' && analogInputName3Posted.length <= 30){
        try{
          const analogInputName3PostedInsert = await Dbschema.updateOne({_id: idPost}, {$set:{"Asset.analogInputName3": analogInputName3Posted}});
          if (analogInputName3PostedInsert.acknowledged == false){
            throw new Error(`Error inserting data to DB at ${analogInputName3Posted} with the ID ${idPost}`) 
          }
        }
        catch(err){
        throw new Error(`Error inserting data to DB at ${analogInputName3Posted} with the ID ${idPost}`) }  
  
      }else{ throw new Error (`The Name is not a string => ${analogInputName3Posted} or length <= 30`)}
    }



    // inputName 1
    if (inputName1Posted !== undefined){
      if(typeof inputName1Posted === 'string' && inputName1Posted.length <= 30){
        try{
          const inputName1PostedInsert = await Dbschema.updateOne({_id: idPost}, {$set:{"Asset.analogInput1": inputName1Posted}});
          if (inputName1PostedInsert.acknowledged == false){
            throw new Error(`Error inserting data to DB at ${inputName1Posted} with the ID ${idPost}`) 
          }
        }
        catch(err){
        throw new Error(`Error inserting data to DB at ${inputName1Posted} with the ID ${idPost}`) }  
  
      }else{ throw new Error (`The Name is not a string => ${inputName1Posted} or length <= 30`)}
    }


    // inputName 1
    if (inputName2Posted !== undefined){
      if(typeof inputName2Posted === 'string' && inputName2Posted.length <= 30){
        try{
          const inputName2PostedInsert = await Dbschema.updateOne({_id: idPost}, {$set:{"Asset.analogInput2": inputName2Posted}});
          if (inputName2PostedInsert.acknowledged == false){
            throw new Error(`Error inserting data to DB at ${inputName2Posted} with the ID ${idPost}`) 
          }
        }
        catch(err){
        throw new Error(`Error inserting data to DB at ${inputName2Posted} with the ID ${idPost}`) }  
  
      }else{ throw new Error (`The Name is not a string => ${inputName2Posted} or length <= 30`)}
    }


    // outputName1
    if (outputName1Posted !== undefined){
      if(typeof outputName1Posted === 'string' && outputName1Posted.length <= 30){

        try{
          const outputName1PostedInsert = await Dbschema.updateOne({_id: idPost}, {$set:{"Asset.outputName1": outputName1Posted}});

          if (outputName1PostedInsert.acknowledged == false){
            throw new Error(`Error inserting data to DB at ${outputName1Posted} with the ID ${idPost}`) 
          }
        }catch(err){
        throw new Error(`Error inserting data to DB at ${outputName1Posted} with the ID ${idPost}`) }  
  
      }else{ throw new Error (`The Name is not a string => ${outputName1Posted} or length <= 30`)}
    }



  
    // OUTPUT1
    if(output1Posted !== undefined){
      if(output1Posted instanceof Boolean || typeof output1Posted === 'boolean'){
        try{
          localdate();
          const output1PostedInsert = await Dbschema.updateOne({_id: idPost}, 
          {$push:{"Asset.output1.output": output1Posted, "Asset.output1.updated": isoDateTime}})

          if (output1PostedInsert.acknowledged == false){
            throw new Error(`Error inserting data to DB at output1Posted = ${output1Posted} with the ID ${idPost}`) 
          }

        }catch(err){
          throw new Error(`Error inserting data to DB at output1Posted ${output1Posted} with the ID ${idPost}`) }  
    
        }else{ throw new Error (`The output is not a Boolean => ${output1Posted}`)}
      }



    // outputName2
    if (outputName2Posted !== undefined){
      if(typeof outputName2Posted === 'string' && outputName2Posted.length <= 30){
        try{
          const outputName2PostedInsert = await Dbschema.updateOne({_id: idPost}, {$set:{"Asset.outputName2": outputName2Posted}});
          if (outputName2PostedInsert.acknowledged == false){
            throw new Error(`Error inserting data to DB at ${outputName2Posted} with the ID ${idPost}`) 
          }
        }
        catch(err){
        throw new Error(`Error inserting data to DB at ${outputName2Posted} with the ID ${idPost}`) }  
  
      }else{ throw new Error (`The Name is not a string => ${outputName2Posted} or length <= 30`)}
    }



    // OUTPUT2
    if(output2Posted !== undefined){
      if(output2Posted instanceof Boolean || typeof output2Posted === 'boolean'){
        try{
          localdate();
          const output2PostedInsert = await Dbschema.updateOne({_id: idPost}, 
          {$push:{"Asset.output2.output": output2Posted, "Asset.output2.updated": isoDateTime}})

          if (output2PostedInsert.acknowledged == false){
            throw new Error(`Error inserting data to DB at output2Posted = ${output2Posted} with the ID ${idPost}`) 
          }

        }catch(err){
          throw new Error(`Error inserting data to DB at output2Posted ${output2Posted} with the ID ${idPost}`) }  
    
        }else{ throw new Error (`The output is not a Boolean => ${output2Posted}`)}
      }



      
  res.status(200).json(req.body);
  await Dbschema.updateOne({_id: idPost}, {$set:{"Asset.errors": false}});  
}
catch(Error) {//FIRST CATCH
  console.error(`Error handling POST From Update Form request: => ${Error}`);
  res.status(500).send(`Error handling POST From Update Form request: => ${Error}`); 

  try {
    await Dbschema.updateOne({_id: idPost}, {$set:{"Asset.errors": true}});
  } catch (error) {
    //email to notify error on db
    console.log("error updating error to db")
  }
  

}

})





//update from our form  
router.post('/update', async (req, res) => {

try{
const id = req.body.id;
const location = req.body.location;


//inserting data into DB

try{
  await Dbschema.updateOne({_id: id}, {$set:{"Asset.location": location}})
  console.log(`New Location inserted (${location})`);
} catch(err){
  console.log(`Db error at ${id} at updating route`);
}




//res.end();
res.status(200).send('OK');
}
catch(error) {
  console.error('Error handling POST request:', error);
  res.status(500).send('Internal Server Error');
}

});




 
 


module.exports = router