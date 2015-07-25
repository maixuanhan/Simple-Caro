// update UI the list of games:
function addGame(jqList, game) {
    var gameColor = 'deep-purple lighten-5';
    var gameName = 'Room ' + game.room;
    var readyCount = 0;
    for (var i = 0; i < game.players.length; i++) {
        if (game.players[i].ready)
            readyCount++;
    }
    if (readyCount >= 2) {
        gameColor = 'purple darken-2 white-text';
    }
    else if (game.players.length > 0) {
        gameColor = 'yellow lighten-2';
    }
    var jqGame = $('<div></div>').addClass('card-panel ' + gameColor).css({ 'position': 'relative' }).html(gameName);
    if (game.players.length > 0) {
        jqGame.append($('<div></div>').addClass('caro-user-stat right').html(game.players.length + ((game.players.length > 1) ? ' users' : ' user')+((readyCount>=2) ? '<br/>Playing...' : '')));
    }
    var jqGameWrapper = $('<div></div>').addClass('waves-effect waves-light col s12 m6 l4 caro-game-item-wrapper').css({ 'padding': 0 }).data({ 'id': game.id }).click(function (event) {
        var game_id = $(this).data('id');
        location.href = '/game/' + game_id;
    }).append(jqGame);
    jqList.append(jqGameWrapper);
}

// load the games:
$.post('/get-all-games', null, function (data, status, jqXHR) {
    $('#sec-loader').hide();
    if (status === 'success') {
        if (data !== null && data.ok == true) {
            var jqGameList = $('#sec-game-list > .caro-container');
            for (i = 0; i < data.games.length; i++) {
                addGame(jqGameList, data.games[i]);
            }
        }
    }
});

// create a game:
$('#btn-create-game').click(function () {
    $('#modal1').openModal({
        'dismissible': false,
        'ready': function () {
            $('#ip-name').focus();
        },
        'complete': function (){
            $('#frm-new-game')[0].reset();
        }
    });
});

$('#btn-join-ran-game').click(function () {
    $.post('/get-ran-game', null, function (data, status, jqXHR) {
        if (status === 'success') {
            if (data !== null && data.ok == true) {
                var game_id = data.game.id;
                location.href = '/game/' + game_id;
            }
        }
    });
});

// DOCUMENT ready:
$(document).ready(function () {
    $('select').material_select();
});

// submit form create a game on clicking CREATE button:
$('#btn-submit-frm').click(function () {
    $('#frm-new-game').submit();
});

// handle for submit event:
$('#frm-new-game').submit(function (event) {
    var name = $.trim($('#ip-name').val());
    if (name === '' || name.length > 30) {
        alert('Name cannot be blank or longer than 30 characters.');
        $('#ip-name').focus();
        event.preventDefault();
    }
});