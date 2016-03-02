var jwt = require('jwt-simple');
var config = require('../../config').init();

module.exports = function(req, res, next) {
    var token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['x-access-token'];

    if (token) {
        try {
            var decoded = jwt.decode(token, config.API_SECRET);

            if (decoded.exp <= Date.now()) {
                res.status(400);
                res.json({ "status": 400, "messages": [{ "type": "error", "content": "Token expired" }] });
                return;
            }

            next(); // To move to next middleware

        } catch (err) {
            res.status(500);
            res.json({ "status": 500, "messages": [{ "type": "exception", "content": err }] });
        }
    } else {
        res.status(401);
        res.json({ "status": 401, "messages": [{ "type": "error", "content": "Invalid Token or Key" }] });
    }
};