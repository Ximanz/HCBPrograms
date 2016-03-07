var express = require('express');
var scheduleAPI = require('./api/schedule.js');

var router = express.Router();

var auth = require('./auth/auth.js');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('layout', { title: 'HCB Programs' });
});

router.get('/partials/:name', function(req, res) {
  var name = req.params.name;
  res.render('partials/' + name, { title: 'HCB Programs' });
});

/* Handle Login POST */
router.post('/connect', auth.connect);

router.get('/api/schedule', scheduleAPI.readAll);
router.get('/api/schedule/:name', scheduleAPI.readOne);
router.post('/api/schedule', scheduleAPI.createOne);
router.delete('/api/schedule/:name', scheduleAPI.deleteOne);

module.exports = router;