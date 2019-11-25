import React from 'react';
import PropTypes from 'prop-types';
import { Table } from 'antd';

const AppTable = ({ pageIndex, total, onChange, defaultPageSize,  ...rest }) => {
    const pagination = {
        current: pageIndex,
        total,
        onChange,
        showQuickJumper: true,
        defaultPageSize: defaultPageSize || 10,
        showTotal: (total) => `总共 ${total} 条记录`
    };
    return(
        <Table
            style={{ marginTop: 15 }}
            pagination={pagination}
            {...rest}
            size="middle"
        />
    );
};

AppTable.propTypes = {
    pageIndex: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired,
    onChange: PropTypes.func.isRequired,
    dataSource: PropTypes.array.isRequired,
    columns: PropTypes.array.isRequired
};

export default AppTable;