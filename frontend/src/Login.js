/* jshint esversion: 6 */
import React, { Component } from 'react';
import './style/form.css';
import './style/login.css';
import { signin, signup } from './api';
import { Link } from 'react-router-dom';
import Title from './Title';

class Login extends Component {
    render() {
        return (
            <div>
                <Title />
                <div className="align_center">
                    <LoginForm />
                </div>
                <div className="center_credit">
                    <Link to={'/credits'} className='credits'>Credits</Link>
                </div>
            </div>
        );
    }
}

// https://reactjs.org/docs/forms.html
class LoginForm extends Component {
    constructor(props) {
        super(props);
        this.state = { username: '', password: '' };
        this.handleUsername = this.handleUsername.bind(this);
        this.handlePassword = this.handlePassword.bind(this);
        this.handleSignin = this.handleSignin.bind(this);
        this.handleSignup = this.handleSignup.bind(this);
    }

    handleUsername(e) {
        this.setState({ username: e.target.value });
    }

    handlePassword(e) {
        this.setState({ password: e.target.value });
    }

    handleSignup(e) {
        signup(this.state.username, this.state.password);
        this.setState({ username: '', password: '' });
    }

    handleSignin(e) {
        signin(this.state.username, this.state.password);
        this.setState({ username: '', password: '' });
    }

    enterKey = (e) => {
        if (e.key === 'Enter') {
            this.handleSignin(e);
        }
    }

    render() {
        return (
            <form className="complex_form">
                <input type="text" placeholder="Username" className="form_element" value={this.state.username} onChange={this.handleUsername} />
                <input type="password" placeholder="Password" className="form_element" value={this.state.password} onChange={this.handlePassword} onKeyPress={this.enterKey} />
                <div className="form_btns">
                    <button type="button" className="btn" onClick={this.handleSignup}>Sign Up</button>
                    <button type="button" className="btn" onClick={this.handleSignin}>Sign In</button>
                </div>
            </form>
        );
    }
}

export default Login;
