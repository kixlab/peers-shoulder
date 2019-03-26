import React, { Component } from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import { DB } from '../../utils/Database';

export default class Chart extends Component {
    state = {

    }
    
    componentDidMount(){
        DB.get("kixtube").getJSON([])
        .then(histories => {
            histories = histories.map(history => history.record);
            histories = histories.map(history => {
                var initial = history[0].time;
                history = history.map(record => ({...record, time: record.time - initial}));
                return history;
            });

            this.setState({
                example: histories[0]
            })
        });
    }

    render() {
        return (
            <div>
                <LineChart layout="horizontal" width={window.innerWidth/2} height={window.innerHeight/2} data={this.state.example} margin={{ top: 30, right: 30, bottom: 30, left: 30 }}>
                    <Line type="monotone" dataKey="playingTime" stroke="#8884d8" dot={false} />
                    <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                </LineChart>
            </div>
        )
    }
}