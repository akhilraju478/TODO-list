const express = require('express');
const bodyParser= require('body-parser');
const mongoose = require('mongoose');
const TODOsc = require('./models/models');
const USERsc = require('./models/user');
const session = require('express-session');
const passwordhash = require('password-hash');
const cookieParser = require('cookie-parser');
// var _ = require('lodash');

mongoose.connect('mongodb://localhost/todo',{ useNewUrlParser: true , useUnifiedTopology: true ,useCreateIndex:true,useFindAndModify: false},function (err,result) {
  if(err) {console.log(err);}
else {console.log("connected to database");}});


var app = express();
app.use(express.static("static"));  
app.use(bodyParser.urlencoded({extended:true}));
app.use(cookieParser());
app.use(express.urlencoded({extended:true}));
app.use(session({secret:"secret", resave:false,saveUninitialized:false}));
app.set('view engine','ejs');   



     

app.get('/', function(req,resp){          
  if(req.session.username){
    resp.redirect('/index');}
    else{
    // resp.json({session:req.session});
    resp.redirect('/login');
    }

});

app.get('/index', function(req,resp){    
  if(TODOsc.find({user:req.session.username})==undefined)
  {  if (req.session.username)
    {
    TODOsc.find({user:req.session.username},function(err,todo){
      resp.render("index" ,{tolist:todo,sess:req.session.username});
      }).sort({createdAt: -1});  
    }
      else {
        resp.redirect('/login');
        }
  }


  else
  {
  if (req.session.username)
  {
  TODOsc.find({user:req.session.username},function(err,todo){
    resp.render("index" ,{tolist:todo,sess:req.session.username});
    }).sort({createdAt: -1});  
  }
    else {
      resp.redirect('/login');
      }
  }

});

app.get('/TODO', function(req,resp){         
  if (req.session.username)
  {
  TODOsc.find({},function(err,todo){
    resp.render("TODO" ,{tolist:todo,sess:req.session.username});
    }).sort({createdAt: -1});   
  }       else {
    // resp.json({session:req.session});
    resp.redirect('/login');
    }
});  

app.get('/login',function(req,resp){
  resp.render("login",{sess:req.session.username});
});
app.get('/sign',function(req,resp){
  resp.render("sign",{sess:req.session.username});
});

app.post('/login',function(req,resp){
  USERsc.findOne({username:req.body.username},function(err,det){
if(err){resp.send("err")}
else if(passwordhash.verify(req.body.password,det.password,function(err){})){
  req.session.username=det.username;
  req.session.name=det.name;
  req.session.uid=det._id;
  resp.redirect('/');}
else{resp.send("incorrect password/username");}
  });
// resp.json({session:req.session});
});
app.get('/logout',function(req,resp){
req.session.destroy();
resp.redirect('/');
});
app.post('/sign',function(req,resp){
  const user=new USERsc({
    name:req.body.name,
    username:req.body.username,
    password:passwordhash.generate(req.body.password)
  });
  user.save(function(err){
    if(err) {console.log(err);}
    else{resp.redirect('/login');}
  });
  // resp.json({body:req.body});
});

app.post('/add',function(req,resp){
  const todo= new TODOsc({title:req.body.title,descrip:req.body.descrip,user:req.session.username});
  todo.save();
  console.log(req.body);
  resp.redirect('/index');
});

app.get('/show/:ids',function(req,resp){
  const id=req.params.ids;
  TODOsc.findById(id,function(err,todo){
    // resp.send(todo)
    resp.render('show',{tolist:todo,sess:req.session.username})
  });
  // console.log(id)
});
app.get('/update/:ids',function(req,resp){
  const id=req.params.ids;
  TODOsc.findById(id,function(err,todo){
    resp.render('update',{tolist:todo,id:id,sess:req.session.username})
  });
});

app.post('/update/:ids', function(req,resp){    
  const id=req.params.ids;
  TODOsc.findByIdAndUpdate(id,req.body,function(err,todo){
    resp.redirect('/index');
  });
});

app.get('/del/:ids',function(req,resp){
  const id=req.params.ids;
  TODOsc.findByIdAndDelete(id, function(err,todo){
    // resp.render('show',{tolist:todo})
    {resp.redirect('/index');}
  });
});


app.listen(3000, function () {
    console.log("Server running on port 3000");
  });




  // app.post('/login',function(req,resp){
//   USERsc.findOne({username:req.body.username},function(err,det){
// if(err)resp.send("err")
// if(passwordhash.verify(req.body.password,det.password)){
//   resp.redirect('/');}
//   });
// // resp.json({body:req.body});
// });


  // app.post('/addB', function(requ,resp){
  //   new Blog({
  //     title: requ.body.title,
  //     content:requ.body.cont
  //   }).save();   
  //   resp.redirect('/bloglim');
  // });





  // const list=[{
//   todo:"todo2",
//  descrip:"something",
//   createdAt:new Date()
// },{
//   todo:"todo1",
//   descrip:"somesomething",
//   createdAt:new Date()
// }]; 
//  const comp = [];
//   //{tolist:list,complete: comp}

  // app.get('/yo', function(requ,resp){          
  //   TODOsc.find({},function(err,todo){ resp.send(todo)})  
  // });
  
  // app.get('/a', function(requ,resp){     
  //   TODOsc.find()  
  //   .then((result)=>{
  //     resp.send(result)
  //   })
  //   .catch((err)=>{console.log(err);
  //   });
  // });
  
  // app.get('/ab', function(requ,resp){     
  //   TODOsc.findById('5f4ea78b81219d242cda80c6')  
  //   .then((result)=>{
  //     resp.send(result)
  //   })
  //   .catch((err)=>{console.log(err);
  //   });
  // });