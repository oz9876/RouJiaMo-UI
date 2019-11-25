import React from 'react';
import { Breadcrumb } from 'antd';
import { Link } from 'react-router-dom';

class AppBreadcrumb extends React.Component {
    /**
    * 面包屑的封装
    * @param first      {string}  一级菜单目录对应左边的一级权限点
    * @param firstPath  {string}  跳转到该菜单的url地址
    * @param second     {string}  二级目录是一级菜单下的子目录
    * @param secondPath {string}  跳转到该菜单的url地址 例如/app/account/rolemanage
    * @param third      {string}  三级目录是二级菜单下的子项
    * @param thirdPath  {string}  跳转到该菜单的url地址 例如/app/account/rolemanage/下的内容
    */
    render() {
        const { first, firstPath, second, secondPath, third, thirdPath } = this.props;
        // console.log('AppBreadcrumb');
        const oneLevel =
            <Breadcrumb.Item>
                {firstPath ? <Link to={`${firstPath}`}>{first}</Link> : first}
            </Breadcrumb.Item>;
        const twoLevel =
            <Breadcrumb.Item>
                {secondPath ? <Link to={`${secondPath}`}>{second}</Link> : second}
            </Breadcrumb.Item>;
        const threeLevel =
            <Breadcrumb.Item>
                {thirdPath ? <Link to={`${thirdPath}`}>{third}</Link> : third}
            </Breadcrumb.Item>;
        return (
            <span>
                <Breadcrumb style={{ margin: '12px 0' }}>
                    {first && oneLevel}
                    {second && twoLevel}
                    {third && threeLevel}
                </Breadcrumb>
            </span>
        );
    }
}

export default AppBreadcrumb;
