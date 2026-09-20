import { initMap } from './map-provider.js';

// 旅行数据只描述内容，不包含地图服务地址、SDK 对象或专用字段。
const places = [
  { name: '北京 · 故宫', latitude: 39.9163, longitude: 116.3972, date: '2024 年 4 月 18 日', image: 'assets/image-placeholder.svg', story: '第一次走进故宫时，红墙和春日的阳光交织在一起，安静地走完了中轴线。', tips: '建议早上预约入场，穿舒适的鞋，并预留半天慢慢参观。' },
  { name: '东京 · 浅草寺', latitude: 35.7148, longitude: 139.7967, date: '2023 年 11 月 3 日', image: 'assets/image-placeholder.svg', story: '傍晚在雷门前看人群来往，随后沿着仲见世商店街吃了人形烧。', tips: '可以乘地铁到浅草站，清晨游客较少，附近的小店适合慢慢逛。' },
  { name: '巴黎 · 埃菲尔铁塔', latitude: 48.8584, longitude: 2.2945, date: '2022 年 9 月 12 日', image: 'assets/image-placeholder.svg', story: '黄昏时分登上高处，看城市从金色渐渐亮起灯光，是难忘的一刻。', tips: '提前购买登塔时段票，日落前抵达，结束后可沿塞纳河散步。' }
];
const $ = (id) => document.getElementById(id);
function showPlace(place) { $('place-name').textContent = place.name; $('place-date').textContent = place.date; $('place-image').src = place.image; $('place-story').textContent = place.story; $('place-tips').textContent = place.tips; $('place-detail').scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }
initMap('map', showPlace).then((mapApi) => mapApi.addPlaces(places)).catch((error) => { $('map').innerHTML = '<p class="map-error">地图暂时无法加载，请检查网络后刷新页面。</p>'; console.error(error); });
