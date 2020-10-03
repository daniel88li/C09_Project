/* jshint esversion: 6 */
import React, { Component } from 'react';
import Immutable from 'immutable';
import './style/game.css';
import Tools from './drawTools';
import SocketContext from './socket';

class DrawCanvas extends Component {
    constructor(props) {
        super(props);
        this.state = { lines: [], draw: false, colour: 'black', width: 3 };
        this._isMounted = false;
    }

    onColourChange = (e, col) => {
        if (this._isMounted) {
            this.setState({ colour: col });
        }
    }

    onWidthChange = (e, width) => {
        if (this._isMounted) {
            this.setState({ width: width });
        }
    }

    onClear = (e, isDrawer) => {
        if (this._isMounted) {
            if (isDrawer) {
                this.setState({ lines: [] });
            }
        }
    }

    onErase = (e, isDrawer) => {
        if (this._isMounted) {
            if (isDrawer) {
                this.setState({ colour: '#fff' });
            }
        }
    }

    componentDidMount = () => {
        this._isMounted = true;
        document.addEventListener("mouseup", this.handleMouseUp);

        this.context.on('clear drawing', () => {
            if (this._isMounted) {
                this.setState({ lines: [] });
            }
        });

        this.context.on('redraw', (items) => {
            if (this._isMounted) {
                this.setState({ lines: items });
            }
        });
    }

    componentWillUnmount = () => {
        this._isMounted = false;
        document.removeEventListener("mouseup", this.handleMouseUp);
    }

    checkMouseButton = (mouseEvent, isDrawer) => {
        // check if main button is pressed
        if (mouseEvent.button !== 0) {
            return;
        }
        const point = this.getData(mouseEvent);
        if (isDrawer) {
            let new_lines = this.state.lines;
            new_lines.push([point]);
            this.setState({ lines: new_lines, draw: true });
        }
    }

    checkDrawStatus = (mouseEvent) => {
        if (!this.state.draw) {
            return;
        }
        const point = this.getData(mouseEvent);
        let new_lines = this.state.lines;
        new_lines[new_lines.length - 1].push(point);
        this.setState({ lines: new_lines });
    }

    handleMouseUp = () => {
        if (this._isMounted) {
            this.setState({ draw: false });
        }
    }

    getData(mouseEvent) {
        const bound = this.refs.drawArea.getBoundingClientRect();
        return { x: mouseEvent.clientX - bound.left, y: mouseEvent.clientY - bound.top, col: this.state.colour, wid: this.state.width };
    }

    render() {
        let isDrawer = this.props.isDrawer;
        let room = this.props.currRoom;
        return (
            <div>
                <div className="drawArea" ref="drawArea" onMouseDown={(e) => this.checkMouseButton(e, isDrawer)} onMouseMove={this.checkDrawStatus}>
                    <Draw lines={this.state.lines} isDrawer={isDrawer} room={room} socket={this.context} />
                </div>
                <Tools onColChange={(e, col) => this.onColourChange(e, col)} onWidthChange={(e, width) => this.onWidthChange(e, width)}
                    onClear={(e) => this.onClear(e, isDrawer)} onErase={(e) => this.onErase(e, isDrawer)} />
            </div>
        );
    }
}

//https://pspdfkit.com/blog/2017/how-to-build-free-hand-drawing-using-react/#
function Draw({ lines, isDrawer, room, socket }) {
    if (isDrawer && room !== '') {
        socket.emit('redraw', lines, room);
    }
    return (
        <svg className="drawing">
            {lines.map((line, index) => (
                <DrawLine key={index} line={line} isDrawer={isDrawer} />
            ))}
        </svg>
    );
}

function DrawLine({ line, isDrawer }) {
    const pathData = "M " + line.map(p => { return Immutable.fromJS(p).get('x') + " " + Immutable.fromJS(p).get('y') }).join(" L ");
    const col = Immutable.fromJS(line[0]).get('col');
    const wid = Immutable.fromJS(line[0]).get('wid');

    return <path style={{ stroke: col }} strokeWidth={wid} className="path" d={pathData} />;
}

DrawCanvas.contextType = SocketContext;

export default DrawCanvas;
