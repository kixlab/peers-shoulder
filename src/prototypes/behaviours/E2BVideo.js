/*
    Event to Behavior Video
    - parse YouTube actions into user behavior
*/

import React, { Component } from 'react';
import YouTube from 'react-youtube';

/* events from YouTube video player */
export const EVENTS = {
    PLAY: 1,
    PAUSE: 2,
    NOTSTART: -1,
    BUFFERING: 3,
    END: 0
};

/* behaviors of users watching videos */
export const BEHAVIORS = {
    PLAY: "Play",
    PAUSE: "Pause",
    JUMP: "Jump",
    END: "End",
    FORCEEND: "Force End",
    SEEK: "Seek",
    SEEKFORWARD: "Seek Forward",
    SEEKBACKWARD: "Seek Backward",
    SEEKIMMEDIATELY: "Seek Immediately",
    SPEEDUP: "Speed Up",
    SPEEDDOWN: "Speed Down"
}

const STATES = {
    _End: "_End",
    _Start: "_Start",
    Play: "Play",
    Pause: "Pause",
    NotStart: "Not Start",
    Buffering: "Buffering",
    End: "End",
    TempPause: "TempPause",
    TryPlay: "TryPlay",
    InitialBuffer: "InitialBuffer",
    GotoBuffer: "GotoBuffer",
    NeedToWait: "NeedToWait",
}

/*
    class E2BVideo
    - handle YouTube video interface

    props
    _onBehaviorCreated(behavior, {time, playingTimeFrom, playingTimeTo, videoFrom, videoTo})
    _onEventsIgnored(state, event)
    _videoRef
    time
    video{id, title}
*/
class E2BVideo extends Component {
    constructor(props){
        super(props);

        this.meta = {
            playbackRate: 1,
            state: STATES._Start
        }

        this.saved = {
            video: this.props.video,
            playingTime: 0
        }

        setTimeout(()=>this._updatePlayingTime(), 10);
    }

    _updatePlayingTime(){
        if(this._videoRef){
            this._videoRef.internalPlayer.getCurrentTime()
            .then(playingTime => {
                if(Math.abs(playingTime - this.saved.playingTime) > 1){
                    if(!this.saved.seekPlayingTime)
                        this.saved.seekPlayingTime = this.saved.playingTime;
                }
                this.saved.playingTime = playingTime;
            });
        }

        setTimeout(()=>this._updatePlayingTime(), 10);
    }

    _resetState(){
        this.meta.state = STATES._Start;
        this.saved.video = this.props.video;
        this.saved.seekPlayingTime = null;
    }

    _onEventsIgnored(state, event){
        this.props._onEventsIgnored(state, event);
        this._resetState();
    }

    async _onBehaviorCreated(behavior){
        const playingTime = await this._videoRef.internalPlayer.getCurrentTime();

        var meta = {
            time: new Date(),
            playbackRate: this.meta.playbackRate,
            videoFrom: this.saved.video
        };

        if(behavior === BEHAVIORS.SEEK){
            meta.playingTimeFrom = this.saved.seekPlayingTime;
            meta.playingTimeTo = playingTime;

            if(this.props.video.id !== this.saved.video.id){
                meta.videoTo = this.props.video;
                this.props._onBehaviorCreated(BEHAVIORS.JUMP, meta);
            }
            else{
                if(playingTime > this.saved.seekPlayingTime){
                    this.props._onBehaviorCreated(BEHAVIORS.SEEKFORWARD, meta);
                }
                else{
                    this.props._onBehaviorCreated(BEHAVIORS.SEEKBACKWARD, meta);
                }
            }
        }
        else{
            meta.playingTimeFrom = playingTime;
            this.props._onBehaviorCreated(behavior, meta);
        }
        
        this._resetState();
    }

    _onState_Start(event){
        switch(event){
            case EVENTS.PLAY:
            this.meta.state = STATES.Play;
            setTimeout(()=>{
                if(this.meta.state === STATES.Play){
                    this._onBehaviorCreated(BEHAVIORS.PLAY);
                }
            }, 500);
            break;

            case EVENTS.PAUSE:
            this.meta.state = STATES.Pause;
            setTimeout(()=>{
                if(this.meta.state === STATES.Pause){
                    this._onBehaviorCreated(BEHAVIORS.PAUSE);
                }
            }, 500);
            break;

            case EVENTS.BUFFERING:
            this.meta.state = STATES.Buffering;
            break;

            case EVENTS.END:
            this.meta.state = STATES.End;
            setTimeout(()=>{
                if(this.meta.state === STATES.End){
                    this._onBehaviorCreated(BEHAVIORS.END);
                }
            }, 500);
            break;

            case EVENTS.NOTSTART:
            this.meta.state = STATES.NotStart;
            break;

            default:
            this._onEventsIgnored(STATES._Start, event);
            break;
        }
    }

    _onStatePlay(event){
        switch(event){
            case EVENTS.PAUSE:
            this.meta.state = STATES.TempPause;
            break;

            case EVENTS.BUFFERING:
            this.meta.state = STATES.Buffering;
            break;

            default:
            this._onEventsIgnored(STATES.Play, event);
            break;
        }
    }

    _onStateBuffering(event){
        switch(event){
            case EVENTS.PLAY:
            this._onBehaviorCreated(BEHAVIORS.SEEK);
            break;

            case EVENTS.NOTSTART:
            this.meta.state = STATES.TryPlay;
            break;

            default:
            this._onEventsIgnored(STATES.Buffering, event);
            break;
        }
    }

    _onStatePause(event){
        switch(event){
            case EVENTS.BUFFERING:
            this.meta.state = STATES.GotoBuffer;
            break;

            case EVENTS.END:
            this._onBehaviorCreated(BEHAVIORS.FORCEEND);
            break;

            case EVENTS.NOTSTART:
            this.meta.state = STATES.TryPlay;
            break;

            default:
            this._onEventsIgnored(STATES.Pause, event);
            break;
        }
    }


    _onStateEnd(event){
        switch(event){
            case EVENTS.NOTSTART:
            this.meta.state = STATES.TryPlay;
            break;

            default:
            this._onEventsIgnored(STATES.End, event);
            break;
        } 
    }

    _onStateNotStart(event){
        switch(event){
            case EVENTS.BUFFERING:
            this.meta.state = STATES.InitialBuffer;
            break;

            default:
            this._onEventsIgnored(STATES.NotStart, event);
            break;
        }
    }

    _onStateTempPause(event){
        switch(event){
            case EVENTS.BUFFERING:
            this.meta.state = STATES.GotoBuffer;
            break;

            case EVENTS.NOTSTART:
            this.meta.state = STATES.TryPlay;
            break;

            case EVENTS.END:
            this._onBehaviorCreated(BEHAVIORS.FORCEEND)
            break;

            default:
            this._onEventsIgnored(STATES.TempPause, event);
            break;
        }
    }

    _onStateTryPlay(event){
        switch(event){
            case EVENTS.BUFFERING:
            this.meta.state = STATES.NeedToWait;
            break;

            case EVENTS.PLAY:
            this._onBehaviorCreated(BEHAVIORS.SEEK)
            break;

            case EVENTS.END:
            this._onBehaviorCreated(BEHAVIORS.FORCEEND)
            break;

            default:
            this._onEventsIgnored(STATES.TryPlay, event);
            break;
        }
    }

    _onStateInitialBuffer(event){
        switch(event){
            case EVENTS.PLAY:
            this._onBehaviorCreated(BEHAVIORS.PLAY);
            break;

            case EVENTS.NOTSTART:
            this.meta.state = STATES.TryPlay;
            break;

            default:
            this._onEventsIgnored(STATES.InitialBuffer, event);
            break;
        }
    }

    _onStateGotoBuffer(event){
        switch(event){
            case EVENTS.PLAY:
            this._onBehaviorCreated(BEHAVIORS.SEEKIMMEDIATELY);
            break;

            default:
            this._onEventsIgnored(STATES.GotoBuffer, event);
            break;
        }
    }

    _onStateNeedToWait(event){
        switch(event){
            case EVENTS.PLAY:
            this._onBehaviorCreated(BEHAVIORS.SEEK);
            break;

            case EVENTS.NOTSTART:
            this.meta.state = STATES.TryPlay;
            break;

            default:
            this._onEventsIgnored(STATES.NeedToWait, event);
            break;
        }
    }

    // function _onStateChange: event(html video query) -> void
    // - on video state changed
    _onStateChange(e){
        const {state} = this.meta;
        const event = e.data;

        console.log('[STATE] ', event)

        switch(state){
        case STATES._Start:
            this._onState_Start(event);
        break;

        case STATES.Play:
            this._onStatePlay(event);
        break;

        case STATES.Buffering:
            this._onStateBuffering(event);
        break;

        case STATES.Pause:
        this._onStatePause(event);
        break;
        
        case STATES.End:
            this._onStateEnd(event);
        break;

        case STATES.NotStart:
            this._onStateNotStart(event);
        break;

        case STATES.TempPause:
            this._onStateTempPause(event);
        break;
        
        case STATES.TryPlay:
            this._onStateTryPlay(event);
        break;

        case STATES.InitialBuffer:
            this._onStateInitialBuffer(event);
        break;

        case STATES.GotoBuffer:
            this._onStateGotoBuffer(event);
        break;

        case STATES.NeedToWait:
            this._onStateNeedToWait(event);
        break;

        default:
        break;
        }
    }

    // callback on playback rate changed
    _onPlaybackRateChange(e){
        const { playbackRate } = this.meta;
        const currentRate = e.data;
        if(currentRate > playbackRate){ // speed up
            this.meta.playbackRate = currentRate;
            this._onBehaviorCreated(BEHAVIORS.SPEEDUP);
        }
        else{   // speed down
            this.meta.playbackRate = currentRate;
            this._onBehaviorCreated(BEHAVIORS.SPEEDDOWN);
        }
    }

    render() {
        return (
            <YouTube
                ref = {c => {
                    this._videoRef = c;
                    this.props._videoRef(c);
                }}
                height={this.props.height || window.innerHeight} 
                width={"100%"} 
                opts={{
                    height: this.props.height || window.innerHeight,
                    width: "100%",
                    playerVars: {
                        autoplay: 1,
                        start: this.props.time || 0,
                        rel: 0,
                        fs: 1,
                    }
                }}
                videoId={this.props.video.id} 
                onStateChange={this._onStateChange.bind(this)}
                onPlaybackRateChange={this._onPlaybackRateChange.bind(this)}
            />
        );
    }
}

export default E2BVideo;