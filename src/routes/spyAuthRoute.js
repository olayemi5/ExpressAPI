const express = require('express')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const Spy = mongoose.model('Spy')

const router = express.Router()

router.post('/spy-signup',  async (req, res) => {

    const { email, password, phoneNumber, phoneModel } = req.body 

    if(!email || !password || !phoneNumber || !phoneModel) return res.status(400).send('All feilds are required!');

    try {

        const existingSpy = await Spy.findOne({ email })

        if(existingSpy === null) {
            const spy = new Spy({  email, password, phoneNumber, phoneModel })
            await spy.save();

            const token = jwt.sign({ userId: spy._id }, 'SPYWARETRACKER')
            res.send({ token, spyId: spy._id });
        }
        else
        {
            return res.status(409).send('This email as already been used');
        }

        
    } catch (err) {
       return res.status(422).send(err.message)
    }
})

router.post('/spy-signin', async (req, res) => {
    const { email, password } = req.body;

    if(!email || !password) {
        return res.status(422).send({error: 'All feilds are required' });
    }

    const spy = await Spy.findOne({ email })

    if(!spy) {
        return res.status(400).send({error: 'Incorrect email or password'})
    }

    try {
        await spy.comparePassword(password) 
        const token = jwt.sign({ spyId: spy._id }, 'SPYWARETRACKER')
        res.send({ token , spyId: spy._id })
    } 
    catch (error) {
        return res.status(400).send({error: 'Incorrect email or password'})
    }
})

module.exports = router;