/* jshint esversion: 6 */
import React, { Component } from 'react';
import { Redirect } from "react-router-dom";
import './style/lobby.css';
import './style/room.css';
import SocketContext from './socket';
import { getCurrentUser } from './api';
import { signout } from './api';
import Title from './Title';

class Lobby extends Component {

    onSignout() {
        signout();
    }

    render() {
        return (
            <div>
                <ul>
                    <li><button className="top_btn" onClick={this.onSignout}>Sign Out</button></li>
                </ul>
                <Title />
                <div>
                    <Box />
                </div>
            </div>
        );
    }
}

class Box extends Component {
    constructor(props) {
        super(props);
        this.state = { room: '', disabled: false, redirect: false, username: getCurrentUser(), options: [] };
        this._isMounted = false;
    }

    inputRoom = (e) => {
        this.setState({ room: e.target.value });
    }

    startGame = (e) => {
        if (this._isMounted) {
            if (this.state.room !== "") {
                this.context.emit('create or join', this.state.room, this.state.username);
                this.setState({ redirect: true });
            }
        }
    }

    clickJoin = (e, room) => {
        if (this._isMounted) {
            this.setState({ room: room });
            setTimeout(() => {
                this.startGame();
            }, 500);
        }
    }

    getAllRooms = (e) => {
        this.context.emit('get rooms');
    }

    componentDidMount = () => {
        this._isMounted = true;

        this.context.on('show all rooms', (rooms) => {
            if (this._isMounted) {
                this.setState({ options: rooms });
            }
        });
    }

    componentWillUnmount = () => {
        this._isMounted = false;
    }

    render() {
        if (this.state.redirect) {
            return <Redirect to={"/game"} />;
        }
        return (
            <div>
                <div className="box">
                    <h1 className="user">Logged in as: {this.state.username}</h1>
                    <div className="dropdown">
                        <span>Create or Join Room</span>
                        <div className="dropdown-content">
                            <label><input type="text" autoComplete="off" id="room_input" name="name" disabled={this.state.disabled} value={this.state.room} onChange={this.inputRoom} /></label>
                            <button id="start_btn" onClick={this.startGame}>Start</button>
                        </div>
                    </div>

                    <div className="server_container" onMouseEnter={this.getAllRooms}>
                        <div className="server_tabs">
                            <p className="server_tab" id="server_tab_name">Room Name</p>
                            <p className="server_tab" id="server_tab_owner">Owner</p>
                            <p className="server_tab" id="server_tab_players">Players</p>
                        </div>
                        <RoomBox rooms={this.state.options} joinRoom={(e, room) => this.clickJoin(e, room)} />
                    </div>
                </div>
            </div>
        );
    }
}

function RoomBox(props) {
    return (
        props.rooms.map(function (roomInfo, index) {
            return (
                <div className="server" key={roomInfo.room} onClick={() => props.joinRoom(this, roomInfo.room)}>
                    <div className="server_info server_name" key={"name" + index + roomInfo.room}>
                        <p key={"name" + roomInfo.room}>{roomInfo.room}</p>
                    </div>
                    <div className="server_info server_owner" key={"owner" + index + roomInfo.room}>
                        <p key={"name" + roomInfo.room}>{roomInfo.owner}</p>
                    </div>
                    <div className="server_info server_players" key={"players" + index + roomInfo.room}>
                        <p key={"players" + roomInfo.room}>{roomInfo.numPlayers}/5</p>
                    </div>
                </div>
            )
        })
    );
}

// https://reactjs.org/docs/context.html
Box.contextType = SocketContext;

export default Lobby;