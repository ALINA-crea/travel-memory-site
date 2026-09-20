// 地图服务的唯一配置入口。更换地图时，先修改这里；旅行数据不需要改动。
export const MAP_CONFIG = {
  provider: 'openstreetmap',
  leafletCssUrl: 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  leafletJsUrl: 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
  tileUrl: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors',
  defaultCenter: [35.5, 110],
  defaultZoom: 3
};
