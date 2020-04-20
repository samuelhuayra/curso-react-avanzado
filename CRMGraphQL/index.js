const { ApolloServer } = require('apollo-server');
const typeDefs = require('./db/schema')
const resolvers = require('./db/resolvers')

const conectarDB = require('./config/db')

//conectarDB
conectarDB()

//Servidor
const server = new ApolloServer({
    typeDefs,
    resolvers,
    //context: ()=>({miContext:"hola"}) //Aqui podemos enviar la info del Usuario
});



server.listen().then(({url})=>{
    console.log(`Servidor listo en la URL ${url}`);
})