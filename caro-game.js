var CaroPlayer = require('./caro-player.js');

function CaroGame(id, boardSizeKey) {
    function getBoardSize(key) {
        switch (key) {
            case 'mini':
            case 'small':
                return { 'row': 15, 'column': 15 };
            case 'medium':
                return { 'row': 20, 'column': 30 };
            case 'large':
                return { 'row': 40, 'column': 40 };
        }
        return { 'row': 15, 'column': 15 };
    }
    
    this.id = id;
    this.room = -1;
    (typeof (boardSizeKey) !== 'undefined') && (this.boardSize = getBoardSize(boardSizeKey)) || (this.boardSize = getBoardSize('mini'));
    
    this.Visible = function () {
        return this.players.length > 0;
    };
    
    this.players = []; // array of CaroPlayer (contain Players and Viewers)
    
    var _muPlayerId = null;
    this.resetCurrentMovePlayerId = function () { 
        _muPlayerId = null;
    };
    this.getCurrentMovePlayerIndex = function () {
        for (var i = 0; i < this.players.length; i++) {
            if (this.players[i].id == _muPlayerId) {
                return i;
            }
        }
        return -1;
    };
    this.getNextMovePlayerIndex = function () {
        var _muPlayerIdx = this.getCurrentMovePlayerIndex();
        for (var i = _muPlayerIdx + 1, k = 0; k < this.players.length; i++, k++) {
            var tempIdx = i % this.players.length;
            if (tempIdx != _muPlayerIdx && this.players[tempIdx].ready) {
                _muPlayerIdx = tempIdx;
                _muPlayerId = this.players[tempIdx].id;
                break;
            }
        }
        return _muPlayerIdx;
    };
    
    var moves = [];
    this.hasMove = function (move) {
        for (var i = 0; i < moves.length; i++) {
            if (moves[i].row == move.row && moves[i].column == move.column)
                return true;
        }
        return false;
    };
    this.setMove = function (move) {
        if (!this.hasMove(move)) {
            moves.push(move);
            return move;
        }
        return null;
    };
    this.getMoves = function () {
        return moves;
    };
    this.emptyMoves = function () {
        moves = [];
    };
    
    this.created = new Date().getTime();
};

CaroGame.prototype.FindPlayer = function (playerId) {
    for (var i = 0; i < this.players.length; i++) {
        if (this.players[i].id === playerId)
            return this.players[i];
    }
    return null;
};

CaroGame.prototype.AssignCharacters = function () {
    var defaultChars = 'xoqwertyuipasdfghjklzcvbnm';
    var charIdx = 0;
    for (var i = 0; i < this.players.length; i++) {
        if (this.players[i].ready) {
            this.players[i].char = defaultChars.charAt(charIdx);
            charIdx++;
        }
    }
};

CaroGame.prototype.CreatePlayer = function (playerId, playerName) {
    var player = new CaroPlayer(playerId, playerName);
    player.setVar('game', this);
    this.players.push(player);
    return player;
};

CaroGame.prototype.RemovePlayer = function (player) {
    var index = this.players.indexOf(player);
    if (index >= 0) {
        player.setVar('game', null);
        this.players.splice(index, 1);
    }
};

CaroGame.prototype.GetReadyPlayers = function () {
    var result = [];
    for (var i = 0; i < this.players.length; i++)
        if (this.players[i].ready)
            result.push(this.players[i]);
    return result;
};

CaroGame.prototype.CanStart = function () {
    var count = 0;
    for (var i = 0; i < this.players.length; i++)
        if (this.players[i].ready)
            count++;
    return (count >= 2);
};

CaroGame.prototype.EndGame = function () {
    this.emptyMoves();
    this.resetCurrentMovePlayerId();
    for (var i = 0; i < this.players.length; i++) {
        this.players[i].char = null;
        this.players[i].ready = false;
    }
};

module.exports = CaroGame;