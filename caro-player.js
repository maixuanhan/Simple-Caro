
function CaroPlayer(id, name) {  
    this.id = id;
    this.name = name;
    this.char = null;
    this.ready = false;

    var _game = null;   // back reference to CaroGame object
    var _socket = null; // back reference to WebSocket object

    this.getVar = function (key) {
        switch (key) {
            case 'game':
                return _game;
            case 'socket':
                return _socket;
        }
    };

    this.setVar = function (key, value) { 
        switch (key) {
            case 'game':
                _game = value;
            case 'socket':
                _socket = value;
        }
    };
};

CaroPlayer.prototype.MarkReady = function (value) {
    if (value) {
        var game = this.getVar('game');
        if (typeof (game) !== 'undefined' && game !== null && !game.CanStart()) {
            this.ready = true;
            return true;
        }
    }
    else {
        if (this.ready) {
            this.ready = false;
            return true;
        }
    }
    return false;
};

module.exports = CaroPlayer;