var mongoose = require("mongoose");
var Employeedata = require("./models/employee");
var Comment   = require("./models/comment");

var data = [
    {
        fullname: "Employee1", 
        username: "Employee1",
         position : "sde",
         email : "emaployee1@gmail.com",
         city : "mumbai"
    },
    {
        fullname: "Employee2", 
        username: "Employee2",
         position : "sde",
         email : "emaployee2@gmail.com",
         city : "mumbai"
    },
    {
        fullname: "Employee3", 
        username: "Employee3",
         position : "sde",
         email : "emaployee3@gmail.com",
         city : "mumbai"
    },
]

function seedDB(){
   //Remove all campgrounds
   Employeedata.remove({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("removed employeedata!");
         //add a few campgrounds
        data.forEach(function(seed){
            Employeedata.create(seed, function(err, campground){
                if(err){
                    console.log(err)
                } else {
                    console.log("added a employeedata");
                    //create a comment
                    Comment.create(
                        {
                            text: "He is a great person, you should definitely consider for job",
                            author: "Expert"
                        }, function(err, comment){
                            if(err){
                                console.log(err);
                            } else {
                                campground.comments.push(comment);
                                campground.save();
                                console.log("Created new comment");
                            }
                        });
                }
            });
        });
    }); 
    //add a few comments
}

module.exports = seedDB;
