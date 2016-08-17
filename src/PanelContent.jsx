import React, { PropTypes } from 'react';
import classnames from 'classnames';

const PanelContent = React.createClass({
  propTypes: {
    prefixCls: PropTypes.string,
    index: PropTypes.number,
    isActive: PropTypes.bool,
    children: PropTypes.any,
  },
  shouldComponentUpdate(nextProps) {
    return this.props.isActive || nextProps.isActive;
  },
  render() {
    this._isActived = this._isActived || this.props.isActive;
    const { index, prefixCls, isActive, children } = this.props;
    const contentCls = classnames({
      [`${prefixCls}-content`]: true,
      [`${prefixCls}-content-active`]: isActive,
      [`${prefixCls}-content-inactive`]: !isActive,
    });

    return (
      <div
        id={`${prefixCls}-${index}`}
        role="tabpanel"
        tabIndex="0"
        aria-hidden={!isActive}
        className={contentCls}
      >
        <div className={`${prefixCls}-content-box`}>{children}</div>
      </div>
    );
  },
});

export default PanelContent;
