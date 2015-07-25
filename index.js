var WebSocketServer = require("ws").Server;
var http = require("http");
var express = require("express");
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');

var CaroPlayer = require('./caro-player.js');
var CaroGame = require('./caro-game.js');
var CaroGameList = require('./caro-game-list.js');

var app = express();
var port = 80;
var defaultRoomNo = 20;
var maximumRoomNo = 64;

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(cookieParser());

app.set('views', './views'); // specify the views directory
app.set('view engine', 'jade');

var server = http.createServer(app);
server.listen(port);
console.log("http server listening on %d", port);

var wss = new WebSocketServer({ server: server });
console.log("websocket server created");

// generate an ID:
function generateAnId(len) {
    var text = "";
    var possibleChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < len; i++)
        text += possibleChars.charAt(Math.floor(Math.random() * possibleChars.length));
    return text;
}

var gameData = new CaroGameList(defaultRoomNo, maximumRoomNo, generateAnId);

// handle for WebSocket Server:
// each WS object will be back referred to a player
wss.on("connection", function (ws) {
    
    function PlayerJoinningHandler(msgData){
        var game = gameData.FindGame(msgData.gameId);
        if (game !== null) {
            var player = game.FindPlayer(msgData.playerSock);
            if (player !== null) {
                // player is already connected
                var sockIdx = wss.clients.indexOf(player.getVar('socket'));
                if (sockIdx >= 0) {
                    ws.send(JSON.stringify({ 'type': 'player-existed' }));
                    ws.close();
                } else {
                    player.setVar('socket', ws);
                    ws.data_player = player;
                    ws.send(JSON.stringify({
                        'type': 'you-joined',
                        'data': { 'players': game.players , 'yourIndex': game.players.indexOf(player) }
                    }));
                    if (game.CanStart()) {
                        // Game already started:
                        ws.send(JSON.stringify({
                            'type': 'game-started',
                            'data': { 'playerChar': player.char, 'boardSize': game.boardSize, 'moves': game.getMoves() }
                        }));
                    }
                    for (var i = 0; i < game.players.length; i++) {
                        var client = game.players[i].getVar('socket');
                        if (client != null && game.players[i].id != player.id) {
                            client.send(JSON.stringify({
                                'type': 'player-joined', 
                                'data': { 'player': player }
                            }));
                        }
                    }
                }
            }
            else {
                // new player:
                player = game.CreatePlayer(generateAnId(32), msgData.playerName);
                player.setVar('socket', ws);
                ws.data_player = player;
                ws.send(JSON.stringify({
                    'type': 'you-joined',
                    'data': { 'players': game.players , 'yourIndex': game.players.indexOf(player) }
                }));
                if (game.CanStart()) {
                    // Game already started:
                    ws.send(JSON.stringify({
                        'type': 'game-started',
                        'data': { 'playerChar': player.char, 'boardSize': game.boardSize, 'moves': game.getMoves() }
                    }));
                }
                for (var i = 0; i < game.players.length; i++) {
                    var client = game.players[i].getVar('socket');
                    if (client != null && game.players[i].id != player.id) {
                        client.send(JSON.stringify({
                            'type': 'player-joined',
                            'data': { 'player': player }
                        }));
                    }
                }
            }
        }
        else {
            // TODO: wrong game ID
        }
    }
    
    function PlayerReadyHandler(){
        var player = ws.data_player;
        if (typeof (player) !== 'undefined' && player !== null && player.MarkReady(true)) {
            ws.send(JSON.stringify({
                'type': 'player-ready-ack'
            }));
            var game = player.getVar('game');
            for (var i = 0; i < game.players.length; i++) {
                var client = game.players[i].getVar('socket');
                if (client != null && game.players[i].id != player.id) {
                    client.send(JSON.stringify({
                        'type': 'player-ready',
                        'data': { 'player': player }
                    }));
                }
            }
            
            // check if game start:
            if (game.CanStart()) {
                game.AssignCharacters();
                if (game.getMoves().length > 0)
                    game.emptyMoves();
                var nextMove = game.getNextMovePlayerIndex();
                for (var i = 0; i < game.players.length; i++) {
                    var client = game.players[i].getVar('socket');
                    if (client !== null) {
                        client.send(JSON.stringify({
                            'type': 'game-started',
                            'data': { 'playerChar': game.players[i].char, 'boardSize': game.boardSize, 'moves': game.getMoves() }
                        }));
                        if (nextMove >= 0) {
                            client.send(JSON.stringify({
                                'type': 'player-turn',
                                'data': { 'playerSock': game.players[nextMove].id }
                            }));
                        }
                    }
                }
            } // end check game start!
        }
        else {
            // TODO: socket is not associated with any player yet
        }
    }
    
    function PlayerNotReadyHandler(){
        var player = ws.data_player;
        if (typeof (player) !== 'undefined' && player !== null && player.MarkReady(false)) {
            ws.send(JSON.stringify({
                'type': 'player-not-ready-ack'
            }));
            var game = player.getVar('game');
            for (var i = 0; i < game.players.length; i++) {
                var client = game.players[i].getVar('socket');
                if (client != null && game.players[i].id != player.id) {
                    client.send(JSON.stringify({
                        'type': 'player-not-ready',
                        'data': { 'player': player }
                    }));
                }
            }
        }
        else {
                    // TODO: socket is not associated with any player yet
        }
    }
    
    function PlayerMovingHandler(msgData){
        var player = ws.data_player;
        if (typeof (player) !== 'undefined' && player !== null) {
            var game = player.getVar('game');
            if (game.players.indexOf(player) == game.getCurrentMovePlayerIndex()) {
                var move = { 'row': msgData.row, 'column': msgData.column, 'char': player.char };
                if (game.setMove(move) == move) {
                    var nextMove = game.getNextMovePlayerIndex();
                    for (var i = 0; i < game.players.length; i++) {
                        var client = game.players[i].getVar('socket');
                        if (client != null) {
                            client.send(JSON.stringify({
                                'type': 'player-moved',
                                'data': { 'playerSock': player.id, 'playerChar': player.char, 'position': msgData }
                            }));
                            if (nextMove >= 0) {
                                client.send(JSON.stringify({
                                    'type': 'player-turn',
                                    'data': { 'playerSock': game.players[nextMove].id }
                                }));
                            }
                        }
                    }
                } // TODO: else: invalid move
            }
        }
        else {
            // TODO: socket is not associated with any player yet
        }
    }
    
    function PlayerWinHandler(){
        var player = ws.data_player;
        if (typeof (player) !== 'undefined' && player !== null) {
            var game = player.getVar('game');
            for (var i = 0; i < game.players.length; i++) {
                var client = game.players[i].getVar('socket');
                if (client != null) {
                    client.send(JSON.stringify({
                        'type': 'game-end',
                        'data': { 'playerSock': player.id }
                    }));
                }
            }
            game.EndGame();
        }
    }
    
    function PlayerLeftHandler(){
        var player = ws.data_player;
        if (typeof (player) !== 'undefined' && player !== null) {
            var game = player.getVar('game');
            game.RemovePlayer(player);

            for (var i = 0; i < game.players.length; i++) {
                var client = game.players[i].getVar('socket');
                if (client != null) {
                    client.send(JSON.stringify({
                        'type': 'player-left',
                        'data': {
                            'player': player
                        }
                    }));
                }
            }

            if (game.players.length == 0) {
                if (game.room > gameData.defaultRoom)
                    gameData.RemoveGame(game);
            }
            else {
                var readyPlayers = game.GetReadyPlayers();
                if (readyPlayers.length == 1) {
                    for (var i = 0; i < game.players.length; i++) {
                        var client = game.players[i].getVar('socket');
                        if (client != null) {
                            client.send(JSON.stringify({
                                'type': 'game-end',
                                'data': { 'playerSock': readyPlayers[0].id }
                            }));
                        }
                    }
                    game.EndGame();
                }
            }
        }
    }

    var pingTimer = setInterval(function () { 
        ws.ping();
    }, 50000);
    console.log("websocket connection open");
    
    ws.on("message", function (event) {
        //console.log("websocket connection message: ", event);
        var message = JSON.parse(event);
        switch (message.type) {
            case 'player-joining':// send info to the other players also
                PlayerJoinningHandler(message.data);
                break;
            case 'player-ready':
                PlayerReadyHandler();
                break;
            case 'player-not-ready':
                PlayerNotReadyHandler();
                break;
            case 'player-moving':
                PlayerMovingHandler(message.data);
                break;
            case 'player-win':
                PlayerWinHandler();
                break;
        }
    });
    
    ws.on('ping', function () {
        //console.log('get a PING');
    });
    
    ws.on('pong', function () {
        //console.log('get a PONG');
    });
    
    ws.on("close", function () {
        console.log("websocket connection close");
        clearInterval(pingTimer);
        
        PlayerLeftHandler();
    });
});

// INDEX:
app.get('/', function (req, res) {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
    res.render('index');
});

app.post('/get-all-games', function (req, res) {
    var games = gameData.games;
    res.json({
        ok: true,
        games: games
    });
});

app.post('/get-ran-game', function (req, res) {
    var game = null;
    for (var i = 0; i < gameData.games.length; i++) {
        if (gameData.games[i].players.length > 0 && !gameData.games[i].CanStart()) {
            game = gameData.games[i];
            break;
        }
    }
    if (game === null) {
        for (var i = 0; i < gameData.games.length; i++) {
            if (!gameData.games[i].CanStart()) {
                game = gameData.games[i];
                break;
            }
        }
    }
    if (game === null) {
        game = gameData.AddGame(new CaroGame(generateAnId(16), 'medium'));
    }
    if (game !== null) {
        res.json({
            ok: true,
            game: game
        });
    }
    else {
        res.json({
            ok: false,
            error: 'Cannot find any free room!'
        });
    }
});

// request to create new game:
app.post('/new-game', function (req, res) {
    var game = new CaroGame(generateAnId(16), req.body.boardsize);
    var player = game.CreatePlayer(generateAnId(32), req.body.name);
    gameData.AddGame(game);

    setTimeout(function () {
        if (!game.Visible())
            gameData.RemoveGame(game);
    }, 300000);
    res.cookie('name', player.name, { path: '/game/' + game.id });
    res.cookie('sock', player.id, { path: '/game/' + game.id });
    res.redirect('/game/' + game.id);
});

app.get('/game/:id', function (req, res) {
    var game = gameData.FindGame(req.params.id);
    if (game !== null) {
        res.render('game', game);
    }
    else
        res.status(404).send('Game is not found!');
});