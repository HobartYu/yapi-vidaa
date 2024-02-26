import React from 'react';
import { Table } from 'antd';
import PropTypes from 'prop-types';
import i18n from '../../../i18n';

const columns = [
  {
    title: 'Group',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: i18n('statisticsClientPage.StatisTable.962079-0'),
    dataIndex: 'project',
    key: 'project'
  },
  {
    title: i18n('statisticsClientPage.StatisTable.962079-1'),
    dataIndex: 'interface',
    key: 'interface'
  },
  {
    title: i18n('statisticsClientPage.StatisTable.962079-2'),
    dataIndex: 'mock',
    key: 'mock'
  }
];

const StatisTable = props => {
  const { dataSource } = props;
  return (
    <div className="m-row-table">
      <h3 className="statis-title">{i18n('statisticsClientPage.StatisTable.962079-3')}</h3>
      <Table
        className="statis-table"
        pagination={false}
        dataSource={dataSource}
        columns={columns}
      />
    </div>
  );
};

StatisTable.propTypes = {
  dataSource: PropTypes.array
};

export default StatisTable;
