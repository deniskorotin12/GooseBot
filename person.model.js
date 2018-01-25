const mongoose = require('mongoose')
const Schema = mongoose.Schema

const PersonSchema = new Schema({
    Name: {
        type: String,
        required: true
    },
    Identificator: {
        type: Number,
        required: true
    }
})

mongoose.model('persons', PersonSchema)