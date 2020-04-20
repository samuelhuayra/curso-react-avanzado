const Usuario = require('../models/Usuario')
const bcryptjs = require('bcryptjs')
//Resolver
const resolvers = {
    Query:{
        obtenerCurso: ()=>"algo"
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
        }
    }
}
module.exports = resolvers;