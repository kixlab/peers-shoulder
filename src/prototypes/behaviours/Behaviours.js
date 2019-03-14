import React, { Component } from 'react';
import { Grid, Dropdown, Header, Button, Input } from 'semantic-ui-react';

import E2BVideo, {BEHAVIORS} from './E2BVideo';
import History from './History';

import myflow from './myflow_history.json';

import { DB } from '../../utils/Database';

class Behaviours extends Component {
    state = {
        video: {
            id: "3q3FV65ZrUs",
            title: "Figma Tutorial - A Free UI Design/Prototyping Tool. It's awesome.",
        },
        time: 0,
        histories: [],
        crowd_history: myflow
    }

    constructor(props){
        super(props);

        if(this.props.match.params.user){
            DB.get(this.props.match.params.user).getJSON()
            .then(crowd_history => {
                if(crowd_history){
                    this.setState({
                        crowd_history
                    })
                }
            })
        }
    }

    componentDidMount(){
        this.videoRef.internalPlayer.seekTo(0);
    }

    _getOptions(){
        var videos = this.state.crowd_history.map(flow => ({
            key: flow.videoFrom.id,
            value: flow.videoFrom.id,
            text: flow.videoFrom.title,
        }));
        var videoIds = this.state.crowd_history.map(flow => flow.videoFrom.id);
        videos = videos.filter((video, i) => videoIds.indexOf(video.key) === i);

        return videos;
    }

    _jump(e, { value }){
        this.setState({ 
            video: {
                id: value,
                title: this.state.crowd_history.filter(flow => flow.videoFrom.id === value)[0].videoFrom.title
            }
        })
    }

    updateVideo(video, time){
        this.setState({video, time});
        this.videoRef.internalPlayer.seekTo(time);
    }

    _onBehaviorCreated(behavior, {time, playingTimeFrom, playingTimeTo, videoFrom, videoTo, playbackRate}){
        var histories = this.state.histories;
        const lastHistory = histories[histories.length-1];

        if(lastHistory && lastHistory.behavior === behavior){
            if(lastHistory.behavior === BEHAVIORS.SEEKFORWARD && playingTimeFrom - lastHistory.playingTimeTo < 1){
                histories[histories.length-1].playingTimeTo = playingTimeTo;
                this.setState({histories});
                return;
            }
            else if(lastHistory.behavior === BEHAVIORS.SEEKBACKWARD && lastHistory.playingTimeTo - playingTimeFrom < 1){
                histories[histories.length-1].playingTimeTo = playingTimeTo;
                this.setState({histories});
                return;
            }
        }

        this.setState({
            histories: [
                ...histories,
                {
                    time,
                    behavior,
                    playingTimeFrom,
                    playingTimeTo,
                    videoFrom,
                    videoTo,
                    playbackRate
                }
            ]
        })
    }

    _onSave(){
        DB.get(this._fileName).putJSON(this.state.histories)
        .then(()=>{
            alert("Saved!");
        })
    }

    render() {
        return (
            <Grid columns={2}>
                <Grid.Column width={3} style={{paddingTop: 20, paddingBottom: 20, paddingLeft: 20}}>
                    <Header style={{margin: 10}}> Juan's Experience </Header>
                    <div style = {{height: window.innerHeight-60}}>
                        <History
                            histories = {this.state.crowd_history} 
                            _onVideoChanged = {this.updateVideo.bind(this)}
                        />
                    </div>
                </Grid.Column>

                <Grid.Column width={10} style={{paddingRight: 0, paddingLeft: 0}}>
                    <E2BVideo
                        time = {this.state.time}
                        video = {this.state.video}
                        _onBehaviorCreated = {this._onBehaviorCreated.bind(this)}
                        _onEventsIgnored = {(state, event) => console.log('[IGNORED]', state, event)}
                        _videoRef = {ref => this.videoRef = ref}
                    />
                </Grid.Column>

                <Grid.Column width={3} style={{paddingTop: 20, paddingBottom: 20, paddingRight: 20}}>
                    <Dropdown 
                        clearable
                        search
                        selection
                        fluid 
                        list='videos' 
                        placeholder='Choose video...' 
                        options={this._getOptions()}
                        onChange={this._jump.bind(this)}
                    />
                    <Input onChange={e=>this._fileName = e.target.value} style={{marginTop: 10, marginRight: 10}}></Input><Button onClick={this._onSave.bind(this)}>Save</Button>
                    <div style = {{height: window.innerHeight-120}}>
                        <History 
                            histories = {this.state.histories} 
                            _onVideoChanged = {this.updateVideo.bind(this)}
                        />
                    </div>
                </Grid.Column>
            </Grid>
        );
    }
}

export default Behaviours;