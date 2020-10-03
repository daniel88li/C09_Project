/* jshint esversion: 6 */
import React, { Component } from 'react';
import './style/home.css';
import { signout } from './api';
import { Redirect } from "react-router-dom";
import Title from './Title';

class Home extends Component {
    render() {
        return (
            <Menu />
        );
    }
}

class Menu extends Component {
    constructor(props) {
        super(props);
        this.state = { redirect: false, location: '' };
        this.onSignout = this.onSignout.bind(this);
    }

    onSignout(e) {
        signout();
    }

    setRedirect = (e) => {
        this.setState({ redirect: true, location: e.target.value });
    }

    render() {
        if (this.state.redirect) {
            return <Redirect to={"/" + this.state.location} />;
        }
        return (
            <div>
                <Title />
                <div className='menu-buttons'>
                    <button className='mbutton' value={'lobby'} onClick={this.setRedirect}>Start Game</button>
                    <button className='mbutton' onClick={this.onSignout}>Exit</button>
                </div>
            </div>
        );
    }
}

export default Home;