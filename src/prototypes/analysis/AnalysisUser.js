import React, { Component, Fragment } from 'react'
import UserChart from './UserChart';
import { Grid, Label } from 'semantic-ui-react';
import { DB } from '../../utils/Database';

export default class AnalysisUser extends Component {
    state = {
        allusers: []
    }

    constructor(props){
        super(props);

        if(this.props.match.params.user){
            var res = this.props.match.params.user.split(",");
            res = res.map(str => str.trim());
            res = res.filter(str => str !== '');
            this.users = res;
        }
    }

    componentDidMount(){
        DB.getJSON()
        .then(all => {
            this.setState({
                allusers: Object.keys(all)
            })
        })
    }

    render() {
        return (
            <Fragment>
                <Label.Group color='blue'>
                    {
                        this.state.allusers.map((user, i) => (
                            <Label key={i} as='a' href={'/analysis/users/'+user}>{user}</Label>
                        ))
                    }
                </Label.Group>
                {
                    this.users ? 
                    <Grid columns='equal'>
                        {
                            this.users.map((user, i) => (
                                <Grid.Column key={i}>
                                    <UserChart user={user} videoIds={["gKkh0aMpQyU", "LwJOWM9Bc5U", "aMeuZpBnlj8", "3q3FV65ZrUs", "8ZaX6qEcUCU"]}/>
                                </Grid.Column>
                            ))
                        }
                    </Grid> :
                    <Grid columns='equal'>
                    {
                        this.state.allusers.map((user, i) => (
                            <Grid.Column key={i}>
                                <UserChart user={user} videoIds={["gKkh0aMpQyU", "LwJOWM9Bc5U", "aMeuZpBnlj8", "3q3FV65ZrUs", "8ZaX6qEcUCU"]}/>
                            </Grid.Column>
                        ))
                    }
                </Grid>
                }
            </Fragment>
        )
    }
}