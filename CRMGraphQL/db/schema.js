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

    #Query
    type Query {
        ##Usuarios
        obtenerUsuario(token:String!): Usuario
        
        ##Productos
        obtenerProductos:[Producto]
        obtenerProducto(id:ID!):Producto
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
    }

`
//! obligatorio
// type Query {
//     obtenerCursos: Curso //Solo 1 [Curso] //Arrays
// }

module.exports = typeDefs