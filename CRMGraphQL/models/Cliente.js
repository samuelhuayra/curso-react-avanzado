const mongoose = require('mongoose')

const ClientesSchema = mongoose.Schema({
    nombre:{
        type:String,
        require: true,
        trim:true
    },
    apellido:{
        type:String,
        require: true,
        trim:true
    },
    empresa:{
        type:String,
        require: true,
        trim:true
    },
    email:{
        type:String,
        require: true,
        trim:true,
        unique:true //Unico en la DB
    },
    telefono:{
        type:String,
        trim:true
    },
    creado:{
        type:Date,
        default: Date.now()
    },
    vendedor:{
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref:'Usuario'
    }
})

module.exports = mongoose.model('Cliente',ClientesSchema)