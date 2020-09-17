'use strict'

var express=require('express');
var bodyParser=require('body-parser');

var app=express();

//CARGAR RUTAS

//CARGAR MIDDLEWARES

app.use(bodyParser.urlencoded({extended:false}));       //CONVERTIR TODOS LOS DATOS EN JSON
app.use(bodyParser.json());

//CORS Y CABECERAS

//RUTAS
app.get('/',(req,res)=>{
    res.status(200).send({
        message:'Hola mundo desde NODEJS',
       
    });
});
app.post('/pruebas',(req,res)=>{
    console.log(req.body);
    res.status(200).send({
    
        message:'Acción de pruebas en el servidor de NodeJS',
     
    });
});
//EXPORTAR
module.exports=app;