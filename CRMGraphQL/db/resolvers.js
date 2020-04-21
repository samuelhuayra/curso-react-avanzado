const Usuario = require('../models/Usuario')
const bcryptjs = require('bcryptjs')
require('dotenv').config({path: 'variables.env'})
const jwt = require('jsonwebtoken')
//Methods
/**
 * Para crear tokens necesitas 3 cosas:
 * payload: que info se va a guerdar en el JWT
 * palabraSecreta: palabra secreta
 * tiempo de expiracion: tiempo de expiracion
 */
const crearToken = (usuario,secreta,expiresIn)=>{
    const {id,email,nombre,apellido} = usuario;
    return jwt.sign({id,email,nombre,apellido},secreta,{ expiresIn })
}


//Resolver
const resolvers = {
    Query:{
        obtenerUsuario: async(_,{token})=>{
            const usuarioId = await jwt.verify(token,process.env.SECRETA)
            return usuarioId;
        }
    },
    Mutation:{
        nuevoUsuario: async(_,{input})=>{
            //console.log(input)
            //Destructuring
            const {email,password} = input;

            //Revisar si el Usuario ya esta registrado
            const  existeUsuario = await Usuario.findOne({email})
            if(existeUsuario) throw new Error('El usuario ya esta registrado.')

            //Hashear el password
            const salt = await bcryptjs.genSalt(10)
            input.password = await bcryptjs.hash(password,salt)
            console.log('>>',input);

            try {
                //Guardar en la BD
                const usuario = new Usuario(input)
                usuario.save() // Guardarlo en DB
                return usuario
            } catch (error) {
                console.error(error);
            }
        },
        autenticarUsuario:async(_,{input})=>{
            //Destructuring
            const {email,password} = input;
            
            //Si el usuario existe
            const  existeUsuario = await Usuario.findOne({email})
            if(!existeUsuario) throw new Error('El usuario no existe.')

            //Revisar si el password es correcto
            const passwordCorrecto = await bcryptjs.compare(password,existeUsuario.password)
            if(!passwordCorrecto) throw new Error('El password es incorrecto.')

            //Crear el token
            return {
                token: crearToken(existeUsuario,process.env.SECRETA,'24h')
            }
        }
    }
}
module.exports = resolvers;