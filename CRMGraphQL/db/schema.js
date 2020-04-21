const { gql } = require('apollo-server');

/**
 * Tipos de datos en GraphQL
 * INT
 * FLOAT
 * STRING => para Date
 * ID
 * BOOLEAN
 */

//Schema
const typeDefs = gql`

    #Datos
    ##Usuarios
    type Usuario {
        id: ID
        nombre: String
        apellido: String
        email: String
        creado: String
    }

    type Token {
        token: String
    }
    ##Productos
    type Producto{
        id: ID
        nombre: String
        existencia: Int
        precio: Float
        creado: String
    }

    ##Clientes
    type Cliente{
        id: ID
        nombre: String
        apellido: String
        empresa: String
        email: String
        telefono: String
        creado: String
        vendedor: ID
    }

    ##Pedido
    type Pedido{
        id:ID
        pedido:[PedidoGrupo]
        total: Float
        cliente: ID
        vendedor: ID
        creado: String
        estado: EstadoPedido
    }

    type PedidoGrupo{
        id:ID
        cantidad: Int
    }

    #Inputs
    ##Usuarios
    input UsuarioInput {
        nombre: String!
        apellido: String!
        email: String!
        password: String!
    }

    input AutenticarInput{
        email: String!
        password: String!
    }

    ##Productos
    input ProductoInput{
        nombre: String!
        existencia: Int!
        precio: Float!
    }

    ##Clientes
    input ClienteInput{
        nombre: String!
        apellido: String!
        empresa: String!
        email: String!
        telefono: String
    }

    ##Pedidos
    input PedidoProductoInput{
        id: ID
        cantidad: Int
    }
    input PedidoInput{
        pedido: [PedidoProductoInput]
        total: Float
        cliente: ID!
        estado: EstadoPedido
    }

    ##SOLO estos valores
    enum EstadoPedido {
        PENDIENTE
        COMPLETADO
        CANCELADO
    }

    #Query
    type Query {
        ##Usuarios
        obtenerUsuario(token:String!): Usuario
        
        ##Productos
        obtenerProductos:[Producto]
        obtenerProducto(id:ID!):Producto

        ##Clientes
        obtenerClientes:[Cliente]
        obtenerClientesVendedor:[Cliente]
        obtenerCliente(id:ID!):Cliente

        ##Pedidos
        obtenerPedidos:[Pedido]
        obtenerPedidosVendedor:[Pedido]
        obtenerPedido(id:ID!):Pedido
        obtenerPedidoEstado(estado:EstadoPedido!):[Pedido]
        
    }

    #Mutations
    type Mutation {
        ##Usuarios
        nuevoUsuario(input: UsuarioInput):Usuario
        autenticarUsuario(input: AutenticarInput):Token

        ##Productos
        nuevoProducto(input:ProductoInput):Producto
        actualizarProducto(id:ID!,input:ProductoInput):Producto
        eliminarProducto(id:ID!):String

        ##Clientes
        nuevoCliente(input:ClienteInput):Cliente
        actualizarCliente(id:ID!,input:ClienteInput):Cliente
        eliminarCliente(id:ID!):String

        ##Pedidos
        nuevoPedido(input: PedidoInput):Pedido
        actualizarPedido(id:ID!,input: PedidoInput):Pedido
        eliminarPedido(id:ID!):String
    }

`
//! obligatorio
// type Query {
//     obtenerCursos: Curso //Solo 1 [Curso] //Arrays
// }

module.exports = typeDefs