var mongoose = require('mongoose')

var employeeSchema = new mongoose.Schema({
    firstname:{
        type: String,
        required:true
    },
    lastname:{
        type: String,
        required: true
    },
    position:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    city:{
        type: String,
        required: true
    }

})
module.exports = mongoose.model('employee',employeeSchema)