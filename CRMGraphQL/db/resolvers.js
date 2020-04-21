const Usuario = require('../models/Usuario')
const Producto = require('../models/Producto')
const Cliente = require('../models/Cliente')
const Pedido = require('../models/Pedido')

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
            try {
                return jwt.verify(token,process.env.SECRETA)
            } catch (error) {
                console.log(error);
            }
        },
        obtenerProductos:async()=>{
            try {
                return await Producto.find({})
            } catch (error) {
                console.log(error);
            }
        },
        obtenerProducto: async(_,{id})=>{
            //Revisar si el existe
            const producto = await Producto.findById(id)
            if(!producto) throw new Error('Producto no encontrado')
            return producto
        },
        obtenerClientes: async()=>{
            try {
                return await Cliente.find({})
            } catch (error) {
                console.log(error);
            }
        },
        obtenerClientesVendedor: async(_,{},ctx)=>{
            try {
                return await Cliente.find({vendedor:ctx.usuario.id.toString()})
            } catch (error) {
                console.log(error);
            }
        },
        obtenerCliente:async(_,{id},ctx)=>{
            //Revisar si el cliente existe o no
            const cliente = await Cliente.findById(id)
            if(!cliente) throw new Error('Cliente no encontrado')
            
            //Quien lo creó,puede verlo
            if(cliente.vendedor.toString()!== ctx.usuario.id) throw new Error('No tienes las credenciales')

            return cliente
        },
        obtenerPedidos:async()=>{
            try {
                return await Pedido.find({})
            } catch (error) {
                console.log(error);
            }
        },
        obtenerPedidosVendedor:async(_,{},ctx)=>{
            try {
                return await Pedido.find({vendedor:ctx.usuario.id.toString()})
            } catch (error) {
                console.log(error);
            }
        },
        obtenerPedido:async(_,{id},ctx)=>{
            //Revisar si el pedido existe o no
            const pedido = await Pedido.findById(id)
            if(!pedido) throw new Error('Pedido no encontrado')
            
            //Quien lo creó,puede verlo
            if(pedido.vendedor.toString()!== ctx.usuario.id) throw new Error('No tienes las credenciales')

            return pedido
        },
        obtenerPedidoEstado:async(_,{estado},ctx)=> await Pedido.find({vendedor:ctx.usuario.id,estado}),
        mejoresClientes:async()=>{
            return await Pedido.aggregate([
                {$match:{estado: 'COMPLETADO'}}, //Where
                { $group:{
                    _id:"$cliente",             //Group by
                    total:{ $sum: '$total'}     //Sum
                }},
                {
                    $lookup:{                    //Join
                        from: 'clientes',
                        localField: '_id',
                        foreignField: '_id',
                        as:'cliente'
                    }
                },
                {
                    $limit: 3
                },
                {
                    $sort: { total : -1}            //sort by desc
                }
            ])
        },
        mejoresVendedores:async()=>{
            return await Pedido.aggregate([
                {$match:{estado: 'COMPLETADO'}}, //Where
                { $group:{
                    _id:"$vendedor",             //Group by
                    total:{ $sum: '$total'}     //Sum
                }},
                {
                    $lookup:{                    //Join
                        from: 'usuarios',
                        localField: '_id',
                        foreignField: '_id',
                        as:'vendedor'             //SE inyecta al type
                    }
                },
                {
                    $limit: 3
                },
                {
                    $sort: { total : -1}            //sort by desc
                }
            ])
        },
        buscarProducto:async(_,{texto})=>{
            return await Producto.find({ $text: { $search: texto}}).limit(10)  // text: Indice busqueda rapida
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
        },
        actualizarCliente:async(_,{id,input},ctx)=>{
            //Verificar si existe
            const cliente = await Cliente.findById(id)
            if(!cliente) throw new Error('Cliente no existe')

            // Si el vendedor es quien edita
            if(cliente.vendedor.toString()!== ctx.usuario.id) throw new Error('No tienes las credenciales')
            // Save
            return await Cliente.findOneAndUpdate({_id:id},input,{new: true}) //New true para devolver el nuevo objeto
        },
        eliminarCliente:async(_,{id},ctx)=>{
            //Verificar si existe
            const cliente = await Cliente.findById(id)
            if(!cliente) throw new Error('Cliente no existe')

            // Si el vendedor es quien edita
            if(cliente.vendedor.toString()!== ctx.usuario.id) throw new Error('No tienes las credenciales')
            // Save
            await Cliente.findOneAndDelete({_id:id})
            return 'Cliente Eliminado.'
        },
        nuevoPedido:async(_,{input},ctx)=>{
            const {cliente} = input
            //Verificar si el cliente existe
            const clienteExiste = await Cliente.findById(cliente)
            if(!clienteExiste) throw new Error('Cliente no existe')

            //Si el cliente es del vendedor
            if(clienteExiste.vendedor.toString()!== ctx.usuario.id) throw new Error('No tienes las credenciales')

            // El stock este disponible
            //OJO con el for await
            for await( const articulo of input.pedido || []){
                const {id} = articulo;
                const producto = await Producto.findById(id)

                if(articulo.cantidad > producto.existencia)
                    throw new Error(`El articulo: ${producto.nombre} excede la cantidad disponible`)
                else{
                    producto.existencia -= articulo.cantidad
                    await producto.save()
                }
                    
            }
            //Crear Pedido
            const nuevoPedido = new Pedido(input)
            // asignar el vendedor
            nuevoPedido.vendedor = ctx.usuario.id

            //Save
            return await nuevoPedido.save()
        },
        actualizarPedido:async(_,{id,input},ctx)=>{

            const { cliente } = input

            //Revisar si el pedido existe o no
            const pedido = await Pedido.findById(id)
            if(!pedido) throw new Error('Pedido no existe')

            //Revisar si el cliente existe o no
            const existeCliente = await Cliente.findById(cliente)
            if(!existeCliente) throw new Error('Cliente no existe')

            //Si el cliente y pedido pertenece al vendedor
            if(existeCliente.vendedor.toString() !== ctx.usuario.id)
            throw new Error('No tienes las credenciales')

            //Revisar el stock
            for await( const articulo of input.pedido || []){
                const {id} = articulo;
                const producto = await Producto.findById(id)

                if(articulo.cantidad > producto.existencia)
                    throw new Error(`El articulo: ${producto.nombre} excede la cantidad disponible`)
                else{
                    producto.existencia -= articulo.cantidad
                    await producto.save()
                }   
            }

            //Save
            return await Pedido.findOneAndUpdate({_id:id},input,{new:true})
        },
        eliminarPedido:async(_,{id},ctx)=>{

            //Revisar si el pedido existe o no
            const pedido = await Pedido.findById(id)
            if(!pedido) throw new Error('Pedido no existe')

            //Si el cliente y pedido pertenece al vendedor
            if(pedido.vendedor.toString() !== ctx.usuario.id)
            throw new Error('No tienes las credenciales')

            //Eliminar
            await Pedido.findOneAndDelete({_id:id})
            return 'Pedido eliminado'
        }
    }
}
module.exports = resolvers;