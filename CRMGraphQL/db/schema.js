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

    type Usuario {
        id: ID
        nombre: String
        apellido: String
        email: String
        creado: String
    }

    input UsuarioInput {
        nombre: String!
        apellido: String!
        email: String!
        password: String!
    }

    type Query {
        obtenerCurso:String
    }

    type Mutation {
        nuevoUsuario(input: UsuarioInput):Usuario
    }

`
//! obligatorio
// type Query {
//     obtenerCursos: Curso //Solo 1 [Curso] //Arrays
// }

module.exports = typeDefs