var mongoose = require('mongoose')

var employeeSchema = new mongoose.Schema({
    fullname:{
        type: String,
        required:true
    },
    username:{
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
    },
    comments: [
        {
           type: mongoose.Schema.Types.ObjectId,
           ref: "Comment"
        }
     ]

})
module.exports = mongoose.model('employee',employeeSchema)