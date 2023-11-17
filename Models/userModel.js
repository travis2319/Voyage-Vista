const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
        name: String,
        email: String,
        date: Date,
        comments: String
})

module.exports = mongoose.model('user',userSchema);