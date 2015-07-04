var express = require('express');
var Kanji = require('../models/kanji');

module.exports = function (app, middleware) {
    var apiRouter = express.Router();

    apiRouter.use(middleware);

    apiRouter.route('/kanji')

        // create a kanji
        // (accessed at POST http://localhost:8080/kanji)
        .post(function (req, res) {
            Kanji.findOne(
                {
                    'user': req.user._id,
                    'hiragana': req.body.hiragana,
                    'kanji': req.body.kanji
                },
                function (err, kanji) {
                    var message = 'Kanji updated';
                    if (err) {
                        res.send(err);
                    }

                    if (! kanji) {
                        message = 'Kanji created';
                        kanji = new Kanji();
                    }

                    kanji.user = req.user._id;
                    kanji.kanji = req.body.kanji;
                    kanji.hiragana = req.body.hiragana;
                    kanji.definition = req.body.definition;
                    kanji.translation = req.body.translation;

                    kanji.save(function (err) {
                        if (err) {
                            res.send(err);
                        }

                        res.json({
                            message: message
                        });
                    });

            
                }
            );
        })

        // get all the kanji owned by the user
        // Sun Jun 21 07:50:52 MST 2015 TODO: that need to be reviewed
        // (accessed at GET http://localhost:8080/api/kanji)
        .get(function (req, res) {
            Kanji.find(
                {
                    'user': req.user._id,
                },
                function (err, kanji) {
                    if (err) {
                        res.send(err);
                    }

                    res.json(kanji);
                }
            );
        });

    
    apiRouter.route('/kanji/:kanji_id')

        // get the kanji with that id
        .get(function (req, res) {
            Kanji.findById(req.params.kanji_id, function (err, kanji) {
                if (err) {
                    res.send(err);
                }
                res.json(kanji);
            });
        })

        // update the kanji with this id
        .put(function (req, res) {
            Kanji.findById(req.params.kanji_id, function (err, kanji) {

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

                kanji.save(function (err) {
                    if (err) {
                        res.send(err);
                    }

                    res.json({ message: 'Kanji updated!' });
                });

            });
        })

        // delete the kanji with this id
        .delete(function (req, res) {
            Kanji.findById(req.params.kanji_id, function (err, kanji) {
                if (req.user._id !== kanji.user) {
                    res.send({
                        error: "Cannot delete unowned kanji"
                    });
                    return;
                }

                Kanji.remove({
                    _id: req.params.kanji_id
                }, function (err, kanji) {
                    if (err) {
                        res.send(err);
                    }

                    res.json({ message: 'Successfully deleted' });
                });
            });
        });

    app.use('/api', apiRouter);
};

