import React, {Component} from 'react';
// import styles from './Alert.css';
// console.log(styles)

class Alert extends Component {

  constructor(props) {
    super(props);
    this.state = {
      message: '',
      lockAlert: false
    };
  };

  componentDidMount() {
    window.auiAlert = this.setState.bind(this);
  }

  okAction() {
    const callback = this.state.yes;
    callback && callback();
    !this.state.lockAlert && this.setState({message: ''});
  }

  cancelAction() {
    const callback = this.state.no;
    callback && callback();
    !this.state.lockAlert && this.setState({message: ''});
  }

  render() {
    const msg = this.state.message;
    const showCancel = !!this.state.no;
    if (msg) {
      return (
        <div className={"auiAlertDialog"}>
          <div className={"auiDialog"}>
            <div className={"auiDialogBody"} dangerouslySetInnerHTML={{__html: msg}} />
            <div className={"auiDialogFooter"}>
              {(() => {
                if (!showCancel)
                  return;
                return (
                  <div onClick={this.cancelAction.bind(this)} style={this.state.noStyle || {}} className={"auiDialogBtn auiTextDanger"}>{this.state.noText && this.state.noText || '取消'}</div>
                )
              })()}
              <div onClick={this.okAction.bind(this)} style={this.state.yesStyle || {}} className={"auiDialogBtn auiTextInfo"}>{this.state.yesText && this.state.yesText || '确定'}</div>
            </div>
          </div>
          <div className={"auiMask"} />
        </div>
      );
    } else {
      return (
        <div style={{display: 'none'}} />
      );
    }
  }
}

export default Alert;

export function toast(msg, time, ok) {
  if (!msg) {
    return;
  }
  var toastDom = document.createElement('div');
  ok === 'OK' && toastDom.classList.add("okToast");
  toastDom.classList.add("toast");
  toastDom.innerHTML = '<div>' + (msg && msg.toString() || '') + '</div>';
  document.body.appendChild(toastDom);
  let toastInnerDom = toastDom.children[0];
  // let toastWidth = toastInnerDom.offsetWidth + 40 < document.body.offsetWidth && toastInnerDom.offsetWidth + 40 || document.body.offsetWidth;
  toastDom.style.height = toastInnerDom.offsetHeight + 'px';
  // toastDom.style.width = toastWidth + 'px';
  toastDom.style.top = -toastDom.offsetHeight + 'px';
  toastDom.style.transform = 'translateY(' + toastDom.offsetHeight + 'px)';
  setTimeout(() => {
    toastDom.style.transform = '';
  },time && time - 500 || 2500);
  setTimeout(() => {
    toastDom.parentNode.removeChild(toastDom);
  }, time && time || 3000);
  return toastDom;
}

export function showMessage(msg) {
  if(!msg) {
    return;
  }
  var alertDom = document.createElement('div');
  alertDom.onclick = (ev = window.event) => ev.target === ev.currentTarget && document.body.removeChild(alertDom);
  alertDom.classList.add("alertBg");
  alertDom.innerHTML = `<div class="alertBox alertBoxDS">
                          <p>${msg && msg.toString() || ''}</p>
                        </div>`;
  document.body.appendChild(alertDom);
  
  return alertDom;
}

