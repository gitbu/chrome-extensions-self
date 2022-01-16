
let containerEle;
// 注册回调，每一个http请求响应后，都触发该回调
chrome.devtools.network.onRequestFinished.addListener(async (...args) => {
    try {
        const [{
            // 请求的类型，查询参数，以及url
            request: { method, queryString, url },

            // 该方法可用于获取响应体
            getContent,
        }] = args;

        // log(method, queryString, url);

        // 将callback转为await promise
        // warn: content在getContent回调函数中，而不是getContent的返回值
        const data = await new Promise((res, rej) => getContent(res));
        if (url.includes('/gateway/?question')) {
          
          containerEle = document.querySelector('#container');
          const loadingEle = document.querySelector('.loadding');
          loadingEle.style.display = 'flex';
          setTimeout(() => { loadingEle.style.display = 'none' }, 500)
          containerEle.innerHTML = '';
          const content = JSON.parse(data)
          const { answer = [] }  = content;
          const { txt = [] } = answer[0] || {};
          const { content: ctt = ""} = txt[0];
          const request_params_obj = {};
          const _content = JSON.parse(ctt);

          if (_content.request_params) {
            decodeURIComponent(_content.request_params).split('&').forEach(item => {
              const [key, value] = item.split('=')
              request_params_obj[key] = value;
            })
          }
          _content.request_params_obj = request_params_obj;

          const {
            global,
            page
          } = _content;
          
          addPageId(page);
          addParamFrag(GLOBAL_TITLE, global);
          addParamFrag(PAGE_TITLE, page);
          addParamFrag(REQUEST_PARAMS_TITLE, request_params_obj);

          const res = JSON.stringify(_content)
          log(res);
        }
    } catch (err) {
        log(err.stack || err.toString());
    }
});


// log
const log = (content) => chrome.devtools.inspectedWindow.eval(`
    console.log(${content});
`);

// define title
const GLOBAL_TITLE = '全局信息(global)';
const PAGE_TITLE = '页面信息(page)';
const REQUEST_PARAMS_TITLE = 'request_params参数列表';


// add a block element
function addParamFrag(
  title = '',
  data = {},
) {
  // fragment
  const fragment = document.createDocumentFragment();
   
  // box
  const boxEle = document.createElement('div');
  boxEle.classList.add('box');
  fragment.appendChild(boxEle);

  // box header
  const boxHeaderEle = document.createElement('div');
  boxHeaderEle.classList.add('box_header');
  boxHeaderEle.innerHTML = title; 
  boxEle.appendChild(boxHeaderEle);

  // box body
  const boxBodyEle = document.createElement('div');
  boxBodyEle.classList.add('box_body');
  boxEle.appendChild(boxBodyEle);

  const keys = Object.keys(data);
  keys.forEach(key => {
    const rowEle = document.createElement('div');
    // key
    const keyEle = document.createElement('span');
    keyEle.innerHTML = `${key}: `;
    keyEle.classList.add('item_key')

    // value
    const valEle = document.createElement('span')
    valEle.classList.add('item_value')
    let value = data[key];
    value = typeof(value) === 'object' ? JSON.stringify(value) : value;
    valEle.innerHTML = value;

    // add key and value
    rowEle.appendChild(keyEle);
    rowEle.appendChild(valEle);
    rowEle.classList.add('item')

    boxBodyEle.appendChild(rowEle)
  })
  
  containerEle.appendChild(fragment);
}

// add page id 
function addPageId(page) {
  if (page && page.uuids && Array.isArray(page.uuids) && page.uuids.length > 0) {
    const pageId = page.uuids[0];
    // fragment
    const fragment = document.createDocumentFragment();

    // container
    const pageIdEle = document.createElement('div');
    pageIdEle.classList.add('pageId')
    fragment.appendChild(pageIdEle)

    // title
    const titleEle = document.createElement('span');
    titleEle.innerHTML = '结果页ID: ';
    titleEle.classList.add('title')
    pageIdEle.appendChild(titleEle);

    // pageId
    const aElement = document.createElement('a');
    aElement.innerHTML = pageId;
    aElement.href = `http://172.20.207.139:8081/manage/urp/v7/index.html#/configPage?pageType=resultPage&pageId=${pageId}&version=0`;
    aElement.target = '_blank';
    pageIdEle.appendChild(aElement);

    const infoEle = document.createElement('span');
    infoEle.innerHTML = '详细数据请点击console';
    infoEle.classList.add('info');
    pageIdEle.appendChild(infoEle);

    // append
    containerEle.appendChild(fragment);
  }
}