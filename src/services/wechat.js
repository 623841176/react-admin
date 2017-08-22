import appInfo from './appInfo.js';
import {Get, Post} from '../services/fetch.js';
import apiPath, {makeParams} from './apiPath.js';
import GPS from '../jsLibs/GPS.js';

const configWechat = (result, callback) => {
  const configObj = {
    debug: false, // 开启调试模式,
    appId: appInfo.wxAPPID, // 必填，公众号的唯一标识
    timestamp: result.timestamp, // 必填，生成签名的时间戳
    nonceStr: result.nonceStr, // 必填，生成签名的随机串
    signature: result.signature, // 必填，签名，见附录1
    jsApiList: [
      'checkJsApi',
      'onMenuShareTimeline',
      'onMenuShareAppMessage',
      'onMenuShareQQ',
      'onMenuShareWeibo',
      'onMenuShareQZone',
      'getNetworkType',
      'openLocation',
      'getLocation',
      'closeWindow',
      'scanQRCode',
      'chooseWXPay'
    ]
  };
  wx.config(configObj);
  wx.ready(() => {
    callback && callback();
  });
  wx.error(() => {});
}

// 每次获取新的token进行签名，防止后台刷新导致前台功能错误
export function wxGetSign(locationHref, callback) {
  Get(apiPath.getWechatSign + '&' + makeParams({
    url: encodeURI(locationHref.split('#')[0])
  })).then(({jsonResult}) => {
    jsonResult.status != "OK" && toast('获取微信签名错误，请尝试刷新页面或重新进入', 3000);
    const result = jsonResult.result;
    const configWithAppID = () => {
      appInfo.wxAPPID
        ? configWechat(result, callback)
        : setTimeout(configWithAppID, 10);
    };
    appInfo.wxScript.__loaded
      ? configWithAppID()
      : appInfo.wxScript.onload = configWithAppID;
  });
}

export function wxPay(result, option) {
  wx.ready(() => {
    wx.chooseWXPay({
      timestamp: result.timestamp,
      nonceStr: result.nonceStr,
      package: result.pkg,
      signType: result.signType,
      paySign: result.paySign,
      success: function(res) {
        option && option.success && option.success(res);
      },
      cancel: function(res) {
        option && option.cancel && option.cancel(res);
      },
      fail: function(res) {
        option && option.fail && option.fail(res);
      }
    });
  });
}

export function wxGetLocation(option) {
  wx.ready(() => {
    // 微信部分机型微信定位会卡死，用H5定位代替
    if (navigator.geolocation && navigator.userAgent.match(/Android/i)) {
      navigator.geolocation.getCurrentPosition((position) => {
        // WGS-84 to GCJ-02
        let chinaPos = GPS.gcj_encrypt(position.coords.latitude, position.coords.longitude);
        chinaPos.latitude = chinaPos.lat;
        chinaPos.longitude = chinaPos.lon;
        option && option.success && option.success(chinaPos);
      }, (res) => {
        option && option.fail && option.fail(res);
      });
    } else {
      wx.getLocation({
        type: 'gcj02', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
        success: function(res) {
          option && option.success && option.success(res);
        },
        fail: (res) => {
          option && option.fail && option.fail(res);
        }
      });
    }
  });
}

export function wxShare(option) {
  wx.ready(() => {
    const shareObj = {
      title: option.title || '鲜食一号', // 分享标题
      desc: option.desc || '好东西！与你一起分享', // 分享描述
      link: option.link || location.href, // 分享链接
      imgUrl: option.imgUrl || location.origin + '/favicon.ico', // 分享图标
      type: option.type || '', // 分享类型,music、video或link，不填默认为link
      dataUrl: option.dataUrl || '', // 如果type是music或video，则要提供数据链接，默认为空
      success: function() {
        option.success && option.success();
      },
      cancel: function() {
        option.success && option.cancel();
      }
    };
    option.type == 'friend' && wx.onMenuShareAppMessage(shareObj);
    option.type != 'friend' && wx.onMenuShareTimeline({
      title: shareObj.title,
      link: shareObj.link,
      imgUrl: shareObj.imgUrl,
      success: shareObj.success,
      cancel: shareObj.cancel
    });
  });
}
