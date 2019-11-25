import React, { Component } from 'react';
import Button from 'components/button';

class Income extends Component {
    state = {
        announcements:[],
        statusType: null,
        showDetail: true,
        applyIncomeModalOpen: false
    };
  
    render() {
       
        return (
            <div className="income-box">
                测试按钮
                <Button>button</Button>
            </div>
        );
    }
}
export default Income;