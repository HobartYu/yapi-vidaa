import React, { PureComponent as Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Form, Button, Input, Icon, message } from 'antd';
import { regActions } from '../../reducer/modules/user';
import { withRouter } from 'react-router';
import i18n from '../../../i18n';
const FormItem = Form.Item;
const formItemStyle = {
  marginBottom: '.16rem'
};

const changeHeight = {
  height: '.42rem'
};

@connect(
  state => {
    return {
      loginData: state.user
    };
  },
  {
    regActions
  }
)
@withRouter
class Reg extends Component {
  constructor(props) {
    super(props);
    this.state = {
      confirmDirty: false
    };
  }

  static propTypes = {
    form: PropTypes.object,
    history: PropTypes.object,
    regActions: PropTypes.func
  };

  handleSubmit = e => {
    e.preventDefault();
    const form = this.props.form;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.regActions(values).then(res => {
          if (res.payload.data.errcode == 0) {
            this.props.history.replace('/group');
            message.success(i18n('Login.Reg.802716-0'));
          }
        });
      }
    });
  };

  checkPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('password')) {
      callback(i18n('Login.Reg.802716-1'));
    } else {
      callback();
    }
  };

  checkConfirm = (rule, value, callback) => {
    const form = this.props.form;
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit}>
        {/* 用户名 */}
        <FormItem style={formItemStyle}>
          {getFieldDecorator('userName', {
            rules: [{ required: true, message: i18n('Login.Reg.802716-2') }]
          })(
            <Input
              style={changeHeight}
              prefix={<Icon type="user" style={{ fontSize: 13 }} />}
              placeholder="Username"
            />
          )}
        </FormItem>

        {/* Emaiil */}
        <FormItem style={formItemStyle}>
          {getFieldDecorator('email', {
            rules: [
              {
                required: true,
                message: i18n('Login.Reg.802716-3'),
                pattern: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{1,})+$/
              }
            ]
          })(
            <Input
              style={changeHeight}
              prefix={<Icon type="mail" style={{ fontSize: 13 }} />}
              placeholder="Email"
            />
          )}
        </FormItem>

        {/* 密码 */}
        <FormItem style={formItemStyle}>
          {getFieldDecorator('password', {
            rules: [
              {
                required: true,
                message: i18n('Login.Reg.802716-4')
              },
              {
                validator: this.checkConfirm
              }
            ]
          })(
            <Input
              style={changeHeight}
              prefix={<Icon type="lock" style={{ fontSize: 13 }} />}
              type="password"
              placeholder="Password"
            />
          )}
        </FormItem>

        {/* 密码二次确认 */}
        <FormItem style={formItemStyle}>
          {getFieldDecorator('confirm', {
            rules: [
              {
                required: true,
                message: i18n('Login.Reg.802716-5')
              },
              {
                validator: this.checkPassword
              }
            ]
          })(
            <Input
              style={changeHeight}
              prefix={<Icon type="lock" style={{ fontSize: 13 }} />}
              type="password"
              placeholder="Confirm Password"
            />
          )}
        </FormItem>

        {/* 注册按钮 */}
        <FormItem style={formItemStyle}>
          <Button
            style={changeHeight}
            type="primary"
            htmlType="submit"
            className="login-form-button"
          >
            {i18n('Login.Reg.802716-6')}
          </Button>
        </FormItem>
      </Form>
    );
  }
}
const RegForm = Form.create()(Reg);
export default RegForm;
