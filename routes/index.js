var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('layout', { title: 'HCB Programs' });
});

router.get('/partials/:name', function(req, res) {
  var name = req.params.name;
  res.render('partials/' + name, { title: 'HCB Programs' });
});

module.exports = router;