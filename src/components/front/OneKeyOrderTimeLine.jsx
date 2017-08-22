/**
 * Created by cwf on 2017/8/8.
 */
import React from 'react';
import { Row, Col, Card, Button, Radio, Icon, Input, DatePicker, Spin, notification } from 'antd';
import moment from 'moment';
import BreadcrumbCustom from '../BreadcrumbCustom';
import EchartsFrontEasyPay from './EchartsFrontEasyPay';
import EchartsPublicPie from './EchartsPublicPie';
import EchartsTimesOfEasyPayBar from './EchartsTimesOfEasyPayBar';
import EchartsTest from './EchartsTest';
import apiPath, {makeParams} from '../../services/apiPath.js'
import {Get, Post} from '../../services/fetch.js'
const { RangePicker } = DatePicker;
const everyDataByTime = 60000; //每隔多久取一次数据（单位毫秒）

class OneKeyOrderTimeLine extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loadingFirst : false,
            startDate : '',
            endDate : '',
            storeId : '',
            frontEasyPayDataArr : [{
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
            }],
            timesOfEasyPayDataArr : [
                {value:335, name:'1次'},
                {value:310, name:'2次'},
                {value:234, name:'3次'},
                {value:135, name:'4次'},
                {value:1548, name:'5次'},
                {value:1548, name:'6次'},
                {value:1548, name:'7次'}
            ]
        };
    }

    componentDidMount(){
        let today = new Date()
        console.log(today)
    }

    onDateChange(mounts,dates){
        let startDate = Date.parse(new Date(dates[0] + ' 00:00:00'));
        let endDate = Date.parse(new Date(dates[1] + ' 23:59:59'));
        console.log(startDate,endDate)
        this.setState({
            startDate : startDate,
            endDate : endDate,
        })
    }

    onSearch(){
        if(this.state.storeId == ''){
            notification.error({
                message: '注意！',
                description: '请填写好门店id'
            })
            return;
        }
        const getQuery = makeParams({
            startDate: this.state.startDate,
            endDate: this.state.endDate,
            storeId: this.state.storeId,
            action: "front_node_easypay_load"
        })
        this.setState({
            loadingFirst : true
        })
        Get('/selectd' + '?' + getQuery).then(({jsonResult})=>{
            this.setState({
                loadingFirst : false
            })
            if(!jsonResult.data || jsonResult.data.length === 0){
                notification.error({
                    message: '注意',
                    description: '后台取不到数据，可能是门店名没有输入正确。'
                });
                return;
            }

            //处理FrontEasyPay（一键支付时间线）
            let frontEasyPayDataObj = {};
            for(let i = this.state.startDate; i < this.state.endDate; i += everyDataByTime){
                frontEasyPayDataObj[parseInt(i / everyDataByTime)] = 0;
            }
            jsonResult.data.forEach((obj, index)=>{
                if(!frontEasyPayDataObj[parseInt(obj.time / everyDataByTime)]){
                    frontEasyPayDataObj[parseInt(obj.time / everyDataByTime)] = 1;
                } else {
                    frontEasyPayDataObj[parseInt(obj.time / everyDataByTime)] ++;
                }
            })
            let frontEasyPayDataArr = []
            for(let key in frontEasyPayDataObj){
                frontEasyPayDataArr.push({value: [[key * everyDataByTime], frontEasyPayDataObj[key]]})
            }
            this.setState({
                frontEasyPayDataArr: frontEasyPayDataArr,
            })

            //处理TimesOfEasyPay（一键支付次数）
            let selectField = 'userId';
            let timesOfEasyPayDataObj = {};
            console.log(jsonResult.data.length)
            jsonResult.data.map(function(res, index) {
                if(!timesOfEasyPayDataObj[res[selectField]]){
                    timesOfEasyPayDataObj[res[selectField]] = [];
                    timesOfEasyPayDataObj[res[selectField]].push(new Date(res.time).toDateString())
                }else  {
                    if(timesOfEasyPayDataObj[res[selectField]].indexOf(new Date(res.time).toDateString()) == -1){
                        timesOfEasyPayDataObj[res[selectField]].push(new Date(res.time).toDateString())
                    }
                }
            })
            for(let key in timesOfEasyPayDataObj){
                timesOfEasyPayDataObj[key] = timesOfEasyPayDataObj[key].length;
            }

            let calculateDataObj = {};
            for(let key in timesOfEasyPayDataObj){
                if(!calculateDataObj[`${timesOfEasyPayDataObj[key]}次`]){
                    calculateDataObj[`${timesOfEasyPayDataObj[key]}次`] = 1;
                }else {
                    calculateDataObj[`${timesOfEasyPayDataObj[key]}次`] ++;
                }
            }

            
            let timesOfEasyPayDataArr = [];
            for(let key in calculateDataObj){
                let value = calculateDataObj[key];
                timesOfEasyPayDataArr.push({value : value, name: key})
            }
            timesOfEasyPayDataArr.sort(function(a,b){
                return parseInt(b.name) - parseInt(a.name);
            })
            this.setState({
                timesOfEasyPayDataArr : timesOfEasyPayDataArr
            })

        })

    }

    emitEmpty = () => {
        this.storeIdInput.focus();
        this.setState({ storeId: '' });
    }
    onChangeStoreId = (e) => {
        this.setState({ storeId: e.target.value });
    }

    render() {
        const { storeId } = this.state;
        const suffix = storeId ? <Icon type="close-circle" onClick={this.emitEmpty} /> : null;
        return (
            <div className="oneKey_order">
            <Spin spinning={this.state.loadingFirst} tip="正在加载。。。">
                <BreadcrumbCustom first="用户端信息" second="一键支付时间线" />
                <Row gutter={16}>
                    <Col className="gutter-row" span={24}>
                        <Card>
                            <RangePicker
                                onChange={this.onDateChange.bind(this)}
                            />
                            <Input
                                style={{ width: 300 }}
                                placeholder="输入门店id。。。"
                                prefix={<Icon type="shop" />}
                                suffix={suffix}
                                value={storeId}
                                onChange={this.onChangeStoreId}
                                ref={node => this.storeIdInput = node}
                            />
                            <Button type="primary" onClick={this.onSearch.bind(this)}>搜索</Button>
                        </Card>
                    </Col>
                    <Col className="gutter-row" span={24}>
                        <div className="gutter-box">
                            <Card>
                                <EchartsFrontEasyPay data={this.state.frontEasyPayDataArr} />
                            </Card>
                        </div>
                    </Col>
                    <Col className="gutter-row" span={24}>
                        <div className="gutter-box">
                            <Card>
                                <EchartsPublicPie data={this.state.timesOfEasyPayDataArr}/>
                            </Card>
                        </div>
                    </Col>
                    <Col className="gutter-row" span={24}>
                        <div className="gutter-box">
                            <Card>
                                <EchartsTimesOfEasyPayBar data={this.state.timesOfEasyPayDataArr}/>
                            </Card>
                        </div>
                    </Col>
                </Row>
            </Spin>
                
                <style>{`
                    .oneKey_order .ant-card {
                        margin-bottom: 12px;
                    }
                    .oneKey_order .ant-btn {
                        margin: 0 12px;
                    }
                `}</style>
            </div>
        )
    }
}

export default OneKeyOrderTimeLine;
