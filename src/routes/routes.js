import React, { Component }  from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

// ---------------------------------------------------------------------- 组件 ----------------------------------------------------------------------
// 收益预览
import Income from 'containers/Components/Earning/Income';

// 通用------------------------------
// 按钮 button
import Button from 'containers/Components/Button';

export default class Routes extends Component {
  
    render() {
        // 以institution组件举例 若需要精确匹配url路径就在Router中加入'exact'关键字;(例如path="/app/institution后面还有doctorinfo组件,则需要加入'exact'精确匹配)
        // <Route exact path="/app/institution" component={Institution} />
        // <Route path="/app/institution/doctorinfo" component={DoctorInfo} />
        return (
            <Switch>
                <Route path="/components/income/:key" component={Income} />
                <Redirect from="/components/income" to="/components/income/1" />

                <Route path="/components/button" component={Button} />
            </Switch>
        );
    }
}