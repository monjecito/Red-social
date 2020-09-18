'use strict'
var bcrypt = require('bcrypt-nodejs');
var mongoosePaginate = require('mongoose-pagination');
var fs = require('fs');
var path = require('path');
var User = require('../models/user');
var Follow=require('../models/follow');
var jwt = require('../services/jwt');

//METODOS DE PRUEBA
function home(req, res) {
    res.status(200).send({
        message: 'Hola mundo desde NODEJS',

    });
}

function pruebas(req, res) {
    console.log(req.body);
    res.status(200).send({

        message: 'Acción de pruebas en el servidor de NodeJS',

    });
}

//REGISTRO
function saveUser(req, res) {
    var params = req.body;
    var user = new User();
    if (params.name && params.surname &&
        params.nick && params.email && params.password) {

        user.name = params.name;
        user.surname = params.surname;                              //ASIGNAR VALORES AL OBJETO DEL MODELO USUARIO
        user.nick = params.nick;
        user.email = params.email;
        user.role = 'ROLE_USER';
        user.image = null;

        //CONTROLAR USUARIOS DUPLICADOS

        User.find({
            $or: [
                { email: user.email.toLowerCase() },
                { nick: user.nick.toLowerCase() }
            ]
        }).exec((err, users) => {
            if (err)
                return res.status(500).send({
                    message: 'Error en la petición de usuarios'
                });

            if (users && users.length >= 1) {
                return res.status(200).send({
                    message: 'El usuario que intentas registrar ya existe!!'
                });
            } else {
                bcrypt.hash(params.password, null, null, (err, hash) => {
                    user.password = hash;

                    user.save((err, userStored) => {
                        if (err) res.status(500).send({ message: 'Error al guardar el usuario' });

                        if (userStored) {
                            res.status(200).send({
                                user: userStored
                            });
                        } else {
                            res.status(404).send({
                                message: 'No se ha registrado el usuario'
                            });
                        }
                    });

                });
            }
        });

        //CIFRADO PASSWORD Y GUARDO DATOS


    } else {
        res.status(200).send({
            message: 'Envia todos los campos necesarios!!',

        });
    }

}

//LOGIN
function loginUser(req, res) {
    var params = req.body;

    var email = params.email;
    var password = params.password;

    User.findOne({ email: email }, (err, user) => {
        if (err) return res.status(500).send({ message: 'Error en la petición' });

        if (user) {
            bcrypt.compare(password, user.password, (err, check) => {
                if (check) {

                    if (params.gettoken) {
                        //Generar y devolver el token
                        return res.status(200).send({
                            token: jwt.createToken(user)
                        });
                    } else {
                        //DEVOLVER DATOS DEL USUARIO
                        user.password = undefined;
                        return res.status(200).send({ user })
                    }


                } else {
                    return res.status(404).send({ message: 'El usuario no se ha podido identificar' });
                }
            });
        } else {
            return res.status(404).send({ message: 'El usuario no se ha podido identificar!!' });
        }
    });

}

//CONSEGUIR DATOS DE UN USUARIO

function getUser(req, res) {
    var userId = req.params.id;

    User.findById(userId, (err, user) => {
        if (err) return res.status(500).send({ message: 'Error en la peticion' });

        if (!user) return res.status(404).send({ Message: 'El usuario no existe' });

        Follow.findOne({"user":req.user.sub,"followed":userId}).exec((err,follow)=>{
            if(err){
                return res.status(500).send({message:'Error al comprobar el seguimiento'});
            }
            return res.status(200).send({ user,follow });
        });
       
    });
}

//DEVOLVER UNA LISTA DE USUARIOS PAGINADOS

function getUsers(req, res) {
    var identity_user_id = req.user.sub;
    var page = 1;
    if (req.params.page) {
        page = req.params.page;
    }
    var itemsPerPage = 5;

    User.find().sort('_id').paginate(page, itemsPerPage, (err, users, total) => {
        if (err) return res.status(500).send({ message: 'Error en la petición' });

        if (!users) return res.status(404).send({ message: 'No hay usuarios disponibles' });

        return res.status(200).send({
            users,
            total,
            pages: Math.ceil(total / itemsPerPage)
        });
    });
}
//EDICION DATOS DE USUARIO

function updateUser(req, res) {
    var userId = req.params.id;
    var update = req.body;

    //Borrar propiedad password
    delete update.password;

    if (userId != req.user.sub) {
        return res.status(500).send({ message: 'No tienes permiso para actualizar los datos del usuario' });
    }
    User.findByIdAndUpdate(userId, update, { new: true }, (err, userUpdated) => {
        if (err) return res.status(500).send({ message: 'Error en la petición' });

        if (!userUpdated) return res.status(404).send({ message: 'No se ha podido actualizar el usuario' });

        return res.status(200).send({
            user: userUpdated
        });
    });


}

//SUBIR AVATAR DEL USUARIO

function uploadImage(req, res) {
    var userId = req.params.id;

    if (req.files) {
        var file_path = req.files.image.path;
        console.log(file_path);
        var file_split = file_path.split('\\');
        console.log(file_split);

        var file_name = file_split[2];
        console.log(file_name);

        var ext_split = file_name.split('\.');
        console.log(ext_split);

        var file_ext = ext_split[1];
        console.log(file_ext);

        if (userId != req.user.sub) {
            return removeFilesOfUploads(res, file_path, 'No tienes permiso para actualizar los datos del usuario');
        }

        if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jpeg' || file_ext == 'gif') {
            //Actualizar documento usuario logeado

            User.findByIdAndUpdate(userId, { image: file_name }, { new: true }, (err, userUpdated) => {
                if (err) return res.status(500).send({ message: 'Error en la petición' });

                if (!userUpdated) return res.status(404).send({ message: 'No se ha podido actualizar el usuario' });

                return res.status(200).send({
                    user: userUpdated
                });
            });
        } else {
            return removeFilesOfUploads(res, file_path, 'Extensión no válida');
        }

    } else {
        return res.status(200).send({
            message: 'No se han subido imagenes'
        });
    }
}
//ELIMINAR IMAGENES
function removeFilesOfUploads(res, file_path, message) {
    fs.unlink(file_path, (err) => {
        return res.status(200).send({ message: message });
    });
}
function getImageFile(req, res) {
    var image_file = req.params.imageFile;
    var path_file = './uploads/users/' + image_file;

    fs.exists(path_file, (exists) => {
        if (exists) {
            res.sendFile(path.resolve(path_file));
        } else {
            res.status(200).send({ message: 'No existe la imagen' });
        }

    });
}
module.exports = {
    home,
    pruebas,                //EXPORTAR FUNCIONES FUERA DEL FICHERO
    saveUser,
    loginUser,
    getUser,
    getUsers,
    updateUser,
    uploadImage,
    getImageFile
}