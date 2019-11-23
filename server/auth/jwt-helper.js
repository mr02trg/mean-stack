const jwt = require('jsonwebtoken');

_jwtOptions = {
    issuer: "i",
    subject: "s", 
    audience: "a"
};

privateKEY = "MY_DARKEST_SECRET";

function sign (payload) {
     // Token signing options
    var signOptions = {
        issuer:  _jwtOptions.issuer,
        subject:  _jwtOptions.subject,
        audience:  _jwtOptions.audience,
        expiresIn:  "1h"
    };
    return jwt.sign(payload, privateKEY, signOptions);
};

function verify (token) {
    var verifyOptions = {
        issuer:  _jwtOptions.issuer,
        subject:  _jwtOptions.subject,
        audience:  _jwtOptions.audience,
        expiresIn:  "1h"
    };

    try{
        return jwt.verify(token, privateKEY, verifyOptions);
    } catch (err) {
        return false;
    }
}

function decode (token) {
    return jwt.decode(token, { complete: true });
}

module.exports = {
    sign,
    verify,
    decode
}