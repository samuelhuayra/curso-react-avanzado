const { gql } = require('apollo-server');

//Schema
const typeDefs = gql`
    type Query{
        obtenerCurso:String
    }
`
//! obligatorio
// type Query {
//     obtenerCursos: Curso //Solo 1 [Curso] //Arrays
// }

module.exports = typeDefs