const { Router } = require('express');
const AppointmentService = require('./services/AppointmentService');
const schedule = require('node-schedule');
const nodemailer = require('nodemailer');
const routes = Router();



routes.get('/', (req, res) =>{
    return res.render('index.ejs', {})
})
routes.get('/create', (req, res) =>{
    
    return res.render('create.ejs',{})
})

routes.post('/create',async (req, res) =>{
    const result = await AppointmentService.Create(req.body.name, req.body.email, req.body.description, req.body.cpf, req.body.date, req.body.time);
    if(result){
        return res.redirect('/')
    }else {
        return res.status(500).json({error:'Ocorreu um erro!'})
    }

})

routes.get("/event/:id",async (req, res) => {
    const appointment = await AppointmentService.GetById(req.params.id);
    console.log(appointment);
    return res.render("event.ejs",{ appo: appointment});
})

routes.get("/getcalendar", async(req, res)=>{
    const appointments = await AppointmentService.GetAll(false);
    return res.json(appointments)
})

routes.post("/finish", async(req, res)=>{
    const id = req.body.id;
    const result = await AppointmentService.Finish(id);
    return res.redirect('/')
})

routes.get('/list',async(req, res)=>{
    const appos = await AppointmentService.GetAll(true);
    
    return res.render('list.ejs', {index:appos})
})

routes.get("/searchresult", async(req, res) =>{
    const query = req.query.search;
    const appos = await AppointmentService.Search(query);
    return res.render("find.ejs",{appos});
    
})


// const pollTime = 2 * 10000;
// setInterval(async() =>{
//     await AppointmentService.SendNotification();
// }, pollTime)


const job = schedule.scheduleJob('*/1 * * * *', async() =>{
    await AppointmentService.SendNotification();
});


module.exports = routes;