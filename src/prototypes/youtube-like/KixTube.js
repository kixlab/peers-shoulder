import React, { Component } from 'react'
import { Menu, Icon, Header, Divider, Segment, Image, Input, Message, Modal } from 'semantic-ui-react';
import E2BVideo, {BEHAVIORS} from '../behaviours/E2BVideo';
import videos from './videos.json';
import { DB } from '../../utils/Database';

import "./KixTube.css";
import task from './task.png';

export default class YouTube extends Component {
    state = {
        video: null,
        time: 0,
        histories: [],
    }

    componentDidMount(){
        setTimeout(() => {
            this.setState({
                yuy: true
            })
        }, 8000);
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

    render() {
        return (
            <div>
                <Menu borderless fixed="top" size="massive">
                    <Menu.Item>
                        <Icon name="youtube" color='red' /> KixTube
                    </Menu.Item>
                    <Modal
                        trigger={<Menu.Item>Goal?</Menu.Item>}
                    >
                        <Modal.Header>Your goal is to learn Figma:</Modal.Header>
                        <Modal.Content>
                            This is a sample of this task. Please complete those six components.
                            <Image src={task} />
                            After finished, please enter your name and click the save button. Only use alphabet and no blank in your name.
                        </Modal.Content>
                    </Modal>
                    
                    <Menu.Item position='right'>
                        <Icon name="user circle" size='large' />
                        <Input
                            size="mini"
                            placeholder='your name'
                            action={{color: 'red', content: 'save', onClick: ()=>{
                                DB.get(this.username).putJSON(this.state.histories)
                                .then(()=>{
                                    alert("Saved!");
                                })
                            }}}
                            onChange={(e, {value}) => this.username = value}
                        />
                    </Menu.Item>
                </Menu>

                <div className="container">
                    <div className="video">
                        {this.state.video ? 
                        <div>
                            <E2BVideo
                                height = {window.innerHeight * 0.7}
                                time = {this.state.time}
                                video = {this.state.video}
                                _onBehaviorCreated = {this._onBehaviorCreated.bind(this)}
                                _onEventsIgnored = {(state, event) => console.log('[IGNORED]', state, event)}
                                _videoRef = {ref => this.videoRef = ref}
                            />
                            <Header>
                                {this.state.video.title}
                                <Header.Subheader>Recording {this.state.histories.length} behavior(s)...</Header.Subheader>
                            </Header>
                        </div>
                        : <Message warning>Select Video to Watch</Message>
                        }
                        <Divider />
                    </div>
                    <div className="playlist">
                        <Header>List of Possible Videos</Header>
                        {
                            videos.map(video => {
                                return (
                                    <Segment style={{cursor: "pointer"}} onClick={()=>this.setState({video})}>
                                        <Image src={`https://img.youtube.com/vi/${video.id}/hqdefault.jpg`} fluid />
                                        <Header>
                                            {video.title}
                                            <Header.Subheader>{video.description}</Header.Subheader>
                                        </Header>
                                    </Segment>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        )
    }
}