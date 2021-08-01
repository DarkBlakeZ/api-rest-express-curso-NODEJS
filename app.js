const debug = require('debug')('app:inicio');
//const dbDebug = require('debug')('app.db');
const config = require('config')

const express = require('express');
const logger = require('./logger')
const Joi = require('joi')
const morgan = require('morgan');
const { required } = require('joi');
const app = express();

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

//app.use(logger.log)
/*
app.use((req, res, next)=>{
    console.log('autenticando...');
    next();
})
*/
//middelwate de tercero

if(app.get('env') === 'development'){
    app.use(morgan('tiny'));
    //console.log('Morgan Habilitado');
    debug('Morgan esta habilitado.');
    
}

//Trabajos con la base de datos
debug('conectando con la base de datos');


//Configuracion de entorno
console.log('Aplicacion: '+ config.get('nombre'));
console.log('BD Server: '+ config.get('configDB.host'));

const usuarios = [
    {id:1, nombre: 'David'},
    {id:2, nombre: 'Cristian'},
    {id:3, nombre: 'Juan'},
    {id:4, nombre: 'Diego'},
    {id:5, nombre: 'Miguel'},
    {id:6, nombre: 'Sergio'},
]

app.get('/api/', (req, res) => {
    res.send('Hola mundo desde Express');
});

app.get('/api/usuarios', (req, res) => {
    res.send(usuarios);
})

app.get('/api/usuarios/:id', (req, res) =>{
    
    let usuario = existUser(req.params.id)

    if(!usuario){
        res.status(404).send('Usuario no encontrado');
    }else{
        res.send(usuario);
    }
})

app.post('/api/usuarios', (req, res) => {

    const {error , value} = validateUser(req.body.nombre)

    if(error){
        res.status(400).send(error.details[0].message);
    }else{
        const usuario = {
        id: usuarios.length + 1,
        nombre: value.nombre
        }
        usuarios.push(usuario)
        res.send(usuario)
    }
    
});


app.put('/api/usuarios/:id', (req, res) => {

    const {error , value} = validateUser(req.body.nombre)

    if(error){
        res.status(400).send(error.details[0].message);
    }else{
        let usuario = existUser(req.params.id)
        if(!usuario){
            res.status(404).send('Usuario no encontrado');
        }else{
            usuario.nombre = value.nombre
            res.send(usuario)
        }
    }
});


app.delete('/api/usuarios/:id', (req, res) => {
    const usuario = existUser(req.params.id)
    if(!usuario){
        res.status(404).send('Usuario no encontrado');
    }else{
        const index = usuarios.indexOf(usuario);
        usuarios.splice(index, 1)
        res.send('Usuario eliminado')
    }
});


const port = process.env.PORT || 3000;


app.listen(port, ()=>{
    console.log(`servidor corriendo en el puerto ${port}`)
});


const existUser = (id) =>{
    let usuario = usuarios.find(e=>e.id == id)
    return usuario
}

const validateUser = (nom) =>{
    const schema = Joi.object({
        nombre: Joi.string().required().min(3)
    })

    return schema.validate({ nombre : nom })
}