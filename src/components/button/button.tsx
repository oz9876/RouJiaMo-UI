import React, { Component } from 'react';
import classNames from 'classnames';
import { polyfill } from 'react-lifecycles-compat';

// export interface ButtonProps {
//   children?: any;

// }
export interface BaseButtonProps {
  loading?: boolean | { delay?: number };
  prefixCls?: string;
  className?: string;
  ghost?: boolean;
  block?: boolean;
  children: any;
}
export type ButtonProps = BaseButtonProps;

interface ButtonState {
}

class Button extends React.Component<ButtonProps, ButtonState> {
  state = {
      announcements:[],
      statusType: null,
      showDetail: true,
      applyIncomeModalOpen: false
  };

  renderButton = () => {
    const classes= classNames({

    })
    const {
      children
    }: ButtonProps = this.props
    const kids = children;
    const iconNode= null;
    
    const buttonNode = (
      <button
        className={classes}
      >
        {iconNode}
        {kids}
      </button>
    );
    return <div>{buttonNode}</div>;
  }
  render() {
      return (
          <div className="button">
            {this.renderButton()}
          </div>
      );
  }
}

polyfill(Button);

export default Button;