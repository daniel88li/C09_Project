/* jshint esversion: 6 */
import React, { Component } from 'react';
import DrawCanvas from './drawCanvas';
import SocketContext from './socket';
import { Redirect } from "react-router-dom";
import MessageBox from './MessageBox';
import { getWords } from './api';
import { signout } from './api';
import Room from './Room';
import './style/room.css';

class Game extends Component {
    constructor(props) {
        super(props);
        this.state = {
            word: '', guess: '', drawIndex: 0, isDrawer: false, isHost: false, textType: 'hidden',
            disabled: true, setWord: true, currRoom: '', myId: '', players: [], msgs: [], set: 0, maxSet: 1,
            lobbyRedirect: false, time: '', setTime: 60, hint: '', temp: '', start: false, correct: false, correctPlayers: [],
            drawer: '', scores: {}, showPopup: false, wordOptions: [], inGame: false, currPlayers: 0
        };
        this.onSignout = this.onSignout.bind(this);
        this.onLeave = this.onLeave.bind(this);
        this.timer = 0;
        //https://www.robinwieruch.de/react-warning-cant-call-setstate-on-an-unmounted-component/
        this._isMounted = false;
    }

    //// set settings from room ////

    // time
    setTime = (time) => {
        this.setState({ setTime: time });
    }

    // sets
    setSet = (set) => {
        this.setState({ maxSet: set });
    }

    // click start button
    startGame = () => {
        if (this.state.players.length > 1) {
            this.setState({ inGame: true });
            this.context.emit('set room settings', this.state.maxSet, this.state.setTime, this.state.currRoom);
        }
    }

    ////////////////

    onSignout() {
        signout();
    }

    onLeave() {
        this.context.emit('leave', this.state.currRoom, true);
        this.setState({ lobbyRedirect: true });
    }

    handleText = (e) => {
        this.setState({ guess: e.target.value });
    }

    handleWord = (e) => {
        this.setState({ word: e.target.value.toLowerCase(), temp: e.target.value.toLowerCase() });
    }

    submitGuess = (e) => {
        if (e.key === 'Enter' && !(this.state.isDrawer)) {
            // use the lesser of players.length or currPlayers to cover for people leaving
            if (this.state.currPlayers <= this.state.players.length) {
                this.context.emit('guess', this.state.guess, this.state.word, this.state.myId, this.state.currRoom, this.state.time, this.state.correct, this.state.currPlayers, this.state.correctPlayers.length);
            } else {
                this.context.emit('guess', this.state.guess, this.state.word, this.state.myId, this.state.currRoom, this.state.time, this.state.correct, this.state.players.length, this.state.correctPlayers.length);
            }
            if (this.state.guess === this.state.word) {
                this.setState({ correct: true });
            }
            this.setState({ guess: '' });
            e.target.value = '';
        }
    }

    submitWord = (e) => {
        if (e.key === 'Enter' && this.state.isDrawer) {
            let input = this.state.word;
            input = input.trim();
            this.setState({ word: input });
            if (input !== '') {
                this.context.emit('set word', input, this.state.currRoom, this.state.myId, this.state.players.length);
                this.setState({ setWord: true });
                e.target.value = '';
            }
        }
    }

    clickWord = (e) => {
        if (this.state.isDrawer) {
            this.setState({ word: e.target.innerHTML, temp: e.target.innerHTML });
            this.context.emit('set word', e.target.innerHTML, this.state.currRoom, this.state.myId, this.state.players.length);
            this.setState({ setWord: true });
        }
        this.closePopup();
    }

    componentDidMount = () => {
        this._isMounted = true;
        // https://stackoverflow.com/questions/40885923/countdown-timer-in-react
        this.startTimer = () => {
            if (this._isMounted) {
                if (this.timer === 0 && this.state.time >= 0) {
                    this.timer = setInterval(this.countDown, 1000);
                }
            }
        };

        this.countDown = () => {
            if (this._isMounted) {
                if (!this.state.start) {
                    return;
                }
                let time = this.state.time - 1;
                this.setState({ time: time });
                if (time <= 0) {
                    clearInterval(this.timer);
                    if (this.state.isDrawer) {
                        let new_index = this.state.drawIndex;
                        new_index += 1;
                        this.setState({ disabled: false, drawIndex: new_index });
                        this.context.emit('next round', this.state.currRoom, this.state.drawIndex, this.state.set, this.state.maxSet);
                    }
                }
            }
        };

        this.context.on('created', (room, clientUsername) => {
            if (this._isMounted) {
                this.setState({ isDrawer: true, isHost: true, currRoom: room, myId: clientUsername, textType: 'text', drawer: clientUsername });
                this.context.emit('update players', room);
            }
        });

        this.context.on('joined', (room, clientUsername, maxSet, time, inGame) => {
            if (this._isMounted) {
                this.setState({ currRoom: room, myId: clientUsername, maxSet: maxSet, setTime: time, inGame: inGame });
                this.context.emit('update players', room);
            }
        });

        this.context.on('update players', (players, scores, playerLeft) => {
            if (this._isMounted) {
                var drawerIndex = players.indexOf(this.state.drawer);
                if (playerLeft) {
                    if (drawerIndex === -1 && players.length > 1) {
                        // assign new drawer
                        let new_index = this.state.drawIndex;
                        new_index += 1;
                        let new_numPlayers = this.state.currPlayers;
                        new_numPlayers -= 1;
                        this.setState({ drawIndex: new_index, players: players, scores: scores, currPlayers: new_numPlayers });
                        this.context.emit('next round', this.state.currRoom, this.state.drawIndex, this.state.set);
                    } else if (players.length === 1 && this.state.inGame) {
                        // leave game when there is 1 person left
                        alert("Everyone left! Leaving game...");
                        this.context.emit('leave', this.state.currRoom, false);
                        this.timeout3 = setTimeout(() => {
                            this.setState({ lobbyRedirect: true });
                        }, 2000);
                        // account for when one person left to guess but they leave
                    } else if ((players.length - this.state.correctPlayers.length) <= 1 && this.state.inGame) {
                        // assign new drawer and next round
                        let new_index = this.state.drawIndex;
                        new_index += 1;
                        let new_numPlayers = this.state.currPlayers;
                        new_numPlayers -= 1;
                        clearInterval(this.timer);
                        this.setState({ drawIndex: new_index, players: players, scores: scores, currPlayers: new_numPlayers });
                        this.context.emit('next round', this.state.currRoom, this.state.drawIndex, this.state.set);
                    } else {
                        let new_numPlayers = this.state.currPlayers;
                        new_numPlayers -= 1;
                        this.setState({ players: players, scores: scores, currPlayers: new_numPlayers });
                    }
                } else {
                    this.setState({ players: players, scores: scores });
                }
            }
        });

        this.context.on('settings', (set, time) => {
            if (this._isMounted) {
                this.setState({ maxSet: set, setTime: time, inGame: true });
                if (this.state.isHost) {
                    this.context.emit('start', this.state.currRoom);
                }
            }
        });

        this.context.on('start', () => {
            if (this._isMounted) {
                if (this.state.isDrawer) {
                    this.setState({ disabled: true, setWord: false, temp: '' });
                }
                this.context.emit('clear drawing', this.state.currRoom);
            }
        });

        this.context.on('set word', (word, drawer, currPlayers) => {
            if (this._isMounted) {
                let wordTrim = '';
                if (!this.state.isDrawer) {
                    let length = word.length;
                    this.setState({ hint: '', drawer: drawer });
                    // this part is for making sure to have only 1 space in between
                    let prev = '';
                    for (let i = 0; i < length; i++) {
                        if ((word[i] === ' ') && (prev === ' ')) {
                            wordTrim += '';
                        } else {
                            wordTrim += word[i];
                        }
                        prev = word[i];
                    }
                    word.trim();
                    length = wordTrim.length;
                    for (let i = 0; i < length; i++) {
                        if (wordTrim[i] === ' ') {
                            this.setState({ hint: this.state.hint + '\xa0\xa0' });
                        } else {
                            this.setState({ hint: this.state.hint + '_ ' });
                        }
                    }
                    this.setState({ word: wordTrim, disabled: false, start: true });
                }
                this.setState({ word: wordTrim });
            }
            this.timer = 0;
            this.setState({ time: this.state.setTime, start: true, currPlayers: currPlayers });
            this.startTimer();
        });

        this.context.on('guess', (guess, user, correct) => {
            if (this._isMounted) {
                let new_msgs = this.state.msgs;
                new_msgs.push(user + ": " + guess);
                this.setState({ msgs: new_msgs });
                if (correct) {
                    let correctPlayers = this.state.correctPlayers;
                    correctPlayers.push(user);
                    this.setState({ correctPlayers: correctPlayers });
                    if (this.state.myId === user) {
                        this.context.emit("update players", this.state.currRoom, false);
                    }
                }
            }
        });

        // winRound to end round early
        this.context.on('end round early', (msg) => {
            if (this._isMounted) {
                let new_msgs = this.state.msgs;
                new_msgs.push(msg);
                clearInterval(this.timer);
                if (this.state.isDrawer) {
                    let new_index = this.state.drawIndex;
                    new_index += 1;
                    this.setState({ msgs: new_msgs, drawIndex: new_index });
                    this.timeout = setTimeout(() => {
                        this.context.emit('next round', this.state.currRoom, this.state.drawIndex, this.state.set, this.state.maxSet);
                    }, 2000);
                } else {
                    this.setState({ msgs: new_msgs });
                }
            }
        });

        this.context.on('next drawer', (nextDrawer, newIndex, set) => {
            if (this._isMounted) {
                // set drawer
                this.setState({ drawer: nextDrawer });
                if (this.state.isDrawer) {
                    this.context.emit('update players', this.state.currRoom, false);
                }
                if (this.state.myId === nextDrawer) {
                    this.setState({
                        isDrawer: true, drawIndex: newIndex, msgs: [], word: '', guess: '', textType: 'text',
                        set: set, time: this.state.setTime, hint: '', start: false, correct: false, correctPlayers: []
                    });
                    this.context.emit('start', this.state.currRoom);
                } else {
                    this.setState({
                        isDrawer: false, drawIndex: newIndex, msgs: [], word: '', guess: '',
                        setWord: true, textType: 'hidden', set: set, time: this.state.setTime, hint: '', start: false, correct: false, correctPlayers: []
                    });
                }
            }
        });

        this.context.on('full', () => {
            if (this._isMounted) {
                this.setState({ lobbyRedirect: true });
                alert("Room is full");
            }
        });

        this.context.on('game end', hostLeft => {
            if (this._isMounted) {
                // make people leave
                if (hostLeft) {
                    alert("Host left the game, leaving game...");
                    this.context.emit('leave', this.state.currRoom, false);
                    this.timeout2 = setTimeout(() => {
                        this.setState({ lobbyRedirect: true });
                    }, 2000);
                } else {
                    this.context.emit('get score', this.state.currRoom);
                }
            }
        });

        this.context.on('display score', (scores) => {
            if (this._isMounted) {
                let winner = null;
                let highestScore = 0;
                let allScore = "";
                for (let player in scores) {
                    allScore += player + ": " + scores[player] + "\n";
                    if (scores[player] > highestScore) {
                        highestScore = scores[player];
                        winner = player;
                    }
                }

                if (winner == null) {
                    alert("No one wins \n" + allScore);
                } else {
                    alert("Winner is " + winner + " with score: " + highestScore + "\n" + allScore);
                }
                // go back to room
                this.setState({ inGame: false });
                this.setState({ lobbyRedirect: true });
                this.context.emit('exit room', this.state.currRoom);
            }
        });
    }

    componentWillUnmount = () => {
        // https://dev.to/dance2die/canceling-interval-in-react-52b5
        clearInterval(this.timer);
        // https://stackoverflow.com/questions/49085450/settimeout-and-cleartimeout-in-reactjs
        clearTimeout(this.timeout);
        clearTimeout(this.timeout2);
        clearTimeout(this.timeout3);
        this._isMounted = false;
    }

    wordPopup() {
        // https://stackoverflow.com/questions/48980380/returning-data-from-axios-api
        getWords().then(words => {
            this.setState({
                wordOptions: words,
                showPopup: !this.state.showPopup
            });
        });
    }

    closePopup() {
        this.setState({ showPopup: !this.state.showPopup });
    }

    render() {
        if (this.state.lobbyRedirect) {
            return <Redirect to={"/lobby"} />;
        }
        if (this.state.inGame) {
            return (
                <div>
                    <ul>
                        <li><button className="top_btn" onClick={this.onSignout}>Sign Out</button></li>
                        <li><button className="top_btn" onClick={this.onLeave}>Leave Game</button></li>
                    </ul>
                    <div className="game">
                        <Players players={this.state.players} drawer={this.state.drawer} correctPlayers={this.state.correctPlayers} scores={this.state.scores} />
                        <div className="draw">
                            <div className="word">
                                <p></p>
                                <h1 id="time">{this.state.time}</h1>
                                <input type={this.state.textType} placeholder="Set a word:" className="set-word" value={this.state.temp}
                                    disabled={this.state.setWord} onChange={this.handleWord} onKeyPress={this.submitWord}>
                                </input>
                                <GetWordButton isDrawer={this.state.isDrawer} disable={this.state.setWord} wordPop={(e) => this.wordPopup(e)} />
                                <div id="hint">{this.state.hint}</div>
                                <p></p>
                            </div>
                            <DrawCanvas isDrawer={this.state.isDrawer} currRoom={this.state.currRoom} />
                        </div>
                        <MessageBox value={this.state.guess} handleText={(e) => this.handleText(e)} submitGuess={(e) => this.submitGuess(e)} disabled={this.state.disabled}
                            msgs={this.state.msgs} />
                        {this.state.showPopup ? <Popup options={this.state.wordOptions} closePopup={this.closePopup.bind(this)} clickWord={this.clickWord} /> : null}
                    </div>
                </div>
            );
            // show room if not in game
        } else {
            return (
                <Room players={this.state.players} setSet={(set) => this.setSet(set)} setTime={(time) => this.setTime(time)} startGame={() => this.startGame()}
                    isHost={this.state.isHost} currRoom={this.state.currRoom} signOut={() => this.onSignout()} leave={() => this.onLeave()} />
            );
        }
    }
}

function GetWordButton(props) {
    if (props.isDrawer) {
        return (
            <button type="button" className="btn" disabled={props.disable} onClick={() => props.wordPop(this)}>Get 3 words</button>
        );
    } else {
        return null;
    }
}

function Players({ players, drawer, correctPlayers, scores }) {
    return (
        <div className='players'>
            <h1 id="players_title">Players</h1>
            {players.map(function (player, index) {
                let playerAndScore;
                if (player in scores) {
                    playerAndScore = player + ": " + scores[player];
                }
                let correct = false;
                for (let i in correctPlayers) {
                    if (player === correctPlayers[i]) {
                        correct = true;
                    }
                }
                if (player === drawer) {
                    return (
                        <div className="player" key={index + player}>
                            <p>{playerAndScore + " (drawer)"}</p>
                        </div>
                    );
                } else if (correct) {
                    return (
                        <div className="correct_player" key={index + player}>
                            <p>{playerAndScore}</p>
                        </div>
                    );
                } else {
                    return (
                        <div className="player" key={index + player}>
                            <p>{playerAndScore}</p>
                        </div>
                    );
                }
            })}
        </div>
    );
}

// https://codepen.io/bastianalbers/pen/PWBYvz
class Popup extends React.Component {
    render() {
        return (
            <div className="modal">
                <div className="modal-box">
                    <div id="label">Choose a word</div>
                    <div className="modal-content">
                        <div className="word-option" onClick={this.props.clickWord}>{this.props.options[0]}</div>
                        <div className="word-option" onClick={this.props.clickWord}>{this.props.options[1]}</div>
                        <div className="word-option" onClick={this.props.clickWord}>{this.props.options[2]}</div>
                    </div>
                    <button onClick={this.props.closePopup}>Cancel</button>
                </div>
            </div>
        );
    }
}

Game.contextType = SocketContext;

export default Game;