import React, { PureComponent as Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Tabs } from 'antd';
import LoginForm from './Login';
import RegForm from './Reg';
import './Login.scss';
import i18n from '../../../i18n';
const TabPane = Tabs.TabPane;

@connect(state => ({
  loginWrapActiveKey: state.user.loginWrapActiveKey,
  canRegister: state.user.canRegister
}))
export default class LoginWrap extends Component {
  constructor(props) {
    super(props);
  }

  static propTypes = {
    form: PropTypes.object,
    loginWrapActiveKey: PropTypes.string,
    canRegister: PropTypes.bool
  };

  render() {
    const { loginWrapActiveKey, canRegister } = this.props;
    {/** show only login when register is disabled */}
    return (
      <Tabs
        defaultActiveKey={loginWrapActiveKey}
        className="login-form"
        tabBarStyle={{ border: 'none' }}
      >
        <TabPane tab={i18n('Login.Login.423150-4')} key="1">
          <LoginForm />
        </TabPane>
        <TabPane tab={i18n('Login.Login.423150-5')} key="2">
          {canRegister ? <RegForm /> : <div style={{minHeight: 200}}>{i18n('Login.Login.423150-6')}</div>}
        </TabPane>
      </Tabs>
    );
  }
}
