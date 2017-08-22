/**
 * Created by cwf on 2017/8/16.
 */
import React from 'react';
import { Row, Col, Card, Button, Radio, Icon, Input, DatePicker, Spin, notification } from 'antd';
import moment from 'moment';
import BreadcrumbCustom from '../BreadcrumbCustom';
import EchartsFrontEasyPay from './EchartsFrontEasyPay';
import EchartsPublicPie from './EchartsPublicPie';
import EchartsTimesOfEasyPayBar from './EchartsTimesOfEasyPayBar';
import EchartsTest from './EchartsTest';
import apiPath, {makeParams} from '../../services/apiPath.js';
import {Get, Post} from '../../services/fetch.js';
import SearchStore from '../public/SearchStore';
const { RangePicker } = DatePicker;

//根据userId去重
function delRepeat(arr){
    let resObj = {};
    let resArr = [];
    arr.forEach(function(res, index) {
        if(!resObj[`${res.userId}_${new Date(res.time).toDateString()}`]){
            resObj[`${res.userId}_${new Date(res.time).toDateString()}`] = res;
        }
    })
    for(let key in resObj){
        resArr.push(resObj[key]);
    }
    return resArr;
}

class EasyPayAppendActionAnalyze extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loadingFirst : false,
            startDate : '',
            endDate : '',
            storeId : '',
            storeName : '',
            bannerClickData: [
                {value:335, name:'已点击'},
                {value:310, name:'未点击'},
            ],
            doubleCouponClickData: [
                {value:335, name:'已点击'},
                {value:310, name:'未点击'},
            ],
            doubleCouponSureOrCancelData: [
                {value:335, name:'点击确认'},
                {value:310, name:'点击取消'},
                {value:30, name:'未点击'},
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

    queryCreate(action){
        return makeParams({
            startDate: this.state.startDate,
            endDate: this.state.endDate,
            storeId: this.state.storeId,
            action: action && action
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
        const getQuery1 = this.queryCreate('front_node_easypay_load'); //扫码进入
        const getQuery2 = this.queryCreate('front_node_easypay_to_index_before_paid_with_coupon');//支付前点击banner广告
        const getQuery3 = this.queryCreate('front_node_easypay_double_coupon'); //支付后点击翻倍
        const getQuery4 = this.queryCreate('front_node_easypay_double_coupon_cancel'); //翻倍取消
        const getQuery5 = this.queryCreate('front_node_easypay_double_coupon_sure'); //翻倍确认
        const getQuery6 = this.queryCreate('front_node_easypay_to_coupon_after_paid'); //点击查看优惠券
        this.setState({
            loadingFirst : true
        })
        Get('/selectd' + '?' + getQuery1).then(({jsonResult})=>{
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

            console.log(this.state.storeName);

            let result1 = delRepeat(jsonResult.data)
            console.log('扫码进入：',result1.length)

            Get('/selectd' + '?' + getQuery2).then(({jsonResult})=>{
                let result2 = delRepeat(jsonResult.data)
                console.log('支付前点击banner广告：',result2.length)
                let { bannerClickData } = this.state;
                bannerClickData[0].value = result2.length;
                bannerClickData[1].value = result1.length - result2.length;
                this.setState({
                    bannerClickData : bannerClickData
                })


            })
            Get('/selectd' + '?' + getQuery3).then(({jsonResult})=>{
                let result3 = delRepeat(jsonResult.data);
                console.log('支付后点击翻倍:',result3.length);
                let { doubleCouponClickData } = this.state;
                doubleCouponClickData[0].value = result3.length;
                doubleCouponClickData[1].value = result1.length - result3.length;
                this.setState({
                    doubleCouponClickData : doubleCouponClickData
                })

                Get('/selectd' + '?' + getQuery4).then(({jsonResult})=>{
                    let result4 = delRepeat(jsonResult.data);
                    console.log('翻倍取消:',result4.length);

                    Get('/selectd' + '?' + getQuery5).then(({jsonResult})=>{
                        let result5 = delRepeat(jsonResult.data);
                        console.log('翻倍确认:',result5.length);
                        let { doubleCouponSureOrCancelData } = this.state;
                        doubleCouponSureOrCancelData[0].value = result5.length;
                        doubleCouponSureOrCancelData[1].value = result4.length
                        doubleCouponSureOrCancelData[2].value = result3.length - result4.length - result5.length;
                        this.setState({
                            doubleCouponSureOrCancelData : doubleCouponSureOrCancelData
                        })
                    })
                })

                Get('/selectd' + '?' + getQuery6).then(({jsonResult})=>{
                    let result6 = delRepeat(jsonResult.data);
                    console.log('点击查看优惠券:',result6.length);
                })

                
            })

        })
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

    emitEmpty = () => {
        this.storeIdInput.focus();
        this.setState({ storeId: '' });
    }
    onChangeStoreId = (e) => {
        this.setState({ storeId: e.target.value });
    }

    chooseStore(chosenStoreId,chosenStoreName) {
        this.setState({
            storeId: chosenStoreId,
            storeName: chosenStoreName
        })
    }
    setChosenStoreId(chosenStoreId,chosenStoreName){
        this.setState({
            storeId: chosenStoreId,
            storeName: chosenStoreName
        })
    }


    render() {
        const { storeId } = this.state;
        const suffix = storeId ? <Icon type="close-circle" onClick={this.emitEmpty} /> : null;
        return (
            <div className="actionAnalyze">
            <Spin spinning={this.state.loadingFirst} tip="正在加载。。。">
                <BreadcrumbCustom first="用户端信息" second="活动数据统计" />
                <Row gutter={16}>
                    <Col className="gutter-row" span={24}>
                        <Card>
                            <RangePicker
                                onChange={this.onDateChange.bind(this)}
                            />
                            <SearchStore chooseStore={this.chooseStore.bind(this)} setChosenStoreId={this.setChosenStoreId.bind(this)} />
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
                                <EchartsPublicPie data={this.state.bannerClickData} title="点击banner广告人次统计" name="点击人数" />
                            </Card>
                        </div>
                    </Col>
                    <Col className="gutter-row" span={24}>
                        <div className="gutter-box">
                            <Card>
                                <EchartsPublicPie data={this.state.doubleCouponClickData} title="点击翻倍人次统计" name="点击人数" />
                            </Card>
                        </div>
                    </Col>
                    <Col className="gutter-row" span={24}>
                        <div className="gutter-box">
                            <Card>
                                <EchartsPublicPie data={this.state.doubleCouponSureOrCancelData} title="翻倍确认与取消人次统计" name="点击人数" />
                            </Card>
                        </div>
                    </Col>
                </Row>
            </Spin>
                
                <style>{`
                    .actionAnalyze .ant-card {
                        margin-bottom: 12px;
                    }
                    .actionAnalyze .ant-btn {
                        margin: 0 12px;
                    }
                `}</style>
            </div>
        )
    }
}

export default EasyPayAppendActionAnalyze;
