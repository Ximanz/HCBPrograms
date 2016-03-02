function init() {
    var vars = [
        "MONGOLAB_URI",
        "API_SECRET",
        "PASSWORD"
    ];

    var config = {};
    var fileConfig = {};
    try {
        fileConfig = require('./.config/configVars.js');
    } catch(e) {}


    vars.forEach(function(el) {
        config[el] = process.env[el];
        if (fileConfig[el]) { config[el] = fileConfig[el]; }
    });

    return config;
}

exports.init = init;