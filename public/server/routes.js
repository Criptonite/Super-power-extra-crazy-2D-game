let express = require('express');
let router = express.Router();

router.get('/supergame', (req, res, next) => {
    res.render('index');
    next();
});

module.exports = router;