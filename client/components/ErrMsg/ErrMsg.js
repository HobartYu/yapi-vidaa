import React, { PureComponent as Component } from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'antd';
import './ErrMsg.scss';
import { withRouter } from 'react-router';
import i18n from '../../../i18n'

/**
 * 错误信息提示
 *
 * @component ErrMsg
 * @examplelanguage js
 *
 * * 错误信息提示组件
 * * 错误信息提示组件
 *
 *
 */

/**
 * 标题
 * 一般用于描述错误信息名称
 * @property title
 * @type string
 * @description 一般用于描述错误信息名称
 * @returns {object}
 */
@withRouter
class ErrMsg extends Component {
  constructor(props) {
    super(props);
  }

  static propTypes = {
    type: PropTypes.string,
    history: PropTypes.object,
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    desc: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    opration: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
  };

  render() {
    let { type, title, desc, opration } = this.props;
    let icon = 'frown-o';
    if (type) {
      switch (type) {
        case 'noFollow':
          title = i18n('ErrMsg.ErrMsg.368006-0');
          desc = (
            <span>
              {i18n('ErrMsg.ErrMsg.368006-1')}
              <a onClick={() => this.props.history.push('/group')}>{i18n('ErrMsg.ErrMsg.368006-2')}</a>
               {i18n('ErrMsg.ErrMsg.368006-3')}
            </span>
          );
          break;
        case 'noInterface':
          title = i18n('ErrMsg.ErrMsg.368006-5');
          desc = i18n('ErrMsg.ErrMsg.368006-6');
          break;
        case 'noMemberInProject':
          title = i18n('ErrMsg.ErrMsg.368006-7');
          break;
        case 'noMemberInGroup':
          title = i18n('ErrMsg.ErrMsg.368006-8');
          break;
        case 'noProject':
          title = i18n('ErrMsg.ErrMsg.368006-9');
          desc = <span>{i18n('ErrMsg.ErrMsg.368006-10')}</span>;
          break;
        case 'noData':
          title = i18n('ErrMsg.ErrMsg.368006-11');
          desc = i18n('ErrMsg.ErrMsg.368006-12');
          break;
        case 'noChange':
          title = i18n('ErrMsg.ErrMsg.368006-13');
          desc = i18n('ErrMsg.ErrMsg.368006-14');
          icon = 'meh-o';
          break;
        default:
          console.log('default');
      }
    }
    return (
      <div className="err-msg">
        <Icon type={icon} className="icon" />
        <p className="title">{title}</p>
        <p className="desc">{desc}</p>
        <p className="opration">{opration}</p>
      </div>
    );
  }
}

export default ErrMsg;
