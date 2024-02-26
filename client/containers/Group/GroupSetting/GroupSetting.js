import React, { PureComponent as Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Input, Button, message, Icon, Card, Alert, Modal, Switch, Row, Col, Tooltip } from 'antd';
import { fetchNewsData } from '../../../reducer/modules/news.js';
import {
  changeGroupMsg,
  fetchGroupList,
  setCurrGroup,
  fetchGroupMsg,
  updateGroupList,
  deleteGroup
} from '../../../reducer/modules/group.js';
const { TextArea } = Input;
import { trim } from '../../../common.js';
import _ from 'underscore';
import './GroupSetting.scss';
import i18n from '../../../../i18n';
const confirm = Modal.confirm;

@connect(
  state => {
    return {
      groupList: state.group.groupList,
      currGroup: state.group.currGroup,
      curUserRole: state.user.role
    };
  },
  {
    changeGroupMsg,
    fetchGroupList,
    setCurrGroup,
    fetchGroupMsg,
    fetchNewsData,
    updateGroupList,
    deleteGroup
  }
)
class GroupSetting extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currGroupDesc: '',
      currGroupName: '',
      showDangerOptions: false,
      custom_field1_name: '',
      custom_field1_enable: false,
      custom_field1_rule: false
    };
  }

  static propTypes = {
    currGroup: PropTypes.object,
    curUserRole: PropTypes.string,
    changeGroupMsg: PropTypes.func,
    fetchGroupList: PropTypes.func,
    setCurrGroup: PropTypes.func,
    fetchGroupMsg: PropTypes.func,
    fetchNewsData: PropTypes.func,
    updateGroupList: PropTypes.func,
    deleteGroup: PropTypes.func,
    groupList: PropTypes.array
  };

  initState(props) {
    this.setState({
      currGroupName: props.currGroup.group_name,
      currGroupDesc: props.currGroup.group_desc,
      custom_field1_name: props.currGroup.custom_field1.name,
      custom_field1_enable: props.currGroup.custom_field1.enable
    });
  }

  // 修改分组名称
  changeName = e => {
    this.setState({
      currGroupName: e.target.value
    });
  };
  // 修改分组描述
  changeDesc = e => {
    this.setState({
      currGroupDesc: e.target.value
    });
  };

  // 修改自定义字段名称
  changeCustomName = e => {
    let custom_field1_rule = this.state.custom_field1_enable ? !e.target.value : false;
    this.setState({
      custom_field1_name: e.target.value,
      custom_field1_rule
    });
  };

  // 修改开启状态
  changeCustomEnable = e => {
    let custom_field1_rule = e ? !this.state.custom_field1_name : false;
    this.setState({
      custom_field1_enable: e,
      custom_field1_rule
    });
  };

  componentWillMount() {
    // console.log('custom_field1',this.props.currGroup.custom_field1)
    this.initState(this.props);
  }

  // 点击“查看危险操作”按钮
  toggleDangerOptions = () => {
    // console.log(this.state.showDangerOptions);
    this.setState({
      showDangerOptions: !this.state.showDangerOptions
    });
  };

  // 编辑分组信息
  editGroup = async () => {
    const id = this.props.currGroup._id;
    if (this.state.custom_field1_rule) {
      return;
    }
    const res = await this.props.changeGroupMsg({
      group_name: this.state.currGroupName,
      group_desc: this.state.currGroupDesc,
      custom_field1: {
        name: this.state.custom_field1_name,
        enable: this.state.custom_field1_enable
      },
      id: this.props.currGroup._id
    });

    if (!res.payload.data.errcode) {
      message.success(i18n('GroupSetting.GroupSetting.265156-0'));
      await this.props.fetchGroupList(this.props.groupList);
      this.props.updateGroupList(this.props.groupList);
      const currGroup = _.find(this.props.groupList, group => {
        return +group._id === +id;
      });
      this.props.setCurrGroup(currGroup);
      this.props.fetchGroupMsg(this.props.currGroup._id);
      this.props.fetchNewsData(this.props.currGroup._id, 'group', 1, 10);
    }
  };

  // 删除分组

  deleteGroup = async () => {
    const that = this;
    const { currGroup } = that.props;
    const res = await this.props.deleteGroup({ id: currGroup._id });
    if (!res.payload.data.errcode) {
      message.success(i18n('GroupSetting.GroupSetting.265156-1'));
      await that.props.fetchGroupList();
      const currGroup = that.props.groupList[0] || { group_name: '', group_desc: '' };
      that.setState({ groupList: that.props.groupList });
      that.props.setCurrGroup(currGroup);
    }
  };

  // 删除分组的二次确认
  showConfirm = () => {
    const that = this;
    confirm({
      title: '确认删除 ' + that.props.currGroup.group_name + ' 分组吗？',
      content: (
        <div style={{ marginTop: '10px', fontSize: '13px', lineHeight: '25px' }}>
          <Alert
            message={i18n('GroupSetting.GroupSetting.265156-4')}
            type="warning"
          />
          <div style={{ marginTop: '16px' }}>
            <p>
              <b>{i18n('GroupSetting.GroupSetting.265156-5')}</b>
            </p>
            <Input id="group_name" />
          </div>
        </div>
      ),
      onOk() {
        const groupName = trim(document.getElementById('group_name').value);
        if (that.props.currGroup.group_name !== groupName) {
          message.error(i18n('GroupSetting.GroupSetting.265156-6'));
          return new Promise((resolve, reject) => {
            reject('error');
          });
        } else {
          that.deleteGroup();
        }
      },
      iconType: 'delete',
      onCancel() {}
    });
  };

  componentWillReceiveProps(nextProps) {
    // 切换分组时，更新分组信息并关闭删除分组操作
    if (this.props.currGroup._id !== nextProps.currGroup._id) {
      this.initState(nextProps);
      this.setState({
        showDangerOptions: false
      });
    }
  }

  render() {
    return (
      <div className="m-panel card-panel card-panel-s panel-group">
        <Row type="flex" justify="space-around" className="row" align="middle">
          <Col span={4} className="label">
            {i18n('GroupSetting.GroupSetting.265156-7')}
          </Col>
          <Col span={20}>
            <Input
              size="large"
              placeholder={i18n('GroupSetting.GroupSetting.265156-8')}
              value={this.state.currGroupName}
              onChange={this.changeName}
            />
          </Col>
        </Row>
        <Row type="flex" justify="space-around" className="row" align="middle">
          <Col span={4} className="label">
          {i18n('GroupSetting.GroupSetting.265156-9')}
          </Col>
          <Col span={20}>
            <TextArea
              size="large"
              rows={3}
              placeholder={i18n('GroupSetting.GroupSetting.265156-10')}
              value={this.state.currGroupDesc}
              onChange={this.changeDesc}
            />
          </Col>
        </Row>
        <Row type="flex" justify="space-around" className="row" align="middle">
          <Col span={4} className="label">
            {i18n('GroupSetting.GroupSetting.265156-11')}&nbsp;
            <Tooltip title={i18n('GroupSetting.GroupSetting.265156-12')}>
              <Icon type="question-circle-o" style={{ width: '10px' }} />
            </Tooltip> ：
          </Col>
          <Col span={12} style={{ position: 'relative' }}>
            <Input
              placeholder={i18n('GroupSetting.GroupSetting.265156-13')}
              style={{ borderColor: this.state.custom_field1_rule ? '#f5222d' : '' }}
              value={this.state.custom_field1_name}
              onChange={this.changeCustomName}
            />
            <div
              className="custom-field-rule"
              style={{ display: this.state.custom_field1_rule ? 'block' : 'none' }}
            >
              {i18n('GroupSetting.GroupSetting.265156-14')}
            </div>
          </Col>
          <Col span={2} className="label">
            {i18n('GroupSetting.GroupSetting.265156-15')}
          </Col>
          <Col span={6}>
            <Switch
              checked={this.state.custom_field1_enable}
              checkedChildren={i18n('GroupSetting.GroupSetting.265156-16')}
              unCheckedChildren={i18n('GroupSetting.GroupSetting.265156-17')}
              onChange={this.changeCustomEnable}
            />
          </Col>
        </Row>
        <Row type="flex" justify="center" className="row save">
          <Col span={4} className="save-button">
            <Button className="m-btn btn-save" icon="save" type="primary" onClick={this.editGroup}>
              {i18n('GroupSetting.GroupSetting.265156-18')}
            </Button>
          </Col>
        </Row>
        {/* 只有超级管理员能删除分组 */}
        {this.props.curUserRole === 'admin' ? (
          <Row type="flex" justify="center" className="danger-container">
            <Col span={24} className="title">
              <h2 className="content">
                <Icon type="exclamation-circle-o" /> {i18n('GroupSetting.GroupSetting.265156-19')}
              </h2>
              <Button onClick={this.toggleDangerOptions}>
                {i18n('GroupSetting.GroupSetting.265156-20')}<Icon type={this.state.showDangerOptions ? 'up' : 'down'} />
              </Button>
            </Col>
            {this.state.showDangerOptions ? (
              <Card hoverable={true} className="card-danger" style={{ width: '100%' }}>
                <div className="card-danger-content">
                  <h3>{i18n('GroupSetting.GroupSetting.265156-21')}</h3>
                  <p>{i18n('GroupSetting.GroupSetting.265156-22')}</p>
                  <p>{i18n('GroupSetting.GroupSetting.265156-23')}</p>
                </div>
                <Button type="danger" ghost className="card-danger-btn" onClick={this.showConfirm}>
                  {i18n('GroupSetting.GroupSetting.265156-24')}
                </Button>
              </Card>
            ) : null}
          </Row>
        ) : null}
      </div>
    );
  }
}

export default GroupSetting;
