import React, { Component } from 'react';
import { Menu, Layout } from 'antd';
import { Link } from 'react-router-dom';
import { getMenuData, getAuth } from 'common/authorize';
import logo from 'images/logo.png';
const { Sider } = Layout;
const getMenuList = getMenuData();
const SubMenu = Menu.SubMenu;
const imgStyle = {
    marginRight: '11.4px',
    marginBottom: '4px'
};

export default class SiderCustom extends Component {
    constructor(props) {
        super(props);
        this.state = {
            openKeys: [],
            current:''
        };
    }

    componentDidMount() {
        const { pathname } = this.props.location;
        const cacheKeys = sessionStorage.getItem('openKey') || '';
        const cacheCurrent = sessionStorage.getItem('currentKey') || '';
        // console.log('cacheKeys',cacheKeys,'pathname',pathname);
        let openKeys = [];
        if(cacheKeys) {
            openKeys = cacheKeys.split(',') || [];
        }
        this.setState({
            openKeys, // 打开的SubMenu 菜单项
            current: cacheCurrent
        });
    }

    //这边处理每次只展开一个一级菜单
    onOpenChange(openKeys) {
        const latestOpenKey = openKeys.find(key => this.state.openKeys.indexOf(key) === -1);
        let rootSubmenuKeys = [];
        let newOpenKeys = [];
        getMenuList.map((first) => {
            rootSubmenuKeys.push(`${first.adminAuthId}`);
        })

        if (rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
            newOpenKeys = openKeys;
        } else {
            newOpenKeys = latestOpenKey ? [latestOpenKey] : [];
        }

        sessionStorage.setItem('openKey', newOpenKeys.join(','));
        this.setState({
            openKeys: newOpenKeys
          });
    }

    handleClick(e) {
        //保存刷新后的选中状态
        sessionStorage.setItem('currentKey', e.key);
        this.setState({ current: e.key });
    }

    render() {
        return (
            <Sider
                width={220}
                trigger={null}
            >
                <div className="logo">
                    <img src={logo} alt="logo"/>
                </div>
                <Menu
                    mode="inline"
                    theme="dark"
                    selectedKeys={[this.state.current]}
                    onClick={(evt) => this.handleClick(evt)}
                    openKeys={this.state.openKeys}
                    onOpenChange={(openKeys) => this.onOpenChange(openKeys)}
                >
                    {
                        getMenuList.map((first, index) =>
                            <SubMenu key={index}
                                title={<span>
                                    <img 
                                        src={first.icon}
                                        style={imgStyle}
                                        alt=""
                                    />
                                    <span>{first.authName}</span>
                                </span>}
                            >
                                {first.children.map((second,index) =>
                                    (
                                        second.type === 'title'?
                                        <div>{second.authName}</div>
                                        :
                                        <SubMenu key={index} title={second.authName} className="second-sub-menu">
                                            {second.children.map((third) =>
                                                <Menu.Item key={index}>
                                                    <Link to={`/${third.pathname}`}>
                                                        {third.authName}
                                                    </Link>
                                                </Menu.Item>
                                            )}
                                        </SubMenu>
                                    )
                                )}
                            </SubMenu>
                        )
                    }
                </Menu>
            </Sider>
        );
    }
}