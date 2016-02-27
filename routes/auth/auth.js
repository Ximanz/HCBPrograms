var jwt = require('jwt-simple');
var bcrypt   = require('bcrypt-nodejs');
var config = require('../../config').init();

var auth = {
    connect: function(req, res) {
        if (!req.body.screenName || !req.body.password) { // If authentication fails, we send a 401 back
            res.status(401);
            res.json({
                "status": 401,
                "message": "Unable to connect"
            });
            return;
        }

        if (bcrypt.compareSync(req.body.password, bcrypt.hashSync(config.PASSWORD, bcrypt.genSaltSync(8), null))) {
            // If authentication is success, we will generate a token
            // and dispatch it to the client
            res.json(genToken({ screenName: req.body.screenName }));
        }
    }
};

// private method
function genToken(user) {
    var expires = expiresIn(3); // 7 days
    var token = jwt.encode({
        exp: expires
    }, config.API_SECRET);

    return {
        token: token,
        expires: expires,
        user: user
    };
}

function expiresIn(numDays) {
    var dateObj = new Date();
    return dateObj.setDate(dateObj.getDate() + numDays);
}

module.exports = auth;