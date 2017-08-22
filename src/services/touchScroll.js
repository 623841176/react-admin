import appInfo from './appInfo.js';

let domElement;
let dynamicDom;
let freeTop;
let freeBottom;
let startPointY = 0;
let lastTransformY = 0;
let lastTouchmoveTime = 0;
let touchMoveSpeed = 0;
let cssTransion = 'transition-timing-function: cubic-bezier(0.1, 0.57, 0.1, 1); transition-duration: {{$time}}ms; transform: translate(0px, {{$y}}px) translateZ(0px);';

const endTouch = () => {
  lastTransformY = 0;
  domElement && domElement.setAttribute('style', cssTransion.replace('{{$time}}', 450).replace('{{$y}}', 0));
}

const makeY = (y) => {
  return y * (2 - Math.abs(y) / 573) / 3;
};

const getScrollDom = (baseDom) => {
  var target = baseDom;
  if (!target || target.classList && target.classList.contains('limitTouchScroll')) {
    return target;
  } else {
    return getScrollDom(baseDom.parentNode);
  }
};
// 记录每次开始滑动时的初始位置
!appInfo.liveIosApp && document.addEventListener('touchstart', (event) => {
  startPointY = event.touches[0].clientY;
  // 置空 touchScrollDom 后，重新获取一次
  domElement = !dynamicDom && domElement || getScrollDom(event.target);
  domElement && domElement.setAttribute('style', cssTransion.replace('{{$time}}', 0).replace('{{$y}}', 0));
});

!appInfo.liveIosApp && document.addEventListener('touchmove', (event) => {
  if (!domElement)
    return;

  // scroll down on start
  const touchY = event.touches[0].clientY;
  if (domElement.scrollTop <= 0 && touchY - startPointY > 0) {
    event.preventDefault();
    freeTop && domElement.setAttribute('style', cssTransion.replace('{{$time}}', 0).replace('{{$y}}', makeY(touchY - startPointY)));
  }
  // scroll up on end
  if (domElement.scrollTop >= domElement.scrollHeight - domElement.offsetHeight && touchY < startPointY) {
    event.preventDefault();
    const transformYNow = touchY - startPointY;
    if (freeBottom) {
      if (touchY <= 0) {
        endTouch();
      } else {
        lastTransformY = transformYNow;
        lastTouchmoveTime = +new Date;
        domElement.setAttribute('style', cssTransion.replace('{{$time}}', 0).replace('{{$y}}', makeY(lastTransformY)));
        // 微信滑过上边沿不触发touchend
        setTimeout(() => {
          let timePast = +new Date - lastTouchmoveTime;
          let moveY = lastTransformY - transformYNow;
          touchMoveSpeed = Math.abs(moveY / timePast) || touchMoveSpeed;
          // lastTransformY && moveY == 0 && timePast >= 60 && toast(touchMoveSpeed);
          lastTransformY && !moveY && timePast >= 60 && (touchMoveSpeed > 0.1 && touchY < 100 || touchY < 10) && endTouch();
        }, 60);
      }
    }
  }
});

!appInfo.liveIosApp && document.addEventListener('touchend', endTouch);

// 更换 touchScrollDom, 重置参数
export function touchScroll(dynamic, option) {
  dynamicDom = dynamic;
  domElement = null;
  freeTop = option && option.freeTop;
  freeBottom = option && option.freeBottom;
  startPointY = lastTransformY = lastTouchmoveTime = touchMoveSpeed = 0;
}
