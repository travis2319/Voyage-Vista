const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const {
    auth
} = require('express-openid-connect');

const config = {
    authRequired: false,
    auth0Logout: true,
    secret: 'a long, randomly-generated string stored in env',
    baseURL: 'http://localhost:3000',
    clientID: 'vLlBz7Xv983pUECdeDGDv2AsUGc0O1ZG',
    issuerBaseURL: 'https://dev-qzl1f8xmx7vyyrek.us.auth0.com'
};

const app = express();

// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(config));
app.set('view engine', 'ejs')
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({
    extended: true
}));

// const user= require('./Models/userModel')

const url = "mongodb+srv://travisdev:Gold2327@cluster0.bb4roea.mongodb.net/booking_Database?retryWrites=true&w=majority"
mongoose.connect(url);

const userSchema = {
    name: String,
    email: String,
    location: String,
    destination: String,
    date: Date,
    time: String,
    service: String
}
const User = mongoose.model('User', userSchema);

// req.isAuthenticated is provided from the auth router
app.get('/auth', (req, res) => {
    res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
});

app.get('/', async (req, res) => {
    const isAuth = await req.oidc.isAuthenticated();
    console.log(isAuth);
    res.render('home', {
        isAuth
    })
})

app.get('/display', async (req, res) => {

    const currentUserEmail = await req.oidc.user.email;
    console.log(currentUserEmail);
    const data = await User.find({
        email: currentUserEmail
    });
    res.render('display', {
        data
    });
    // Render the EJS template with the data

})
app.get('/input', (req, res) => {
    res.render('input')
})


app.post('/submit', (req, res) => {
    const {
        name,
        location,
        destination,
        date,
        time,
        service
    } = req.body;
    const auth0Email = req.oidc.user.email;
    const newBooking = new User({
        name: name,
        email: auth0Email,
        location: location,
        destination: destination,
        date: date,
        time: time,
        service: service
    })

    newBooking.save();
    console.log("form submitted");
    res.redirect('/')
})

async function deleteAll() {
    const result = await User.deleteMany({});
    console.log(`${result.deletedCount} documents deleted successfully`);
    mongoose.connection.close();

}

app.get('/deleteAll', (req, res) => {
    deleteAll(res);
    res.redirect('/')
})

app.listen(3000, () => {
    console.log("server running on port 3000 and live on http://localhost:3000/");
})