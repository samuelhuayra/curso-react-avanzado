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

    #Inputs
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

    #Query
    type Query {
        obtenerUsuario(token:String!): Usuario
    }

    #Mutations
    type Mutation {
        nuevoUsuario(input: UsuarioInput):Usuario
        autenticarUsuario(input: AutenticarInput):Token
    }

`
//! obligatorio
// type Query {
//     obtenerCursos: Curso //Solo 1 [Curso] //Arrays
// }

module.exports = typeDefs