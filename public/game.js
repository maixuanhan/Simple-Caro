/* GAME.JS */
/* Han Mai */

// CAROBOARD Type:
var CaroBoard = function () {
    this.rows = 15;
    this.columns = 15;
    this.matrix = [];
    this.initBoard();
    this.jqTable = null;
};

CaroBoard.prototype.initBoard = function () {
    this.matrix = new Array(this.rows);
    for (var i = 0; i < this.rows; i++) {
        this.matrix[i] = new Array(this.columns);
        for (var j = 0; j < this.columns; j++)
            this.matrix[i][j] = '';
    }
};

CaroBoard.prototype.setBoardSize = function (row, column) {
    this.rows = row;
    this.columns = column;
    this.initBoard();
};

CaroBoard.prototype.isValidCell = function (row, column) {
    return (row >= 0 && row < this.rows && column >= 0 && column < this.columns);
};

CaroBoard.prototype.canSetAMove = function (row, column, char) {
    if (this.isValidCell(row, column) && this.matrix[row][column] === '') {
        if (this.jqTable !== null) {
            //draw:
            var jqCell = this.jqTable.find('[data-row=' + row + '][data-column=' + column + ']');
            if (jqCell.find('span').length > 0)
                return false;
            jqCell.append($('<span></span>').html(char).addClass('caro-temp'));
        }
        return true;
    }
    return false;
}

CaroBoard.prototype.setAMove = function (row, column, char, delay) {
    var _delay = 0;
    if (typeof (delay) === 'number') {
        _delay = delay;
    }
    if (this.isValidCell(row, column) && this.matrix[row][column] === '') {
        this.matrix[row][column] = char;
        if (this.jqTable !== null) {
            //draw:
            var jqCell = this.jqTable.find('[data-row=' + row + '][data-column=' + column + ']');
            this.jqTable.find('.caro-temp').remove();
            this.jqTable.find('.caro-win').removeClass('caro-win');
            jqCell.append($('<span></span>').html(char).css({'display':'none'})).addClass('caro-win caro-' + char);
            jqCell.off('click');
            setTimeout(function () {
                jqCell.find('span').show('fast');
            }, delay);
        }
        return true;
    }
    return false;
};

CaroBoard.prototype.checkWin = function (row, column, char) {
    var results = [];
    var tempArr = [];
    var blockedHead = false;
    var blockedTail = false;
    var count = 0;
    
    if (!this.isValidCell(row, column) || char === '')
        return results;
    
    // check for the HORIZONTAL line
    for (var i = column; i >= 0; i--) {
        var current = this.matrix[row][i];
        if (current === char) {
            count++;
            tempArr.push({ 'row': row, 'column': i });
        }
        else if (current !== '') {
            blockedHead = true;
            break;
        }
        else
            break;
    }
    for (var i = column + 1; i < this.columns; i++) {
        var current = this.matrix[row][i];
        if (current === char) {
            count++;
            tempArr.push({ 'row': row, 'column': i });
        }
        else if (current !== '') {
            blockedTail = true;
            break;
        }
        else
            break;
    }
    if ((count == 5 && !(blockedHead && blockedTail))) {
        results = results.concat(tempArr);
    }
    
    // check for the VERTICAL line
    tempArr = [];
    blockedHead = false;
    blockedTail = false;
    count = 0;
    for (var i = row; i >= 0; i--) {
        var current = this.matrix[i][column];
        if (current === char) {
            count++;
            tempArr.push({ 'row': i, 'column': column });
        }
        else if (current !== '') {
            blockedHead = true;
            break;
        }
        else
            break;
    }
    
    for (var i = row + 1; i < this.rows; i++) {
        var current = this.matrix[i][column];
        if (current === char) {
            count++;
            tempArr.push({ 'row': i, 'column': column });
        }
        else if (current !== '') {
            blockedTail = true;
            break;
        }
        else
            break;
    }
    if ((count == 5 && !(blockedHead && blockedTail))) {
        results = results.concat(tempArr);
    }
    
    // check for the DIAGONAL line
    tempArr = [];
    blockedHead = false;
    blockedTail = false;
    count = 0;
    for (var i = row, j = column; i >= 0 && j >= 0; i--, j--) {
        var current = this.matrix[i][j];
        if (current === char) {
            count++;
            tempArr.push({ 'row': i, 'column': j });
        }
        else if (current !== '') {
            blockedHead = true;
            break;
        }
        else
            break;
    }
    for (var i = row + 1, j = column + 1; i < this.rows && j < this.columns; i++, j++) {
        var current = this.matrix[i][j];
        if (current === char) {
            count++;
            tempArr.push({ 'row': i, 'column': j });
        }
        else if (current !== '') {
            blockedTail = true;
            break;
        }
        else
            break;
    }
    if ((count == 5 && !(blockedHead && blockedTail))) {
        results = results.concat(tempArr);
    }
    
    // check for the back DIAGONAL line
    tempArr = [];
    blockedHead = false;
    blockedTail = false;
    count = 0;
    for (var i = row, j = column; i >= 0 && j < this.columns; i--, j++) {
        var current = this.matrix[i][j];
        if (current === char) {
            count++;
            tempArr.push({ 'row': i, 'column': j });
        }
        else if (current !== '') {
            blockedHead = true;
            break;
        }
        else
            break;
    }
    for (var i = row + 1, j = column - 1; i < this.rows && j >= 0; i++, j--) {
        var current = this.matrix[i][j];
        if (current === char) {
            count++;
            tempArr.push({ 'row': i, 'column': j });
        }
        else if (current !== '') {
            blockedTail = true;
            break;
        }
        else
            break;
    }
    if ((count == 5 && !(blockedHead && blockedTail))) {
        results = results.concat(tempArr);
    }
    
    return results;
};

CaroBoard.prototype.draw = function (jqObject) {
    this.jqTable = jqObject;
    this.jqTable.empty();
    for (var i = 0; i < this.rows; i++) {
        var jqRow = $('<tr></tr>');
        for (var j = 0; j < this.columns; j++) {
            var jqCell = $('<td></td>').attr({ 'data-row': i, 'data-column': j });
            jqCell.click(function (event) {
                if (gMyChar !== null && gHaveBall) {
                    var clickedRow = $(this).attr('data-row');
                    var clickedColumn = $(this).attr('data-column');
                    if (gBoard.canSetAMove(clickedRow, clickedColumn, gMyChar)) {
                        ws.send(JSON.stringify({
                            'type': 'player-moving',
                            'data': {
                                'row': clickedRow,
                                'column': clickedColumn
                            }
                        }));
                    }
                }
                event.preventDefault();
            });
            jqRow.append(jqCell);
        }
        this.jqTable.append(jqRow);
    }
};

CaroBoard.prototype.highlightPoints = function (points) {
    for (var i = 0; i < points.length; i++) {
        var row = points[i].row;
        var column = points[i].column;
        if (this.jqTable !== null) {
            //draw:
            var jqCell = this.jqTable.find('[data-row=' + row + '][data-column=' + column + ']');
            jqCell.addClass('caro-win');
        }
    }
};

var WebState = { 'NOT_READY': 1, 'READY': 2, 'PLAYING': 3 };
var TOAST_VISIBLE = 3000; /*3 seconds*/
var host = location.origin.replace(/^http/, 'ws');
var cookies = $.cookie();
var gameId = location.href.substr(location.href.length - 16);
var gBoard = new CaroBoard();
var gState = WebState.NOT_READY;
var gHaveBall = false;
var gMyChar = null;

function resetGame(){
    playerNotReady();
    gHaveBall = false;
    gMyChar = null;
    $('#lst-players i.mdi-action-done').remove();
}

function playerReady() {
    gState = WebState.READY;
    $('#btn-ready').addClass('disabled');
}

function playerNotReady() {
    gState = WebState.NOT_READY;
    $('#btn-ready').removeClass('disabled');
}

function playerPlaying(){
    gState = WebState.PLAYING;
    var btnReady = $('#btn-ready');
    if (!btnReady.hasClass('disabled'))
        btnReady.addClass('disabled');
}

function addToUserList(jqList, player) {
    var jqName = $('<span></span>').text(player.name);
    if (cookies.sock == player.id) {
        jqName.css({'font-weight' : 'bold'});
    }
    var jqItem = $('<li></li>').attr('id', player.id).addClass('collection-item').append(jqName);
    if (player.ready)
        jqItem.append($('<i></i>').addClass('right mdi-action-done')).attr('title', 'Ready');
    jqList.append(jqItem);
}

function updateInUserList(player) {
    var jqItem = $('#' + player.id);
    if (jqItem.length <= 0)
        return;
    if (player.ready) {
        jqItem.find('i').remove();
        jqItem.append($('<i></i>').addClass('right mdi-action-done')).attr('title', 'Ready');
    }
    else {
        jqItem.find('i').remove();
    }
}

function removeUserInList(id){
    jqItem = $('#' + id).remove();
}

function joinGame() {
    if (typeof (cookies.name) !== 'undefined' || cookies.name == '') {
        ws.send(JSON.stringify({
            'type': 'player-joining',
            'data': {
                'gameId': gameId,
                'playerSock': cookies.sock,
                'playerName': cookies.name
            }
        }));
    }
    else {
        $('#modal1').openModal({
            'dismissible': false, ready: function () { 
                $('#ip-name').focus();
            }
        });
    }
}

function moveBall(playerSock){
    $('.caro-ball').remove();
    var jqBall = $('<i></i>').addClass('mdi-image-tag-faces caro-ball right').attr('title', 'Current turn');
    $('#' + playerSock).append(jqBall);
    if (cookies.sock == playerSock)
        gHaveBall = true;
    else
        gHaveBall = false;
}

function winnGame(moves, callEndGame){
    gHaveBall = false;
    gMyChar = null;
    gBoard.highlightPoints(moves);
    if (callEndGame) {
        ws.send(JSON.stringify({
            'type': 'player-win',
            'data': {
                'playerSock': cookies.sock
            }
        }));
    }
}

function markWin(playerSock){
    resetGame();
    $('.caro-ball').remove();
    var jqMarker = $('<i></i>').addClass('mdi-action-wallet-membership right').attr('title', 'Winner');
    $('#' + playerSock).append(jqMarker);
}

var ws = new WebSocket(host);
ws.onopen = joinGame;
ws.onmessage = function (event) {
    var obj = JSON.parse(event.data);
    switch (obj.type) {
        case 'you-joined':
            var players = obj.data.players;
            var myIndex = obj.data.yourIndex;
            $.cookie('sock', players[myIndex].id, { path: location.pathname });
            cookies = $.cookie();
            $('#lst-players').empty();
            for (var i = 0; i < players.length; i++) {
                addToUserList($('#lst-players'), players[i]);
            }
            Materialize.toast('YOU joined!', TOAST_VISIBLE);
            break;
        case 'player-joined':
            var player = obj.data.player;
            addToUserList($('#lst-players'), player);
            Materialize.toast(player.name + ' joined!', TOAST_VISIBLE);
            break;
        case 'player-existed':
            break;
        case 'player-ready-ack':
            playerReady();
            updateInUserList({ id: cookies.sock, ready: true });
            Materialize.toast('YOU are ready!', TOAST_VISIBLE);
            break;
        case 'player-not-ready-ack':
            playerNotReady();
            updateInUserList({ id: cookies.sock, ready: false });
            Materialize.toast('YOU are not ready!', TOAST_VISIBLE);
            break;
        case 'player-ready':
            updateInUserList(obj.data.player);
            Materialize.toast(obj.data.player.name + ' is ready!', TOAST_VISIBLE);
            break;
        case 'player-not-ready':
            updateInUserList(obj.data.player);
            Materialize.toast(obj.data.player.name + ' is not ready!', TOAST_VISIBLE);
            break;
        case 'game-started':
            gBoard.setBoardSize(obj.data.boardSize.row, obj.data.boardSize.column);
            gMyChar = obj.data.playerChar;
            gBoard.draw($('#tbl-board'));
            playerPlaying();
            if (obj.data.moves.length > 0) {
                for (var i = 0; i < obj.data.moves.length; i++)
                    gBoard.setAMove(obj.data.moves[i].row, obj.data.moves[i].column, obj.data.moves[i].char, 1000 / obj.data.moves.length * (i + 1));
                var temp = gBoard.checkWin(parseInt(obj.data.moves[obj.data.moves.length - 1].row), parseInt(obj.data.moves[obj.data.moves.length - 1].column), obj.data.moves[obj.data.moves.length - 1].char);
                if (temp.length > 0)
                    winnGame(temp, false); // Other win
            }
            break;
        case 'player-turn':
            var playerTurn = obj.data.playerSock;
            moveBall(playerTurn);
            break;
        case 'player-moved':
            if (gBoard.setAMove(obj.data.position.row, obj.data.position.column, obj.data.playerChar)) {
                var temp = gBoard.checkWin(parseInt(obj.data.position.row), parseInt(obj.data.position.column), obj.data.playerChar);
                if (temp.length > 0)
                    winnGame(temp, obj.data.playerSock == cookies.sock);
            }
            break;
        case 'game-end':
            var playerSock = obj.data.playerSock;
            markWin(playerSock);
            break;
        case 'player-error':
        case 'player-left':
            removeUserInList(obj.data.player.id);
            Materialize.toast(obj.data.player.name + ' left!', TOAST_VISIBLE);
            break;
    }
};
ws.onclose = function () {
    $('#d-conn-closed').show().animate({ 'opacity': 0.95 });
    setTimeout(function () { 
        location.href = location.origin;
    }, 3000);
};

$('#modal1 form').submit(function (event) {
    var name = $.trim($('#ip-name').val());
    if (name === '' || name.length > 30) {
        alert('Name cannot be blank or longer than 30 characters.');
        $('#ip-name').focus();
    }
    else {
        $.cookie('name', name, { path: location.pathname });
        cookies = $.cookie();
        if (ws !== null) {
            joinGame();
        }
        $('#modal1').closeModal();
    }
    event.preventDefault();
});

$('#btn-name-ok').click(function (event) {
    $('#modal1 form').submit();
    event.preventDefault();
});

$('#btn-ready').click(function (event) {
    if (gState !== WebState.PLAYING) {
        if (gState == WebState.READY) {
            ws.send(JSON.stringify({
                'type': 'player-not-ready'
            }));
        }
        else {
            ws.send(JSON.stringify({
                'type': 'player-ready'
            }));
        }
    }
    event.preventDefault();
});

$('#btn-close').click(function(){
    location.href = '/';
});

$(window).on("beforeunload", function(event) {
    if (gState == WebState.PLAYING && gMyChar != null) {
        return "If you leave, you lose the game.";
    }
});