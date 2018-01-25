const mongoose = require('mongoose')
const Schema = mongoose.Schema

const dateSchema = new Schema({
    getDate: {
        type: Number,
        required: true
    },
    current_goose: {
        type: String,
        required: false
    }
})

mongoose.model('get_date', dateSchema)