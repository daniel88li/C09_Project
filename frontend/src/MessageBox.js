/* jshint esversion: 6 */
import React, { Component } from 'react';
import './style/game.css';

class MessageBox extends Component {
    constructor(props) {
        super(props);
        this.messagesEnd = React.createRef();
    }

    componentDidUpdate() {
        this.scrollToBottom();
    }

    scrollToBottom = () => {
        if (this.messagesEnd.current) {
            this.messagesEnd.current.scrollIntoView();
        }
    }

    render() {
        return (
            <div className="chat">
                <div className="chat_box">
                    <ChatBox msgs={this.props.msgs} />
                    <div ref={this.messagesEnd} />
                </div>
                <input type="text" name="guess" placeholder="Guess the drawing" className="create_message"
                    value={this.props.guess} onChange={(e) => this.props.handleText(e)} onKeyPress={(e) => this.props.submitGuess(e)} disabled={this.props.disabled}></input>
            </div>
        );
    }
}

function ChatBox({ msgs }) {
    return (
        msgs.map(function (msg, index) {
            return (
                <div className="message" key={index + msg}>
                    <span key={msg.id}>{msg}</span>
                </div>
            );
        })
    );
}

export default MessageBox;