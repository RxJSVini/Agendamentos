const appointment = require('../models/Appointment');
const mongoose = require('mongoose');
const AppointmentFactory = require('../factories/AppointmentFactory');
const Appo = mongoose.model("Appointment", appointment);
const mailer = require('nodemailer');


class AppointmentService {
    async Create(name, email, description, cpf, date, time){
        const newAppo = new Appo({
            name,
            email,
            description, 
            cpf,
            date,
            time,
            finished:false,
            notified:false
        });
        try {
            await newAppo.save();
            return true;

        } catch (error) {
            console.log(error);
            return true;
        }
    }
    

    async GetAll(showFinished){
        if(showFinished){
            return await Appo.find();
        }else{
            const appos = await Appo.find({'finished': false});
            const appointments = [];

            appos.forEach(appointment => {
                if(appointment.date != undefined){
                    appointments.push( AppointmentFactory.Build(appointment) )
                }                
            });

            return appointments;
        }
    }

    async GetById(id){
        try{
            const event = await Appo.findOne({'_id': id});
            return event;
        }catch(err){
            console.log(err);
        }
    }

    async Finish(id){
       try {
            await Appo.findByIdAndUpdate(id, {finished:true});
            return true;
       } catch (err) {
         console.log(err);
         return false;
       }
    }

    async Search(query){
        try{
            const appos = await Appo.find().or([{email:query}, {cpf:query}])
            console.log(appos)
        }catch(e){
            console.log(e)
        }
    }

    async SendNotification(){
       const appos =  await this.GetAll(false);
       console.log(appos)

       const transporter = mailer.createTransport({  
        host: "smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: "f0b665db70312f",
          pass: "0ba691d2bcc3ed"
        }})
        appos.forEach(async appo =>{
             const date = appo.start.getTime(); 
             const hour = 1000 * 60 * 60;
             const gap = date-Date.now();
             if(gap <= hour){
               if(!appo.notified){
                   await Appo.findByIdAndUpdate(appo.id, {notified:true})
                   transporter.sendMail({
                       from:"Vinicius P <vinicius@guia.com.br>",
                       to:appo.email,
                       subject:"Sua consulta irá acontecer em breve",
                       text:"Olá lembramos que sua consulta foi marcada para hoje. caso já tenha ciência disso por favor desconsidere a mensagem!"
                   }).then(() =>{
                       console.log(`Email enviado ao destinatário com sucesso!`)
                   }).catch((err) =>{
                       console.log(`Email não enviado. Erro=>`, err)
                   })
               }
             }
        })
    }
}

module.exports  = new AppointmentService();