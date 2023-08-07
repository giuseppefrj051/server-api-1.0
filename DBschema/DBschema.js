const mongoose = require('mongoose');
 
const apiSchema = new mongoose.Schema({

         
        Asset: {
                name: {type: String}, //
                location: {type: String},
                datasheet: {type: String}, // 
                status: {type: Boolean},  // ONLINE / OFFLINE
                errors: {type: Boolean},
                
                analogInputName1: {type: String},
                analogInput1:{
                        analogInput: [{type: Number, required: true}],
                        updated: [{type: Date, default: Date.now}]
                },

                analogInputName2: {type: String},
                analogInput2:{
                        analogInput: [{type: Number, required: true}],
                        updated: [{type: Date, default: Date.now}]
                },

                analogInputName3: {type: String},
                analogInput3:{
                        analogInput: [{type: Number, required: true}],
                        updated: [{type: Date, default: Date.now}]
                },

                inputName1: {type: String},
                input1:{
                        input: [{type: Boolean, required: true}],
                        updated: [{type: Date, default: Date.now}]
                },

                inputName2: {type: String},
                input2:{
                        input: [{type: Boolean, required: true}],
                        updated: [{type: Date, default: Date.now}]
                },

                outputName1: {type: String},
                output1:{
                        output: [{type: Boolean, required: true}],
                        updated: [{type: Date, default: Date.now}]
                },

                outputName2: {type: String},
                output2:{
                        output: [{type: Boolean, required: true}],
                        updated: [{type: Date, default: Date.now}]
                }
              }
        
});

module.exports = mongoose.model('RM-BOX', apiSchema);   //here you can set a DB name ''