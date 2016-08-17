import React, { PropTypes, Children }from 'react';
import KeyCode from './KeyCode';
import CollapsePanel from './Panel';
import openAnimationFactory from './openAnimationFactory';

function toArray(activeKey) {
  let currentActiveKey = activeKey;
  if (!Array.isArray(currentActiveKey)) {
    currentActiveKey = currentActiveKey ? [currentActiveKey] : [];
  }
  return currentActiveKey;
}

const Collapse = React.createClass({
  propTypes: {
    children: PropTypes.any,
    prefixCls: PropTypes.string,
    activeKey: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.arrayOf(PropTypes.string),
    ]),
    defaultActiveKey: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.arrayOf(PropTypes.string),
    ]),
    openAnimation: PropTypes.object,
    onChange: PropTypes.func,
    accordion: PropTypes.bool,
  },

  statics: {
    Panel: CollapsePanel,
  },

  getDefaultProps() {
    return {
      prefixCls: 'rc-collapse',
      onChange() {
      },
      accordion: false,
    };
  },

  getInitialState() {
    const { activeKey, defaultActiveKey } = this.props;
    let currentActiveKey = defaultActiveKey;
    if ('activeKey' in this.props) {
      currentActiveKey = activeKey;
    }
    return {
      openAnimation: this.props.openAnimation || openAnimationFactory(this.props.prefixCls),
      activeKey: toArray(currentActiveKey),
    };
  },

  componentWillReceiveProps(nextProps) {
    if ('activeKey' in nextProps) {
      this.setState({
        activeKey: toArray(nextProps.activeKey),
      });
    }
    if ('openAnimation' in nextProps) {
      this.setState({
        openAnimation: nextProps.openAnimation,
      });
    }
  },

  onClickItem(key) {
    return () => {
      let activeKey = this.state.activeKey;
      if (this.props.accordion) {
        activeKey = activeKey[0] === key ? [] : [key];
      } else {
        activeKey = [...activeKey];
        const index = activeKey.indexOf(key);
        const isActive = index > -1;
        if (isActive) {
          // remove active state
          activeKey.splice(index, 1);
        } else {
          activeKey.push(key);
        }
      }
      this.setActiveKey(activeKey);
    };
  },

  onTabClick(key) {
    this.setActiveKey(key);
    if (this.state.activeKey !== key) {
      this.props.onChange(key);
    }
  },

  onNavKeyDown(e) {
    const eventKeyCode = e.keyCode;

    if (eventKeyCode === KeyCode.ENTER) {
      const ariaid = e.target.getAttribute('aria-controls');
      const re = /(\d+)$/g;
      const key = re.exec(ariaid);
      this.onTabClick(key);
    } else if (eventKeyCode === KeyCode.RIGHT || eventKeyCode === KeyCode.DOWN) {
      e.preventDefault();
      const nextKey = this.getNextActiveKey(true);
      this.onTabClick(nextKey);
    } else if (eventKeyCode === KeyCode.LEFT || eventKeyCode === KeyCode.UP) {
      e.preventDefault();
      const previousKey = this.getNextActiveKey(false);
      this.onTabClick(previousKey);
    }
  },
  getNextActiveKey(next) {
    const activeKey = this.state.activeKey;
    const children = [];

    React.Children.forEach(this.props.children, (c) => {
      if (!c.props.disabled) {
        if (next) {
          children.push(c);
        } else {
          children.unshift(c);
        }
      }
    });

    const length = children.length;
    let ret = length && children[0].key;
    children.forEach((child, i) => {
      if (child.key === activeKey[0]) {
        if (i === length - 1) {
          ret = children[0];
        } else {
          ret = children[i + 1];
        }
        ret = ret.key;
      }
    });

    return ret;
  },

  getItems() {
    const activeKey = this.state.activeKey;
    const { prefixCls, accordion } = this.props;
    return Children.map(this.props.children, (child, index) => {
      // If there is no key provide, use the panel order as default key
      const key = child.key || String(index);
      const header = child.props.header;
      let isActive = false;
      if (accordion) {
        isActive = activeKey[0] === key;
      } else {
        isActive = activeKey.indexOf(key) > -1;
      }

      const props = {
        key,
        index: key,
        header,
        isActive,
        prefixCls,
        openAnimation: this.state.openAnimation,
        children: child.props.children,
        onItemClick: this.onClickItem(key).bind(this),
      };

      return React.cloneElement(child, props);
    });
  },

  setActiveKey(activeKey) {
    if (!('activeKey' in this.props)) {
      this.setState({
        activeKey,
      });
    }
    this.props.onChange(this.props.accordion ? activeKey[0] : activeKey);
  },

  render() {
    const prefixCls = this.props.prefixCls;
    return (
      <div
        tabIndex="0"
        className={prefixCls} role="tablist"
        onKeyDown={this.onNavKeyDown}
      >
        {this.getItems()}
      </div>
    );
  },
});

export default Collapse;
