const Usuario = require('../models/Usuario')
const Producto = require('../models/Producto')
const Cliente = require('../models/Cliente')
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
        },
        obtenerProductos:async()=>{
            try {
                const productos = await Producto.find({})
                return productos
            } catch (error) {
                
            }
        },
        obtenerProducto: async(_,{id})=>{

            //Revisar si el existe
            const producto = await Producto.findById(id)
            if(!producto) throw new Error('Producto no encontrado')
            return producto
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
        },
        nuevoProducto:async(_,{input})=>{
            
            const producto = new Producto(input)

            try {
                //Guardar
                return await producto.save()
            } catch (error) {
                console.error(error)
            }
        },
        actualizarProducto:async(_,{id,input})=>{  
                //Revisar si el existe
                let producto = await Producto.findById(id)
                if(!producto) throw new Error('Producto no encontrado')

            try {
                //Update
                return await Producto.findOneAndUpdate({_id:id},input,{new: true}) //New true para devolver el nuevo objeto

            } catch (error) {
                console.error(error)
            }
        },
        eliminarProducto:async(_,{id})=>{
                //Revisar si el existe
                let producto = await Producto.findById(id)
                if(!producto) throw new Error('Producto no encontrado')

            try {
                //Update
                await Producto.findByIdAndDelete({_id:id})
                return "Producto eliminado."
            } catch (error) {
                console.error(error)
            }
        },
        nuevoCliente:async(_,{input},ctx)=>{
            
                const {email} = input
                //Verificar si el cliente ya esta creado
                const cliente = await Cliente.findOne({email})
                if(cliente) throw new Error('El cliente ya esta registrado')
                
                const nuevoCliente = new Cliente(input)
                //asignar el vendedor
                nuevoCliente.vendedor = ctx.usuario.id
            try {
                //Guardar
                return await nuevoCliente.save()
            } catch (error) {
                console.error(error)
            }
        }
    }
}
module.exports = resolvers;