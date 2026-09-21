import { initMap } from './map-provider.js';

// 旅行数据只描述内容，不包含地图服务地址、SDK 对象或专用字段。
const places = [
  { name: '北京 · 故宫', province: '北京市', city: '北京市', latitude: 39.9163, longitude: 116.3972, date: '2024 年 4 月 18 日', image: 'assets/image-placeholder.svg', story: '第一次走进故宫时，红墙和春日的阳光交织在一起，安静地走完了中轴线。', tips: '建议早上预约入场，穿舒适的鞋，并预留半天慢慢参观。' },
  { name: '杭州 · 西湖', province: '浙江省', city: '杭州市', latitude: 30.2444, longitude: 120.1499, date: '2023 年 11 月 3 日', image: 'assets/image-placeholder.svg', story: '沿着西湖慢慢散步，看夕阳落在湖面上，桂花香气让秋天变得格外具体。', tips: '建议从断桥附近出发，避开周末午后高峰，步行或骑行都很舒服。' },
  { name: '成都 · 宽窄巷子', province: '四川省', city: '成都市', latitude: 30.6711, longitude: 104.0556, date: '2022 年 9 月 12 日', image: 'assets/image-placeholder.svg', story: '在青砖灰瓦之间喝了一杯盖碗茶，感受成都悠闲又热闹的日常。', tips: '下午到晚上氛围最好，可以把宽巷子、窄巷子和井巷子一起逛完。' }
];
const $ = (id) => document.getElementById(id);
function showPlace(place) { $('place-name').textContent = place.name; $('place-date').textContent = place.date; $('place-image').src = place.image; $('place-story').textContent = place.story; $('place-tips').textContent = place.tips; $('place-detail').scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }
initMap('map', showPlace).then((mapApi) => { mapApi.addPlaces(places); $('location-search').addEventListener('submit', (event) => { event.preventDefault(); const query = $('search-input').value.trim(); if (!query) return; mapApi.search(query, places).then((result) => { $('back-to-china').hidden = false; $('search-status').textContent = result.type === 'poi' ? `已定位：${result.poi.name}` : `已筛选 ${result.places.length} 个旅行地点`; }).catch((error) => { $('search-status').textContent = error.message; }); }); $('back-to-china').addEventListener('click', () => { mapApi.reset(); $('back-to-china').hidden = true; $('search-status').textContent = ''; $('search-input').value = ''; }); }).catch((error) => { $('map').innerHTML = '<p class="map-error">地图暂时无法加载，请检查网络后刷新页面。</p>'; console.error(error); });
