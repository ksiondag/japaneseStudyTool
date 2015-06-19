window.onload = function () {
    $('form').submit(function (event) {

        $.ajax(
            '/api/kanji',
            {
                method: 'POST',
                data: {
                    kanji: $('#kanji').val(),
                    hiragana: $('#hiragana').val(),
                    translation: $('#english').val()
                },
                success: function (data) {
                    console.log(data);
                }
            }
        );

        $('#kanji').val('');
        $('#hiragana').val('');
        $('#english').val('');
    });
};
