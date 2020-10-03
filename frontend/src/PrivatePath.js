/* jshint esversion: 6 */
import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import Cookies from 'universal-cookie';
import axios from "axios";

function isAuthenticated() {
    const cookies = new Cookies();
    const username = cookies.get('username');

    if (!username) {
        return false;
    }
    return axios.get('/user/')
        .then(response => {
            if (response.data === username) {
                return true;
            } else {
                return false;
            }
        })
        .catch(function (error) {
            return false;
        });
}

// https://reacttraining.com/react-router/web/example/auth-workflow
function PrivatePath({ component: Component, ...rest }) {
    return (
        <Route {...rest} render={props => isAuthenticated() ? (<Component {...props} />) :
            (<Redirect to={{ pathname: "/login" }} />)} />
    );
}

export default PrivatePath;