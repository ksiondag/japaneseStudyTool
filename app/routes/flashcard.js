var express = require('express');

module.exports = function (app, middleware) {
    var flashcardRouter = express.Router();

    // autheticate the user for all flashcard requests
    flashcardRouter.use(middleware);

    flashcardRouter.get('/', function(req, res) {
        res.redirect('/japanese/flashcard/spaced-repetition');
    });
    
    // SPACED-REPETITION SECTION
    flashcardRouter.get('/spaced-repetition', function(req, res) {
        res.render('spaced-repetition.ejs');
    });

    // CREATE-FLASHCARD SECTION
    flashcardRouter.get('/create', function(req, res) {
        res.render('create-flashcard.ejs');
    });
    
    app.use('/flashcard', flashcardRouter);
};

