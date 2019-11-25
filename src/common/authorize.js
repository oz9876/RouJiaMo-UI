import workbench1 from 'images/workbench1.png';
import account1 from 'images/account1.png';
import order1 from 'images/order1.png';
import taskPool1 from 'images/taskPool1.png';
import dutyManage1 from 'images/dutyManage1.png';
import serviceManage1 from 'images/serviceManage1.png';
import information1 from 'images/information1.png';
import questionnaire1 from 'images/questionnaire1.png';
import consult1 from 'images/consult1.png';
import reconciliationmenu from 'images/reconciliationmenu.png';
import enter1 from 'images/taskPool1.png';
import income1 from 'images/earning1.png';
import { WEB } from './util';
import { message } from 'antd';

export function getAuth() {
    const auth = localStorage.getItem('auth');
    if (auth) {
        return JSON.parse(auth);
    } else {
        message.warning('请先登录');
        setTimeout(() => {
            localStorage.clear();
            window.location.href = WEB; // 没登录直接进入login页面
        }, 800);
    }
}

// 菜单
export function getMenuData() {
    return [
        {
            authName: '组件',
            icon: workbench1,
            children: [
                {
                    authName: '通用',
                    type:'title',
                    children: [
                        {
                            authName: 'Button 按钮',
                            pathname: 'components/button',
                        },{
                            authName: 'Icon 按钮',
                            pathname: 'components/button',
                        }
                    ]
                },{
                    authName: '数据展示',
                    type:'title',
                    children: [
                        {
                            authName: 'Button 按钮',
                            pathname: 'components/button',
                        },{
                            authName: 'Icon 按钮',
                            pathname: 'components/button',
                        }
                    ]
                }
            
            ]
        }
    ];
}