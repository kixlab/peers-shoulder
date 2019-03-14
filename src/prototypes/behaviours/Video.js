import React, { Component } from 'react';
import YouTube from 'react-youtube';

const EVENT_NOTYETSTART = "Not Yet Start";
const EVENT_END = "End";
const EVENT_PLAY = "Play";
const EVENT_PAUSE = "Pause";
const EVENT_BUFFERING = "Buffering";
const EVENT_JUMP = "Jump";
const EVENT_SEEKFORWARD = "Seek Forward";
const EVENT_SEEKBACKWARD = "Seek Backward";
const EVENT_SEEKTIMELINE = "Seek Timeline";
const EVENT_SPEEDUP = "Speed Up";
const EVENT_SPEEDDOWN = "Speed Down";

export const EVENTS = {
    EVENT_NOTYETSTART,
    EVENT_END,
    EVENT_PLAY,
    EVENT_PAUSE,
    EVENT_BUFFERING,
    EVENT_JUMP,
    EVENT_SEEKFORWARD,
    EVENT_SEEKBACKWARD,
    EVENT_SEEKTIMELINE,
    EVENT_SPEEDUP,
    EVENT_SPEEDDOWN
};

/*
    class Video
    - handle YouTube video interface

    props
    - video: initial video information (id, title)
    - _onActionUpdated: function(histories)
*/
class Video extends Component {
    myState = {
        histories: [],
        previous: {
            playbackRate: 1
        }
    }

    // constructor
    // - run updatePlayingTime background service
    constructor(props){
        super(props);

        // call playing time listener
        setTimeout(()=>{
            this._updatePlayingTime();
        }, 100);
    }

    // function _updatePlayingTime: void -> void
    // - run on background, and record the current playing time of the video
    _updatePlayingTime(){
        if(this._videoRef){
            this._videoRef.internalPlayer.getCurrentTime()
            .then(playingTime => {
                this.myState.playingTime = playingTime;
            });
        }

        setTimeout(()=>{
            this._updatePlayingTime();
        }, 100);
    }

    // function _recordAction: object -> void
    // - call props._onActionUpdated whenever the list of history is updated
    _recordAction(variables){
        this.myState.histories = [
            ...this.myState.histories,
            {
                id: this.myState.histories.length,
                time: (new Date()).getTime(),
                video: this.props.video,
                ...variables
            }
        ];

        this.props._onActionUpdated(this.myState.histories);
    }

    // function _onStateChange: event(html video query) -> void
    // - on video state changed
    _onStateChange(e){
        const state = e.data;
        console.log('state\n', e.data)
        var histories = this.myState.histories;
        switch(state){
            case -1:    // not yet start
            this.myState.previous.notyetstart = true;
            break

            case 0:     // end
            this._recordAction({action: EVENT_END});
            this.myState.previous.lastAction = EVENT_END;
            break;

            case 1:     // play
            if(this.myState.previous.lastAction === EVENT_BUFFERING && !this.myState.previous.notyetstart){
                histories[histories.length - 1].endingTime = (new Date()).getTime();
                histories[histories.length - 1].to = e.target.getCurrentTime();
                this.myState.histories = histories;
                this.props._onActionUpdated(this.myState.histories);
                break;
            }
            this.myState.previous.notyetstart = false;
            this._recordAction({action: EVENT_PLAY, playingTime: e.target.getCurrentTime()});
            this.myState.previous.lastAction = EVENT_PLAY;
            this.myState.previous.time = e.target.getCurrentTime();
            break;

            case 2:     // pause
            this._recordAction({action: EVENT_PAUSE, playingTime: e.target.getCurrentTime()});
            this.myState.previous.lastAction = EVENT_PAUSE;
            this.myState.previous.time = e.target.getCurrentTime();
            break;

            case 3:     // buffering
            if(this.myState.previous.lastAction === EVENT_PAUSE){
                // Seek Through Timeline
                this.myState.histories.pop(); // remove Pause
                this._recordAction({action: EVENT_SEEKTIMELINE, playingTime: e.target.getCurrentTime()});
            }
            else if(this.myState.previous.notyetstart){
                // keep
            }
            else {
                e.target.seekTo(e.target.getCurrentTime() - 1);
                // even after seeking, the time changed. eliminate time passing effect.

                // Seek Through Keyboard
                const currenTime = e.target.getCurrentTime();
                const previousTime = this.myState.playingTime;
                
                const now = (new Date()).getTime();
                if(currenTime > previousTime){
                    if(histories[histories.length - 1] && histories[histories.length - 1].action === EVENT_SEEKFORWARD && now - histories[histories.length - 1].endingTime < 1000){
                        // do not add new
                    }
                    else {
                        this._recordAction({action: EVENT_SEEKFORWARD, from: e.target.getCurrentTime()-5});
                    }
                }
                else {
                    if(histories[histories.length - 1] && histories[histories.length - 1].action === EVENT_SEEKBACKWARD && now - histories[histories.length - 1].endingTime < 1000){
                        // do not add new
                    }
                    else {
                        this._recordAction({
                            action: EVENT_SEEKBACKWARD, 
                            from: e.target.getCurrentTime()+5
                        });
                    }
                }
            }

            this.myState.previous.lastAction = EVENT_BUFFERING;
            this.myState.previous.time = e.target.getCurrentTime();
            break;

            default:
            break;
        }
    }

    _onPlaybackRateChange(e){
        const playbackRate = e.data;
        const previousRate = this.myState.previous.playbackRate || 1;
        if(playbackRate > previousRate){
            this._recordAction({action: EVENT_SPEEDUP, playbackRate, playingTime: e.target.getCurrentTime()});
        }
        else{
            this._recordAction({action: EVENT_SPEEDDOWN, playbackRate, playingTime: e.target.getCurrentTime()});
        }
        this.myState.previous.playbackRate = playbackRate;
    }

    render() {
        return (
            <YouTube
                ref = {c => {
                    this._videoRef = c;
                    this.props._getRef(c);
                }}
                height={this.props.height || window.innerHeight} 
                width={"100%"} 
                opts={{
                    height: window.innerHeight,
                    width: "100%",
                    playerVars: {
                        autoplay: 1,
                        start: this.props.time || 0,
                        rel: 0,
                        fs: 0,
                    }
                }}
                videoId={this.props.video.id} 
                onStateChange={this._onStateChange.bind(this)}
                onPlaybackRateChange={this._onPlaybackRateChange.bind(this)}
            />
        );
    }
}

export default Video;