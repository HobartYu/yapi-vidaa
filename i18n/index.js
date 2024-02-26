/**
 * 国际化资源，每次切换语言之后需刷新页面
 * 国际化资源按照语言划分文件夹
 * 然后每个文件夹下的词条除了公共的部分放在common中，其他按照页面的名称定义文件名
 * 具体每个key的第一段字母为文件名称，后面自己定义
 * 避免产生重复
 * 开发只需要关注 ./zh-cn 下的中文即可，其他语言下对应的改动会在编译时由脚本自动完成
 */

import { en, zh } from './temp';

/**
 * 获取当前语言设置
 */
export const getLanguage = () => {
  return window.localStorage.locale || 'zh';
};

/**
 * 更改当前语言设置
 */
export const setLanguage = (language = 'zh') => {
  window.localStorage.setItem('locale', language);
};

const replaceStr = (str, replacer) => {
  if (replacer) {
    Object.entries(replacer).forEach(([k, v]) => {
      const reg = new RegExp(`{${k}}`, 'g');
      str = str.replace(reg, v);
    });
  }

  return str;
};

/**
 * 获取国际化文本接口
 * @param {String} key 对应文本的key值
 * @param {Object} replacer 变量替换工具，key为要替换的目标字符串，value为真正的值，可以写多组
 * @demo i18n('common.title', { str1: '值1', str2: '值2' })
 */

const i18n = (key, replacer) => {
  const language = getLanguage();
  let locale;
  if (language = 'en') {
    locale = en;
  } else {
    locale = zh;
  }
  const str = locale[key] || '';
  if (!str) {
    return '没找到值！！！！！！！！！！！！';
  }

  return replaceStr(str, replacer);
};

export default i18n;

export {
  replaceStr
};
