// 高德地图的唯一配置入口。请在申请高德 Web 端（JS API）应用后填写两个占位符。
const AMAP_KEY = "1cc56e3da58d3c6dccd5d10cce1d0d7c";
const AMAP_SECURITY_CODE = "d357bd5b8a940cea0eada20cea1e302d";

export const MAP_CONFIG = {
  provider: 'amap',
  apiKey: AMAP_KEY,
  securityCode: AMAP_SECURITY_CODE,
  apiUrl: 'https://webapi.amap.com/maps?v=2.0&key=',
  plugins: 'AMap.DistrictSearch,AMap.PlaceSearch',
  attribution: '地图数据 © 高德地图',
  defaultCenter: [104.1954, 35.8617],
  defaultZoom: 4
};
