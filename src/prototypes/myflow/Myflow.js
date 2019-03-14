import React, { Component } from 'react';

import Video from "./Video";
import Scrollbar from "react-scrollbars-custom";

import {Timeline, TimelineEvent} from 'react-event-timeline'

import flow from './myflow.json';

class Myflow extends Component {
  state = {
    videoId: "3q3FV65ZrUs",
    playingTime: 0,
  }

  setVideo(s, i) {
    this.setState({
      playingTime: s,
      videoId: i
    });
  }

  render() {
    return (
      <div className="App" style = {{display: 'flex', justifyContent:'center', alignContent:'center'}}>
        <div style = {{marginLeft:50, marginRight:50, marginTop:150}}>
        <Video videoId={this.state.videoId} currentTime={this.state.playingTime}/>
        </div>
        <Scrollbar style={ {width: '100%', height: '100%', minHeight: 1000} } >
        <Timeline>
          {
            flow.map((value, i) => {
              return(
                <TimelineEvent
                  title = {value.title}
                  createdAt = {value.createdAt}
                  icon = {value.icon}
                >
                  <button onClick={() => {this.setVideo(value.sec, value.videoId)}}> Show </button>
                  {value.text}
                </TimelineEvent>
              )
            })
          }
      </Timeline>
        </Scrollbar>
      </div>
    );
  }
}

export default Myflow;