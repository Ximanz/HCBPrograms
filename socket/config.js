var jwt = require('jwt-simple');
var config = require('../config').init();

module.exports = function (io) {
    var _schedule = "";
    var _timerSettings = "";

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

            if (!data.token || data.token.length == 0) {
                socket.disconnect('missing token');
                return;
            }

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

        socket.on('chat message', function(chatMessage) {
            io.emit('chat message', chatMessage);
        });

        socket.on('update schedule', function(schedule) {
            _schedule = schedule;
            socket.broadcast.emit('update schedule', _schedule);
        });

        socket.on('get schedule', function() {
            io.to(socket.id).emit('update schedule', _schedule);
        });

        socket.on('update timer', function(timerSettings) {
            _timerSettings = timerSettings;
            socket.broadcast.emit('update timer', _timerSettings)
        });

        socket.one('get timer', function() {
            io.to(socket.id).emit('update timer', _timerSettings)
        });
    });
};