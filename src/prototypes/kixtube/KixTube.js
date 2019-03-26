import React, { Component } from 'react'
import { Menu, Icon, Button, Header, Input, Message } from 'semantic-ui-react';
import { DB } from '../../utils/Database';
import YouTube from 'react-youtube';

import "./KixTube.css";

export default class KixTube extends Component {
    state = {
        video: null,
        time: 0,
        histories: [],
        records: [],
    }

    recordTime(){
        if(this.videoRef){
            this.videoRef.internalPlayer.getCurrentTime()
            .then(time => {
                this.setState({
                    records: [
                        ...this.state.records,
                        {
                            playingTime: time,
                            time: new Date().getTime()
                        }
                    ]
                })
            })
        }
        setTimeout(()=>{
            this.recordTime();
        }, 100);
    }

    onStartButtonClicked(){
        if(!this.flag_started){
            this.flag_started = true;
            this.setState({
                video: {
                    id: "aM6k1j3UuTg"
                },
                deactivate_start: true,
            })
            this.recordTime();
        }
    }

    onSaveButtonClicked(){
        DB.get('kixtube').getJSON([])
        .then(histories => {
            histories.push({
                answer_hue_for_yellow: this.answer_hue_for_yellow,
                answer_grain_amount: this.answer_grain_amount,
                answer_contrast: this.answer_contrast,
                video: this.state.video.id,
                record: this.state.records
            });

            DB.get('kixtube').putJSON(histories)
            .then(()=>{
                alert("Thank you very much!");
            })
        })
    }

    _cleanDB(){
        DB.putJSON(null);
    }

    render() {
        return (
            <div>
                <Menu borderless fixed="top" size="massive">
                    <Menu.Item>
                        <Icon name="youtube" color='red' /> KixTube
                    </Menu.Item>
                </Menu>

                <div className="container">
                    <div className="video">
                        <div>
                            {this.state.video ?
                            <YouTube
                                ref = {c => this.videoRef = c}
                                opts={{
                                    height: window.innerHeight * 0.7,
                                    width: "100%",
                                    playerVars: {
                                        autoplay: 1,
                                        start: this.state.time,
                                        rel: 0,
                                        fs: 0,
                                    }
                                }}
                                videoId={this.state.video.id} 
                            /> : <Message warning>Read instruction and click the button to start!</Message>
                            }
                        </div>
                    </div>
                    <div className="playlist">
                        <h1>Instruction</h1>

                        <div style={{backgroundColor: "#ecf0f1", padding: "1em"}}>
                            <Header>1. Watch the video</Header>
                            {
                                this.state.deactivate_start ? 
                                <Button primary disabled>Click here to start</Button>:
                                <Button primary onClick={()=>{this.onStartButtonClicked()}}>Click here to start</Button>
                            }
                        </div>

                        <div style={{backgroundColor: "#ecf0f1", padding: "1em", marginTop: "1em"}}>
                            <Header>2. Answer the following questions</Header>
                            <p>Q. How much Contrast did he set?</p>
                            <Input fluid onChange={v => this.answer_contrast = v.target.value} placeholder="contrast" />
                            <p>Q. How much Hue for Yellow did he finally set?</p>
                            <Input fluid onChange={v => this.answer_hue_for_yellow = v.target.value} placeholder="hue value for yello" />
                            <p>Q. How much Grain Amount did he finally set?</p>
                            <Input fluid onChange={v => this.answer_grain_amount = v.target.value} placeholder="grain amount" />
                        </div>

                        <div style={{backgroundColor: "#ecf0f1", padding: "1em", marginTop: "1em"}}>
                            <Header>3. Click save button</Header>
                            {
                                this.answer_contrast && this.answer_hue_for_yellow && this.answer_grain_amount ?
                                <Button primary onClick={()=>{this.onSaveButtonClicked()}}>Save!</Button>:
                                <Button primary disabled>Save!</Button>
                            }
                        </div>

                        <Header>Thank you very much</Header>
                    </div>
                </div>
            </div>
        ) // answer is 9 / -86 / 21
    }
}