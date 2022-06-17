const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    todos: [
        {
            content: String,
            isDone: Boolean
        }
    ]
});

module.exports = mongoose.model('User', userSchema);