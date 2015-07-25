# Simple Caro Game
Caro is an advanced tic-tac-toe game. Game rules are described as in the below section.
This game is a [Node.js](https://nodejs.org/) web application built with [Express framework](http://expressjs.com/) and [ws module](https://github.com/websockets/ws). UI being used is [Materialize CSS](http://materializecss.com/).

See the [Demo](https://carogame.herokuapp.com/).

**Tips**: *You can test the game by using 2 different browsers.*

## Game rules
* Turn-based game for 2 players
* For each of player's turn, that player places a piece on the table board.
* Player who has a five consecutive pieces which are not nipped by 2 pieces of the opponent in one row, or column, or diagonal will be the winner.

## Game examples
#### WIN:
.    |.     |.     |.     |.     |.     |.    
---- | ---- | ---- | ---- | ---- | ---- | ----
.    |X     |X     |X     |X     |X     |.    
.    |.     |.     |.     |.     |.     |.    

.    |.     |.    
---- | ---- | ----
.    |X     |.    
.    |X     |.    
.    |X     |.    
.    |X     |.    
.    |X     |.    
.    |.     |.    

.    |.     |.     |.     |.     |.     |.    
---- | ---- | ---- | ---- | ---- | ---- | ----
.    |X     |.     |.     |.     |.     |.    
.    |.     |X     |.     |.     |.     |.    
.    |.     |.     |X     |.     |.     |.    
.    |.     |.     |.     |X     |.     |.    
.    |.     |.     |.     |.     |X     |.    
.    |.     |.     |.     |.     |.     |.    

.    |.     |.     |.     |.     |.     |.    
---- | ---- | ---- | ---- | ---- | ---- | ----
.    |.     |.     |.     |.     |X     |.    
.    |.     |.     |.     |X     |.     |.    
.    |.     |.     |X     |.     |.     |.    
.    |.     |X     |.     |.     |.     |.    
.    |X     |.     |.     |.     |.     |.    
.    |.     |.     |.     |.     |.     |.    

.    |.     |.     |.     |.     |.     |.    
---- | ---- | ---- | ---- | ---- | ---- | ----
O    |X     |X     |X     |X     |X     |.    
.    |.     |.     |.     |.     |.     |.    

.    |.     |.     |.     |.     |.     |.     |.    
---- | ---- | ---- | ---- | ---- | ---- | ---- | ----
O    |X     |X     |X     |X     |X     |.     |O    
.    |.     |.     |.     |.     |.     |.     |.    
...

#### NOT WIN:
.    |.     |.     |.     |.     |.     |.    
---- | ---- | ---- | ---- | ---- | ---- | ----
**O**|X     |X     |X     |X     |X     |**O**
.    |.     |.     |.     |.     |.     |.    

.    |.     |.     |.     |.     |.     |.     |.    
---- | ---- | ---- | ---- | ---- | ---- | ---- | ----
.    |X     |X     |X     |X     |X     |X     |.    
.    |.     |.     |.     |.     |.     |.     |.   

...

## Run
* In order to run this application, you must have Node.js with NPM installed on your machine.
* After downloading the source code, navigate to the Simple-Caro folder.
* To update the components, type `npm update`.
* After updating, either use `npm start` or `node index.js` command to run the server.

## Contributing
Contributions are appreciated in the form of pull requests.
To maintain code readability and maintainability, please walk through the below guidelines.
* Please have a semicolon (;) explicitly to end a statement in Node code.
* Please avoid using TAB character, instead use 4 spaces.
* Please keep things simple, don't hesitate to give comment for complex code handling.

## License
Apache License

Please see [LICENSE](https://github.com/maixuanhan/Simple-Caro/blob/master/LICENSE) or [this](http://choosealicense.com/licenses/apache-2.0/) for the details.
