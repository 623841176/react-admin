import appInfo from './appInfo.js';
import {hashHistory} from 'react-router';
import {Get, Post} from '../services/fetch.js';
import apiPath, {makeParams} from './apiPath.js';
import {wxPay} from '../services/wechat.js';

export function appPay(tradeId, payChannel, successCallback, failCallback) {
  // 更新订单，准备支付
  Post(apiPath.updateOrder + '&' + makeParams({tradeId: tradeId})).then(({jsonResult}) => {
    if (jsonResult.status != "OK") {
      toast(jsonResult.message);
      return;
    }
    // 请求app支付接口
    const nativePayStr = JSON.stringify({tradeId: tradeId, payChannel: payChannel, device: 'web', version: '1.0.0', sessionId: appInfo.session.result});
    window.notifyPayStatus = function(payResult) {
      // 取消支付，停留当前位置等待重新支付
      if (payResult.status == 'FAIL') {
        payResult.message && toast(payResult.message);
        failCallback && failCallback();
      }
      // 支付成功，延时等待第三方支付通知后台
      if (payResult.status == 'OK') {
        successCallback && successCallback();
        !successCallback && setTimeout(() => {
          hashHistory.replace('/orderDetail/' + tradeId + '/PAID');
        }, 0);
      }
    };
    window.nativeUtil && window.nativeUtil.commitPay(nativePayStr);

    // 微信支付
    appInfo.liveWechat && Post(apiPath.payChannel, {
      tradeId: tradeId,
      channel: payChannel
    }).then(({jsonResult}) => {
      const callback = () => {
        successCallback && successCallback();
        !successCallback && setTimeout(() => {
          hashHistory.replace('/orderDetail/' + tradeId + '/PAID'); // 延时等待支付结果通知后台
        }, 0);
      };
      if (jsonResult.status != "OK") {
        auiAlert({message: jsonResult.message, yes: callback, no: null});
      } else {
        // 支付宝网页支付
        payChannel == 'ZHIFUBAO_WEB' && (() => {
          window.location.href = '/alipay.html?tradeId=' + tradeId + '&sessionId=' + appInfo.session.result;
        })();
        // 微信webview支付
        payChannel == 'WECHAT_WEB' && wxPay(jsonResult.result, {
          success: callback,
          cancel: () => {
            failCallback && failCallback();
          },
          fail: () => {
            failCallback && failCallback();
          }
        });
      }
    });

    (!appInfo.liveWechat && !window.nativeUtil) && toast('请使用app或关注微信公众号支付');
  });
}
