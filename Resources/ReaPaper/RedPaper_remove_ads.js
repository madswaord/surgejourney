// 转换时间: 2023/7/30 00:57:11
// 兼容性转换
if (typeof $request !== 'undefined') {
  const lowerCaseRequestHeaders = Object.fromEntries(
    Object.entries($request.headers).map(([k, v]) =&gt; [k.toLowerCase(), v])
  );

  $request.headers = new Proxy(lowerCaseRequestHeaders, {
    get: function (target, propKey, receiver) {
      return Reflect.get(target, propKey.toLowerCase(), receiver);
    },
    set: function (target, propKey, value, receiver) {
      return Reflect.set(target, propKey.toLowerCase(), value, receiver);
    },
  });
}
if (typeof $response !== 'undefined') {
  const lowerCaseResponseHeaders = Object.fromEntries(
    Object.entries($response.headers).map(([k, v]) =&gt; [k.toLowerCase(), v])
  );

  $response.headers = new Proxy(lowerCaseResponseHeaders, {
    get: function (target, propKey, receiver) {
      return Reflect.get(target, propKey.toLowerCase(), receiver);
    },
    set: function (target, propKey, value, receiver) {
      return Reflect.set(target, propKey.toLowerCase(), value, receiver);
    },
  });
}


// QX 相关
var setInterval = () =&gt; {}
var clearInterval = () =&gt; {}
var $task = {
  fetch: url =&gt; {
    return new Promise((resolve, reject) =&gt; {
      if (url.method == 'POST') {
        $httpClient.post(url, (error, response, data) =&gt; {
          if (response) {
            response.body = data
            resolve(response, {
              error: error,
            })
          } else {
            resolve(null, {
              error: error,
            })
          }
        })
      } else {
        $httpClient.get(url, (error, response, data) =&gt; {
          if (response) {
            response.body = data
            resolve(response, {
              error: error,
            })
          } else {
            resolve(null, {
              error: error,
            })
          }
        })
      }
    })
  },
}

var $prefs = {
  valueForKey: key =&gt; {
    return $persistentStore.read(key)
  },
  setValueForKey: (val, key) =&gt; {
    return $persistentStore.write(val, key)
  },
}

var $notify = (title = '', subt = '', desc = '', opts) =&gt; {
  const toEnvOpts = (rawopts) =&gt; {
    if (!rawopts) return rawopts 
    if (typeof rawopts === 'string') {
      if ('undefined' !== typeof $loon) return rawopts
      else if('undefined' !== typeof $rocket) return rawopts
      else return { url: rawopts }
    } else if (typeof rawopts === 'object') {
      if ('undefined' !== typeof $loon) {
        let openUrl = rawopts.openUrl || rawopts.url || rawopts['open-url']
        let mediaUrl = rawopts.mediaUrl || rawopts['media-url']
        return { openUrl, mediaUrl }
      } else {
        let openUrl = rawopts.url || rawopts.openUrl || rawopts['open-url']
        if('undefined' !== typeof $rocket) return openUrl
        return { url: openUrl }
      }
    } else {
      return undefined
    }
  }
  console.log(title, subt, desc, toEnvOpts(opts))
  $notification.post(title, subt, desc, toEnvOpts(opts))
}
var _scriptSonverterDone = (val = {}) =&gt; {
  let result
  if (
    (typeof $request !== 'undefined' &amp;&amp;
    typeof val === 'object' &amp;&amp;
    typeof val.status !== 'undefined' &amp;&amp;
    typeof val.headers !== 'undefined' &amp;&amp;
    typeof val.body !== 'undefined') || false
  ) {
    result = { response: val }
  } else {
    result = val
  }
  console.log('$done')
  try {
    console.log(JSON.stringify(result))
  } catch (e) {
    console.log(result)
  }
  $done(result)
}
// 2023-07-14 11:45

const url = $request.url;
if (!$response.body) _scriptSonverterDone({});
let obj = JSON.parse($response.body);

if (url.includes("/v1/search/banner_list")) {
  if (obj.data) {
    obj.data = {};
  }
} else if (url.includes("/v1/search/hot_list")) {
  if (obj.data?.items) {
    obj.data.items = [];
  }
} else if (url.includes("/v1/system_service/config")) {
  // 整体配置
  const item = ["app_theme", "loading_img", "splash", "store"];
  if (obj.data) {
    item.forEach((i) =&gt; {
      delete obj.data[i];
    });
  }
} else if (url.includes("/v2/note/widgets")) {
  const item = ["generic"];
  if (obj.data) {
    item.forEach((i) =&gt; {
      delete obj.data[i];
    });
  }
} else if (url.includes("/v2/system_service/splash_config")) {
  // 开屏广告
  if (obj.data?.ads_groups) {
    obj.data.ads_groups.forEach((i) =&gt; {
      i.start_time = 2208960000; // Unix 时间戳 2040-01-01 00:00:00
      i.end_time = 2209046399; // Unix 时间戳 2040-01-01 23:59:59
      if (i.ads) {
        i.ads.forEach((j) =&gt; {
          j.start_time = 2208960000; // Unix 时间戳 2040-01-01 00:00:00
          j.end_time = 2209046399; // Unix 时间戳 2040-01-01 23:59:59
        });
      }
    });
  }
} else if (url.includes("/v4/followfeed")) {
  // 关注列表
  if (obj.data?.items) {
    // recommend_user 可能感兴趣的人
    obj.data.items = obj.data.items.filter(
      (i) =&gt; !["recommend_user"].includes(i.recommend_reason)
    );
  }
} else if (url.includes("/v4/search/trending")) {
  // 搜索栏
  if (obj.data?.queries) {
    obj.data.queries = [];
  }
  if (obj.data?.hint_word) {
    obj.data.hint_word = {};
  }
} else if (url.includes("/v4/search/hint")) {
  // 搜索栏填充词
  if (obj.data?.hint_words) {
    obj.data.hint_words = [];
  }
} else if (url.includes("/v6/homefeed")) {
  if (obj.data) {
    // 信息流广告
    let newItems = [];
    for (let item of obj.data) {
      // 信息流-直播
      if (item.model_type === "live_v2") {
        continue;
        // 信息流-赞助
      } else if (item.ads_info) {
        continue;
        // 信息流-带货
      } else if (item.card_icon) {
        continue;
        // 信息流-商品
      } else if (item?.note_attributes?.includes("goods")) {
        continue;
      } else {
        newItems.push(item);
      }
    }
    obj.data = newItems;
  }
} else if (url.includes("/v10/search/notes")) {
  if (obj.data?.items) {
    obj.data.items = obj.data.items.filter(
      (i) =&gt; i.model_type === "note"
    );
  }
}

_scriptSonverterDone({ body: JSON.stringify(obj) });
