import i18n from '../i18n';
const schema = require('./schema-transformTo-table.js');
const _ = require('underscore');

const json_parse = function(json) {
  try {
    return JSON.parse(json);
  } catch (err) {
    return {};
  }
};
// 处理字符串换行
const handleWrap = str => {
  return _.isString(str) ? str.replace(/\n/gi, '<br/>') : str;
};
const messageMap = {
  desc: i18n('common.markdown.756977-0'),
  default: i18n('common.markdown.756977-1'),
  maximum: i18n('common.markdown.756977-2'),
  minimum: i18n('common.markdown.756977-3'),
  maxItems: i18n('common.markdown.756977-4'),
  minItems: i18n('common.markdown.756977-5'),
  maxLength: i18n('common.markdown.756977-6'),
  minLength: i18n('common.markdown.756977-7'),
  uniqueItems: i18n('common.markdown.756977-8'),
  itemType: i18n('common.markdown.756977-9'),
  format: 'format',
  enum: i18n('common.markdown.756977-10'),
  enumDesc: i18n('common.markdown.756977-11'),
  mock: 'mock'
};

const columns = [
  {
    title: i18n('common.markdown.756977-12'),
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: i18n('common.markdown.756977-13'),
    dataIndex: 'type',
    key: 'type'
  },
  {
    title: i18n('common.markdown.756977-14'),
    dataIndex: 'required',
    key: 'required'
  },
  {
    title: i18n('common.markdown.756977-15'),
    dataIndex: 'default',
    key: 'default'
  },
  {
    title: i18n('common.markdown.756977-0'),
    dataIndex: 'desc',
    key: 'desc'
  },
  {
    title: i18n('common.markdown.756977-16'),
    dataIndex: 'sub',
    key: 'sub'
  }
];

function escapeStr(str, isToc) {
  return isToc ? escape(str) : str;
}

function createBaseMessage(basepath, inter) {
  // 基本信息
  let baseMessage = `### ${i18n('common.markdown.756977-17')}\n\n**Path：** ${basepath + inter.path}\n\n**Method：** ${
    inter.method
  }\n\n**${i18n('common.markdown.756977-30')}：**\n${_.isUndefined(inter.desc) ? '' : inter.desc}\n`;
  return baseMessage;
}

function createReqHeaders(req_headers) {
  // Request-headers
  if (req_headers && req_headers.length) {
    let headersTable = `**Headers**\n\n`;
    headersTable += `| ${i18n('common.markdown.756977-18')}  | ${i18n('common.markdown.756977-31')}  |  ${i18n('common.markdown.756977-32')} | ${i18n('common.markdown.756977-33')}  | ${i18n('common.markdown.756977-34')}  |\n| ------------ | ------------ | ------------ | ------------ | ------------ |\n`;
    for (let j = 0; j < req_headers.length; j++) {
      headersTable += `| ${req_headers[j].name || ''}  |  ${req_headers[j].value || ''} | ${
        req_headers[j].required == 1 ? i18n('common.markdown.756977-19') : i18n('common.markdown.756977-20')
      }  |  ${handleWrap(req_headers[j].example) || ''} |  ${handleWrap(req_headers[j].desc) ||
        ''} |\n`;
    }
    return headersTable;
  }
  return '';
}

function createPathParams(req_params) {
  if (req_params && req_params.length) {
    let paramsTable = `**${i18n('common.markdown.756977-21')}**\n\n`;
    paramsTable += `| ${i18n('common.markdown.756977-18')} | ${i18n('common.markdown.756977-33')}  | ${i18n('common.markdown.756977-34')}  |\n| ------------ | ------------ | ------------ |\n`;
    for (let j = 0; j < req_params.length; j++) {
      paramsTable += `| ${req_params[j].name || ''} |  ${handleWrap(req_params[j].example) ||
        ''} |  ${handleWrap(req_params[j].desc) || ''} |\n`;
    }
    return paramsTable;
  }
  return '';
}

function createReqQuery(req_query) {
  if (req_query && req_query.length) {
    let headersTable = `**Query**\n\n`;
    headersTable += `| ${i18n('common.markdown.756977-18')}  |  ${i18n('common.markdown.756977-32')} | ${i18n('common.markdown.756977-33')}  | ${i18n('common.markdown.756977-34')}  |\n| ------------ | ------------ | ------------ | ------------ |\n`;
    for (let j = 0; j < req_query.length; j++) {
      headersTable += `| ${req_query[j].name || ''} | ${
        req_query[j].required == 1 ? i18n('common.markdown.756977-19') : i18n('common.markdown.756977-20')
      }  |  ${handleWrap(req_query[j].example) || ''} |  ${handleWrap(req_query[j].desc) ||
        ''} |\n`;
    }
    return headersTable;
  }
  return '';
}

function createReqBody(req_body_type, req_body_form, req_body_other, req_body_is_json_schema) {
  if (req_body_type === 'form' && req_body_form.length) {
    let bodyTable = `**Body**\n\n`;
    bodyTable += `| ${i18n('common.markdown.756977-18')}  | ${i18n('common.markdown.756977-35')}  |  ${i18n('common.markdown.756977-32')} | ${i18n('common.markdown.756977-33')}  | ${i18n('common.markdown.756977-34')}  |\n| ------------ | ------------ | ------------ | ------------ | ------------ |\n`;
    let req_body = req_body_form;
    for (let j = 0; j < req_body.length; j++) {
      bodyTable += `| ${req_body[j].name || ''} | ${req_body[j].type || ''}  |  ${
        req_body[j].required == 1 ? i18n('common.markdown.756977-19') : i18n('common.markdown.756977-20')
      } |  ${req_body[j].example || ''}  |  ${req_body[j].desc || ''} |\n`;
    }
    return `${bodyTable}\n\n`;
  } else if (req_body_other) {
    if (req_body_is_json_schema) {
      let reqBody = createSchemaTable(req_body_other);
      return `**Body**\n\n` + reqBody;
    } else {
      //other
      return `**Body**\n\n` + '```javascript' + `\n${req_body_other || ''}` + '\n```';
    }
  }
  return '';
}

function tableHeader(columns) {
  let header = ``;
  columns.map(item => {
    header += `<th key=${item.key}>${item.title}</th>`;
  });

  return header;
}

function handleObject(text) {
  if (!_.isObject(text)) {
    return text;
  }
  let tpl = ``;
  Object.keys(text || {}).map((item, index) => {
    let name = messageMap[item];
    let value = text[item];
    tpl += _.isUndefined(text[item])
      ? ''
      : `<p key=${index}><span style="font-weight: '700'">${name}: </span><span>${value.toString()}</span></p>`;
  });

  return tpl;
}

function tableCol(col, columns, level) {
  let tpl = ``;
  columns.map((item, index) => {
    let dataIndex = item.dataIndex;
    let value = col[dataIndex];
    value = _.isUndefined(value) ? '' : value;
    let text = ``;

    switch (dataIndex) {
      case 'sub':
        text = handleObject(value);
        break;
      case 'type':
        text =
          value === 'array'
            ? `<span>${col.sub ? col.sub.itemType || '' : 'array'} []</span>`
            : `<span>${value}</span>`;
        break;
      case 'required':
        text = value ? i18n('common.markdown.756977-25') : i18n('common.markdown.756977-26');
        break;
      case 'desc':
        text = _.isUndefined(col.childrenDesc)
          ? `<span style="white-space: pre-wrap">${value}</span>`
          : `<span style="white-space: pre-wrap">${col.childrenDesc}</span>`;
        break;
      case 'name':
        text = `<span style="padding-left: ${20 * level}px"><span style="color: #8c8a8a">${
          level > 0 ? '├─' : ''
        }</span> ${value}</span>`;
        break;
      default:
        text = value;
    }
    tpl += `<td key=${index}>${text}</td>`;
  });

  return tpl;
}

function tableBody(dataSource, columns, level) {
  //  按照columns的顺序排列数据
  let tpl = ``;
  dataSource.map(col => {
    let child = null;
    tpl += `<tr key=${col.key}>${tableCol(col, columns, level)}</tr>`;
    if (!_.isUndefined(col.children) && _.isArray(col.children)) {
      let index = level + 1;
      child = tableBody(col.children, columns, index);
    }
    tpl += child ? `${child}` : ``;
  });

  return tpl;
}

function createSchemaTable(body) {
  let template = ``;
  let dataSource = schema.schemaTransformToTable(json_parse(body));
  template += `<table>
  <thead class="ant-table-thead">
    <tr>
      ${tableHeader(columns)}
    </tr>
  </thead>`;

  template += `<tbody className="ant-table-tbody">${tableBody(dataSource, columns, 0)}
               </tbody>
              </table>
            `;

  return template;
}

function createResponse(res_body, res_body_is_json_schema, res_body_type) {
  let resTitle = `\n### ${i18n('common.markdown.756977-27')}\n\n`;
  if (res_body) {
    if (res_body_is_json_schema && res_body_type === 'json') {
      let resBody = createSchemaTable(res_body);
      return resTitle + resBody;
    } else {
      let resBody = '```javascript' + `\n${res_body || ''}\n` + '```';
      return resTitle + resBody;
    }
  }
  return '';
}

function createInterMarkdown(basepath, listItem, isToc) {
  let mdTemplate = ``;
  const toc = `[TOC]\n\n`;
  // 接口名称
  mdTemplate += `\n## ${escapeStr(`${listItem.title}\n<a id=${listItem.title + listItem.catid}> </a>`, isToc)}\n`;
  isToc && (mdTemplate += toc);
  // 基本信息
  mdTemplate += createBaseMessage(basepath, listItem);
  // Request
  mdTemplate += `\n### ${i18n('common.markdown.756977-28')}\n`;
  // Request-headers
  mdTemplate += createReqHeaders(listItem.req_headers);
  // Request-params
  mdTemplate += createPathParams(listItem.req_params);
  // Request-query
  mdTemplate += createReqQuery(listItem.req_query);
  // Request-body
  mdTemplate += createReqBody(
    listItem.req_body_type,
    listItem.req_body_form,
    listItem.req_body_other,
    listItem.req_body_is_json_schema
  );
  // Response
  // Response-body
  mdTemplate += createResponse(
    listItem.res_body,
    listItem.res_body_is_json_schema,
    listItem.res_body_type
  );

  return mdTemplate;
}

function createProjectMarkdown(curProject, wikiData) {
  let mdTemplate = ``;
  // 项目名、项目描述
  let title = `<h1 class="curproject-name"> ${curProject.name} </h1>`;

  mdTemplate += `\n ${title} \n ${curProject.desc || ''}\n\n`;

  // 增加公共wiki信息展示
  mdTemplate += wikiData ? `\n### ${i18n('common.markdown.756977-29')}\n${wikiData.desc || ''}\n` : '';
  return mdTemplate;
}

function createClassMarkdown(curProject, list, isToc) {
  let mdTemplate = ``;
  const toc = `[TOC]\n\n`;
  list.map(item => {
    // 分类名称
    mdTemplate += `\n# ${escapeStr(item.name, isToc)}\n`;
    isToc && (mdTemplate += toc);
    for (let i = 0; i < item.list.length; i++) {
      //循环拼接 接口
      // 接口内容
      mdTemplate += createInterMarkdown(curProject.basepath, item.list[i], isToc);
    }
  });
  return mdTemplate;
}

let r = {
  createInterMarkdown,
  createProjectMarkdown,
  createClassMarkdown
};

module.exports = r;
