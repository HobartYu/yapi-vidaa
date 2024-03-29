import React, { PureComponent as Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Select, Button } from 'antd';
import i18n from '../../../../../i18n';

import constants from '../../../../constants/variable.js'
import { handleApiPath, nameLengthLimit } from '../../../../common.js'
const HTTP_METHOD = constants.HTTP_METHOD;
const HTTP_METHOD_KEYS = Object.keys(HTTP_METHOD);

const FormItem = Form.Item;
const Option = Select.Option;
function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}


class AddInterfaceForm extends Component {
  static propTypes = {
    form: PropTypes.object,
    onSubmit: PropTypes.func,
    onCancel: PropTypes.func,
    catid: PropTypes.number,
    catdata: PropTypes.array
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.onSubmit(values, () => {
          this.props.form.resetFields();
        });

      }
    });
  }

  handlePath = (e) => {
    let val = e.target.value
    this.props.form.setFieldsValue({
      path: handleApiPath(val)
    })
  }
  render() {
    const { getFieldDecorator, getFieldsError } = this.props.form;
    const prefixSelector = getFieldDecorator('method', {
      initialValue: 'GET'
    })(
      <Select style={{ width: 75 }}>
        {HTTP_METHOD_KEYS.map(item => {
          return <Option key={item} value={item}>{item}</Option>
        })}
      </Select>
      );
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
        <FormItem
          {...formItemLayout}
          label={i18n('InterfaceList.AddInterfaceForm.010380-0')}
        >
          {getFieldDecorator('catid', {
            initialValue: this.props.catid ? this.props.catid + '' : this.props.catdata[0]._id + ''
          })(
            <Select>
              {this.props.catdata.map(item => {
                return <Option key={item._id} value={item._id + ""}>{item.name}</Option>
              })}
            </Select>
            )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label={i18n('InterfaceList.AddInterfaceForm.010380-1')}
        >
          {getFieldDecorator('title', {
            rules: nameLengthLimit(i18n('InterfaceList.AddInterfaceForm.010380-2'))
          })(
            <Input placeholder={i18n('InterfaceList.AddInterfaceForm.010380-1')} />
            )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label={i18n('InterfaceList.AddInterfaceForm.010380-3')}
        >
          {getFieldDecorator('path', {
            rules: [{
              required: true, message: i18n('InterfaceList.AddInterfaceForm.010380-4')
            }]
          })(
            <Input onBlur={this.handlePath} addonBefore={prefixSelector} placeholder="/path" />
            )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label={i18n('InterfaceList.AddInterfaceForm.010380-5')}
        >
          <span style={{ color: "#929292" }}>{i18n('InterfaceList.AddInterfaceForm.010380-6')}</span>
        </FormItem>
        <FormItem className="catModalfoot" wrapperCol={{ span: 24, offset: 8 }} >
          <Button onClick={this.props.onCancel} style={{ marginRight: "10px" }}  >{i18n('InterfaceList.AddInterfaceForm.010380-7')}</Button>
          <Button
            type="primary"
            htmlType="submit"
            disabled={hasErrors(getFieldsError())}
          >
            {i18n('InterfaceList.AddInterfaceForm.010380-8')}
          </Button>
        </FormItem>

      </Form>

    );
  }
}

export default Form.create()(AddInterfaceForm);
