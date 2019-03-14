import React, { Component, Fragment } from 'react'
import VideoChart from './VideoChart';
import { Grid, Label } from 'semantic-ui-react';
import { DB } from '../../utils/Database';

export default class AnalysisVideo extends Component {
    state = {

    }

    constructor(props){
        super(props);

        if(this.props.match.params.video){
            var res = this.props.match.params.video.split(",");
            res = res.map(str => str.trim());
            res = res.filter(str => str !== '');
            this.videoIds = res;
        }
    }

    componentDidMount(){
        DB.getJSON()
        .then(users => {
            console.log(Object.keys(users))
            this.setState({
                users: Object.keys(users)
            })
        })
    }

    render() {
        var users = this.state.users;
        var videoArray = ["gKkh0aMpQyU", "LwJOWM9Bc5U", "aMeuZpBnlj8", "3q3FV65ZrUs", "8ZaX6qEcUCU"];
        return (
            <Fragment>
                <Label.Group color='blue'>
                    {
                        videoArray.map((videoId, i) => (
                            <Label key={i} as='a' href={'/analysis/video/'+videoId}>{videoId}</Label>
                        ))
                    }
                </Label.Group>
                {
                    this.videoIds ? 
                    <Grid columns='equal'>
                        {
                            this.videoIds.map((videoId, i) => (
                                <Grid.Column key={i}>
                                    <VideoChart videoId={videoId} users = {users || ["RyuHyun", "Woojin", "Hyunchang", "minkyu", "antaehyeon"]}/>
                                </Grid.Column>
                            ))
                        }
                    </Grid> : null
                }
            </Fragment>
        )
    }
}