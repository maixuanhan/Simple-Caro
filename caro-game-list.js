var CaroGame = require('./caro-game.js');

function CaroGameList(defaultRoomNo, maximumRoomNo, genIdFunc) {
    this.games = []; // array of CaroGame
    this.defaultRoom = defaultRoomNo;
    this.maximumRoom = maximumRoomNo;
    if (typeof(genIdFunc) === 'undefined'){
        this.generateIdFunc = function(hashValue) {
            return new Date().getTime();
        };
    }
    else {
        this.generateIdFunc = genIdFunc;
    }
    
    // init the game list:
    for (var i = 0; i < this.defaultRoom; i++) {
        var game = new CaroGame(this.generateIdFunc(16), 'medium');
        this.AddGame(game);
    }
};

CaroGameList.prototype.FindGame = function (gameId) {
    for (var i = 0; i < this.games.length; i++) {
        if (this.games[i].id === gameId)
            return this.games[i];
    }
    return null;
};

CaroGameList.prototype.RemoveGame = function (game) {
    for (var i = 0; i < this.games.length; i++)
        if (this.games[i].id == game.id) {
            this.games.splice(i, 1);
            break;
        }
};

CaroGameList.prototype.AddGame = function (game) {
    if (this.maximumRoom > this.games.length) {
        var found, room;
        for (room = 1; room < this.games.length + 2; room++) {
            found = false;
            for (var j = 0; j < this.games.length; j++) {
                if (this.games[j].room == room) {
                    found = true;
                    break;
                }
            }
            if (!found) {
                break;
            }
        }
        game.room = room;
        this.games.push(game);
        return game;
    }
    return null;
};

module.exports = CaroGameList;