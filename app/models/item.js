// import dependecies
const mongoose = require('mongoose')
// just a schema not a model so will use standard syntax
const itemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },    
    description: {
         type: String,
         required: true
    },
    manufacturer: {
        type: Number,
        required: true
    },
    image: {
        type: String,
        required: true
    }
})

module.exports = itemSchema