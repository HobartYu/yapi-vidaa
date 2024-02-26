import React, { Component } from 'react';
import axios from 'axios';
import { Alert, message } from 'antd';
import i18n from '../../../i18n';

export default class Notify extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newVersion: process.env.version,
      version: process.env.version
    };
  }

  componentDidMount() {
    const versions = 'https://www.fastmock.site/mock/1529fa78fa4c4880ad153d115084a940/yapi/versions';
    axios.get(versions).then(req => {
      if (req.status === 200) {
        this.setState({ newVersion: req.data.data[0] });
      } else {
        message.error(i18n('Notify.Notify.575185-0'));
      }
    });
  }

  render() {
    const isShow = this.state.newVersion !== this.state.version;
    return (
      <div>
        {isShow && (
          <Alert
            message={
              <div>
                {i18n('Notify.Notify.575185-1')}{this.state.version}&nbsp;&nbsp;{i18n('Notify.Notify.575185-2')} {this.state.newVersion}
                &nbsp;&nbsp;&nbsp;
                <a
                  target="view_window"
                  href="https://github.com/YMFE/yapi/blob/master/CHANGELOG.md"
                >
                  {i18n('Notify.Notify.575185-3')}
                </a>
              </div>
            }
            banner
            closable
            type="info"
          />
        )}
      </div>
    );
  }
}
