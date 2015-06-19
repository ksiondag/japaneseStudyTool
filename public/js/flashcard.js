window.onload = function () {
    var shuffle = function (array) {
        var counter = array.length, temp, index;

        // While there are elements in the array
        while (counter > 0) {
            // Pick a random index
            index = Math.floor(Math.random() * counter);

            // Decrease counter by 1
            counter--;

            // And swap the last element with it
            temp = array[counter];
            array[counter] = array[index];
            array[index] = temp;
        }

        return array;
    };

    $.getJSON('/api/kanji', function (data) {
        var index = 0;

        data = shuffle(data);

        data = data.filter(function (kanji) {
            if ((new Date(kanji.review)).getTime() <= Date.now()) {
                return true;
            }
            return false;
        });

        console.log(data);
        
        if (data.length) {
            $('#flashcard').html(data[index].translation);
        } else {
            $('#flashcard').html('Maybe you should add some more flashcards!');
        }

        $('#success').click(function () {
            $.ajax(
                '/api/kanji/' + data[index]._id,
                {
                    data: {
                        remembered: true
                    },
                    method: 'PUT',
                    success: function (data) {
                        console.log(data);
                    }
                }
            );

            index = index + 1;

            if (index >= data.length) {
                $('#flashcard').html('Out of cards! Refresh the page!');
            } else {
                $('#flashcard').html(data[index].translation);
            }
        });

        $('#failure').click(function () {
            $.ajax(
                '/api/kanji/' + data[index]._id,
                {
                    method: 'PUT',
                    success: function (data) {
                        console.log(data);
                    }
                }
            );

            index = index + 1;

            if (index >= data.length) {
                $('#flashcard').html('Out of cards! Refresh the page!');
            } else {
                $('#flashcard').html(data[index].translation);
            }
        });
        
        $('#english').click(function () {
            $('#flashcard').html(data[index].translation);
        });
        $('#hiragana').click(function () {
            $('#flashcard').html(data[index].hiragana);
        });
        $('#kanji').click(function () {
            $('#flashcard').html(data[index].kanji);
        });
    });
};
