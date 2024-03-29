import React, { PureComponent as Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Tabs, Modal, Button } from 'antd';
import Edit from './Edit.js';
import View from './View.js';
import { Prompt } from 'react-router';
import { fetchInterfaceData } from '../../../../reducer/modules/interface.js';
import { withRouter } from 'react-router-dom';
import Run from './Run/Run.js';
import i18n from '../../../../../i18n';

const plugin = require('client/plugin.js');

const TabPane = Tabs.TabPane;
@connect(
  state => {
    return {
      curdata: state.inter.curdata,
      list: state.inter.list,
      editStatus: state.inter.editStatus
    };
  },
  {
    fetchInterfaceData
  }
)
class Content extends Component {
  static propTypes = {
    match: PropTypes.object,
    list: PropTypes.array,
    curdata: PropTypes.object,
    fetchInterfaceData: PropTypes.func,
    history: PropTypes.object,
    editStatus: PropTypes.bool
  };
  constructor(props) {
    super(props);
    this.title = i18n('InterfaceList.InterfaceContent.589922-0');
    this.state = {
      curtab: 'view',
      visible: false,
      nextTab: ''
    };
  }

  componentWillMount() {
    const params = this.props.match.params;
    this.actionId = params.actionId;
    this.handleRequest(this.props);
  }

  componentWillUnmount() {
    document.getElementsByTagName('title')[0].innerText = this.title;
  }

  componentWillReceiveProps(nextProps) {
    const params = nextProps.match.params;
    if (params.actionId !== this.actionId) {
      this.actionId = params.actionId;
      this.handleRequest(nextProps);
    }
  }

  handleRequest(nextProps) {
    const params = nextProps.match.params;
    this.props.fetchInterfaceData(params.actionId);
    this.setState({
      curtab: 'view'
    });
  }

  switchToView = () => {
    this.setState({
      curtab: 'view'
    });
  };

  onChange = key => {
    if (this.state.curtab === 'edit' && this.props.editStatus) {
      this.showModal();
    } else {
      this.setState({
        curtab: key
      });
    }
    this.setState({
      nextTab: key
    });
  };
  // 确定离开页面
  handleOk = () => {
    this.setState({
      visible: false,
      curtab: this.state.nextTab
    });
  };
  // 离开编辑页面的提示
  showModal = () => {
    this.setState({
      visible: true
    });
  };
  // 取消离开编辑页面
  handleCancel = () => {
    this.setState({
      visible: false
    });
  };
  render() {
    if (this.props.curdata.title) {
      document.getElementsByTagName('title')[0].innerText =
        this.props.curdata.title + '-' + this.title;
    }

    let InterfaceTabs = {
      view: {
        component: View,
        name: i18n('InterfaceList.InterfaceContent.589922-1')
      },
      edit: {
        component: Edit,
        name: i18n('InterfaceList.InterfaceContent.589922-2')
      },
      run: {
        component: Run,
        name: i18n('InterfaceList.InterfaceContent.589922-3')
      }
    };

    plugin.emitHook('interface_tab', InterfaceTabs);

    const tabs = (
      <Tabs
        className="tabs-large"
        onChange={this.onChange}
        activeKey={this.state.curtab}
        defaultActiveKey="view"
      >
        {Object.keys(InterfaceTabs).map(key => {
          let item = InterfaceTabs[key];
          return <TabPane tab={item.name} key={key} />;
        })}
      </Tabs>
    );
    let tabContent = null;
    if (this.state.curtab) {
      let C = InterfaceTabs[this.state.curtab].component;
      tabContent = <C switchToView={this.switchToView} />;
    }

    return (
      <div className="interface-content">
        <Prompt
          when={this.state.curtab === 'edit' && this.props.editStatus ? true : false}
          message={() => {
            // this.showModal();
            return i18n('InterfaceList.InterfaceContent.589922-4');
          }}
        />
        {tabs}
        {tabContent}
        {this.state.visible && (
          <Modal
            title={i18n('InterfaceList.InterfaceContent.589922-5')}
            visible={this.state.visible}
            onCancel={this.handleCancel}
            footer={[
              <Button key="back" onClick={this.handleCancel}>
                {i18n('InterfaceList.InterfaceContent.589922-6')}
              </Button>,
              <Button key="submit" onClick={this.handleOk}>
                {i18n('InterfaceList.InterfaceContent.589922-7')}
              </Button>
            ]}
          >
            <p>{i18n('InterfaceList.InterfaceContent.589922-4')}</p>
          </Modal>
        )}
      </div>
    );
  }
}

export default withRouter(Content);
