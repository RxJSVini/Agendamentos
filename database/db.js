const mongoose = require('mongoose');
const dotenv = require('dotenv').config()

module.exports = () =>{
    mongoose.connect(`mongodb://${process.env.USER_DB}:${process.env.PASSWORD_DB}@${process.env.URL_DB}:${process.env.PORT_DB}/${process.env.NAME_DB}`,{useNewUrlParser: true, useUnifiedTopology: true})
    .then(( ) =>{
        mongoose.set('useFindAndModify', false);

        console.log(`Conexão estabelecida com sucesso!`)
    })
    .catch((error) =>{

        console.log(`Erro na conexão com o banco de dados!`,error);
    })
}