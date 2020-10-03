/* jshint esversion: 6 */
import React, { Component } from 'react';
import './style/game.css';

class Tools extends Component {
    render() {
        return (
            <div className="tools">
                <div className="top_tools">
                    <button id="clear" onClick={() => this.props.onClear()}>Clear</button>
                    <button id="eraser" onClick={() => this.props.onErase()}>Eraser</button>
                </div>
                <div className="colourWidthBox">
                    <ColourPalette onClick={(e, col) => this.props.onColChange(e, col)} />
                    <div className="lineWidth">
                        <div className="widthBox" onClick={() => this.props.onWidthChange(this, '3')}>
                            <div className="width widthSmall"></div>
                        </div>
                        <div className="widthBox" onClick={() => this.props.onWidthChange(this, '8')}>
                            <div className="width widthMedium"></div>
                        </div>
                        <div className="widthBox" onClick={() => this.props.onWidthChange(this, '14')}>
                            <div className="width widthLarge"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

function ColourPalette(props) {
    return (
        <div className="colourPalette">
            <div id="colourBlack" className="colour" onClick={() => props.onClick(this, 'black')} style={{ background: 'black' }}></div>
            <div id="colourBlue" className="colour" onClick={() => props.onClick(this, 'blue')} colour={'blue'} style={{ background: 'blue' }}></div>
            <div id="colourRed" className="colour" onClick={() => props.onClick(this, 'red')} colour={'red'} style={{ background: 'red' }}></div>
            <div id="colourGreen" className="colour" onClick={() => props.onClick(this, 'green')} style={{ background: 'green' }}></div>
            <div id="colourYellow" className="colour" onClick={() => props.onClick(this, 'yellow')} style={{ background: 'yellow' }}></div>
            <div id="colourPurple" className="colour" onClick={() => props.onClick(this, 'rgb(147,112,219)')} style={{ background: 'rgb(147,112,219)' }}></div>
            <div id="colourOrange" className="colour" onClick={() => props.onClick(this, 'orange')} style={{ background: 'orange' }}></div>
            <div id="colourSkyBlue" className="colour" onClick={() => props.onClick(this, 'rgb(135,206,235)')} style={{ background: 'rgb(135,206,235)' }}></div>
        </div>
    )
}

export default Tools;