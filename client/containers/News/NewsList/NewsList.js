import React, { PureComponent as Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Menu } from 'antd';
import { fetchNewsData } from '../../../reducer/modules/news.js';
import i18n from '../../../../i18n';

const logList = [
  {
    name: i18n('NewsList.NewsList.968609-0')
  },
  {
    name: i18n('NewsList.NewsList.968609-1')
  },
  {
    name: i18n('NewsList.NewsList.968609-2')
  },
  {
    name: i18n('NewsList.NewsList.968609-3')
  }
];
@connect(
  state => {
    // console.log(state);
    return {
      uid: state.user.uid + '',
      newsData: state.news.newsData
    };
  },
  {
    fetchNewsData
  }
)
class NewsList extends Component {
  static propTypes = {
    fetchNewsData: PropTypes.func,
    setLoading: PropTypes.func,
    uid: PropTypes.string
  };

  constructor(props) {
    super(props);
    this.state = {
      selectedKeys: 0
    };
  }
  getLogData(e) {
    // page,size,logId
    // console.log(e.key);
    this.setState({
      selectedKeys: +e.key
    });
    const that = this;
    this.props.setLoading(true);
    this.props.fetchNewsData(+this.props.uid, 0, 5).then(function() {
      that.props.setLoading(false);
    });
  }
  render() {
    return (
      <div className="logList">
        <h3>{i18n('NewsList.NewsList.968609-4')}</h3>
        <Menu
          mode="inline"
          selectedKeys={[`${this.state.selectedKeys}`]}
          onClick={this.getLogData.bind(this)}
        >
          {logList.map((item, i) => {
            return (
              <Menu.Item key={i} className="log-item">
                {item.name}
              </Menu.Item>
            );
          })}
        </Menu>
      </div>
    );
  }
}

export default NewsList;
