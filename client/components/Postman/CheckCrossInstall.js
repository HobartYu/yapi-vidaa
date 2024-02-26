import React from 'react';
import { Alert } from 'antd';
import PropTypes from 'prop-types';
import i18n from '../../../i18n';

exports.initCrossRequest = function (fn) {
  let startTime = 0;
  let _crossRequest = setInterval(() => {
    startTime += 500;
    if (startTime > 5000) {
      clearInterval(_crossRequest);
    }
    if (window.crossRequest) {
      clearInterval(_crossRequest);
      fn(true);
    } else {
      fn(false);
    }
  }, 500);
  return _crossRequest;
};

CheckCrossInstall.propTypes = {
  hasPlugin: PropTypes.bool
};

function CheckCrossInstall(props) {
  const hasPlugin = props.hasPlugin;
  return (
    <div className={hasPlugin ? null : 'has-plugin'}>
      {hasPlugin ? (
        ''
      ) : (
        <Alert
          message={
            <div>
              {i18n('Postman.CheckCrossInstall.874179-0')}
              {/* <div>
                <a
                  target="blank"
                  href="https://chrome.google.com/webstore/detail/cross-request/cmnlfmgbjmaciiopcgodlhpiklaghbok?hl=en-US"
                >
                  [Google 商店获取（需翻墙]
                </a>
              </div> */}
              <div>
                <a target="blank" href="https://juejin.im/post/5e3bbd986fb9a07ce152b53d">
                  {' '}
                  {i18n('Postman.CheckCrossInstall.874179-1')}
                  {' '}
                </a>
              </div>
            </div>
          }
          type="warning"
        />
      )}
    </div>
  );
}

export default CheckCrossInstall;
