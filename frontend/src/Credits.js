/* jshint esversion: 6 */
import React, { Component } from 'react';
import Title from './Title';

class Credits extends Component {
    render() {
        return (
            <div>
                <Title />
                <h1 className="credit-headers">Credits</h1>
                <h2>Icons</h2>
                <p>- Icons made by <a href="https://www.freepik.com/" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/"
                    title="Flaticon">www.flaticon.com</a> is pcensed by <a href="http://creativecommons.org/pcenses/by/3.0/"
                        title="Creative Commons BY 3.0" target="_blank" rel="noopener noreferrer">CC 3.0 BY</a></p>
                <h2>React Code</h2>
                <p>- What would I do without <a href="http://stackoverflow.com/" target="_blank" rel="noopener noreferrer">Stackoverflow</a></p>
                <p>- Run React Package.json <a href="https://medium.com/javascript-in-plain-engpsh/full-stack-mongodb-react-node-js-express-js-in-one-simple-app-6cc8ed6de274"
                    target="_blank" rel="noopener noreferrer">concurrently</a></p>
                <p>- <a href="https://reacttraining.com/react-router/web/guides/quick-start" target="_blank" rel="noopener noreferrer">React Router</a></p>
                <p>- <a href="https://reactjs.org/docs/context.html" target="_blank" rel="noopener noreferrer">React Context</a></p>
                <p>- <a href="https://itnext.io/how-to-use-a-single-instance-of-socket-io-in-your-react-app-6a4465dcb398" target="_blank" rel="noopener noreferrer">Socket.io Context</a></p>
                <p>- Drawing using <a href="https://pspdfkit.com/blog/2017/how-to-build-free-hand-drawing-using-react/#" target="_blank" rel="noopener noreferrer">SVG</a> in React</p>
                <p>- Setting state for <a href="https://www.robinwieruch.de/react-warning-cant-call-setstate-on-an-unmounted-component/" target="_blank" rel="noopener noreferrer">
                    Unmounted Components</a></p>
                <p>- <a href="https://stackoverflow.com/questions/40885923/countdown-timer-in-react" target="_blank" rel="noopener noreferrer">Countdown Timer</a> in React</p>
                <p>- <a href="https://stackoverflow.com/questions/25500316/sort-a-dictionary-by-value-in-javascript" target="_blank" rel="noopener noreferrer">Sorting Dictionary</a> in Javascript</p>
                <p>- Returning data in <a href="https://stackoverflow.com/questions/48980380/returning-data-from-axios-api" target="_blank" rel="noopener noreferrer">axios api</a></p>
                <p>- <a href="https://dev.to/dance2die/cancepng-interval-in-react-52b5" target="_blank" rel="noopener noreferrer">Clear Interval</a> method</p>
                <p>- <a href="https://stackoverflow.com/questions/49085450/settimeout-and-cleartimeout-in-reactjs" target="_blank" rel="noopener noreferrer">Clear Timeout</a> method</p>
                <p>- <a href="https://codepen.io/bastianalbers/pen/PWBYvz" target="_blank" rel="noopener noreferrer">React Popup</a></p>
                <p>- <a href="https://github.com/JedWatson/react-select" target="_blank" rel="noopener noreferrer">React Select</a></p>
                <p>- <a href="https://reactjs.org/docs/forms.html" target="_blank" rel="noopener noreferrer">React Forms</a></p>
                <p>- <a href="https://reacttraining.com/react-router/web/example/auth-workflow" target="_blank" rel="noopener noreferrer">Authentication Router</a></p>
            </div>
        )
    }
}

export default Credits;