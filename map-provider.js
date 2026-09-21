import { MAP_CONFIG } from './map-config.js';

// 地图适配层：页面只使用 initMap/addPlaces，不直接依赖高德 SDK。
function loadAmap() {
  return new Promise((resolve, reject) => {
    if (window.AMap) { resolve(window.AMap); return; }
    if (MAP_CONFIG.apiKey === 'YOUR_AMAP_KEY' || MAP_CONFIG.securityCode === 'YOUR_AMAP_SECURITY_CODE') { reject(new Error('请先在 map-config.js 中填写高德地图 Key 和安全密钥。')); return; }
    window._AMapSecurityConfig = { securityJsCode: MAP_CONFIG.securityCode };
    const script = document.createElement('script'); script.src = `${MAP_CONFIG.apiUrl}${encodeURIComponent(MAP_CONFIG.apiKey)}`; script.onload = () => resolve(window.AMap); script.onerror = () => reject(new Error('高德地图脚本加载失败，请检查网络、Key 和域名白名单。')); document.head.appendChild(script);
  });
}
export async function initMap(containerId, onPlaceClick) {
  const AMap = await loadAmap();
  const map = new AMap.Map(containerId, { viewMode: '2D', zoom: MAP_CONFIG.defaultZoom, center: MAP_CONFIG.defaultCenter });
  document.querySelector('#map-attribution').innerHTML = MAP_CONFIG.attribution;
  return { map, addPlaces(places) { places.forEach((place) => { const marker = new AMap.Marker({ position: [place.longitude, place.latitude], title: place.name }); marker.setMap(map); marker.on('click', () => onPlaceClick(place)); }); } };
}
