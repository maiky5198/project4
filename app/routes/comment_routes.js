// import dependencies 
const express = require('express')
const passport = require('passport')
const Comment = require('../models/comment')
const Adventure = require ('../models/adventure')
const router = express.Router()

const customErrors = require('../../lib/custom_errors')

const handle404 = customErrors.handle404
const requireOwnership = customErrors.requireOwnership
const requireToken = passport.authenticate('bearer', { session: false })
const removeBlanks = require('../../lib/remove_blank_fields')

// POST -> create a comment
// POST /comment/:advId
// make a route the posts all the new comments 
router.post('/comments/:adventureId', requireToken, (req,res, next) => {
        //get our comment from req.body
        const comment = req.body.comment
        req.body.comment.owner = req.user.id
        //get our adventureId from req.params.id
        const adventureId = req.params.adventureId
        //find the adventure
        Adventure.findById(adventureId)
            .then(handle404)
        //push the comment to the comments array
            .then(adventure => {
                console.log('this is the adventure', adventure)
                console.log('this is the comment', comment)
                adventure.comments.push(comment)
                //save the adventure
                return adventure.save()
            })
        //then we send the adventure as json
            .then(adventure => res.status(201).json({adventure: adventure}))
        //catch errors and send to the handler
            .catch(next)
})

// Delete route for the comments
router.delete('/comments/:adventureId/:commId', requireToken, (req,res, next) => {
     // saving both ids to variables for easy ref later
     const commId = req.params.commId
     const adventureId = req.params.adventureId
     // find the pet in the db
     Adventure.findById(adventureId)
        .populate('comments.owner')
         // if pet not found throw 404
         .then(handle404)
         .then(adventure => {
             // get the specific subdocument by its id
             const theComment = adventure.comments.id(commId)
             console.log('this is the comment', theComment)
             // require that the deleter is the owner of the comment
             requireOwnership(req, theComment)
             // call remove on the toy we got on the line above requireOwnership
             theComment.remove()
 
             // return the saved pet
             return adventure.save()
         })
         // send 204 no content
         .then(() => res.sendStatus(204))
         .catch(next)
})

module.exports = router