import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'antd';
import { Link } from 'react-router-dom';
import i18n from '../../../i18n';

const WikiView = props => {
  const { editorEable, onEditor, uid, username, editorTime, desc } = props;
  return (
    <div className="wiki-view-content">
      <div className="wiki-title">
        <Button icon="edit" onClick={onEditor} disabled={!editorEable}>
          {i18n('wikiPage.View.668530-0')}
        </Button>
        {username && (
          <div className="wiki-user">
            {i18n('wikiPage.View.668530-1')}{' '}
            <Link className="user-name" to={`/user/profile/${uid || 11}`}>
              {username}
            </Link>{' '}
            {i18n('wikiPage.View.668530-2')} {editorTime}
          </div>
        )}
      </div>
      <div
        className="tui-editor-contents"
        dangerouslySetInnerHTML={{ __html: desc }}
      />
    </div>
  );
};

WikiView.propTypes = {
  editorEable: PropTypes.bool,
  onEditor: PropTypes.func,
  uid: PropTypes.number,
  username: PropTypes.string,
  editorTime: PropTypes.string,
  desc: PropTypes.string
};

export default WikiView;
