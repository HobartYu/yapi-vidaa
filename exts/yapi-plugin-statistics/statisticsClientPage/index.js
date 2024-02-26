/**
 * Created by gxl.gao on 2017/10/25.
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import PropTypes from 'prop-types';
import './index.scss';
// import { withRouter } from 'react-router-dom';
import { Row, Col, Tooltip, Icon } from 'antd';
import { setBreadcrumb } from 'client/reducer/modules/user';
import StatisChart from './StatisChart';
import StatisTable from './StatisTable';
import i18n from '../../../i18n';

const CountOverview = props => (
  <Row type="flex" justify="space-start" className="m-row">
    <Col className="gutter-row" span={6}>
      <span>
        {i18n('statisticsClientPage.index.905699-0')}
        <Tooltip placement="rightTop" title={i18n('statisticsClientPage.index.905699-1')}>
          <Icon className="m-help" type="question-circle" />
        </Tooltip>
      </span>
      <h2 className="gutter-box">{props.date.groupCount}</h2>
    </Col>
    <Col className="gutter-row" span={6}>
      <span>
        {i18n('statisticsClientPage.index.905699-2')}
        <Tooltip placement="rightTop" title={i18n('statisticsClientPage.index.905699-3')}>
          <Icon className="m-help" type="question-circle" />
        </Tooltip>
      </span>
      <h2 className="gutter-box">{props.date.projectCount}</h2>
    </Col>
    <Col className="gutter-row" span={6}>
      <span>
        {i18n('statisticsClientPage.index.905699-4')}
        <Tooltip placement="rightTop" title={i18n('statisticsClientPage.index.905699-5')}>
          {/*<a href="javascript:void(0)" className="m-a-help">?</a>*/}
          <Icon className="m-help" type="question-circle" />
        </Tooltip>
      </span>
      <h2 className="gutter-box">{props.date.interfaceCount}</h2>
    </Col>
    <Col className="gutter-row" span={6}>
      <span>
        {i18n('statisticsClientPage.index.905699-6')}
        <Tooltip placement="rightTop" title={i18n('statisticsClientPage.index.905699-7')}>
          {/*<a href="javascript:void(0)" className="m-a-help">?</a>*/}
          <Icon className="m-help" type="question-circle" />
        </Tooltip>
      </span>
      <h2 className="gutter-box">{props.date.interfaceCaseCount}</h2>
    </Col>
  </Row>
);

CountOverview.propTypes = {
  date: PropTypes.object
};

const StatusOverview = props => (
  <Row type="flex" justify="space-start" className="m-row">
    <Col className="gutter-row" span={6}>
      <span>
        {i18n('statisticsClientPage.index.905699-8')}
        <Tooltip
          placement="rightTop"
          title={i18n('statisticsClientPage.index.905699-9')}
        >
          <Icon className="m-help" type="question-circle" />
        </Tooltip>
      </span>
      <h2 className="gutter-box">{props.data.systemName}</h2>
    </Col>
    <Col className="gutter-row" span={6}>
      <span>
        {i18n('statisticsClientPage.index.905699-10')}
        <Tooltip placement="rightTop" title={i18n('statisticsClientPage.index.905699-11')}>
          <Icon className="m-help" type="question-circle" />
        </Tooltip>
      </span>
      <h2 className="gutter-box">{props.data.load} %</h2>
    </Col>
    <Col className="gutter-row" span={6}>
      <span>
        {i18n('statisticsClientPage.index.905699-12')}
        <Tooltip placement="rightTop" title={i18n('statisticsClientPage.index.905699-12')}>
          <Icon className="m-help" type="question-circle" />
        </Tooltip>
      </span>
      <h2 className="gutter-box">
        {props.data.freemem} G / {props.data.totalmem} G{' '}
      </h2>
    </Col>
    <Col className="gutter-row" span={6}>
      <span>
        {i18n('statisticsClientPage.index.905699-13')}
        <Tooltip placement="rightTop" title={i18n('statisticsClientPage.index.905699-14')}>
          <Icon className="m-help" type="question-circle" />
        </Tooltip>
      </span>
      <h2 className="gutter-box">{props.data.mail}</h2>
    </Col>
  </Row>
);

StatusOverview.propTypes = {
  data: PropTypes.object
};

@connect(
  null,
  {
    setBreadcrumb
  }
)
class statisticsPage extends Component {
  static propTypes = {
    setBreadcrumb: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.state = {
      count: {
        groupCount: 0,
        projectCount: 0,
        interfaceCount: 0,
        interfactCaseCount: 0
      },
      status: {
        mail: '',
        systemName: '',
        totalmem: '',
        freemem: '',
        uptime: ''
      },
      dataTotal: []
    };
  }

  async componentWillMount() {
    this.props.setBreadcrumb([{ name: i18n('statisticsClientPage.index.905699-15') }]);
    this.getStatisData();
    this.getSystemStatusData();
    this.getGroupData();
  }

  // 获取统计数据
  async getStatisData() {
    let result = await axios.get('/api/plugin/statismock/count');
    if (result.data.errcode === 0) {
      let statisData = result.data.data;
      this.setState({
        count: { ...statisData }
      });
    }
  }

  // 获取系统信息

  async getSystemStatusData() {
    let result = await axios.get('/api/plugin/statismock/get_system_status');
    if (result.data.errcode === 0) {
      let statusData = result.data.data;
      this.setState({
        status: { ...statusData }
      });
    }
  }

  // 获取分组详细信息

  async getGroupData() {
    let result = await axios.get('/api/plugin/statismock/group_data_statis');
    if (result.data.errcode === 0) {
      let statusData = result.data.data;
      statusData.map(item => {
        return (item['key'] = item.name);
      });
      this.setState({
        dataTotal: statusData
      });
    }
  }

  render() {
    const { count, status, dataTotal } = this.state;

    return (
      <div className="g-statistic">
        <div className="content">
          <h2 className="title">{i18n('statisticsClientPage.index.905699-16')}</h2>
          <div className="system-content">
            <StatusOverview data={status} />
          </div>
          <h2 className="title">{i18n('statisticsClientPage.index.905699-17')}</h2>
          <div>
            <CountOverview date={count} />
            <StatisTable dataSource={dataTotal} />
            <StatisChart />
          </div>
        </div>
      </div>
    );
  }
}

export default statisticsPage;
