chrome.contextMenus.create({
  title: "click me",
  onclick: function() { alert('我被点到了哦')}
})
chrome.browserAction.setBadgeText({ text: 'new' });
function setRequestHeader(e) {
  // console.log(e);
  // e.requestHeaders.push({name: 'access-control-request-headers', value: 'aaa'});
  // e.requestHeaders.push({name: 'a', value: 'b'});

  return { requestHeaders: e.requestHeaders };
}
chrome.webRequest.onBeforeSendHeaders.addListener(
  setRequestHeader,
  { urls: ["<all_urls>"] },
  ["blocking", 'requestHeaders']
)

function setResponseHeader(e) {
  // if (e.url.includes('ai.iwencai.com/gateway/')) {
  //   e.responseHeaders.push({"name": "Access-Control-Allow-Methods", "value": "GET, PUT, POST, DELETE, HEAD, OPTIONS"});
  //   e.responseHeaders.push({name:'Access-Control-Allow-Origin',value:"*"});
  //   console.log(e.responseHeaders);
  //   return {
  //     responseHeaders: e.responseHeaders,
  //     redirectUrl: e.url.replace('ai.iwencai.com', 'eq.10jqka.com.cn')
  //   };  

  // }
    // e.responseHeaders.push({"name": "Access-Control-Allow-Methods", "value": "GET, PUT, POST, DELETE, HEAD, OPTIONS"});
    // e.responseHeaders.push({name:'Access-Control-Allow-Origin',value:"*"});
    // return {
    //   responseHeaders: e.responseHeaders,
    // };  
}

chrome.webRequest.onHeadersReceived.addListener(
  setResponseHeader,
  { urls: ["<all_urls>"] },
  ["blocking", "responseHeaders", "extraHeaders"]
);

function logResponse(e) {
  console.log('onCompleted', e);
}

chrome.webRequest.onCompleted.addListener(
  logResponse,
  { urls: ["<all_urls>"] }
);