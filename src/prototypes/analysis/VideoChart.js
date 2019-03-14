import React, { Component, Fragment } from 'react'
import ReactHighcharts from 'react-highcharts'

import { DB } from '../../utils/Database';
import { BEHAVIORS } from './../behaviours/E2BVideo';

const { SEEKFORWARD, SEEKBACKWARD } = BEHAVIORS;

export default class VideoChart extends Component {
    constructor(props){
        super(props);

        this.state = {
            chart: {
                type: 'spline',
                height: window.innerHeight,
                inverted: true,
                zoomType: 'x',
            },
            xAxis: {
                reversed: false,
                title: {
                    enabled: true,
                    text: 'Time'
                },
                labels: {
                    format: '{value} s'
                },
                maxPadding: 0.05,
                showLastLabel: true
            },
            yAxis: {
                title: {
                    text: 'Video Playingtime'
                },
                labels: {
                    format: '{value} s'
                },
                lineWidth: 2
            },
            legend: {
                enabled: false
            },
            tooltip: {
                headerFormat: '<b>{series.name}</b><br/>',
                pointFormat: '{point._meta.behavior}: {point.y}s at {point.x}s'
            },
            plotOptions: {
                spline: {
                    marker: {
                        enable: false
                    }
                }
            },
            series: []
        }
    }

    componentDidMount(){
        if(this.props.users){
            DB.getJSON()
            .then(all => {
                var series = Object.keys(all).filter(key => this.props.users.includes(key)).map(user => {
                    var trajectory = all[user];
                    var initial = new Date(trajectory[0].time).getTime();
                    var data = trajectory.map(tr => {
                        var time = (new Date(tr.time).getTime() - initial)/1000;
                        
                        var parsed_time = parseInt(time.toFixed(2));
                        var parsed_playing = parseInt(tr.playingTimeFrom ? tr.playingTimeFrom.toFixed(2) : 0);
                        
                        if(tr.videoFrom.id !== this.props.videoId) {
                            return {
                                x:parsed_time,
                                y:null,
                                _meta: tr,
                                marker: {
                                    symbol: 'circle'
                                }
                            }
                        }

                        return {
                            x:parsed_time,
                            y:parsed_playing,
                            _meta: tr,
                            marker: {
                                symbol: 'circle'
                            }
                        }
                    });

                    var parsed = [data[0]];
                    data.forEach(d => {
                        if(parsed[parsed.length - 1].y !== d.y){
                            parsed.push(d);

                            // add end of seeking
                            if(d._meta.behavior === SEEKFORWARD || d._meta.behavior === SEEKBACKWARD){
                                parsed.push({
                                    ...d,
                                    y: d._meta.playingTimeTo,
                                    marker: {
                                        symbol: 'diamond'
                                    }
                                })
                            }
                        }
                    });

                    return {
                        name: user,
                        data: parsed,
                        marker: {
                            enabled: true,
                            symbol: "triangle"
                        }
                    };
                });

                this.setState({
                    title: {
                        text: this.props.videoId
                    },
                    series
                });
            })
        }
    }

    render() {
        return (
            <Fragment>
                <ReactHighcharts config={this.state} />
            </Fragment>
        )
    }
}