import React from 'react';
import ReactEcharts from 'echarts-for-react';
import echarts from 'echarts';


class EchartsTest extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            option : {
                title: {
                    text: '一键支付次数数据统计',
                    x:'center',
                },
                color: ['#3398DB'],
                tooltip : {
                    trigger: 'axis',
                    axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                        type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis : [
                    {
                        name : '次数',
                        type : 'category',
                        data : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                        axisTick: {
                            alignWithLabel: true,
                        },
                        axisLabel:{
                            interval: 0
                        }
                    }
                ],
                yAxis : [
                    {
                        type : 'value',
                        name : '人数'
                    }
                ],
                toolbox: {
                    feature: {
                        saveAsImage: {}
                    }
                },
                series : [
                    {
                        name:'人数',
                        type:'bar',
                        barWidth: '60%',
                        label:{
                            normal: {
                                show: true,
                                position: 'top',
                                textStyle: {
                                    color: '#000'
                                }
                            }
                        },
                        data:[10, 52, 200, 334, 390, 330, 220]
                    }
                ]
            }
        }
    }

    componentWillReceiveProps(nextProps) {
        let { option } = this.state;
        option.series[0].data = [];
        option.xAxis[0].data = [];
        nextProps.data.map(function(res, index) {
            option.xAxis[0].data.push(res.name.substring(0,res.name.indexOf('次')+1));
            option.series[0].data.push(res.value);
        })
        this.setState({
            option: option
        })
    }

    render() {
        const {option} = this.state
        return (
            <ReactEcharts
                option={option}
                style={{height: '500px', width: '100%'}}
                className={'react_for_echarts'}
            />
        )
    }
}

export default EchartsTest;

