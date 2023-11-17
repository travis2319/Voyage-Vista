const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')

const app = express();

app.set('view engine','ejs')
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));

// const user= require('./Models/userModel')

const url="mongodb+srv://travisdev:Gold2327@cluster0.bb4roea.mongodb.net/booking_Database?retryWrites=true&w=majority"
mongoose.connect(url);

const userSchema={
    name: String,
    email: String,
    location: String,
    destination: String,
    date: Date,
    time: String,
    service: String
}
const User=mongoose.model('User',userSchema);


app.get('/',(req,res)=>{
    res.render('home')
})

app.get('/display', async(req,res)=>{
    const data = await User.find();

  // Render the EJS template with the data
  res.render('display', { data });
})
app.get('/input',(req,res)=>{
    res.render('input')
})


app.post('/submit',(req,res)=>{
    const {name,email,location,destination,date,time,service} = req.body;
    
    const newBooking = new User({
        name:name,
        email:email,
        location:location,
        destination:destination,
        date: date,
        time:time,
        service:service
    })


    // user.insertOne(booking, (err, result) => {
    //     if (err) {
    //       console.error('Error inserting document:', err);
    //       res.status(500).send('Error submitting booking');
    //       return;
    //     }
    //     console.log('Booking submitted successfully');
    //     res.send('Booking submitted successfully');
    //   });
    // console.log('form submitted');

    newBooking.save();
      console.log("form submitted");
      res.redirect('/')
})

async function deleteAll() {
      const result = await User.deleteMany({});
console.log(`${result.deletedCount} documents deleted successfully`);
mongoose.connection.close();
    
}

app.get('/deleteAll',(req,res)=>{
    deleteAll(res);
    res.redirect('/')
})

app.listen(3000,()=>{
    console.log("server running on port 3000 and live on http://localhost:3000/");
})