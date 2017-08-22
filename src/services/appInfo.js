import {updatePath} from './apiPath.js';
import {addToTheCart, removeFromTheCart, clearTheCart} from './cartActions.js';

const setInfo = (key, info) => {
  info = info || null;
  const localInfo = JSON.stringify(info);
  appInfo[key] = info;
  window.localStorage.setItem(key, localInfo);
  if (key == 'session') {
    updatePath(info.result);
  }
  return localInfo;
};

const clearInfo = (key) => {
  appInfo[key] = null;
  window.localStorage.removeItem(key);
};

const appInfo = {
  wxAPPID: '',
  bodyDom: document.body,
  liveWechat: navigator.userAgent.indexOf('MicroMessenger') != -1,
  liveIosApp: navigator.userAgent.toUpperCase().indexOf('XS1H(IOS') != -1,
  liveAndroidApp: navigator.userAgent.toUpperCase().indexOf('XS1H(ANDROID') != -1,
  wechatInfo: JSON.parse(window.localStorage.getItem('wechat')) || {}, // 微信页面可能会用到的信息，如跳转回去的url之类
  cart: JSON.parse(window.localStorage.getItem('cart')) || {},
  city: JSON.parse(window.localStorage.getItem('city')),
  store: JSON.parse(window.localStorage.getItem('store')),
  goodsData: JSON.parse(window.localStorage.getItem('goodsData')),
  cateStoreVersion: + JSON.parse(window.localStorage.getItem('cateStoreVersion')),
  address: JSON.parse(window.localStorage.getItem('address')),
  session: JSON.parse(window.localStorage.getItem('session')),
  user: JSON.parse(window.localStorage.getItem('user')),
  tuanInfo: JSON.parse(window.localStorage.getItem('tuanInfo')),
  areaList: JSON.parse(window.localStorage.getItem('areaList')),  //旧接口返回三级城市信息
  provinceList: JSON.parse(window.localStorage.getItem('provinceList')),  //新接口只返回一级省列表
  clearCart: clearTheCart,
  addToCart: addToTheCart,
  removeFromCart: removeFromTheCart,
  setCart: setInfo.bind(appInfo, 'cart'),
  setCity: setInfo.bind(appInfo, 'city'),
  setStore: setInfo.bind(appInfo, 'store'),
  setGoodsData: setInfo.bind(appInfo, 'goodsData'),
  setStoreVersion: setInfo.bind(appInfo, 'cateStoreVersion'),
  clearGoodsData: clearInfo.bind(appInfo, 'goodsData'),
  setAddress: setInfo.bind(appInfo, 'address'),
  setSession: setInfo.bind(appInfo, 'session'),
  setUser: setInfo.bind(appInfo, 'user'),
  setWechatInfo: setInfo.bind(appInfo, 'wechat'),
  setAreaList: setInfo.bind(appInfo, 'areaList'),  //旧
  setProvinceList: setInfo.bind(appInfo, 'provinceList'),  //新
  setInfo: (key, value) => {
    return setInfo(key, value);
  },
  getInfo: (key) => {
    return JSON.parse(window.localStorage.getItem(key));
  },
  clearInfo: (key) => {
    clearInfo(key);
  }
};

export default appInfo;
