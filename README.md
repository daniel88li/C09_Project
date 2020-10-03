C09 web programming project reuploaded to my personal repo. App url discontinued.

# Drawing.io
## Project Proposal

### Team Members: 
* Lex Pegenia
* Susan Wang
* Xu Dong Li (Daniel)

### Description
[*__Drawing.io__*](https://drawing-io.herokuapp.com) is an online multiplayer game where a player will draw an image of their choosing and other players race to guess what that image is before the timer goes off. Players take turns being the drawer. If no players successfully guess the correct answer before the timer, the round is forfeited and the next player can begin drawing. Each round ends when either all the players guessed correctly or when the timer ends. Points are given according to when a player guesses an image correctly. The faster the response the more points will be awarded. At the end of a game, it will show the scores of each player and the winner.

### App URL
[https://drawing-io.herokuapp.com](https://drawing-io.herokuapp.com)

### Run locally
* Run `npm install` in [root](https://github.com/UTSCC09/project-lsd/) directory
* Run `npm install` in [frontend](./frontend) directory
* Then run `npm run local` in root directory and site should open up, or go to localhost:3000
* REST API documentation in [doc](./doc) directory

### Key features completed by Beta release
* Login/Sign Up page
* Drawing canvas where players can draw using a black paint brush
* Setting up a server that transmits data back and forth
* A simple game where the first player to guess correctly wins the round
* The player drawing can input their own word to draw
* Chat where players will try to guess the drawing

### Additional features completed by Final release
* Setting up multiple rooms so players can choose which one they want to join
* Having a list of stored words in the database for players to either input their own object to draw or to provide them with a randomized word
* Have different color paints and different line widths instead of just plain black
* Setting up a timer for each round
* Players get awarded points based on how fast they guess correctly
* Display scores of each player after game is over

### Technology
* Frontend: [React](https://reactjs.org/) and CSS
* Backend: Node.js and Express.js
* Database: [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
* [SVG](https://developer.mozilla.org/en-US/docs/Web/SVG) for drawing
* Networking: [socket.io](https://github.com/socketio/socket.io) for sending/receiving data and to implement multiple rooms for players
* Deployment: [Heroku](https://www.heroku.com/)

### Top 5 technological challenges
1. Learning how to use React
2. Integrating multiple APIs to work concurrently
3. Real time synchronization between multiple players
4. Setting up multiple rooms/servers
5. Maintaining a chat where players enter their guesses
