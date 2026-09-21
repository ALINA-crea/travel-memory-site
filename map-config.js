// 高德地图的唯一配置入口。请在申请高德 Web 端（JS API）应用后填写两个占位符。
const AMAP_KEY = "YOUR_AMAP_KEY";
const AMAP_SECURITY_CODE = "YOUR_AMAP_SECURITY_CODE";

export const MAP_CONFIG = {
  provider: 'amap',
  apiKey: AMAP_KEY,
  securityCode: AMAP_SECURITY_CODE,
  apiUrl: 'https://webapi.amap.com/maps?v=2.0&key=',
  attribution: '地图数据 © 高德地图',
  defaultCenter: [104.1954, 35.8617],
  defaultZoom: 4
};
