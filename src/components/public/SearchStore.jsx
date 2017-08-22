import React, {Component} from 'react';
import PropTypes from 'prop-types';
import apiPath, {updatePath, makeParams} from '../../services/apiPath.js';
import { Icon, Input } from 'antd';
import {Get, Post} from '../../services/fetch.js';

class SearchStore extends Component {
    constructor(props) {
        super(props);
        this.state = {
            storesList: '',
            chosenStoreIndex: -1,
            searchStoreValue: ''
        }
    }

    componentDidMount() {
        window.onresize = () => {
            if(this.forChooseStoreUl){
                document.getElementById('addressUl').style.width = this.storeInput.refs.input.offsetWidth + 'px';
            }
        }
    }

    storeOnBlur() {
        setTimeout(() => {
            this.setState({
                storesList: ''
            })
        }, 200)
    }

    changeStoreValue(event) {
        if(!event.target)return;
        const value = event.target.value;
        this.state.searchStoreValue = event.target.value;
        this.state.chosenStoreIndex = -1;
        this.props.setChosenStoreId('','');
        Get(apiPath.storesList + '&' + makeParams({keyword: value, skip: 0, limit: 10})).then(({jsonResult}) => {
            if (jsonResult.status != "OK") {
                window.toast(jsonResult.message);
                this.setState({
                    storesList: ''
                });
                return;
            }
            this.setState({
                storesList: jsonResult.result.data
            })
            setTimeout(() => {
                if(this.forChooseStoreUl){
                    document.getElementById('addressUl').style.width = this.storeInput.refs.input.offsetWidth + 'px';
                }
            }, 0);
        })
    }

    chooseStore(store) {
        this.props.chooseStore(store.id, store.name);
    }

    keyOperation(event) {
        // console.log(event.keyCode);
        const key = event.keyCode;
        const storesList = this.state.storesList;
        let chosenStoreIndex = this.state.chosenStoreIndex;
        if (event.keyCode == 40) {
            event.preventDefault();
            chosenStoreIndex = chosenStoreIndex >= storesList.length - 1
                             ? 0
                             : chosenStoreIndex + 1;
            this.setState({
                chosenStoreIndex: chosenStoreIndex
            })
        } else if (event.keyCode == 38) {
            event.preventDefault();
            chosenStoreIndex = chosenStoreIndex <= 0
                             ? storesList.length - 1
                             : chosenStoreIndex - 1;
            this.setState({
                chosenStoreIndex: chosenStoreIndex
            })
        } else if (event.keyCode == 13 && chosenStoreIndex >= 0) {
            let chosenStoreId = storesList[chosenStoreIndex].id
            let chosenStoreName = storesList[chosenStoreIndex].name
            this.props.chooseStore(chosenStoreId,chosenStoreName);
            this.setState({
                storesList: ''
            })
        } else if (event.keyCode == 13 && event.target.value == '') {
            this.props.chooseStore('','');
            this.setState({
                storesList: ''
            })
        }
        storesList && chosenStoreIndex != -1 && (this.storeInput.refs.input.value = storesList[chosenStoreIndex].name);
        
    }

    mouseOperation(store, storeIndex) {
        this.storeInput.refs.input.value = store.name;
        this.setState({
            chosenStoreIndex: storeIndex
        });
    }

    render() {
        const storesList = this.state.storesList;
        const chosenStoreIndex = this.state.chosenStoreIndex;
        const searchStoreValue = this.state.searchStoreValue;
        const suffix = searchStoreValue ? <Icon type="close-circle" onClick={this.emitEmpty} /> : null;
        return (
            <span style={{width: '300px',margin: '16px'}} className="ant-input-affix-wrapper">
                {/*<input style={{width: '100%'}} type='text' placeholder="请输入门店名。。。" onKeyDown={this.keyOperation.bind(this)} onBlur={this.storeOnBlur.bind(this)} onChange={this.changeStoreValue.bind(this)} ref={ref => (this.storeInput = ref)} />*/}
                <Input
                    style={{ width: '100%' }}
                    placeholder="请输入门店名。。。"
                    prefix={<Icon type="shop" />}
                    suffix={suffix}
                    onKeyDown={this.keyOperation.bind(this)}
                    onBlur={this.storeOnBlur.bind(this)}
                    onChange={this.changeStoreValue.bind(this)}
                    ref={ref => (this.storeInput = ref)} 
                />
                {storesList && <ul id='addressUl' className="chooseStoreUl" ref={ref => (this.forChooseStoreUl = ref)} >
                    {storesList.map((store, storeIndex) => {
                        let chosenStyle = chosenStoreIndex == storeIndex
                                        ? "chosenStyle"
                                        : '';
                        let value = store.name + '(' + store.location + ')';
                        value = searchStoreValue
                              ? value.replace(searchStoreValue, '<span>' + searchStoreValue + '</span>')
                              : value;
                        return (
                            <li className={chosenStyle} onMouseEnter={this.mouseOperation.bind(this, store, storeIndex)} onClick={this.chooseStore.bind(this, store)} key={storeIndex} dangerouslySetInnerHTML={{__html: value}}></li>
                        )
                    })}
                </ul>}
            </span>
        )
    }

}

export default SearchStore;