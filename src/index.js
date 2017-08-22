import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import './style/lib/animate.css';
import { Router, Route, hashHistory, IndexRedirect } from 'react-router';
import Page from './components/Page';
import BasicForm from './components/forms/BasicForm';
import BasicTable from './components/tables/BasicTables';
import AdvancedTable from './components/tables/AdvancedTables';
import AsynchronousTable from './components/tables/AsynchronousTable';
import Login from './components/pages/Login';
import Echarts from './components/charts/Echarts';
import Recharts from './components/charts/Recharts';
import Icons from './components/ui/Icons';
import Buttons from './components/ui/Buttons';
import Spins from './components/ui/Spins';
import Modals from './components/ui/Modals';
import Notifications from './components/ui/Notifications';
import Tabs from './components/ui/Tabs';
import Banners from './components/ui/banners';
import Drags from './components/ui/Draggable';
import Dashboard from './components/dashboard/Dashboard';
import Gallery from './components/ui/Gallery';
import NotFound from './components/pages/NotFound';
import BasicAnimations from './components/animation/BasicAnimations';
import ExampleAnimations from './components/animation/ExampleAnimations';
import registerServiceWorker from './registerServiceWorker';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { createStore, applyMiddleware } from 'redux';
import reducer from './reducer';
import AuthBasic from './components/auth/Basic';
import RouterEnter from './components/auth/RouterEnter';
import {toast, showMessage} from './components/public/Alert';

import OneKeyOrderTimeLine from './components/front/OneKeyOrderTimeLine'
import EasyPayAppendActionAnalyze from './components/front/EasyPayAppendActionAnalyze'

window.toast = toast;
window.showMessage = showMessage;

const Wysiwyg = (location, cb) => {     // 按需加载富文本配置
    require.ensure([], require => {
        cb(null, require('./components/ui/Wysiwyg').default);
    }, 'Wysiwyg');
};

const routes =
    <Route path={'/'} components={Page}>
        <IndexRedirect to="/app/dashboard/index" />
        <Route path={'app'} component={App}>
            <Route path={'form'}>
                <Route path={'basicForm'} component={BasicForm} />
            </Route>
            <Route path={'table'}>
                <Route path={'basicTable'} component={BasicTable} />
                <Route path={'advancedTable'} components={AdvancedTable} />
                <Route path={'asynchronousTable'} components={AsynchronousTable} />
            </Route>
            <Route path={'chart'}>
                <Route path={'echarts'} component={Echarts} />
                <Route path={'recharts'} component={Recharts} />
            </Route>
            <Route path={'ui'}>
                <Route path={'icons'} component={Icons} />
                <Route path={'buttons'} component={Buttons} />
                <Route path={'spins'} component={Spins} />
                <Route path={'modals'} component={Modals} />
                <Route path={'notifications'} component={Notifications} />
                <Route path={'tabs'} component={Tabs} />
                <Route path={'banners'} component={Banners} />
                <Route path={'wysiwyg'} getComponent={Wysiwyg} />
                <Route path={'drags'} component={Drags} />
                <Route path={'gallery'} component={Gallery} />
            </Route>
            <Route path={'animation'}>
                <Route path={'basicAnimations'} component={BasicAnimations} />
                <Route path={'exampleAnimations'} component={ExampleAnimations} />
            </Route>
            <Route path={'dashboard/index'} component={Dashboard} />
            <Route path="auth">
                <Route path="basic" component={AuthBasic} />
                <Route path="routerEnter" component={RouterEnter} />
            </Route>
            <Route path={'front'}>
                <Route path={'oneKeyOrderTimeLine'} component={OneKeyOrderTimeLine} />
                <Route path={'EasyPayAppendActionAnalyze'} component={EasyPayAppendActionAnalyze} />
            </Route>
        </Route>
        <Route path={'login'} components={Login} />
        <Route path={'404'} component={NotFound} />
    </Route>;

// redux 注入操作
const middleware = [thunk];
const store = createStore(reducer, applyMiddleware(...middleware));
console.log(store.getState());

ReactDOM.render(
    <Provider store={store}>
        <Router history={hashHistory}>
            {routes}
        </Router>
    </Provider>
 ,
  document.getElementById('root')
);
registerServiceWorker();