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






//////////////////////////Universal Update route DONE WORKING

router.post('/RM-BOX-UPDATE', async (req, res) => {

  try
  { // it might be like this : let idPost = req[0].body.id;

  idPost = req.body.id;
  let analogInput1 = req.body.analogInput1;
  let analogInput2 = req.body.analogInput2;
  let analogInput3 = req.body.analogInput3;
  let input1 = req.body.input1;
  let input2 = req.body.input2;
  let assetError = false;

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

//////////////update ends





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

//update from our form  
router.post('/appAndroid', async (req, res) => {

  try{
  console.log(req.body);
  //res.end();
  res.status(200).send('OK');
  }
  catch(error) {
    console.error('Error handling POST request:', error);
    res.status(500).send('Internal Server Error');
  }
  
  }); 


  
/*
//get one
router.get('/:id', getSensors, (req, res) => {
    res.json(res.sensors);
  
});

//get one with filters
router.get('/filter/:id', getSensors, (req, res) => {
 var setpoint = res.sensors.device.setpoint;
 var output = res.sensors.device.output;
 var alarmActive = res.sensors.device.alarmActive;
 var bundle = {setpoint,
                output,
                alarmActive}
 res.json(bundle);
 

    
  //let lastDate = dataDate[dataDate.length - 1];

  //console.log(lastDate);

});*/





  async function getSensors(req, res, next) {
    let sensors
    try {
      sensors = await Dbschema.findById(req.params.id)
      if (sensors == null) {
        return res.status(404).json({ message: 'Cannot find this ID' })
      }
    } catch (err) {
      return res.status(500).json({ message: err.message })
    }
  
    res.sensors = sensors
    next()
  }

 
 


module.exports = router