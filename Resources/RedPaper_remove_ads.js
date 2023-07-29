/*
引用地址https://raw.githubusercontent.com/RuCu6/QuanX/main/Scripts/xiaohongshu.js
*/
// 2023-05-26 22:50

const url = $request.url;
if (!$response.body) $done({});
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
    item.forEach((i) => {
      delete obj.data[i];
    });
  }
} else if (url.includes("/v2/system_service/splash_config")) {
  // 开屏广告
  if (obj.data?.ads_groups) {
    obj.data.ads_groups.forEach((i) => {
      i.start_time = 2208960000; // Unix 时间戳 2040-01-01 00:00:00
      i.end_time = 2209046399; // Unix 时间戳 2040-01-01 23:59:59
      if (i.ads) {
        i.ads.forEach((j) => {
          j.start_time = 2208960000; // Unix 时间戳 2040-01-01 00:00:00
          j.end_time = 2209046399; // Unix 时间戳 2040-01-01 23:59:59
        });
      }
    });
  }
} 

$done({ body: JSON.stringify(obj) });
