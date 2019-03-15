var jwt = require('jsonwebtoken');
var config = require('../../config/config');

module.exports = {
    authenticate(req, res, next) {
        jwt.verify(req.headers['token'], config.auth.secretKey, function(err, decoded) {
            if (err) {
                res.json({ status:"error", message: err.message, data:null });
            }else{
                // add user id to request
                // req.body.userId = decoded.id;
                next();
            }
        });
    }
}