import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './ProjectToken.scss';
import { getToken, updateToken } from '../../../../reducer/modules/project';
import { connect } from 'react-redux';
import { Icon, Tooltip, message, Modal } from 'antd';
import copy from 'copy-to-clipboard';
import i18n from '../../../../../i18n';

const confirm = Modal.confirm;

@connect(
  state => {
    return {
      token: state.project.token
    };
  },
  {
    getToken,
    updateToken
  }
)
class ProjectToken extends Component {
  static propTypes = {
    projectId: PropTypes.number,
    getToken: PropTypes.func,
    token: PropTypes.string,
    updateToken: PropTypes.func,
    curProjectRole: PropTypes.string
  };

  async componentDidMount() {
    await this.props.getToken(this.props.projectId);
  }

  copyToken = () => {
    copy(this.props.token);
    message.success(i18n('ProjectToken.ProjectToken.718595-0'));
  };

  updateToken = () => {
    let that = this;
    confirm({
      title: i18n('ProjectToken.ProjectToken.718595-1'),
      content: i18n('ProjectToken.ProjectToken.718595-2'),
      okText: i18n('ProjectToken.ProjectToken.718595-3'),
      cancelText: i18n('ProjectToken.ProjectToken.718595-4'),
      async onOk() {
        await that.props.updateToken(that.props.projectId);
        message.success(i18n('ProjectToken.ProjectToken.718595-5'));
      },
      onCancel() {}
    });
  };

  render() {
    return (
      <div className="project-token">
        <h2 className="token-title">{i18n('ProjectToken.ProjectToken.718595-6')}</h2>
        <div className="message">
          {i18n('ProjectToken.ProjectToken.718595-7')}
        </div>
        <div className="token">
          <span>
            token: <span className="token-message">{this.props.token}</span>
          </span>
          <Tooltip title={i18n('ProjectToken.ProjectToken.718595-8')}>
            <Icon className="token-btn" type="copy" onClick={this.copyToken} />
          </Tooltip>
          {this.props.curProjectRole === 'admin' || this.props.curProjectRole === 'owner' ? (
            <Tooltip title={i18n('ProjectToken.ProjectToken.718595-9')}>
              <Icon className="token-btn" type="reload" onClick={this.updateToken} />
            </Tooltip>
          ) : null}
        </div>
        <div className="blockquote">
          {i18n('ProjectToken.ProjectToken.718595-10')}
        </div>
        <br />
        <h2  className="token-title">{i18n('ProjectToken.ProjectToken.718595-11')}</h2>
        <p><a target="_blank" rel="noopener noreferrer"   href="https://hellosean1025.github.io/yapi/openapi.html">详细接口文档</a></p>
        <div>
          <ul className="open-api">
            <li>{i18n('ProjectToken.ProjectToken.718595-12')}</li>
            <li>{i18n('ProjectToken.ProjectToken.718595-13')}</li>
            <li>{i18n('ProjectToken.ProjectToken.718595-14')}</li>
            <li>{i18n('ProjectToken.ProjectToken.718595-15')}</li>
            <li>{i18n('ProjectToken.ProjectToken.718595-16')}</li>
            <li>{i18n('ProjectToken.ProjectToken.718595-17')}</li>
            <li>{i18n('ProjectToken.ProjectToken.718595-18')}</li>
            <li>{i18n('ProjectToken.ProjectToken.718595-19')}</li>
            <li>{i18n('ProjectToken.ProjectToken.718595-20')}</li>
            <li>{i18n('ProjectToken.ProjectToken.718595-12')}</li>
          </ul>
        </div>
      </div>
    );
  }
}

export default ProjectToken;
