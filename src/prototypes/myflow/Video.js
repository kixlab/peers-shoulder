import React from 'react';
import YouTube from 'react-youtube';
 
class Video extends React.Component {
  render() {
    const opts = {
      height: this.props.height || '600',
      width: this.props.width || '1000',
      playerVars: { // https://developers.google.com/youtube/player_parameters
        autoplay: 1,
        start: this.props.currentTime,
        rel: 0,
        fs: 0,
      }
    };
 
    return (
      <YouTube
        videoId= {this.props.videoId}
        opts={opts}
        onReady={this._onReady}
      />
    );
  }
 
  _onReady(event) {
    // access to player in all event handlers via event.target
    //event.target.pauseVideo();
  }
}

export default Video;