import React, { PureComponent as Component } from 'react';
import { Tabs } from 'antd';
import PropTypes from 'prop-types';
import ProjectMessage from './ProjectMessage/ProjectMessage.js';
import ProjectEnv from './ProjectEnv/index.js';
import ProjectRequest from './ProjectRequest/ProjectRequest';
import ProjectToken from './ProjectToken/ProjectToken';
import ProjectMock from './ProjectMock/index.js';
import { connect } from 'react-redux';
import i18n from '../../../../i18n';

const TabPane = Tabs.TabPane;
const plugin = require('client/plugin.js');

const routers = {}

import './Setting.scss';

@connect(state => {
  return {
    curProjectRole: state.project.currProject.role
  };
})
class Setting extends Component {
  static propTypes = {
    match: PropTypes.object,
    curProjectRole: PropTypes.string
  };
  render() {
    const id = this.props.match.params.id;
    plugin.emitHook('sub_setting_nav', routers);
    return (
      <div className="g-row">
        <Tabs type="card" className="has-affix-footer tabs-large">
          <TabPane tab={i18n('Setting.Setting.405099-0')} key="1">
            <ProjectMessage projectId={+id} />
          </TabPane>
          <TabPane tab={i18n('Setting.Setting.405099-1')} key="2">
            <ProjectEnv projectId={+id} />
          </TabPane>
          <TabPane tab={i18n('Setting.Setting.405099-2')} key="3">
            <ProjectRequest projectId={+id} />
          </TabPane>
          {this.props.curProjectRole !== 'guest' ? (
            <TabPane tab={i18n('Setting.Setting.405099-3')} key="4">
              <ProjectToken projectId={+id} curProjectRole={this.props.curProjectRole} />
            </TabPane>
          ) : null}
          <TabPane tab={i18n('Setting.Setting.405099-4')} key="5">
            <ProjectMock projectId={+id} />
          </TabPane>
          {Object.keys(routers).map(key=>{
            const C = routers[key].component;
            return <TabPane tab={routers[key].name} key={routers[key].name}>
              <C projectId={+id} />
            </TabPane>
          })}
        </Tabs>
      </div>
    );
  }
}

export default Setting;
