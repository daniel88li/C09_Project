/* jshint esversion: 6 */
import React, { Component } from 'react';
import Select from 'react-select';
import './style/room.css';
import './style/top.css';
import Title from './Title';

class Room extends Component {

    render() {
        return (
            <div>
                <ul>
                    <li><button className="top_btn" onClick={this.props.signOut}>Sign Out</button></li>
                    <li><button className="top_btn" onClick={this.props.leave}>Leave Game</button></li>
                </ul>
                <Title />
                <div>
                    <RoomBox players={this.props.players} setSet={(set) => this.props.setSet(set)} setTime={(time) => this.props.setTime(time)} startGame={() => this.props.startGame()} isHost={this.props.isHost} currRoom={this.props.currRoom} />
                </div>
            </div>
        );
    }
}

// https://github.com/JedWatson/react-select
class RoomBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            setOptions: [
                { value: 1, label: 1 },
                { value: 2, label: 2 },
                { value: 3, label: 3 }
            ],
            timeOptions: [
                { value: 30, label: 30 },
                { value: 60, label: 60 },
                { value: 90, label: 90 }
            ],
            choseOption1: false,
            choseOption2: false
        }
    }
    render() {
        // what host sees
        if (this.props.isHost) {
            return (
                <div className="room_box">
                    <h1 className='room_title'>{this.props.currRoom}</h1>
                    <div className="lobby_settings">
                        <h2>Max Set</h2>
                        <Select className="lobby_setting" options={this.state.setOptions} onChange={item => this.props.setSet(item.value)} />
                        <h2>Time</h2>
                        <Select className="lobby_setting" options={this.state.timeOptions} onChange={item => this.props.setTime(item.value)} />
                        <button className="begin_btn" onClick={this.props.startGame}>Start</button>
                    </div>
                    <h1 className="room_title">Players</h1>
                    <Players players={this.props.players} />
                </div>
            );
            // what others see
        } else {
            return (
                <div className="room_box">
                    <h1 className='room_title'>{this.props.currRoom}</h1>
                    <div className="lobby_settings">
                        <h2>Waiting for Host to start...</h2>
                    </div>
                    <h1 className="room_title">Players</h1>
                    <Players players={this.props.players} />
                </div>
            );
        }
    }
}

function Players({ players }) {
    return (
        <div className='lobby_players'>
            {players.map(function (player, index) {
                return (
                    <div className="lobby_player" key={index}>
                        <p>{player}</p>
                    </div>
                );
            })}
        </div>
    )
}

export default Room;