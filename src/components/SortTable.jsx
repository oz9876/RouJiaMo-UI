import React from 'react';
import PropTypes from 'prop-types';
import { Table } from 'antd';

const SortTable = ({ pageIndex, total, onPageChange, defaultPageSize,  ...rest }) => {
    const pagination = {
        current: pageIndex,
        total,
        onChange: onPageChange,
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

SortTable.propTypes = {
    pageIndex: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
    dataSource: PropTypes.array.isRequired,
    columns: PropTypes.array.isRequired
};

export default SortTable;