import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { formatTime } from 'client/common.js';
import { Form, Switch, Button, Icon, Tooltip, message, Input, Select } from 'antd';
import {handleSwaggerUrlData} from 'client/reducer/modules/project';
const FormItem = Form.Item;
const Option = Select.Option;
import axios from 'axios';
import i18n from '../../../i18n';

// layout
const formItemLayout = {
  labelCol: {
    lg: { span: 5 },
    xs: { span: 24 },
    sm: { span: 10 }
  },
  wrapperCol: {
    lg: { span: 16 },
    xs: { span: 24 },
    sm: { span: 12 }
  },
  className: 'form-item'
};
const tailFormItemLayout = {
  wrapperCol: {
    sm: {
      span: 16,
      offset: 11
    }
  }
};

@connect(
  state => {
    return {
      projectMsg: state.project.currProject
    };
  },
  {
    handleSwaggerUrlData
  }
)
@Form.create()
export default class ProjectInterfaceSync extends Component {
  static propTypes = {
    form: PropTypes.object,
    match: PropTypes.object,
    projectId: PropTypes.number,
    projectMsg: PropTypes.object,
    handleSwaggerUrlData: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.state = {
      sync_data: { is_sync_open: false }
    };
  }

  handleSubmit = async () => {
    const { form, projectId } = this.props;
    let params = {
      project_id: projectId,
      is_sync_open: this.state.sync_data.is_sync_open,
      uid: this.props.projectMsg.uid
    };
    if (this.state.sync_data._id) {
      params.id = this.state.sync_data._id;
    }
    form.validateFields(async (err, values) => {
      if (!err) {
        let assignValue = Object.assign(params, values);
        await axios.post('/api/plugin/autoSync/save', assignValue).then(res => {
          if (res.data.errcode === 0) {
            message.success(i18n('swaggerAutoSync.swaggerAutoSync.279556-0'));
          } else {
            message.error(res.data.errmsg);
          }
        });
      }
    });

  };

  validSwaggerUrl = async (rule, value, callback) => {
    if(!value)return;
    try{
      await this.props.handleSwaggerUrlData(value);
    } catch(e) {
      callback(i18n('swaggerAutoSync.swaggerAutoSync.279556-1'));
    }
    callback()
  }

  componentWillMount() {
    //查询同步任务
    this.setState({
      sync_data: {}
    });
    //默认每份钟同步一次,取一个随机数
    this.setState({
      random_corn: '*/2 * * * *'
    });
    this.getSyncData();
  }

  async getSyncData() {
    let projectId = this.props.projectMsg._id;
    let result = await axios.get('/api/plugin/autoSync/get?project_id=' + projectId);
    if (result.data.errcode === 0) {
      if (result.data.data) {
        this.setState({
          sync_data: result.data.data
        });
      }
    }
  }

  // 是否开启
  onChange = v => {
    let sync_data = this.state.sync_data;
    sync_data.is_sync_open = v;
    this.setState({
      sync_data: sync_data
    });
  };

  sync_cronCheck(rule, value, callback){
    if(!value)return;
    value = value.trim();
    if(value.split(/ +/).length > 5){
      callback(i18n('swaggerAutoSync.swaggerAutoSync.279556-2'))
    }
    callback()
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div className="m-panel">
        <Form>
          <FormItem
            label={i18n('swaggerAutoSync.swaggerAutoSync.279556-4')}
            {...formItemLayout}
          >
            <Switch
              checked={this.state.sync_data.is_sync_open}
              onChange={this.onChange}
              checkedChildren={i18n('swaggerAutoSync.swaggerAutoSync.279556-5')}
              unCheckedChildren={i18n('swaggerAutoSync.swaggerAutoSync.279556-6')}
            />
            {this.state.sync_data.last_sync_time != null ? (<div>{i18n('swaggerAutoSync.swaggerAutoSync.279556-7')}<span className="logtime">{formatTime(this.state.sync_data.last_sync_time)}</span></div>) : null}
          </FormItem>

          <div>
            <FormItem {...formItemLayout} label={
              <span className="label">
                {i18n('swaggerAutoSync.swaggerAutoSync.279556-8')}&nbsp;
                <Tooltip
                  title={
                    <div>
                      <h3 style={{ color: 'white' }}>{i18n('swaggerAutoSync.swaggerAutoSync.279556-9')}</h3>
                      <p>{i18n('swaggerAutoSync.swaggerAutoSync.279556-10')}</p>
                      <br />
                      <h3 style={{ color: 'white' }}>{i18n('swaggerAutoSync.swaggerAutoSync.279556-11')}</h3>
                      <p>
                        {i18n('swaggerAutoSync.swaggerAutoSync.279556-12')}
                      </p>
                      <br />
                      <h3 style={{ color: 'white' }}>{i18n('swaggerAutoSync.swaggerAutoSync.279556-14')}</h3>
                      <p>{i18n('swaggerAutoSync.swaggerAutoSync.279556-15')}</p>
                    </div>
                  }
                >
                  <Icon type="question-circle-o" />
                </Tooltip>{' '}
              </span>
            }>
              {getFieldDecorator('sync_mode', {
                initialValue: this.state.sync_data.sync_mode,
                rules: [
                  {
                    required: true,
                    message: i18n('swaggerAutoSync.swaggerAutoSync.279556-16')
                  }
                ]
              })(

                <Select>
                  <Option value="normal">{i18n('swaggerAutoSync.swaggerAutoSync.279556-9')}</Option>
                  <Option value="good">{i18n('swaggerAutoSync.swaggerAutoSync.279556-11')}</Option>
                  <Option value="merge">{i18n('swaggerAutoSync.swaggerAutoSync.279556-14')}</Option>
                </Select>
              )}
            </FormItem>

            <FormItem {...formItemLayout} label={i18n('swaggerAutoSync.swaggerAutoSync.279556-17')}>
              {getFieldDecorator('sync_json_url', {
                rules: [
                  {
                    required: true,
                    message: i18n('swaggerAutoSync.swaggerAutoSync.279556-18')
                  },
                  {
                    validator: this.validSwaggerUrl
                  }
                ],
                validateTrigger: 'onBlur',
                initialValue: this.state.sync_data.sync_json_url
              })(<Input />)}
            </FormItem>

            <FormItem {...formItemLayout} label={<span>{i18n('swaggerAutoSync.swaggerAutoSync.279556-19')}&nbsp;<a href="https://blog.csdn.net/shouldnotappearcalm/article/details/89469047">{i18n('swaggerAutoSync.swaggerAutoSync.279556-20')}</a></span>}>
              {getFieldDecorator('sync_cron', {
                rules: [
                  {
                    required: true,
                    message: i18n('swaggerAutoSync.swaggerAutoSync.279556-21')
                  },
                  {
                    validator: this.sync_cronCheck
                  }
                ],
                initialValue: this.state.sync_data.sync_cron ? this.state.sync_data.sync_cron : this.state.random_corn
              })(<Input />)}
            </FormItem>
          </div>
          <FormItem {...tailFormItemLayout}>
            <Button type="primary" htmlType="submit" icon="save" size="large" onClick={this.handleSubmit}>
              {i18n('swaggerAutoSync.swaggerAutoSync.279556-22')}
            </Button>
          </FormItem>
        </Form>
      </div>
    );
  }
}
