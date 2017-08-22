const apiPath = {
  storesList: '/api-admin/store/list',  //get 门店列表信息
};

// updatePath 由setSession自动触发， 默认从localStorage获取一次
const sessionId = (JSON.parse(window.localStorage.getItem('session')) || {}).result || '';

const apiParams = {
  device: 'web',
  version: '1.0.0',
  // sessionId: sessionId
  sessionId: '15852b80-075f-4190-a938-f716b847408e'
  
};

const _makeParams = (obj) => {
  let key;
  let paramStr = '';
  for (key in obj) {
    paramStr += (paramStr && '&' || '') + key + '=' + obj[key];
  }
  return paramStr;
}

const _updatePath = (sessionId) => {
  if (sessionId) {
    apiParams.sessionId = sessionId;
  }
  for (let key in apiPath) {
    if (apiPath[key].indexOf('sessionId') == -1) {
      apiPath[key] += '?' + _makeParams(apiParams);
    } else {
      apiPath[key] = apiPath[key].replace(/sessionId=(.*)?/, function() {
        return 'sessionId=' + sessionId;
      });
    }
  }
  return apiPath;
};

// 自动更新请求网址，已有session其他地方不会updatePath
_updatePath();

export function makeParams(obj) {
  return _makeParams(obj);
}

export function updatePath(sessionId) {
  _updatePath(sessionId);
}

export default apiPath;
