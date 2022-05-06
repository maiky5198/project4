const express = require('express')
const passport = require('passport')

const Exhibition = require('../models/exhibition')

const customErrors = require('../../lib/custom_errors')
const handle404 = customErrors.handle404

const requireOwnership = customErrors.requireOwnership
const requireToken = passport.authenticate('bearer', {session: false})

const removeBlanks = require('../../lib/remove_blank_fields')
const { handle } = require('express/lib/application')

const router = express.Router()

//ROUTES GO HERE

//POST -> create item
//POST /item/<exhibition_id>
router.post('/item/:exhibitionId', requireToken, (req, res, next)=>{
    //get our item from req.body
    const item = req.body.item
    //get our exhibitionId from req.params.id
    const exhibitionId = req.params.exhibitionId
    //find the exhibition
    Exhibition.findById(exhibitionId)
        .then(handle404)
    //push the item to the item array
        .then(exhibition => {
            console.log('this is the exhibition', exhibition)
            console.log('this is the item', item)
            requireOwnership(req, exhibition)
            exhibition.item.push(item)
            //save the exhibition
            return exhibition.save()
        })
    //then we send the exhibition as json
        .then(exhibition => res.status(201).json({exhibition: exhibition}))
    //catch errors and send to the handler
        .catch(next)
})
// //PATCH -> update a piece of item
//PATCH /item/<exhibition_id>/<item_id>
router.patch('/item/:exhibitionId/:itemId', requireToken, removeBlanks, (req, res, next)=>{
    const itemId = req.params.itemId
    const exhibitionId = req.params.exhibitionId

    Exhibition.findById(exhibitionId)
        .then(handle404)
        .then(exhibition => {
            const theItem = exhibition.item.id(itemId)
            console.log('this is the original item')
            requireOwnership(req, exhibition)
            theItem.set(req.body.item)
            return exhibition.save()
        })
        .then(()=> res.sendStatus(204))
        .catch(next)
})
//DELETE -> delete a piece of item
//DELETE /item/<exhibition_id>/<item_id>
router.delete('/item/:exhibitionId/:itemId', requireToken, (req, res, next)=>{
    const itemId = req.params.itemId
    const exhibitionId = req.params.exhibitionId
    //find the exhibition in the database
    Exhibition.findById(exhibitionId)
        //if exhibition not found 404
        .then(handle404)
        .then(exhibition => {
            //get the subdocument by its id
            const theItem =  exhibition.item.id(itemId)
            //require that the deleter is the owner of the exhibition
            requireOwnership(req, exhibition)
            //call remove on the item we got on the line above requireOwnership
            theItem.remove()
            //return the saved exhibition
            return exhibition.save()
        })
        //send 204 no content
        .then(() => res.sendStatus(204))
        .catch(next)
})




module.exports = router