const cursos = [
    {
        titulo: 'JavaScript Moderno Guía Definitiva Construye +10 Proyectos',
        tecnologia: 'JavaScript ES6',
    },
    {
        titulo: 'React – La Guía Completa: Hooks Context Redux MERN +15 Apps',
        tecnologia: 'React',
    },
    {
        titulo: 'Node.js – Bootcamp Desarrollo Web inc. MVC y REST API’s',
        tecnologia: 'Node.js'
    }, 
    {
        titulo: 'ReactJS Avanzado – FullStack React GraphQL y Apollo',
        tecnologia: 'React'
    }
];

//Resolver
const resolvers = {
    Query:{
        obtenerCursos:(
            _,//Objeto que contine los resultados del resolver padre
            {input}, //input
            ctx,//Context, información que se comparte entre todos los resolvers EJ:auth
            info, //Tiene info sobre la consulta actual
        )=> {
            console.log(ctx);
            return cursos.filter(curso=> curso.tecnologia === input.tecnologia)
        }, //Curso[0] //Solo 1 Curso //Arrays
        //obtenerTecnologia:()=>cursos
    }
}
module.exports = resolvers;