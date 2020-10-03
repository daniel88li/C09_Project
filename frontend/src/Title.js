/* jshint esversion: 6 */
import React, { Component } from 'react';
import brush from './style/brush.png';
import './style/login.css';

class Title extends Component {
    mainPage = (e) => {
        window.location.href = '/';
    }

    render() {
        return (
            <div className="header">
                <img src={brush} alt="Brush" className="brush" />
                <h1 onClick={() => this.mainPage()} className="title">Drawing.io</h1>
            </div>
        );
    }
}

export default Title;