const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const spySchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true    
    },
    password: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    phoneModel: {
        type: String,
        required: true
    }
})

spySchema.pre('save', function(next) {
    const spy = this;
    if(!spy.isModified('password')) {
        return next();
    }

    bcrypt.genSalt(10, (err, salt) => {
        if (err) {
            return next(err)
        }

        bcrypt.hash(spy.password, salt, (err, hash) => {
            if (err) {
                return next(err)
            }
            spy.password = hash;
            next();
        })
    })
})

spySchema.methods.comparePassword = function comparePassword(spyPaswword) {
    const spy = this;
    return new Promise(( resolve, reject) => {
        bcrypt.compare(spyPaswword, spy.password, (err, isMatch) => {
            if(err) {
                return reject(err);
            }

            if(!isMatch) {
                return reject(false);
            }

            resolve(true);
        });
    });
};

mongoose.model('Spy', spySchema);