const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const userModel = require('../model/user.model');
require('dotenv').config();

const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.SECRETORKEY
}

passport.use(
    new JwtStrategy(options, (jwtPayload, done) => {
        userModel.findUserById(jwtPayload.id)
            .then((user) => {
                if (user) {
                    return done(null, user)
                } else {
                    return done(null, false)
                }
            })
    })
)


module.exports = passport;