import { MAP_CONFIG } from './map-config.js';

// 地图适配层：页面只使用 initMap/addPlaces，不直接依赖高德 SDK。
function loadAmap() {
  return new Promise((resolve, reject) => {
    if (window.AMap) { resolve(window.AMap); return; }
    if (MAP_CONFIG.apiKey === 'YOUR_AMAP_KEY' || MAP_CONFIG.securityCode === 'YOUR_AMAP_SECURITY_CODE') { reject(new Error('请先在 map-config.js 中填写高德地图 Key 和安全密钥。')); return; }
    window._AMapSecurityConfig = { securityJsCode: MAP_CONFIG.securityCode };
    const script = document.createElement('script'); script.src = `${MAP_CONFIG.apiUrl}${encodeURIComponent(MAP_CONFIG.apiKey)}&plugin=${MAP_CONFIG.plugins}`; script.onload = () => resolve(window.AMap); script.onerror = () => reject(new Error('高德地图脚本加载失败，请检查网络、Key 和域名白名单。')); document.head.appendChild(script);
  });
}
export async function initMap(containerId, onPlaceClick) {
  const AMap = await loadAmap();
  const map = new AMap.Map(containerId, { viewMode: '2D', zoom: MAP_CONFIG.defaultZoom, center: MAP_CONFIG.defaultCenter });
  document.querySelector('#map-attribution').innerHTML = MAP_CONFIG.attribution;
  const markers = [];
  let districtPolygon;
  const districtSearch = new AMap.DistrictSearch({ subdistrict: 0, extensions: 'all', level: 'province' });
  function clearDistrict() { if (districtPolygon) { map.remove(districtPolygon); districtPolygon = null; } }
  function showDistrict(name) { return new Promise((resolve, reject) => { districtSearch.search(name, (status, result) => { if (status !== 'complete' || !result.districtList?.length) { reject(new Error('没有找到该行政区域')); return; } const district = result.districtList[0]; clearDistrict(); if (district.boundaries?.length) districtPolygon = new AMap.Polygon({ path: district.boundaries, strokeColor: '#c06d43', strokeWeight: 2, fillColor: '#c06d43', fillOpacity: .12, map }); map.setBounds(district.boundaries ? districtPolygon.getBounds() : district.center); resolve(district); }); }); }
  function setVisible(places) { const visible = new Set(places); markers.forEach(({ place, marker }) => marker.setMap(visible.has(place) ? map : null)); }
  function addPlaces(places) { places.forEach((place) => { const marker = new AMap.Marker({ position: [place.longitude, place.latitude], title: place.name }); marker.on('click', () => onPlaceClick(place)); markers.push({ place, marker }); }); setVisible(places); }
  function search(query, places) { return new Promise((resolve, reject) => { const local = places.filter((place) => `${place.name}${place.city}${place.province}`.includes(query)); if (local.length) { const first = local[0]; const isCity = query.includes('市') || query === first.city; showDistrict(first.province).then(() => { setVisible(local); map.setZoomAndCenter(isCity ? 12 : 8, [first.longitude, first.latitude]); resolve({ type: 'local', places: local }); }); return; } const placeSearch = new AMap.PlaceSearch({ pageSize: 10, city: '全国' }); placeSearch.search(query, (status, result) => { if (status !== 'complete' || !result.poiList?.pois?.length) { reject(new Error('没有找到相关省份、城市或景点')); return; } const poi = result.poiList.pois[0]; setVisible([]); map.setZoomAndCenter(12, [poi.location.lng, poi.location.lat]); resolve({ type: 'poi', poi }); }); }); }
  return { map, addPlaces, search, showDistrict, setVisible, reset() { clearDistrict(); setVisible(markers.map(({ place }) => place)); map.setZoomAndCenter(MAP_CONFIG.defaultZoom, MAP_CONFIG.defaultCenter); } };
}
