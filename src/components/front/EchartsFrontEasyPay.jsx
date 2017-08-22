import React from 'react';
import ReactEcharts from 'echarts-for-react';
import echarts from 'echarts';

class EchartsFrontEasyPay extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            option : {
                title: {
                    text: "一键支付时间线"
                },
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data: ['一键支付人次']
                },
                xAxis: {
                    type: 'time',
                },
                yAxis: {},
                toolbox: {
                    feature: {
                        saveAsImage: {}
                    }
                },
                dataZoom: [{
                    type: 'inside',
                    start: 0,
                    end: 100
                }, {
                    start: 0,
                    end: 100,
                    // handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
                    handleSize: '100%',
                    handleStyle: {
                        color: '#fff',
                        shadowBlur: 3,
                        shadowColor: 'rgba(0, 0, 0, 0.6)',
                        shadowOffsetX: 2,
                        shadowOffsetY: 2
                    }
                }],
                series: [{
                    name: '一键支付人次',
                    type: 'line',
                    symbol: 'none',
                    areaStyle: {
                        normal: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: 'red'
                            }, {
                                offset: 1,
                                color: 'green'
                            }])
                        }
                    },
                    data: [{
                        value: [1501516800000,5]
                    },{
                        value: ["2017-8-2",20]
                    },{
                        value: ["2017-8-3",36]
                    },{
                        value: ["2017-8-4",10]
                    },{
                        value: ["2017-8-5",10]
                    },{
                        value: ["2017-8-6",20]
                    }]
                }]
            }
        };
    }

    componentWillReceiveProps(nextProps) {
        let { option } = this.state;
        option.series[0].data = nextProps.data;
        this.setState({
            option: option
        })
        
    }

    render() {
        const { option } = this.state;
        return (
            <ReactEcharts
                option={option}
                style={{height: '300px', width: '100%'}}
                className={'react_for_echarts'}
            />
        )
    }
}

export default EchartsFrontEasyPay;