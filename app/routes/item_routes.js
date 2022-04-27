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

//POST -> create gear
//POST /gear/<adventure_id>
router.post('/item/:exhibitionId', requireToken, (req, res, next)=>{
    //get our gear from req.body
    const item = req.body.item
    //get our adventureId from req.params.id
    const exhibitionId = req.params.exhibitionId
    //find the adventure
    Exhibition.findById(exhibitionId)
        .then(handle404)
    //push the gear to the gear array
        .then(exhibition => {
            console.log('this is the adventure', exhibition)
            console.log('this is the gear', item)
            requireOwnership(req, exhibition)
            exhibition.item.push(item)
            //save the adventure
            return exhibition.save()
        })
    //then we send the adventure as json
        .then(exhibition => res.status(201).json({exhibition: exhibition}))
    //catch errors and send to the handler
        .catch(next)
})
// //PATCH -> update a piece of gear
//PATCH /gear/<adventure_id>/<gear_id>
router.patch('/gear/:exhibitionId/:itemId', requireToken, removeBlanks, (req, res, next)=>{
    const itemId = req.params.itemId
    const exhibitionId = req.params.exhibitionId

    Exhibition.findById(exhibitionId)
        .then(handle404)
        .then(exhibition => {
            const theItem = exhibition.item.id(itemId)
            console.log('this is the original gear')
            requireOwnership(req, exhibitions)
            theItem.set(req.body.gear)
            return exhibition.save()
        })
        .then(()=> res.sendStatus(204))
        .catch(next)
})
//DELETE -> delete a piece of gear
//DELETE /gear/<adventure_id>/<gear_id>
router.delete('/gear/:exhibitionId/:itemId', requireToken, (req, res, next)=>{
    const itemId = req.params.itemId
    const exhibitionId = req.params.exhibitionId
    //find the adventure in the database
    Exhibition.findById(exhibitionId)
        //if adventure not found 404
        .then(handle404)
        .then(exhibition => {
            //get the subdocument by its id
            const theItem =  exhibition.item.id(itemId)
            //require that the deleter is the owner of the adventure
            requireOwnership(req, exhibition)
            //call remove on the gear we got on the line above requireOwnership
            theItem.remove()
            //return the saved adventure
            return exhibition.save()
        })
        //send 204 no content
        .then(() => res.sendStatus(204))
        .catch(next)
})




module.exports = router