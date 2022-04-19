// 定义一些常量
var xPI = 3.14159265358979324 * 3000.0 / 180.0;
var PI = 3.1415926535897932384626;
var a = 6378245.0;
var ee = 0.00669342162296594323;
/**
 * 百度坐标系 (BD-09) 与 火星坐标系 (GCJ-02) 的转换
 * 即 百度 转 谷歌、高德
 * @param bdLng
 * @param bdLat
 * @returns {[number, number]}
 */
export var bd09togcj02 = function (_a) {
    var bdLng = _a[0], bdLat = _a[1];
    bdLng = +bdLng;
    bdLat = +bdLat;
    var x = bdLng - 0.0065;
    var y = bdLat - 0.006;
    var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * xPI);
    var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * xPI);
    var ggLng = z * Math.cos(theta);
    var ggLat = z * Math.sin(theta);
    return [ggLng, ggLat];
};
/**
 * 火星坐标系 (GCJ-02) 与百度坐标系 (BD-09) 的转换
 * 即 谷歌、高德 转 百度
 * @param lng
 * @param lat
 * @returns {*[]}
 */
export var gcj02tobd09 = function (_a) {
    var lng = _a[0], lat = _a[1];
    lat = +lat;
    lng = +lng;
    var z = Math.sqrt(lng * lng + lat * lat) + 0.00002 * Math.sin(lat * xPI);
    var theta = Math.atan2(lat, lng) + 0.000003 * Math.cos(lng * xPI);
    var bdLng = z * Math.cos(theta) + 0.0065;
    var bdLat = z * Math.sin(theta) + 0.006;
    return [bdLng, bdLat];
};
/**
 * WGS-84 转 GCJ-02
 * @param lng
 * @param lat
 * @returns {*[]}
 */
export var wgs84togcj02 = function (_a) {
    var lng = _a[0], lat = _a[1];
    lat = +lat;
    lng = +lng;
    if (outOfChina([lng, lat])) {
        return [lng, lat];
    }
    else {
        var dlat = transformlat([lng - 105.0, lat - 35.0]);
        var dlng = transformlng([lng - 105.0, lat - 35.0]);
        var radlat = lat / 180.0 * PI;
        var magic = Math.sin(radlat);
        magic = 1 - ee * magic * magic;
        var sqrtmagic = Math.sqrt(magic);
        dlat = (dlat * 180.0) / ((a * (1 - ee)) / (magic * sqrtmagic) * PI);
        dlng = (dlng * 180.0) / (a / sqrtmagic * Math.cos(radlat) * PI);
        var mglat = lat + dlat;
        var mglng = lng + dlng;
        return [mglng, mglat];
    }
};
/**
 * GCJ-02 转换为 WGS-84
 * @param lng
 * @param lat
 * @returns {*[]}
 */
export var gcj02towgs84 = function (_a) {
    var lng = _a[0], lat = _a[1];
    lat = +lat;
    lng = +lng;
    if (outOfChina([lng, lat])) {
        return [lng, lat];
    }
    else {
        var dlat = transformlat([lng - 105.0, lat - 35.0]);
        var dlng = transformlng([lng - 105.0, lat - 35.0]);
        var radlat = lat / 180.0 * PI;
        var magic = Math.sin(radlat);
        magic = 1 - ee * magic * magic;
        var sqrtmagic = Math.sqrt(magic);
        dlat = (dlat * 180.0) / ((a * (1 - ee)) / (magic * sqrtmagic) * PI);
        dlng = (dlng * 180.0) / (a / sqrtmagic * Math.cos(radlat) * PI);
        var mglat = lat + dlat;
        var mglng = lng + dlng;
        return [lng * 2 - mglng, lat * 2 - mglat];
    }
};
export var transformlat = function (_a) {
    var lng = _a[0], lat = _a[1];
    lat = +lat;
    lng = +lng;
    var ret = -100.0 + 2.0 * lng + 3.0 * lat + 0.2 * lat * lat + 0.1 * lng * lat + 0.2 * Math.sqrt(Math.abs(lng));
    ret += (20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0 / 3.0;
    ret += (20.0 * Math.sin(lat * PI) + 40.0 * Math.sin(lat / 3.0 * PI)) * 2.0 / 3.0;
    ret += (160.0 * Math.sin(lat / 12.0 * PI) + 320 * Math.sin(lat * PI / 30.0)) * 2.0 / 3.0;
    return ret;
};
export var transformlng = function transformlng(_a) {
    var lng = _a[0], lat = _a[1];
    lat = +lat;
    lng = +lng;
    var ret = 300.0 + lng + 2.0 * lat + 0.1 * lng * lng + 0.1 * lng * lat + 0.1 * Math.sqrt(Math.abs(lng));
    ret += (20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0 / 3.0;
    ret += (20.0 * Math.sin(lng * PI) + 40.0 * Math.sin(lng / 3.0 * PI)) * 2.0 / 3.0;
    ret += (150.0 * Math.sin(lng / 12.0 * PI) + 300.0 * Math.sin(lng / 30.0 * PI)) * 2.0 / 3.0;
    return ret;
};
/**
 * 判断是否在国内，不在国内则不做偏移
 * @param lng
 * @param lat
 * @returns {boolean}
 */
export var outOfChina = function (_a) {
    var lng = _a[0], lat = _a[1];
    lat = +lat;
    lng = +lng;
    // 纬度 3.86~53.55, 经度 73.66~135.05
    return !(lng > 73.66 && lng < 135.05 && lat > 3.86 && lat < 53.55);
};
