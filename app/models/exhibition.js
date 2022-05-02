const mongoose = require('mongoose')
const itemSchema = require('./item')
const commentSchema = require('./comment')

const { Schema, model } = mongoose

const exhibitionSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		type: {
			type: String,
			required: true,
		},	
		description: {
				type: String,
				required: true,	
		},
		item: [itemSchema],
		comments: [commentSchema],
        owner: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
	},
	{
		timestamps: true,
	}
)

module.exports = mongoose.model('Exhibition', exhibitionSchema)
