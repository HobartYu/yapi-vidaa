import React, { Component } from 'react';
import { Table } from 'antd';
import json5 from 'json5';
import PropTypes from 'prop-types';
import { schemaTransformToTable } from '../../../common/schema-transformTo-table.js';
import _ from 'underscore';
import './index.scss';
import i18n from '../../../i18n';

const messageMap = {
  desc: i18n('SchemaTable.SchemaTable.110629-0'),
  default: i18n('SchemaTable.SchemaTable.110629-1'),
  maximum: i18n('SchemaTable.SchemaTable.110629-2'),
  minimum: i18n('SchemaTable.SchemaTable.110629-3'),
  maxItems: i18n('SchemaTable.SchemaTable.110629-4'),
  minItems: i18n('SchemaTable.SchemaTable.110629-5'),
  maxLength: i18n('SchemaTable.SchemaTable.110629-6'),
  minLength: i18n('SchemaTable.SchemaTable.110629-7'),
  enum: i18n('SchemaTable.SchemaTable.110629-8'),
  enumDesc: i18n('SchemaTable.SchemaTable.110629-9'),
  uniqueItems: i18n('SchemaTable.SchemaTable.110629-10'),
  itemType: i18n('SchemaTable.SchemaTable.110629-11'),
  format: 'format',
  itemFormat: 'format',
  mock: 'mock'
};

const columns = [
  {
    title: i18n('SchemaTable.SchemaTable.110629-12'),
    dataIndex: 'name',
    key: 'name',
    width: 200
  },
  {
    title: i18n('SchemaTable.SchemaTable.110629-13'),
    dataIndex: 'type',
    key: 'type',
    width: 100,
    render: (text, item) => {
      // console.log('text',item.sub);
      return text === 'array' ? (
        <span>{item.sub ? item.sub.itemType || '' : 'array'} []</span>
      ) : (
        <span>{text}</span>
      );
    }
  },
  {
    title: i18n('SchemaTable.SchemaTable.110629-14'),
    dataIndex: 'required',
    key: 'required',
    width: 80,
    render: text => {
      return <div>{text ? i18n('SchemaTable.SchemaTable.110629-15') : i18n('SchemaTable.SchemaTable.110629-16')}</div>;
    }
  },
  {
    title: i18n('SchemaTable.SchemaTable.110629-17'),
    dataIndex: 'default',
    key: 'default',
    width: 80,
    render: text => {
      return <div>{_.isBoolean(text) ? text + '' : text}</div>;
    }
  },
  {
    title: i18n('SchemaTable.SchemaTable.110629-0'),
    dataIndex: 'desc',
    key: 'desc',
    render: (text, item) => {
      return _.isUndefined(item.childrenDesc) ? (
        <span className="table-desc">{text}</span>
      ) : (
        <span className="table-desc">{item.childrenDesc}</span>
      );
    }
  },
  {
    title: i18n('SchemaTable.SchemaTable.110629-18'),
    dataIndex: 'sub',
    key: 'sub',
    width: 180,
    render: (text, record) => {
      let result = text || record;

      return Object.keys(result).map((item, index) => {
        let name = messageMap[item];
        let value = result[item];
        let isShow = !_.isUndefined(result[item]) && !_.isUndefined(name);

        return (
          isShow && (
            <p key={index}>
              <span style={{ fontWeight: '700' }}>{name}: </span>
              <span>{value.toString()}</span>
            </p>
          )
        );
      });
    }
  }
];

class SchemaTable extends Component {
  static propTypes = {
    dataSource: PropTypes.string
  };

  constructor(props) {
    super(props);
  }

  render() {
    let product;
    try {
      product = json5.parse(this.props.dataSource);
    } catch (e) {
      product = null;
    }
    if (!product) {
      return null;
    }
    let data = schemaTransformToTable(product);
    data = _.isArray(data) ? data : [];
    return <Table bordered size="small" pagination={false} dataSource={data} columns={columns} />;
  }
}
export default SchemaTable;
