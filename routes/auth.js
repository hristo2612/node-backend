var jwt = require('express-jwt');
var secret = require('../config').secret;

function getTokenFromHeader(req) {
    var splitAuth = req.headers.authorization.split(' ');
    if (req.headers.authorization && splitAuth[0] === 'Token') {
        return splitAuth[1];
    }
    
    return null;
}

var auth = {
    required: jwt({
        secret: secret,
        userProperty: 'payload',
        getToken: getTokenFromHeader
    }),
    optional: jwt({
        secret: secret,
        userProperty: 'payload',
        credentialsRequired: false,
        getToken: getTokenFromHeader
    })
};

module.exports = auth;