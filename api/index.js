'use strict'
var mongoose = require('mongoose');
var app = require('./app');
var port = 3800;

//CONEXION DATABASE
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/red-social')
    .then(() => {
        console.log('Servidor de la red social corriendo correctamente');

        //CREAR SERVIDOR
        app.listen(port,()=>{
            console.log('Servidor corriendo en http://localhost:3800');
        });


    })
    .catch(err => console.log(err));