// import dependencies 
const express = require('express')
const passport = require('passport')
const Comment = require('../models/comment')
const Exhibition = require ('../models/exhibition')
const router = express.Router()

const customErrors = require('../../lib/custom_errors')

const handle404 = customErrors.handle404
const requireOwnership = customErrors.requireOwnership
const requireToken = passport.authenticate('bearer', { session: false })
const removeBlanks = require('../../lib/remove_blank_fields')

// POST -> create a comment
// POST /comment/:advId
// make a route the posts all the new comments 
router.post('/comments/:exhibitionId', requireToken, (req,res, next) => {
        //get our comment from req.body
        const comment = req.body.comment
        req.body.comment.owner = req.user.id
        //get our adventureId from req.params.id
        const exhibitionId = req.params.exhibitionId
        //find the adventure
        Exhibition.findById(exhibitionId)
            .then(handle404)
        //push the comment to the comments array
            .then(exhibition => {
                console.log('this is the adventure', exhibition)
                console.log('this is the comment', comment)
                exhibition.comments.push(comment)
                //save the adventure
                return exhibition.save()
            })
        //then we send the adventure as json
            .then(exhibition => res.status(201).json({exhibition: exhibition}))
        //catch errors and send to the handler
            .catch(next)
})

// Delete route for the comments
router.delete('/comments/:exhibitionId/:commId', requireToken, (req,res, next) => {
     // saving both ids to variables for easy ref later
     const commId = req.params.commId
     const exhibitionId = req.params.exhibitionId
     // find the pet in the db
     Exhibition.findById(exhibitionId)
        .populate('comments.owner')
         // if pet not found throw 404
         .then(handle404)
         .then(exhibition => {
             // get the specific subdocument by its id
             const theComment = exhibition.comments.id(commId)
             console.log('this is the comment', theComment)
             // require that the deleter is the owner of the comment
             requireOwnership(req, theComment)
             // call remove on the toy we got on the line above requireOwnership
             theComment.remove()
 
             // return the saved pet
             return exhibition.save()
         })
         // send 204 no content
         .then(() => res.sendStatus(204))
         .catch(next)
})

module.exports = router