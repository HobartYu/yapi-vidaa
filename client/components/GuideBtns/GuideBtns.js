import React, { PureComponent as Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'antd';
import { connect } from 'react-redux';
import { changeStudyTip, finishStudy } from '../../reducer/modules/user.js';
import i18n from '../../../i18n';

@connect(
  null,
  {
    changeStudyTip,
    finishStudy
  }
)
class GuideBtns extends Component {
  constructor(props) {
    super(props);
  }

  static propTypes = {
    changeStudyTip: PropTypes.func,
    finishStudy: PropTypes.func,
    isLast: PropTypes.bool
  };

  // 点击下一步
  nextStep = () => {
    this.props.changeStudyTip();
    if (this.props.isLast) {
      this.props.finishStudy();
    }
  };

  // 点击退出指引
  exitGuide = () => {
    this.props.finishStudy();
  };

  render() {
    return (
      <div className="btn-container">
        <Button className="btn" type="primary" onClick={this.nextStep}>
          {this.props.isLast ? i18n('GuideBtns.GuideBtns.671838-0') : i18n('GuideBtns.GuideBtns.671838-1')}
        </Button>
        <Button className="btn" type="dashed" onClick={this.exitGuide}>
          {i18n('GuideBtns.GuideBtns.671838-2')}
        </Button>
      </div>
    );
  }
}
export default GuideBtns;
