const { gql } = require('apollo-server');

//Schema
const typeDefs = gql`

    type Curso {
        titulo: String
    }

    type Tecnologia {
        tecnologia: String
    }

    input CursoInput {
        tecnologia: String
    }

    type Query {
        obtenerCursos(input:CursoInput!): [Curso]
        obtenerTecnologia: [Tecnologia]
    }
`
//! obligatorio
// type Query {
//     obtenerCursos: Curso //Solo 1 [Curso] //Arrays
// }

module.exports = typeDefs