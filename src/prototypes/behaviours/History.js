import React, { Component } from 'react';
import { Segment, Header, Icon, Label } from 'semantic-ui-react';
import Scrollbar from "react-custom-scrollbars"; 
import { BEHAVIORS } from './E2BVideo';

const {PLAY, PAUSE, JUMP, SEEKFORWARD, SEEKBACKWARD, SEEKIMMEDIATELY, SPEEDUP, SPEEDDOWN} = BEHAVIORS;

class History extends Component {
    _drawHistoryBasic(history){
        return (
            <Header>
                {history.behavior}
                <Header.Subheader>{history.videoFrom.title}</Header.Subheader>
            </Header>
        );
    }

    _drawHistoryWithFromTo(history){
        return (
            <div>
                <Label 
                    onMouseEnter={() => {
                        document.body.style.cursor = "pointer";
                    }}
                    onMouseLeave={() => {
                        document.body.style.cursor = "default";
                    }} 
                    color='teal' onClick={()=>{this.props._onVideoChanged(history.videoFrom, history.playingTimeFrom || 0)}}>
                    <Icon name="angle right"/> From
                    <Label.Detail>{history.playingTimeFrom ? history.playingTimeFrom.toFixed(2) : null}</Label.Detail>
                </Label>
                <Label 
                    onMouseEnter={() => {
                        document.body.style.cursor = "pointer";
                    }}
                    onMouseLeave={() => {
                        document.body.style.cursor = "default";
                    }}
                    color='green' onClick={()=>{this.props._onVideoChanged(history.videoTo, history.playingTimeTo || 10000000)}}>
                    <Icon name="angle left"/> To
                    <Label.Detail>{history.playingTimeTo ? history.playingTimeTo.toFixed(2) : "End"}</Label.Detail>
                </Label>
            </div>
        );
    }

    _drawHistoryWithPlayingTime(history){
        return (
            <Label 
                onMouseEnter={() => {
                    document.body.style.cursor = "pointer";
                }}
                onMouseLeave={() => {
                    document.body.style.cursor = "default";
                }}
                color='blue' onClick={()=>{this.props._onVideoChanged(history.videoFrom, history.playingTimeFrom)}}>
                <Icon name="clock"/> Time
                <Label.Detail>{history.playingTimeFrom.toFixed(2)}</Label.Detail>
            </Label>
        );
    }

    _drawHistoryWithSpeed(history){
        return (
            <Label 
                onMouseEnter={() => {
                    document.body.style.cursor = "pointer";
                }}
                onMouseLeave={() => {
                    document.body.style.cursor = "default";
                }}
                color='yellow'>
                <Icon name="angle double right"/> Speed
                <Label.Detail>{history.playbackRate}</Label.Detail>
            </Label>
        );
    }

    _drawHistoryWithJump(history){
        return (
            <Label 
                onMouseEnter={() => {
                    document.body.style.cursor = "pointer";
                }}
                onMouseLeave={() => {
                    document.body.style.cursor = "default";
                }}
                color='red' onClick={()=>{this.props._onVideoChanged(history.videoTo, 0)}}>
                <Icon name="play"/> Video
                <Label.Detail>{history.videoTo.title}</Label.Detail>
            </Label>
        );
    }

    _drawHistory(history, i){
        return(
            <Segment key={i}>
                {this._drawHistoryBasic(history)}
                {
                    (()=>{switch(history.behavior){
                        case SEEKFORWARD:
                        case SEEKBACKWARD:
                            return this._drawHistoryWithFromTo(history);
                        
                        case SPEEDDOWN:
                        case SPEEDUP:
                            return this._drawHistoryWithSpeed(history);
                        
                        case PLAY:
                        case PAUSE:
                        case SEEKIMMEDIATELY:
                            return this._drawHistoryWithPlayingTime(history);
                        
                        case JUMP:
                            return this._drawHistoryWithJump(history);
                        
                        default:
                        break;
                    }})()
                }
            </Segment>
        )
    }

    render() {
        return (
            <Scrollbar autoHide style={ {width: '100%', height: '100%'} } >
                <Segment.Group style={{margin: 10}}>
                    {this.props.histories.map((history, i) => this._drawHistory(history, i))}
                </Segment.Group>
            </Scrollbar>
        );
    }
}

export default History;