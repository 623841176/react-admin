import React from 'react';
import ReactEcharts from 'echarts-for-react';
import echarts from 'echarts';


class EchartsPublicPie extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            option : {
                title : {
                    text: this.props.title || '一键支付次数数据统计',
                    // subtext: '纯属虚构',
                    x:'center',
                },
                tooltip : {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                legend: {
                    orient: 'vertical',
                    left: 'left',
                    data: ['1次','2次','3次','4次','5次','6次','7次']
                },
                toolbox: {
                    feature: {
                        saveAsImage: {}
                    }
                },
                series : [
                    {
                        name: this.props.name || '人数统计',
                        type: 'pie',
                        radius : '55%',
                        center: ['50%', '60%'],
                        data:[
                            {value:335, name:'1次'},
                            {value:310, name:'2次'},
                            {value:234, name:'3次'},
                            {value:135, name:'4次'},
                            {value:1548, name:'5次'},
                            {value:1548, name:'6次'},
                            {value:1548, name:'7次'}
                        ],
                        itemStyle: {
                            emphasis: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                ]
            }
        }
    }

    componentWillReceiveProps(nextProps) {
        let { option } = this.state;
        let data = [];
        let totalNum = 0; //总数，以便计算比率
        nextProps.data.forEach((res, index) => {
            totalNum += res.value;
        })
        nextProps.data.forEach((res, index) => {
            data[index] = JSON.parse(JSON.stringify(res));
            let rate = parseInt((res.value / totalNum) * 10000) / 100;
            data[index].name = `${res.name}\n${res.value}(${rate}%)`;
        })

        option.series[0].data = data;
        option.legend.data = [];
        data.map(function(res, index) {
            option.legend.data.push(res.name);
        })
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

export default EchartsPublicPie;