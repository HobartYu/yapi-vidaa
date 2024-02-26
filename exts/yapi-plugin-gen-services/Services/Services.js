import React, { PureComponent as Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux';
import { getToken } from '../../../client/reducer/modules/project.js'
import i18n from '../../../i18n';


import './Services.scss';

@connect(
  state => {
    return {
      token: state.project.token
    }
  },
  {
    getToken
  }
)
export default class Services extends Component {
  static propTypes = {
    projectId: PropTypes.string,
    token: PropTypes.string,
    getToken: PropTypes.func
  }

  async componentDidMount() {
    const id = this.props.projectId;
    await this.props.getToken(id);

  }
  render () {
    const id = this.props.projectId;
    return (
      <div className="project-services">
        <section className="news-box m-panel">
          <div className="token">
            <h5>{i18n('Services.Services.743139-0')}</h5>
            <pre>{`
  npm i sm2tsservice -D
  `}</pre>
            <h5>{i18n('Services.Services.743139-1')}</h5>
            <pre>{`
  touch json2service.json
  `}</pre>
            <pre>{`
  {
    "url": "yapi-swagger.json",
    "remoteUrl": "${location.protocol}//${location.hostname}${location.port ? `:${location.port}` : ''}/api/open/plugin/export-full?type=json&pid=${id}&status=all&token=${this.props.token}",
    "type": "yapi",
    "swaggerParser": {}
  }
  `}
            </pre>
            <h5>{i18n('Services.Services.743139-2')}</h5>
            <pre>{`
  touch json2service.json
  `}</pre>
            <pre>{`
  {
    "url": "${location.protocol}//${location.hostname}${location.port ? `:${location.port}` : ''}/api/open/plugin/export-full?type=json&pid=${id}&status=all&token=${this.props.token}",
    "type": "yapi",
    "swaggerParser": {}
  }
  `}
            </pre>
            <h5>{i18n('Services.Services.743139-3')}</h5>
            <pre>{`
  (./node_modules/.bin/)sm2tsservice --clear
  `}</pre>
          </div>
          <a href="https://github.com/gogoyqj/sm2tsservice">{i18n('Services.Services.743139-4')} sm2tsservice</a>
        </section>
      </div>
    );
  }
}