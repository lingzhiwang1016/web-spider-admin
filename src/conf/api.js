import config from "@/conf/config";

export default {
    oss_token: config.api + "/ali/token", // 获得阿里云签名

    // 用户
    sysUser_getCurrentUser: config.api + "/sys_user/current", // 用户信息
    login: config.api + "/login", //  登陆
    captcha_type: config.api + "/captcha/login", // 登录验证码
    logout: config.api + "/logout", // 退出

    // 城市数据
    city_economy_query: config.api + "/city_economy/query", // v1.7城市数据信息展示
    city_economy_add: config.api + "/city_economy/add", // v1.7城市经济情况编辑
    city_economy_population_update:
        config.api + "/city_economy/population/update", // v1.7人口信息情况编辑
    city_economy_population: config.api + "/city_economy/population/:ids", // v1.7根据ids获取人口信息详情

    // 企业地图
    recruitment_poi: config.api + "/recruitment_poi/poi", // 定位点poi列表
    recruitment_location: config.api + "/recruitment/location", // 某个定位点放大显示企业信息
    recruitment_location_industry:
        config.api + "/recruitment/location_industry", //获取放大定位点行业信息
    recruitment_location_page:
        config.api + "/recruitment/location/page/:pageSize/:pageNo", //定位点放大根据行业划分企业信息
    recruitment_poi_county_list: config.api + "/recruitment_poi/county/list", // v1.7根据行政区统计
    //企业-列表
    enterprise_page: config.api + "/enterprise/page/:pageSize/:pageNo", //分页查询企业基本信息
    recruitment_poi_page:
        config.api + "/recruitment_poi/page/:pageSize/:pageNo", //根据定位类型统计poi（商圈，交通枢纽）
    recruitment_county:
        config.api + "/recruitment_poi/county/:pageSize/:pageNo", //根据行政区统计poi
    recruitment_industry:
        config.api + "/recruitment/industry/:pageSize/:pageNo", //根据行业统计企业信息
    enterprise_export: config.api + "/enterprise/export", //企业基本信息下载
    recruitment_industry_export: config.api + "/recruitment/industry/export", //行业统计信息下载
    recruitment_county_export: config.api + "/recruitment_poi/county/export", //行政区统计信息下载
    recruitment_poi_export: config.api + "/recruitment_poi/poi/export", //POI统计信息下载=>商圈，交通枢纽
    recruitment_industry_enterprise:
        config.api + "/recruitment/industry/enterprise/:pageSize/:pageNo", //根据行业获取企业列表(详情页)
    recruitment_industry_enterprise_export:
        config.api + "/recruitment/industry/enterprise/export", //行业企业统计信息下载(详情页)
    recruitment_county_enterprise:
        config.api + "/recruitment/county/enterprise/:pageSize/:pageNo", //根据行政区获取企业列表(详情页)
    recruitment_county_enterprise_export:
        config.api + "/recruitment/county/enterprise/export", //行政区企业详情统计信息下载(详情页)
    recruitment_poi_enterprise:
        config.api + "/recruitment_poi/enterprise/:pageSize/:pageNo", //根据定位点获取企业列表(商圈，交通枢纽详情页)
    recruitment_poi_enterprise_export:
        config.api + "/recruitment_poi/enterprise/export", //定位点获取企业列表下载(商圈，交通枢纽详情页)

    // 省市区
    districts_getProvince: config.api + "/districts/getProvince", //获取省份
    districts_getCityByProvince: config.api + "/districts/getCityByProvince", //获取省份的城市
    districts_getAreaByCity: config.api + "/districts/getAreaByCity", //获取城市的区县
    districts_getAllByTree: config.api + "/districts/getAllByTree", // 获取省市区的树形结构
    districts_getLocationCity: config.api + "/districts/getLocationCity", //操作定位点时城市筛选

    recruitment_poi_enterprise_statistical:
        config.api + "/recruitment_poi/enterprise_statistical", //信息统计图表

    // 酒店地图
    hotel_page: config.api + "/hotel/page/:pageSize/:pageNo", // 分页获取酒店信息
    hotel_page_type: config.api + "/hotel/page/type/:pageSize/:pageNo", // 按类型分页获取酒店信息
    hotel_page_type_detail:
        config.api + "/hotel/page/type/detail/:pageSize/:pageNo", // 分页获取类型下酒店详情
    hotel_page_county: config.api + "/hotel/page/county/:pageSize/:pageNo", // 按行政区分页获取企业信息
    hotel_page_county_detail:
        config.api + "/hotel/page/county/detail/:pageSize/:pageNo", // 分页获取行政区下酒店详情
    hotel_poi_page_locationType:
        config.api + "/hotel/poi/page/locationType/:pageSize/:pageNo", // 按定位点类型分页获取酒店POI信息
    hotel_page_location_detail:
        config.api + "/hotel/page/location/detail/:pageSize/:pageNo", // 分页获取定位点下酒店详情
    hotel_export: config.api + "/hotel/export", // 导出酒店信息Excel  导出分类酒店详情Excel  导出按行政区划分酒店详情Excel
    hotel_export_type: config.api + "/hotel/export/type", // 导出类型分类酒店信息Excel
    hotel_export_county: config.api + "/hotel/export/county", // 导出按行政区划分酒店Excel
    hotel_poi_export: config.api + "/hotel/poi/export", // 导出酒店Poi信息Excel
    hotel_export_location_detail: config.api + "/hotel/export/location/detail", // 导出酒店Poi详情Excel
    // 酒店地图统计报表
    hotel_poi_hotel_statistical: config.api + "/hotel/poi/hotel_statistical", // 酒店信息统计图表
    // 酒店地图POI
    hotel_poi_list: config.api + "/hotel/poi/list", // 按地图展示poi
    hotel_location_type: config.api + "/hotel/location/type", // 按定位点获取酒店类型
    hotel_poi_county_list: config.api + "/hotel/poi/county/list", // v1.7按区县统计

    //租金地图
    house_rent_page: config.api + "/house_rent/page/:pageSize/:pageNo", // 租房信息（包括各种详情，除了交通枢纽详情）
    house_rent_page_type:
        config.api + "/house_rent/page/type/:pageSize/:pageNo", // 房型统计列表
    house_rent_house_type_count: config.api + "/house_rent/house_type_count", // 房型统计列表
    house_rent_page_county:
        config.api + "/house_rent/page/county/:pageSize/:pageNo", // 区县统计列表
    house_rent_page_locationType:
        config.api + "/house_rent_poi/page/locationType/:pageSize/:pageNo", // 交通枢纽统计列表
    house_rent_page_location_detail:
        config.api + "/house_rent/page/location/detail/:pageSize/:pageNo", // 交通枢纽下的详情
    house_rent_export_county: config.api + "/house_rent/export/county", // 导出租房区县统计
    house_rent_export_type: config.api + "/house_rent/export/type", // 导出租房类型统计
    house_rent_poi_export: config.api + "/house_rent_poi/export", // 导出交通枢纽统计
    house_rent_export_location_detail:
        config.api + "/house_rent/export/location/detail", // 导出交通枢纽详情
    house_rent_export: config.api + "/house_rent/export", // 导出租房详情
    house_rent_poi_statistical:
        config.api + "/house_rent_poi/house_rent_statistical", // 租房统计图表
    //poi
    house_rent_poi_list: config.api + "/house_rent_poi/list", //poi
    house_rent_poi_county: config.api + "/house_rent/poi/county", //行政区
    house_rent_page_location:
        config.api + "/house_rent/page/location/detail/:pageSize/:pageNo", //poi定位点列表
    house_rent_location_count: config.api + "/house_rent/location/count", //定位点下统计信息
    house_rent_poi_county_list: config.api + "/house_rent_poi/county/list", // v1.7租房poi区县统计

    // 公寓地图
    apartment_page: config.api + "/apartment/page/:pageSize/:pageNo", // v1.5_公寓信息
    apartment_page_brand:
        config.api + "/apartment/page/brand/:pageSize/:pageNo", // v1.5_按公寓品牌统计
    apartment_export: config.api + "/apartment/export", // 导出公寓信息Excel
    apartment_export_brand: config.api + "/apartment/export/brand", // 导出公寓信息品牌统计Excel
    apartment_poi_list: config.api + "/apartment_poi/list", // v1.5按地图展示poi
    apartment_poi_page_locationType:
        config.api + "/apartment_poi/page/locationType/:pageSize/:pageNo", // v1.5按定位点类型分页获取公寓POI信息
    apartment_poi_map_list: config.api + "/apartment_poi/map_list", // v1.5地图定位信息展示
    apartment_poi_page_mapLocation:
        config.api + "/apartment_poi/page/mapLocation/:pageSize/:pageNo", // v1.5分页获取地图定位poi下公寓详情
    apartment_poi_county_list: config.api + "/apartment_poi/county/list", // v1.7公寓poi区县统计
    // v1.8公寓竞品展示
    apartment_poi_query_competition:
        config.api + "/apartment_poi/query/competition",
    // v1.8公寓竞品信息添加
    apartment_poi_add_competition:
        config.api + "/apartment_poi/add/competition",
    // ids获取信息
    apartment_poi_query_ids: config.api + "/apartment_poi/query/ids",
    ali_download_attachmentId: config.api + "/ali/download",

    // 停车场地图
    depot_page: config.api + "/depot/page/:pageSize/:pageNo", // v1.6_停车场信息展示
    depot_page_type: config.api + "/depot/page/type/:pageSize/:pageNo", // v1.6_停车场信息按类型展示
    depot_page_quality: config.api + "/depot/page/quality/:pageSize/:pageNo", // v1.6_停车场信息按质量展示
    depot_list: config.api + "/depot/list", // v1.6_停车场信息poi展示
    depot_add: config.api + "/depot/add", // v1.7信息录入
    depot_delete: config.api + "/depot/delete/:id", // v1.7删除停车场信息
    depot_queryById: config.api + "/depot/queryById/:id", // v1.7根据id获取详情
    ali_attachmentId: config.api + "/ali/:attachmentId", // v1.7根据id获取图片信息

    // 系统设置 -编辑定位列表
    // 系统设置 -定位点设置
    location_page: config.api + "/location/page/:pageSize/:pageNo", //定位点分页
    location_list: config.api + "/location/list", //定位点列表
    location_id: config.api + "/location/:id", //获取定位点详情
    location_add: config.api + "/location", //新增定位点
    location_update: config.api + "/location/:id", //更新定位点
    location_get: config.api + "/location/:id", //获取定位点详情
    location_delete: config.api + "/location/:id", //删除定位点
    // 系统设置 - 账号管理
    sys_user_page: config.api + "/sys_user/page/:pageSize/:pageNo", //v1.8分页查询用户
    sys_user_disabled_id: config.api + "/sys_user/disabled/:id", //禁用用户
    sys_user_enabled_id: config.api + "/sys_user/enabled/:id", //启用用户
    sys_user_add: config.api + "/sys_user/add" // 添加用户
};
