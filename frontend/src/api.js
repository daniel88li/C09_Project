/* jshint esversion: 6 */

import axios from "axios";

export function getCurrentUser() {
    var username = document.cookie.split("username=")[1];
    if (!username) return null;
    return username;
}

// https://medium.com/javascript-in-plain-english/full-stack-mongodb-react-node-js-express-js-in-one-simple-app-6cc8ed6de274
export function signup(username, password) {
    axios.post('/signup/', { username: username, password: password })
        .then(function (response) {
            window.location.href = '/';
        })
        .catch(function (error) {
            console.error(error.response);
        });
}

export function signin(username, password) {
    axios.post('/signin/', { username: username, password: password })
        .then(function (response) {
            window.location.href = '/';
        })
        .catch(function (error) {
            console.error(error.response);
        });
}

export function signout() {
    axios.get('/signout/')
        .then(function (response) {
            window.location.href = '/login';
        })
        .catch(function (error) {
            console.error(error.response);
        });
}

export function getWords() {
    return axios.get('/wordBank/')
        .then(function (response) {
            let num = response.data.length;
            let indexList = [];
            let randIndex;
            let wordList = [];

            while (indexList.length < 3) {
                randIndex = getRandInt(0, num);
                if (!indexList.includes(randIndex)) {
                    indexList.push(randIndex);
                }
            }
            indexList.forEach(function (index) {
                wordList.push(response.data[index]._id);
            });
            return wordList;
        })
        .catch(function (error) {
            console.error(error.response);
        });
}

function getRandInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}