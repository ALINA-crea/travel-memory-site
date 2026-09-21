import { MAP_CONFIG } from './map-config.js';

// 先加载基础地图，搜索插件独立加载，避免插件故障阻断地图显示。
function loadAmap() {
  return new Promise((resolve, reject) => {
    if (window.AMap) { resolve(window.AMap); return; }
    if (MAP_CONFIG.apiKey === 'YOUR_AMAP_KEY' || MAP_CONFIG.securityCode === 'YOUR_AMAP_SECURITY_CODE') {
      reject(new Error('请先在 map-config.js 中填写高德地图 Key 和安全密钥。'));
      return;
    }
    window._AMapSecurityConfig = { securityJsCode: MAP_CONFIG.securityCode };
    const script = document.createElement('script');
    script.src = `${MAP_CONFIG.apiUrl}${encodeURIComponent(MAP_CONFIG.apiKey)}`;
    script.onload = () => resolve(window.AMap);
    script.onerror = () => reject(new Error('高德地图脚本加载失败，请检查网络、Key 和域名白名单。'));
    document.head.appendChild(script);
  });
}

function loadSearchPlugins(AMap) {
  return new Promise((resolve, reject) => {
    AMap.plugin(['AMap.DistrictSearch', 'AMap.PlaceSearch'], () => {
      if (typeof AMap.DistrictSearch !== 'function' || typeof AMap.PlaceSearch !== 'function') {
        reject(new Error('高德搜索插件加载失败，暂时无法使用省份、城市或景点搜索。'));
        return;
      }
      resolve();
    });
  });
}

export async function initMap(containerId, onPlaceClick) {
  const AMap = await loadAmap();
  const map = new AMap.Map(containerId, {
    viewMode: '2D',
    zoom: MAP_CONFIG.defaultZoom,
    center: MAP_CONFIG.defaultCenter
  });
  document.querySelector('#map-attribution').textContent = MAP_CONFIG.attribution;

  const markers = [];
  let districtPolygon;
  let districtSearch;
  let placeSearch;
  let pluginsReady = false;
  const searchStatus = document.querySelector('#search-status');
  const pluginPromise = loadSearchPlugins(AMap).then(() => {
    districtSearch = new AMap.DistrictSearch({ subdistrict: 0, extensions: 'all', level: 'province' });
    placeSearch = new AMap.PlaceSearch({ pageSize: 10, city: '全国' });
    pluginsReady = true;
  }).catch((error) => {
    if (searchStatus) searchStatus.textContent = error.message;
    throw error;
  });

  function clearDistrict() {
    if (districtPolygon) {
      map.remove(districtPolygon);
      districtPolygon = null;
    }
  }

  function showDistrict(name) {
    return new Promise((resolve, reject) => {
      if (!districtSearch) { reject(new Error('省份边界搜索暂时不可用。')); return; }
      districtSearch.search(name, (status, result) => {
        if (status !== 'complete' || !result.districtList?.length) {
          reject(new Error('没有找到该行政区域'));
          return;
        }
        const district = result.districtList[0];
        clearDistrict();
        if (district.boundaries?.length) {
          districtPolygon = new AMap.Polygon({ path: district.boundaries, strokeColor: '#c06d43', strokeWeight: 2, fillColor: '#c06d43', fillOpacity: 0.12, map });
          map.setBounds(districtPolygon.getBounds());
        } else if (district.center) {
          map.setCenter(district.center);
        }
        resolve(district);
      });
    });
  }

  function setVisible(places) {
    const visible = new Set(places);
    markers.forEach(({ place, marker }) => marker.setMap(visible.has(place) ? map : null));
  }

  function addPlaces(places) {
    places.forEach((place) => {
      const marker = new AMap.Marker({ position: [place.longitude, place.latitude], title: place.name });
      marker.on('click', () => onPlaceClick(place));
      markers.push({ place, marker });
    });
    setVisible(places);
  }

  function search(query, places) {
    return pluginPromise.then(() => new Promise((resolve, reject) => {
      if (!pluginsReady || !placeSearch) { reject(new Error('搜索插��暂时不可用，请稍后再试。')); return; }
      const local = places.filter((place) => `${place.name}${place.city}${place.province}`.includes(query));
      if (local.length) {
        const first = local[0];
        const isCity = query.includes('市') || query === first.city;
        showDistrict(first.province).then(() => {
          setVisible(local);
          map.setZoomAndCenter(isCity ? 12 : 8, [first.longitude, first.latitude]);
          resolve({ type: 'local', places: local });
        }).catch(reject);
        return;
      }
      placeSearch.search(query, (status, result) => {
        if (status !== 'complete' || !result.poiList?.pois?.length) {
          reject(new Error('没有找到相关省份、城市或景点'));
          return;
        }
        const poi = result.poiList.pois[0];
        setVisible([]);
        map.setZoomAndCenter(12, [poi.location.lng, poi.location.lat]);
        resolve({ type: 'poi', poi });
      });
    }));
  }

  return {
    map,
    addPlaces,
    search,
    showDistrict,
    setVisible,
    reset() {
      clearDistrict();
      setVisible(markers.map(({ place }) => place));
      map.setZoomAndCenter(MAP_CONFIG.defaultZoom, MAP_CONFIG.defaultCenter);
    }
  };
}
