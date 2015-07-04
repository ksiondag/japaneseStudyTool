module.exports = function (app, passport) {
    // AUTHENTICATE (FIRST LOGIN)

    // locally
    // LOGIN
    // show the login form
    app.get('/login', function(req, res) {
        res.render('login.ejs', { message: req.flash('loginMessage') });
    });

    // process the login form
    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/japanese/flashcard',
        failureRedirect : '/japanese/login',
        failureFlash : true
    }));

    // SIGNUP
    // show the signup form
    /*
    app.get('/signup', function(req, res) {
        res.render('signup.ejs', { message: req.flash('signupMessage') });
    });

    // process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/japanese/flashcard',
        failureRedirect : '/japanese/signup',
        failureFlash : true
    }));
    */

    // LOGOUT
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/japanese/');
    });

    // PROFILE SECTION
    /*
    app.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile.ejs', {
            user : req.user
        });
    });
    */
};
