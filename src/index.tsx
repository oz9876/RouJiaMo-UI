import React from 'react';
import ReactDOM from 'react-dom';
import App from './routes/index.js';
import { AppContainer } from 'react-hot-loader';
// import zhCN from 'antd/lib/locale-provider/zh_CN';
import 'nprogress/nprogress.css';
import 'styles/app.less';
// import moment from 'moment';
// import 'moment/locale/zh-cn';

// moment.locale('zh-cn');
const render = (Component: any) => {
    ReactDOM.render(
        <AppContainer>
            <Component  location={location} />
        </AppContainer>
        ,document.getElementById('root')
    );
};
let isDone: boolean = false;
render(App);

if(module.hot) {
    module.hot.accept('./routes',() => {
        render(App);
    });
}
