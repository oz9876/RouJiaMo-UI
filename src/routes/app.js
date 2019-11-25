import React, { Component } from 'react';
import { Layout } from 'antd';
import Menu from 'components/Menu';
import Header from 'components/Header';
import Routes from './routes';

const { Content } = Layout;

class App extends Component {
    render() {
        return (
            <Layout>
                <Menu location={this.props.location} />
                <div className="right-body">
                    <Header />
                    <Content style={{ padding: '0 40px', overflow: 'initial', flex: '1', overflowY: 'scroll', background: '#f9f8f8'}}>
                        <Routes/>
                    </Content>
                </div>
            </Layout>
        );
    }
}

export default App;