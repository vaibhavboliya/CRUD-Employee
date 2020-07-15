const express        = require('express'),
      methodOverride = require("method-override"),
      bodyparser     = require('body-parser'),
      mongoose       = require('mongoose'),
      employeedata   = require('./models/employee'),
      LocalStrategy  = require("passport-local");
       passport = require('passport'),
      Comment        = require("./models/comment"),
      session        = require("express-session"),
      User           = require("./models/user"),
      seedb          = require("./seed"),
      passport       = require("passport");


const app = express();

//=======================Mongoose connection=================================

mongoose.Promise = global.Promise;
const url = 'mongodb://localhost/EmployeeDB'
mongoose.connect(url, { useNewUrlParser: true })
    .then(() => console.log(`Database connected`))
    .catch(err => console.log(`Database connection error: ${err.message}`));




//=======================requirements=================================
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.json())
// app.use((req,res,next)=>{
//     res.locals.currentUser = req.user;
//     console.log(req.user)
//     next()
// })

//=======================passport=================================
app.use(require("express-session")({
    secret: "always be the best",
    resave: false,
    saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// seedb()
//=======================Employee showlist=================================
// list of all the employees
app.get('/', async (req, res) => {
    try {
        const employees = await employeedata.find()
        res.render('home', { employee: employees,currentUser:req.user });
    } catch (err) {
        res.send('Error ' + err)
    }

});
// for adding new employ
app.get('/add',isLoggedIn,  (req, res)=> {
    res.render('create');
});
//for adding the employ data in database
app.post('/addemployee',isLoggedIn, async (req, res) => {
    const emp = new employeedata({
        fullname: req.body.fullName,
        username: req.body.usernameName,
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
//=======================employee info=================================
// to show the employee by id
app.get('/show/:id', async (req, res) => {
    employeedata.findById(req.params.id).populate("comments").exec(function(err, found){
        if(err || !found){
            console.log(err);
            return res.redirect('/');
        }
        console.log(found)
        //render show template with that campground
        res.render("show", {employee: found ,currentUser:req.user});
    });
});






// for editing the employee info
app.get('/edit/:id',(req,res) =>{
    employeedata.findOne({_id: req.params.id}).exec( (err, employee)=> {
        if (err) {
          console.log("Error:", err);
        }
        else {
          res.render("edit", {employee: employee , currentUser:req.user });
        }
      });
})
// to update the new data in database
app.post('/update/:id', async (req, res) => {
    employeedata.findByIdAndUpdate(req.params.id, { $set: { fullname: req.body.fullname,username: req.body.username, email: req.body.email, position: req.body.position, city: req.body.city } }, { new: true },  (err, employee) => {
        if (err) {
            console.log(err);
            res.render("edit", { employee: req.body });
        }
        res.redirect('/');
    });

})
// to delete the employee database
app.post('/delete/:id',(req, res)=> {
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

//=======================login/register=================================
app.get('/login',(req,res)=>{
    res.render('login',{currentUser:req.user})
});
app.post("/login",passport.authenticate("local",{
    successRedirect: "/",
    failureRedirect: "/login"
}),(req,res)=>{
    res.redirect("/");
})

app.get("/logout",(req,res)=>{
    req.logout(),
    res.render("/")
});

app.get("/register", function(req, res){
    res.render("register", {page: 'register', employee: req.body }); 
 });

app.post('/register',(req,res)=>{
        newuser = new User({username:req.body.username});
        User.register(newuser,req.body.password,(err,user)=>{
            if(err){
                console.log(err);
                return res.render("register")
            }
            passport.authenticate("local")(req,res,()=>{
                res.redirect("/");
            })

            });
})

//=======================middleware=================================
 function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
}









//=======================server starter code=================================
app.listen(3000, ()=> {
    console.log("Server Started at port 3000 ")
})
