import React from 'react';
import { Modal } from 'antd';

const AppImage = ({url,width = 40}) =>
<img
    style={{ width: width, height: width, cursor: 'pointer', display: 'inline-block',marginRight:20 }}
    onClick={() => Modal.info({
        content: (
            <img
                src={url}
                style={{ width: '100%' }}
                alt="缩略图"
            />),
        width: 500,
        okText: '确定'
    })}
    src={url}
    alt=""
/>;

export default AppImage;

