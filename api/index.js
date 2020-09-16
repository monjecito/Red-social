'use strict'
var mongoose=require('mongoose');

mongoose.Promise=global.Promise;
mongoose.connect('mongodb://localhost:27017/red-social')
.then(()=>{
    console.log('Servidor de la red social corriendo correctamente');
})
.catch(err=>console.log(err));