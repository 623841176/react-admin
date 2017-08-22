import {polyfill} from 'es6-promise';
import fetch from 'isomorphic-fetch';
import {Modal, notification} from 'antd';

function checkHttp(res) {
  if (res.status > 300) {
    notification.open({
      message: '提示',
      description: '服务器正忙，请求数据失败,请刷新页面或退出应用重试'
    })
    return Promise.reject(res.status);
  }
  return res;
}

function jsonParse(res) {
  return res.json().then((jsonResult) => {
    // 拦截请求过程中的用户session过期问题
    if (jsonResult.status == "ERROR" && jsonResult.errorCode == 1) {
      setTimeout(() => {
        Modal.confirm({
          content: '获取数据失败，是否尝试重新获取数据',
          onOk: () => {
            window.location.reload();
          },
          onCancel: () => {}
        });
      }, 3000);
    }
    return ({
      ...res,
      jsonResult
    })
  });
}

function errorMessageParse(res) {
  const jsonType = typeof res == 'object';
  const {success, message} = (jsonType && res.jsonResult || {});
  if (!success) {
    return {
      jsonResult: {
        status: 'ERROR',
        message: jsonType && res.jsonResult && res.jsonResult.message || '',
        httpErrorCode: !jsonType && res || 0
      }
    };
  }
  return res;
}

function xFetch(url, options) {
  const opts = {
    ...options,
    mode: 'cors'
  };

  const reqTimeoutHash = (+ new Date) + '' + Math.random();
  xFetch[reqTimeoutHash] = 1;

  setTimeout(function() {
    if (xFetch[reqTimeoutHash]) {
      delete xFetch[reqTimeoutHash];
      notification.open({
        message: '提示',
        description: '您的网络似乎有点问题,或者后台接口有点慢了。。'
      });
    }
  }, 10000);

  return fetch(url, opts).then(function(res) {
    delete xFetch[reqTimeoutHash];
    return res;
  }).then(checkHttp).then(jsonParse).then(null, errorMessageParse);
}

export default xFetch;
