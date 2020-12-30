const mongoose = require('mongoose');


const todoschema=new mongoose.Schema({
    title: {
        type: String
        
    },
    descrip:{ 
        type:String
    },
    user:{
        type:String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
},
{timestamps:true}
);




const Dosc=mongoose.model('TOdo',todoschema);     // dosch is pluralized automatically n stored in database
module.exports=Dosc;
