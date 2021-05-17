const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const dotenv = require('dotenv').config()
const db = require('./database/db')();
const routes = require('./routes');
const path = require('path')


// Static
app.use(express.static('public'));

//Views
app.set('views', path.join(__dirname, 'views'));

//Template engine
app.set('view engine', 'ejs');


//Body parser
app.use(bodyParser.urlencoded({ extended: false}));

//Routes
app.use(routes);


app.listen(process.env.PORT_SERVER, () => {
    console.log(`Sistema de agendamentos está online em ${process.env.PORT_SERVER}`)
});