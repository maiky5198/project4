/////////////////////////////////
// import dependencies
/////////////////////////////////
const mongoose = require('mongoose')
const { Schema, model } = mongoose


// here's an alternate syntax for creating a schema
// reminder: we do not need a model for a subdocument
// all we need is a schema 
const commentSchema = new mongoose.Schema({
    note: {
        type: String,
        required: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
})

module.exports = commentSchema