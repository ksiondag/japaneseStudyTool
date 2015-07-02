var express = require('express');

module.exports = function(app, passport) {
    // normal routes

    // show the home page (will also have our login links)
    app.get('/', function(req, res) {
        res.render('index.ejs');
    });

    // user stuff
    require('./routes/user.js')(app, passport);

    // api routes
    require('./routes/api.js')(app, isLoggedIn);

    // flashcard routes
    require('./routes/flashcard.js')(app, isLoggedIn);

    // public (static) routes
    app.use('/', express.static('public'));
};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/login');
}

