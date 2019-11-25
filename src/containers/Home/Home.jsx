import React, { Component } from 'react';
import { getAuth } from 'common/authorize';
import Header from 'components/Header';
// import Button from 'components/button';
class Home extends Component {
    state = {
    };

    componentDidMount() {
    }
    render() {
        const auth = getAuth();
        return (
            <div className="app-home" style={{background: '#f9f8f8'}}>
                <Header/>
                首页
                {/* <Button>立即使用</Button> */}
            </div>
        );
    }
}

export default Home;
