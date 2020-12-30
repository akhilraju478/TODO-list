const mongoose = require('mongoose');

const userschema=new mongoose.Schema({
    name:String,
    username:{type:String,unique:true},
    password:String
},
{timestamps:true}
);


const USsc=mongoose.model('USER',userschema);     
module.exports=USsc;