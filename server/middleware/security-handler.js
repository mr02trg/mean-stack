const jwtHelper = require('../auth/jwt-helper');

module.exports = (req, res, next) => {
    try {
        // console.log(req.headers);
        const token = req.headers.authorization.split(' ')[1];
        jwtHelper.verify(token);
        req.userId = jwtHelper.decode(token).payload.id;
        req.roleType = jwtHelper.decode(token).payload.roleType;
        next();
    }
    catch (err) {
        res.status(401).json({
            message: 'Failed to authorize'
        })
    }
}