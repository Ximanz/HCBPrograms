var jwt = require('jwt-simple');
var config = require('../config').init();

module.exports = function (io) {
    io.on('connection', function(socket){
        //temp delete socket from namespace connected map
        delete io.sockets.connected[socket.id];

        var options = {
            secret: config.API_SECRET,
            timeout: 5000 // 5 seconds to send the authentication message
        };

        var auth_timeout = setTimeout(function () {
            socket.disconnect('unauthorized');
        }, options.timeout || 5000);

        var authenticate = function (data) {
            clearTimeout(auth_timeout);

            var decoded = jwt.decode(data.token, options.secret);

            if (decoded == undefined || !decoded.exp) {
                socket.disconnect('unauthorised');
            } else if(decoded.exp <= Date.now()) {
                socket.disconnect('token expired');
            } else {
                //restore temporarily disabled connection
                io.sockets.connected[socket.id] = socket;

                socket.decoded_token = decoded;
                socket.connectedAt = new Date();

                // Disconnect listener
                socket.on('disconnect', function () {
                    console.info('SOCKET [%s] DISCONNECTED', socket.id);
                });

                console.info('SOCKET [%s] CONNECTED', socket.id);
                socket.emit('authenticated');
            }
        };

        socket.on('authenticate', authenticate );
    });
};