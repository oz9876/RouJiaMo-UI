import React, { Component } from 'react';
import { Layout, Modal, Button, Badge, Icon } from 'antd';
import { withRouter } from 'react-router-dom';
import quit from 'images/quit.png';

const { Header } = Layout;
class HeaderCustom extends Component {
    state = {
        notification: null
    }
    async componentDidMount() {
    }
    render() {
        const { history, messageState, setPopOpenType, popOpenType } = this.props;
        const {notification} = this.state;
        return (
            <Header style={{ background: '#fff', paddingLeft: '40px', paddingRight: '40px', height: 60, minWidth: '980px', fontSize: '20px', color: '#5D616C', borderBottom: '1px solid #EEEEEE'}} >
                <div>
                    <div>
                        <div className="app-head">
                            <span style={{float: 'left', fontWeight: 'bold'}}>肉夹馍</span>

                            <span>首页</span>
                            <span>Git</span>
                        </div>
                    </div>
                </div>
            </Header>
        );
    }
}


export default withRouter(HeaderCustom);