import React from 'react';
import { Tooltip } from 'antd';

const style = {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    maxWidth:'350px'
};

export default ({ text = '', maxWidth}) => <div style={{maxWidth, ...style}}>
    <Tooltip
        placement="bottomLeft"
        title={text}
        overlayStyle={{ whiteSpace: 'normal' }}
    >
        {text}
    </Tooltip>
</div>;