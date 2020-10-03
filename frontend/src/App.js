/* jshint esversion: 6 */
import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './Home';
import Login from './Login';
import Lobby from './Lobby';
import Game from './Game';
import PrivatePath from './PrivatePath';
import PageNotFound from './PageNotFound';
import Credits from './Credits';
import SocketContext from './socket';
import io from 'socket.io-client';

const socket = io();

// https://reacttraining.com/react-router/web/guides/quick-start
// https://itnext.io/how-to-use-a-single-instance-of-socket-io-in-your-react-app-6a4465dcb398
class App extends Component {
    render() {
        return (
            <SocketContext.Provider value={socket}>
                <Router>
                    <div>
                        <Switch>
                            <PrivatePath exact path="/" component={Home} />
                            <PrivatePath exact path="/lobby" component={Lobby} />
                            <PrivatePath exact path='/game' component={Game} />
                            <Route exact path='/login' component={Login} />
                            <Route exact path='/credits' component={Credits} />
                            <Route path="" component={PageNotFound} />
                        </Switch>
                    </div>
                </Router>
            </SocketContext.Provider>
        );
    }
}

export default App;
