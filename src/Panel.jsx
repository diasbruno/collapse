import React, { PropTypes } from 'react';
import classNames from 'classnames';
import PanelContent from './PanelContent';
import Animate from 'rc-animate';

const CollapsePanel = React.createClass({
  propTypes: {
    className: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object,
    ]),
    index: PropTypes.number,
    children: PropTypes.any,
    openAnimation: PropTypes.object,
    prefixCls: PropTypes.string,
    header: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
      PropTypes.node,
    ]),
    isActive: PropTypes.bool,
    onItemClick: PropTypes.func,
  },

  getDefaultProps() {
    return {
      isActive: false,
      onItemClick() {
      },
    };
  },

  handleItemClick() {
    this.props.onItemClick();
  },

  render() {
    const {
      className, prefixCls, header, children, isActive,
    } = this.props;
    const key = this.props.index;

    const headerCls = `${prefixCls}-header`;
    const itemCls = classNames({
      [`${prefixCls}-item`]: true,
      [`${prefixCls}-item-active`]: isActive,
      [className]: className,
    });
    return (
      <div className={ itemCls }>
        <div
          className={headerCls}
          ref="tab-ref"
          aria-controls={`react-collapse-${key}`}
          aria-disabled={false}
          aria-expanded={isActive}
          aria-selected={isActive}
          onClick={this.handleItemClick}
          role="tab"
          tabIndex="0"
          onClick={this.handleItemClick}
        >
          <i className="arrow"></i>
          <a title={header}>{header}</a>
        </div>
        <Animate
          showProp="isActive"
          exclusive
          component=""
          animation={this.props.openAnimation}
        >
          <PanelContent index={key} prefixCls={prefixCls} isActive={isActive}>
            {children}
          </PanelContent>
        </Animate>
      </div>
    );
  },
});

export default CollapsePanel;
