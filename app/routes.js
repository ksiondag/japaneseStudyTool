var express = require('express');
var Kanji     = require('./models/kanji');

module.exports = function(app, passport) {
    var flashcardRouter,
        apiRouter;

// normal routes ==============================================================

    // show the home page (will also have our login links)
    app.get('/', function(req, res) {
        res.render('index.ejs');
    });

    // PROFILE SECTION =========================
    /*
    app.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile.ejs', {
            user : req.user
        });
    });
    */

    // LOGOUT ==============================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });


// api routes ===============================================================
    apiRouter = express.Router();

    apiRouter.use(isLoggedIn);

    apiRouter.route('/kanji')

        // create a kanji
        // (accessed at POST http://localhost:8080/kanji)
        .post(function(req, res) {
            
            var kanji = new Kanji();
            kanji.user = req.user._id;
            kanji.kanji = req.body.kanji;
            kanji.hiragana = req.body.hiragana;
            kanji.definition = req.body.definition;
            kanji.translation = req.body.translation;

            kanji.save(function(err) {
                if (err) {
                    res.send(err);
                }

                res.json({ message: 'Kanji created!' });
            });

            
        })

        // get all the kanji owned by the user
        // (accessed at GET http://localhost:8080/api/kanji)
        .get(function(req, res) {
            Kanji.find(
                {
                    'user': req.user._id
                },
                function(err, kanji) {
                    if (err) {
                        res.send(err);
                    }

                    res.json(kanji);
                }
            );
        });

    apiRouter.route('/kanji/:kanji_id')

        // get the kanji with that id
        .get(function(req, res) {
            Kanji.findById(req.params.kanji_id, function(err, kanji) {
                if (err) {
                    res.send(err);
                }
                res.json(kanji);
            });
        })

        // update the kanji with this id
        .put(function(req, res) {
            Kanji.findById(req.params.kanji_id, function(err, kanji) {

                if (err) {
                    res.send(err);
                }

                if (req.user._id !== kanji.user) {
                    res.send({
                        error: "Cannot modify unowned kanji"
                    });
                    return;
                }

                kanji.kanji = req.body.kanji || kanji.kanji;
                kanji.hiragana = req.body.hiragana || kanji.hiragana;
                kanji.definition = req.body.definition || kanji.definition;
                kanji.translation = req.body.translation || kanji.translation;

                if (req.body.remembered) {
                    kanji.review = new Date(Date.now() + kanji.spacing);
                    kanji.spacing *= 2;
                } else {
                    kanji.review = new Date(Date.now());
                    kanji.spacing = 24*60*60*1000;
                }

                kanji.save(function(err) {
                    if (err) {
                        res.send(err);
                    }

                    res.json({ message: 'Kanji updated!' });
                });

            });
        })

        // delete the kanji with this id
        .delete(function(req, res) {
            Kanji.findById(req.params.kanji_id, function(err, kanji) {
                if (req.user._id !== kanji.user) {
                    res.send({
                        error: "Cannot delete unowned kanji"
                    });
                    return;
                }

                Kanji.remove({
                    _id: req.params.kanji_id
                }, function(err, kanji) {
                    if (err) {
                        res.send(err);
                    }

                    res.json({ message: 'Successfully deleted' });
                });
            });
        });
    app.use('/api', apiRouter);

// flashcard routes ===========================================================
    flashcardRouter = express.Router();

    // autheticate the user for all flashcard requests
    flashcardRouter.use(isLoggedIn);

    flashcardRouter.get('/', isLoggedIn, function(req, res) {
        res.redirect('/flashcard/spaced-repetition');
    });
    
    // SPACED-REPETITION SECTION =========================
    flashcardRouter.get('/spaced-repetition', isLoggedIn, function(req, res) {
        res.render('spaced-repetition.ejs');
    });

    // CREATE-FLASHCARD SECTION =========================
    flashcardRouter.get('/create', isLoggedIn, function(req, res) {
        res.render('create-flashcard.ejs');
    });
    
    app.use('/flashcard', flashcardRouter);

// public (static) routes =====================================================
    app.use('/', express.static('public'));

// ============================================================================
// AUTHENTICATE (FIRST LOGIN) =================================================
// ============================================================================

    // locally --------------------------------
        // LOGIN ===============================
        // show the login form
        app.get('/login', function(req, res) {
            res.render('login.ejs', { message: req.flash('loginMessage') });
        });

        // process the login form
        app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/flashcard',
            failureRedirect : '/login',
            failureFlash : true
        }));

        // SIGNUP =================================
        // show the signup form
        app.get('/signup', function(req, res) {
            res.render('signup.ejs', { message: req.flash('signupMessage') });
        });

        // process the signup form
        app.post('/signup', passport.authenticate('local-signup', {
            successRedirect : '/flashcard',
            failureRedirect : '/signup',
            failureFlash : true
        }));

};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/login');
}

