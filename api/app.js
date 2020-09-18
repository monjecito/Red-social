'use strict'

var express=require('express');
var bodyParser=require('body-parser');

var app=express();

//CARGAR RUTAS
var user_routes=require('./routes/user');
var follow_routes=require('./routes/follow');
//CARGAR MIDDLEWARES

app.use(bodyParser.urlencoded({extended:false}));       //CONVERTIR TODOS LOS DATOS EN JSON
app.use(bodyParser.json());

//CORS Y CABECERAS

//RUTAS
app.use('/api',user_routes);
app.use('/api',follow_routes);

//EXPORTAR
module.exports=app;