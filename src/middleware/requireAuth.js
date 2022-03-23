const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Spy = mongoose.model('Spy');


module.exports = (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization) return res.status(401).send({ error: 'You must be logged in.' })

    const token = authorization.replace('Bearer ', '');

    jwt.verify(token, 'SPYWARETRACKER', async (err, payload) => {
        if (err) return res.status(401).send({ error: 'You must be logged in.' })

        const { spyId } = payload;

        const spy = await Spy.findById(spyId);
        req.spy = spy;
        next();
    })
}