var express = require('express');
var app = express();
var bodyparser = require('body-parser')
var mongoose = require('mongoose')
var employeedata = require('./models/employee');

var url = 'mongodb://localhost/EmployeeDB'
mongoose.connect(url, { useNewUrlParser: true })
var con = mongoose.connection
con.on('open', () => {
    console.log('connected');
})




app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.json())




// list of all the employees
app.get('/', async (req, res) => {
    try {
        const employees = await employeedata.find()
        res.render('home', { employee: employees });
    } catch (err) {
        res.send('Error ' + err)
    }

});
// to show the employee by id
app.get('/show/:id', async (req, res) => {
    try {
        const emp = await employeedata.findById(req.params.id)
        res.render('show', { employee: emp })
    } catch (err) {
        res.send('Error ' + err)
    }
});
// for editing the employee info
app.get('/edit/:id',(req,res) =>{
    employeedata.findOne({_id: req.params.id}).exec(function (err, employee) {
        if (err) {
          console.log("Error:", err);
        }
        else {
          res.render("edit", {employee: employee});
        }
      });
})
// to update the new data in database
app.post('/update/:id', async (req, res) => {
    employeedata.findByIdAndUpdate(req.params.id, { $set: { firstname: req.body.firstname,lastname: req.body.lastname, email: req.body.email, position: req.body.position, city: req.body.city } }, { new: true },  (err, employee) => {
        if (err) {
            console.log(err);
            res.render("edit", { employee: req.body });
        }
        res.redirect('/');
    });

})
// to delete the employee database
app.post('/delete/:id',function(req, res) {
    employeedata.remove({_id: req.params.id}, (err) => {
      if(err) {
        console.log(err);
      }
      else {
        console.log("Employee deleted!");
        res.redirect("/");
      }
    });
});
// for adding new employ
app.get('/add', function (req, res) {
    res.render('create');
});
//for adding the employ data in database
app.post('/addemployee', async (req, res) => {
    const emp = new employeedata({
        firstname: req.body.firstName,
        lastname: req.body.lastName,
        position: req.body.position,
        email: req.body.email,
        city: req.body.city
    })
    try {
        const a1 = await emp.save()
        res.redirect('/');
    } catch (err) {
        res.send(err)
    }
});

app.listen(3000, function () {
    console.log("Server Started at port 3000 ")
})
