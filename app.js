/* jshint esversion: 6 */

const crypto = require('crypto');
const express = require('express');
const path = require('path');
const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.json());

const validator = require('validator');

const http = require('http');
const PORT = process.env.PORT || 3001;
var socketIO = require('socket.io');

const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectID;
const url = "mongodb+srv://user_drawing:aQoJXZ00y2RrkSqo@cluster0-yfeog.mongodb.net/test?retryWrites=true";

MongoClient.connect(url, { useNewUrlParser: true }, function (err, client) {
    if (err) return console.log(err);
    var db = client.db("c09project");
    db.createCollection("users", function (err, res) {
        if (err) throw err;
    });
    db.createCollection("wordBankDB", function (err, res) {
        if (err) throw err;
        client.close();
    });

});

//https://medium.freecodecamp.org/how-to-make-create-react-app-work-with-a-node-backend-api-7c5c48acb1b0
if (process.env.NODE_ENV === 'production') {
  // Serve any static files
  app.use(express.static(path.join(__dirname, 'frontend/build')));
  // Handle React routing, return all requests to React app
  app.get('*', function(req, res, next) {
    if (req.url === '/wordBank/' || req.url === '/signout/') return next();
    res.sendFile(path.join(__dirname, 'frontend/build', 'index.html'));
  });
}

var server = http.createServer(app).listen(PORT, function (err) {
    if (err) console.log(err);
    else console.log("HTTP server on http://localhost:%s", PORT);
});

const cookie = require('cookie');

const session = require('express-session');
app.use(session({
    secret: 'projectdrawingio',
    resave: false,
    saveUninitialized: true
}));

function generateSalt() {
    return crypto.randomBytes(16).toString('base64');
}

function generateHash(password, salt) {
    var hash = crypto.createHmac('sha512', salt);
    hash.update(password);
    return hash.digest('base64');
}

app.use(function (req, res, next) {
    var username = (req.session.username) ? req.session.username : '';
    res.setHeader('Set-Cookie', cookie.serialize('username', username, {
        path: '/',
        maxAge: 60 * 60 * 24 * 7 // 1 week in number of seconds
    }));
    next();
});

app.use(express.static('static'));

app.use(function (req, res, next) {
    console.log("HTTP request", req.method, req.url, req.body);
    next();
});

var checkUsername = function (req, res, next) {
    if (!validator.isAlphanumeric(req.body.username)) return res.status(400).end("bad input");
    next();
};

// curl -H "Content-Type: application/json" -X POST -d '{"username":"alice","password":"alice"}' -c cookie.txt localhost:3000/signup/
app.post('/signup/', checkUsername, function (req, res, next) {
    var username = req.body.username;
    var password = req.body.password;

    MongoClient.connect(url, { useNewUrlParser: true }, function (err, client) {
        var db = client.db('c09project');
        db.collection('users').findOne({ _id: username }, function (err, user) {
            if (err) return res.status(500).end(err);
            if (user) return res.status(409).end("username " + username + " already exists");
            var salt = generateSalt();
            var hash = generateHash(password, salt);
            db.collection('users').insertOne({ _id: username, salt, hash }, function (err) {
                if (err) return res.status(500).end(err);
                req.session.username = username;
                // initialize cookie
                res.setHeader('Set-Cookie', cookie.serialize('username', username, {
                    path: '/',
                    maxAge: 60 * 60 * 24 * 7
                }));
                return res.json("user " + username + " signed up");
            });
        });
    });
});

// curl -H "Content-Type: application/json" -X POST -d '{"username":"alice","password":"alice"}' -c cookie.txt localhost:3000/signin/
app.post('/signin/', checkUsername, function (req, res, next) {
    var username = req.body.username;
    var password = req.body.password;

    MongoClient.connect(url, { useNewUrlParser: true }, function (err, client) {
        var db = client.db('c09project');
        db.collection('users').findOne({ _id: username }, function (err, user) {
            if (err) return res.status(500).end(err);
            if (!user) return res.status(401).end("access denied");
            if (user.hash !== generateHash(password, user.salt)) return res.status(401).end("access denied"); // invalid password
            // start a session
            req.session.username = username;
            res.setHeader('Set-Cookie', cookie.serialize('username', username, {
                path: '/',
                maxAge: 60 * 60 * 24 * 7 // 1 week in number of seconds
            }));
            return res.json("user " + username + " signed in");
        });
    });
});

// curl -b cookie.txt -c cookie.txt localhost:3000/signout/
app.get('/signout/', function (req, res, next) {
    req.session.destroy();
    res.setHeader('Set-Cookie', cookie.serialize('username', '', {
        path: '/',
        maxAge: 60 * 60 * 24 * 7 // 1 week in number of seconds
    }));
    res.redirect('/');
});

// curl localhost:3000/wordBank/
app.get('/wordBank/', function (req, res, next) {
    MongoClient.connect(url, { useNewUrlParser: true }, function (err, client) {
        var db = client.db('c09project');
        db.collection('wordBankDB').find({}).toArray(function (err, allWords) {
            if (err) return res.status(500).end(err);
            // return list of word obj {_id: word}
            return res.json(allWords);
        });
    });
});

var io = socketIO.listen(server);

io.on('connection', socket => {
    console.log('New client connected');

    socket.on('error', function () {
        console.log(err);
    });

    socket.on('start', function (room) {
        io.in(room).emit('start');
    });

    socket.on('get rooms', function () {
        let rooms = Object.keys(io.sockets.adapter.rooms);
        let roomInfoList = [];
        rooms.forEach(function (eachRoom) {
            let roomObj = {};
            roomObj.room = eachRoom;
            let sockRoom = io.sockets.adapter.rooms[eachRoom];
            if (sockRoom.owner != null) {
                roomObj.owner = sockRoom.owner;
                roomObj.numPlayers = getAllRoomMembers(eachRoom).length;
                roomInfoList.push(roomObj);
            }
        });
        socket.emit('show all rooms', roomInfoList);
    });

    socket.on('update players', function (room, playerLeft) {
        io.to(room).emit('update players', getAllRoomMembers(room), getScores(room), playerLeft);
    });

    socket.on('guess', function (guess, answer, user, room, time, correct, players, correctPlayers) {
        if ((guess === answer) && !correct) {
            //answer faster get more points
            if (time >= 50) {
                socket.score += 5;
            } else if (time >= 40) {
                socket.score += 4;
            } else if (time >= 30) {
                socket.score += 3;
            } else if (time >= 20) {
                socket.score += 2;
            } else {
                socket.score++;
            }
            // last player guess the word right
            // 2 b/c not include drawer
            if ((players - correctPlayers) <= 2) {
                io.sockets.in(room).emit('end round early', user + " has guessed correct!");
            } else {
                io.sockets.in(room).emit('guess', "has guessed correct!", user, true);
            }
        } else {
            // cannot send answer
            if (guess !== answer) {
                io.sockets.in(room).emit('guess', guess, user, false);
            }
        }
    });

    // https://stackoverflow.com/questions/9352549/getting-how-many-people-are-in-a-chat-room-in-socket-io
    function getAllRoomMembers(room) {
        // for some reason this runs when starting nodejs
        let members = io.nsps['/'].adapter.rooms[room];
        if (members !== undefined) {
            let playerList = [];
            for (let player in members.sockets) {
                let socket = io.of("/").connected[player];
                if (socket.username) {
                    playerList.push(socket.username);
                } else {
                    // when not logged in
                    playerList.push(player);
                }
            }
            return playerList;
        }
    }

    function getScores(room) {
        let members = io.nsps['/'].adapter.rooms[room];
        if (members !== undefined) {
            let scoreList = {};
            for (let player in members.sockets) {
                let socket = io.of("/").connected[player];
                scoreList[socket.username] = socket.score;
            }
            return scoreList;
        }
    }

    socket.on('get score', function (room) {
        socket.emit('display score', getScores(room));
    });

    socket.on('create or join', (room, username) => {
        console.log('Received request to create or join room ' + room);

        socket.on('error', function (err) {
            console.log(err);
        });

        // https://stackoverflow.com/questions/24111280/socket-io-detect-what-room-a-user-has-disconnected-from
        socket.roomID = room;
        socket.score = 0;
        socket.username = username;

        var clientsInRoom = io.sockets.adapter.rooms[room];
        var numClients = clientsInRoom ? Object.keys(clientsInRoom.sockets).length : 0;
        console.log('Room ' + room + ' now has ' + numClients + ' client(s)');

        if (numClients === 0) {
            socket.join(room);
            console.log('Client ID ' + socket.id + ' created room ' + room);

            // https://stackoverflow.com/questions/16419743/setting-variables-to-rooms-in-node-js-socket-io
            // set default settings on room variables
            io.sockets.adapter.rooms[room].maxSet = 1;
            io.sockets.adapter.rooms[room].time = 60;
            io.sockets.adapter.rooms[room].inGame = false;
            io.sockets.adapter.rooms[room].owner = socket.username;
            io.sockets.adapter.rooms[room].numPlayers = 1;
            socket.emit('created', room, username);
        } else if (numClients <= 4 && numClients > 0) {
            let players = getAllRoomMembers(room);
            if (players.indexOf(username) < 0) {
                socket.join(room);
                io.sockets.adapter.rooms[room].numPlayers += 1;
                // get room variables for settings
                socket.emit('joined', room, username, io.sockets.adapter.rooms[room].maxSet, io.sockets.adapter.rooms[room].time,
                    io.sockets.adapter.rooms[room].inGame);
            }
        } else { // max 5 clients
            socket.emit('full', room);
        }
    });

    socket.on('set room settings', function (set, time, room) {
        io.sockets.adapter.rooms[room].maxSet = set;
        io.sockets.adapter.rooms[room].time = time;
        io.sockets.adapter.rooms[room].inGame = true;
        io.to(room).emit('settings', set, time);
    });

    socket.on('clear drawing', function (room) {
        io.to(room).emit('clear drawing');
    });

    socket.on('redraw', function (arrayObj, room) {
        // send to all in room except sender
        socket.in(room).emit('redraw', arrayObj);
    });

    socket.on('set word', function (word, room, drawer, currPlayers) {
        io.to(room).emit('set word', word, drawer, currPlayers);
    });

    socket.on('next round', function (room, newDrawerIndex, set, maxSet) {
        let players = getAllRoomMembers(room);
        // ends after max set (everyone got to draw)
        if (set === maxSet) {
            io.in(room).emit('game end', false);
        } else {
            if (newDrawerIndex >= players.length) {
                newDrawerIndex = 0;
                set++;
            }
            io.in(room).emit('next drawer', players[newDrawerIndex], newDrawerIndex, set);
        }
    });

    socket.on('leave', function (room, oneLeft) {
        socket.leave(room);
        // someonoe chose to leave
        if (oneLeft) {
            io.to(room).emit('update players', getAllRoomMembers(room), getScores(room), true);
        }
    });

    socket.on('get score', function (room) {
        socket.emit('display score', getScores(room));
    });

    socket.on('exit room', function (room) {
        socket.leave(room);
    });

    socket.on('disconnect', () => {
        if (socket.roomID) {
            io.to(socket.roomID).emit('update players', getAllRoomMembers(socket.roomID), getScores(socket.roomID), true);
        }
        console.log('A user disconnected');
    });
});

app.get('/user/', function (req, res, next) {
    res.setHeader('content-type', 'text/plain');
    res.json(req.session.username);
});