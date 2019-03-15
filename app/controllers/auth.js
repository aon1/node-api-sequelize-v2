const jwt = require('jsonwebtoken');
const config = require('../../config/config');

const { User } = require('../models');

module.exports = {
	login(req, res, next) {
        return User.findOne({ where: { email: req.body.email }})
            .then(userInfo => {
                if(userInfo) {
                    // if(bcrypt.compareSync(req.body.password, userInfo.password)) {
                    if(req.body.password, userInfo.password) {
                        const token = jwt.sign({ id: userInfo.id}, config.auth.secretKey, { expiresIn: '1h' });
                        res.json({ status:"success", message: "user found!!!", data: { user: userInfo, token: token }});
                    }else{
                        res.json({ status:"error", message: "Invalid email/password!!!", data:null });
                    }
                }
            });
        }
}