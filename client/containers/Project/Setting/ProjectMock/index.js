import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Form, Switch, Button, Icon, Tooltip, message } from 'antd';
import AceEditor from '../../../../components/AceEditor/AceEditor';
const FormItem = Form.Item;
import { updateProjectMock, getProject } from '../../../../reducer/modules/project';
import i18n from '../../../../../i18n';

const formItemLayout = {
  labelCol: {
    sm: { span: 4 }
  },
  wrapperCol: {
    sm: { span: 16 }
  }
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
    updateProjectMock,
    getProject
  }
)
@Form.create()
export default class ProjectMock extends Component {
  static propTypes = {
    form: PropTypes.object,
    match: PropTypes.object,
    projectId: PropTypes.number,
    updateProjectMock: PropTypes.func,
    projectMsg: PropTypes.object,
    getProject: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.state = {
      is_mock_open: false,
      project_mock_script: ''
    };
  }

  handleSubmit = async () => {
    let params = {
      id: this.props.projectId,
      project_mock_script: this.state.project_mock_script,
      is_mock_open: this.state.is_mock_open
    };

    let result = await this.props.updateProjectMock(params);

    if (result.payload.data.errcode === 0) {
      message.success(i18n('ProjectMock.index.133722-0'));
      await this.props.getProject(this.props.projectId);
    } else {
      message.success(i18n('ProjectMock.index.133722-1') + result.payload.data.errmsg);
    }
  };

  componentWillMount() {
    this.setState({
      is_mock_open: this.props.projectMsg.is_mock_open,
      project_mock_script: this.props.projectMsg.project_mock_script
    });
  }

  // 是否开启
  onChange = v => {
    this.setState({
      is_mock_open: v
    });
  };

  handleMockJsInput = e => {
    this.setState({
      project_mock_script: e.text
    });
  };

  render() {
    return (
      <div className="m-panel">
        <Form>
          <FormItem
            label={
              <span>
                {i18n('ProjectMock.index.133722-2')}&nbsp;<a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://hellosean1025.github.io/yapi/documents/project.html#%E5%85%A8%E5%B1%80mock"
                >
                  <Tooltip title={i18n('ProjectMock.index.133722-3')}>
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </a>
              </span>
            }
            {...formItemLayout}
          >
            <Switch
              checked={this.state.is_mock_open}
              onChange={this.onChange}
              checkedChildren={i18n('ProjectMock.index.133722-4')}
              unCheckedChildren={i18n('ProjectMock.index.133722-5')}
            />
          </FormItem>
          <FormItem label={i18n('ProjectMock.index.133722-6')} {...formItemLayout}>
            <AceEditor
              data={this.state.project_mock_script}
              onChange={this.handleMockJsInput}
              style={{ minHeight: '500px' }}
            />
          </FormItem>
          <FormItem {...tailFormItemLayout}>
            <Button type="primary" htmlType="submit" onClick={this.handleSubmit}>
              {i18n('ProjectMock.index.133722-7')}
            </Button>
          </FormItem>
        </Form>
      </div>
    );
  }
}
