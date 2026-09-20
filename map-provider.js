import { MAP_CONFIG } from './map-config.js';

// 地图适配层：页面只使用 initMap/addPlaces，不直接依赖具体地图服务。
function loadLeaflet() {
  return new Promise((resolve, reject) => {
    const css = document.createElement('link'); css.rel = 'stylesheet'; css.href = MAP_CONFIG.leafletCssUrl; document.head.appendChild(css);
    const script = document.createElement('script'); script.src = MAP_CONFIG.leafletJsUrl; script.onload = resolve; script.onerror = () => reject(new Error('地图脚本加载失败')); document.head.appendChild(script);
  });
}
export async function initMap(containerId, onPlaceClick) {
  await loadLeaflet();
  const map = L.map(containerId).setView(MAP_CONFIG.defaultCenter, MAP_CONFIG.defaultZoom);
  L.tileLayer(MAP_CONFIG.tileUrl, { attribution: MAP_CONFIG.attribution, maxZoom: 19 }).addTo(map);
  document.querySelector('#map-attribution').innerHTML = MAP_CONFIG.attribution;
  return { map, addPlaces(places) { places.forEach((place) => L.marker([place.latitude, place.longitude]).addTo(map).bindPopup(place.name).on('click', () => onPlaceClick(place))); } };
}
