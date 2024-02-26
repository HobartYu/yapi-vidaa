import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { Table, Button, message, Popconfirm, Tooltip, Icon } from 'antd';
import { fetchMockCol } from 'client/reducer/modules/mockCol';
import { formatTime } from 'client/common.js';
import constants from 'client/constants/variable.js';
import CaseDesModal from './CaseDesModal';
import { json5_parse } from '../../../client/common';
import _ from 'underscore';
import i18n from '../../../i18n';

@connect(
  state => {
    return {
      list: state.mockCol.list,
      currInterface: state.inter.curdata,
      currProject: state.project.currProject
    };
  },
  {
    fetchMockCol
  }
)
@withRouter
export default class MockCol extends Component {
  static propTypes = {
    list: PropTypes.array,
    currInterface: PropTypes.object,
    match: PropTypes.object,
    fetchMockCol: PropTypes.func,
    currProject: PropTypes.object
  };

  state = {
    caseData: {},
    caseDesModalVisible: false,
    isAdd: false
  };

  constructor(props) {
    super(props);
  }

  componentWillMount() {
    const interfaceId = this.props.match.params.actionId;
    this.props.fetchMockCol(interfaceId);
  }

  openModal = (record, isAdd) => {
    return async () => {
      if (this.props.currInterface.res_body_is_json_schema && isAdd) {
        let result = await axios.post('/api/interface/schema2json', {
          schema: json5_parse(this.props.currInterface.res_body),
          required: true
        });
        record.res_body = JSON.stringify(result.data);
      }
      // 参数过滤schema形式
      if (this.props.currInterface.req_body_is_json_schema) {
        let result = await axios.post('/api/interface/schema2json', {
          schema: json5_parse(this.props.currInterface.req_body_other),
          required: true
        });
        record.req_body_other = JSON.stringify(result.data);
      }

      this.setState({
        isAdd: isAdd,
        caseDesModalVisible: true,
        caseData: record
      });
    };
  };

  handleOk = async caseData => {
    if (!caseData) {
      return null;
    }
    const { caseData: currcase } = this.state;
    const interface_id = this.props.match.params.actionId;
    const project_id = this.props.match.params.id;
    caseData = Object.assign({
      ...caseData,
      interface_id: interface_id,
      project_id: project_id
    });
    if (!this.state.isAdd) {
      caseData.id = currcase._id;
    }
    await axios.post('/api/plugin/advmock/case/save', caseData).then(async res => {
      if (res.data.errcode === 0) {
        message.success(this.state.isAdd ? i18n('MockCol.MockCol.244853-0') : i18n('MockCol.MockCol.244853-1'));
        await this.props.fetchMockCol(interface_id);
        this.setState({ caseDesModalVisible: false });
      } else {
        message.error(res.data.errmsg);
      }
    });
  };

  deleteCase = async id => {
    const interface_id = this.props.match.params.actionId;
    await axios.post('/api/plugin/advmock/case/del', { id }).then(async res => {
      if (res.data.errcode === 0) {
        message.success(i18n('MockCol.MockCol.244853-2'));
        await this.props.fetchMockCol(interface_id);
      } else {
        message.error(res.data.errmsg);
      }
    });
  };

  // mock case 可以设置开启的关闭
  openMockCase = async (id , enable=true)=> {
    const interface_id = this.props.match.params.actionId;

    await axios.post('/api/plugin/advmock/case/hide', {
      id,
      enable: !enable
    }).then(async res => {
      if (res.data.errcode === 0) {
        message.success(i18n('MockCol.MockCol.244853-3'));
        await this.props.fetchMockCol(interface_id);
      } else {
        message.error(res.data.errmsg);
      }
    })
  }

  render() {
    const { list: data, currInterface } = this.props;
    const { isAdd, caseData, caseDesModalVisible } = this.state;

    const role = this.props.currProject.role;
    const isGuest = role === 'guest';
    const initCaseData = {
      ip: '',
      ip_enable: false,
      name: currInterface.title,
      code: '200',
      delay: 0,
      headers: [{ name: '', value: '' }],
      params: {},
      res_body: currInterface.res_body
    };

    let ipFilters = [];
    let ipObj = {};
    let userFilters = [];
    let userObj = {};
    _.isArray(data) &&
      data.forEach(item => {
        ipObj[item.ip_enable ? item.ip : ''] = '';
        userObj[item.username] = '';
      });
    ipFilters = Object.keys(Object.assign(ipObj)).map(value => {
      if (!value) {
        value = i18n('MockCol.MockCol.244853-4');
      }
      return { text: value, value };
    });
    userFilters = Object.keys(Object.assign(userObj)).map(value => {
      return { text: value, value };
    });
    const columns = [
      {
        title: i18n('MockCol.MockCol.244853-5'),
        dataIndex: 'name',
        key: 'name'
      },
      {
        title: 'ip',
        dataIndex: 'ip',
        key: 'ip',
        render: (text, recode) => {
          if (!recode.ip_enable) {
            text = '';
          }
          return text;
        },
        onFilter: (value, record) =>
          (record.ip === value && record.ip_enable) || (value === i18n('MockCol.MockCol.244853-4') && !record.ip_enable),
        filters: ipFilters
      },
      {
        title: i18n('MockCol.MockCol.244853-6'),
        dataIndex: 'username',
        key: 'username',
        onFilter: (value, record) => record.username === value,
        filters: userFilters
      },
      {
        title: i18n('MockCol.MockCol.244853-7'),
        dataIndex: 'up_time',
        key: 'up_time',
        render: text => formatTime(text)
      },
      {
        title: i18n('MockCol.MockCol.244853-8'),
        dataIndex: '_id',
        key: '_id',
        render: (_id, recode) => {
          // console.log(recode)
          return (
            !isGuest && (
              <div>
                <span style={{ marginRight: 5 }}>
                  <Button size="small" onClick={this.openModal(recode)}>
                    {i18n('MockCol.MockCol.244853-9')}
                  </Button>
                </span>
                <span style={{ marginRight: 5 }}>
                  <Popconfirm
                    title={i18n('MockCol.MockCol.244853-10')}
                    onConfirm={() => this.deleteCase(_id)}
                    okText={i18n('MockCol.MockCol.244853-11')}
                    cancelText={i18n('MockCol.MockCol.244853-12')}
                  >
                    <Button size="small" onClick={() => {}}>
                      {i18n('MockCol.MockCol.244853-13')}
                    </Button>
                  </Popconfirm>
                </span>
                <span>
                  <Button size="small" onClick={() => this.openMockCase(_id, recode.case_enable)}>
                    {recode.case_enable ? <span>{i18n('MockCol.MockCol.244853-14')}</span> : <span>{i18n('MockCol.MockCol.244853-15')}</span>}
                  </Button>
                </span>
              </div>
            )
          );
        }
      }
    ];

    return (
      <div>
        <div style={{ marginBottom: 8 }}>
          <Button type="primary" onClick={this.openModal(initCaseData, true)} disabled={isGuest}>
            {i18n('MockCol.MockCol.244853-16')}
          </Button>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={constants.docHref.adv_mock_case}
            style={{ marginLeft: 8 }}
          >
            <Tooltip title={i18n('MockCol.MockCol.244853-17')}>
              <Icon type="question-circle-o" />
            </Tooltip>
          </a>
        </div>
        <Table columns={columns} dataSource={data} pagination={false} rowKey="_id" />
        {caseDesModalVisible && (
          <CaseDesModal
            visible={caseDesModalVisible}
            isAdd={isAdd}
            caseData={caseData}
            onOk={this.handleOk}
            onCancel={() => this.setState({ caseDesModalVisible: false })}
            ref={this.saveFormRef}
          />
        )}
      </div>
    );
  }
}
