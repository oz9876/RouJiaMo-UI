import React, { Component } from 'react';
// import PropTypes from 'prop-types';

// 分页相关高阶组件
// 需要传入 当前页pageIndex， 总条数total， 除分页信息以外的查询条件search， 列表数据dataList
const DataGrid = (WrappedComponent) => {
    class DataGridMain extends Component {
        constructor(props) {
            super(props);
            this.state = {
                pageIndex: 1,
                total: 0,
                search: {},
                dataList:[]
            };
        }
        // 分页数据
        setListData(data){
            this.setState(data);
        }
        render() {
            return (
                <div>
                    <WrappedComponent
                        {...this.props}
                        {...this.state}
                        setListData={(data) => this.setListData(data)}
                    />
                </div>
            );
        }
    }
    return DataGridMain;
};
export default DataGrid;

