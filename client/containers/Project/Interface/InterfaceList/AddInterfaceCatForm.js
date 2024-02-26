import React, { PureComponent as Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Button } from 'antd';
import i18n from '../../../../../i18n';

const FormItem = Form.Item;
function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}
class AddInterfaceForm extends Component {
  static propTypes = {
    form: PropTypes.object,
    onSubmit: PropTypes.func,
    onCancel: PropTypes.func,
    catdata: PropTypes.object
  };
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.onSubmit(values);
      }
    });
  };

  render() {
    const { getFieldDecorator, getFieldsError } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 }
      }
    };

    return (
      <Form onSubmit={this.handleSubmit}>
        <FormItem {...formItemLayout} label={i18n('InterfaceList.AddInterfaceCatForm.896256-0')}>
          {getFieldDecorator('name', {
            rules: [
              {
                required: true,
                message: i18n('InterfaceList.AddInterfaceCatForm.896256-1')
              }
            ],
            initialValue: this.props.catdata ? this.props.catdata.name || null : null
          })(<Input placeholder={i18n('InterfaceList.AddInterfaceCatForm.896256-2')} />)}
        </FormItem>
        <FormItem {...formItemLayout} label={i18n('InterfaceList.AddInterfaceCatForm.896256-3')}>
          {getFieldDecorator('desc', {
            initialValue: this.props.catdata ? this.props.catdata.desc || null : null
          })(<Input placeholder={i18n('InterfaceList.AddInterfaceCatForm.896256-3')} />)}
        </FormItem>

        <FormItem className="catModalfoot" wrapperCol={{ span: 24, offset: 8 }}>
          <Button onClick={this.props.onCancel} style={{ marginRight: '10px' }}>
            {i18n('InterfaceList.AddInterfaceCatForm.896256-4')}
          </Button>
          <Button type="primary" htmlType="submit" disabled={hasErrors(getFieldsError())}>
            {i18n('InterfaceList.AddInterfaceCatForm.896256-5')}
          </Button>
        </FormItem>
      </Form>
    );
  }
}

export default Form.create()(AddInterfaceForm);
