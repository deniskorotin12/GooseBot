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
    },
    Counter_Goose: {
        type: Number,
        required: false,
        default: 0
    }
})

mongoose.model('persons', PersonSchema)