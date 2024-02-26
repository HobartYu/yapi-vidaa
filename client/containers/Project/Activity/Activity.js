import './Activity.scss';
import React, { PureComponent as Component } from 'react';
import TimeTree from '../../../components/TimeLine/TimeLine';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Button } from 'antd';
import i18n from '../../../../i18n';

@connect(state => {
  return {
    uid: state.user.uid + '',
    curdata: state.inter.curdata,
    currProject: state.project.currProject
  };
})
class Activity extends Component {
  constructor(props) {
    super(props);
  }
  static propTypes = {
    uid: PropTypes.string,
    getMockUrl: PropTypes.func,
    match: PropTypes.object,
    curdata: PropTypes.object,
    currProject: PropTypes.object
  };
  render() {
    let { currProject } = this.props;
    return (
      <div className="g-row">
        <section className="news-box m-panel">
          <div style={{ display: 'none' }} className="logHead">
            {/*<Breadcrumb />*/}
            <div className="projectDes">
              <p>{i18n('Activity.Activity.817165-0')}</p>
            </div>
            <div className="Mockurl">
              <span>{i18n('Activity.Activity.817165-1')}</span>
              <p>
                {location.protocol +
                  '//' +
                  location.hostname +
                  (location.port !== '' ? ':' + location.port : '') +
                  `/mock/${currProject._id}${currProject.basepath}/yourPath`}
              </p>
              <Button type="primary">
                <a href={`/api/project/download?project_id=${this.props.match.params.id}`}>
                  {i18n('Activity.Activity.817165-2')}
                </a>
              </Button>
            </div>
          </div>
          <TimeTree type={'project'} typeid={+this.props.match.params.id} />
        </section>
      </div>
    );
  }
}

export default Activity;
