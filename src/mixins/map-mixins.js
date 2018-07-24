/**
 * Created by vyouyou on 18-2-2.
 */
import { getLabelStyle, getPointSvg } from "@/util/mapUtils.js";
import location from "@/generated/location.json";
import dict, { LOCATION_TYPE, COVERAGE_RADIUSENUM } from "@/net/dict.js";
import AMap from "AMap";

const radiusToZoom = [
    { radius: 0.5, zoom: 16 },
    { radius: 1, zoom: 15 },
    { radius: 2, zoom: 14 },
    { radius: 3, zoom: 14 }
];

const mapMixins = {
    data() {
        return {
            // 图标的overflow
            overflowMarkers: [],
            mapData: {
                mapSize: 12
            },
            filter: {
                locationType: "trading_area",
                coverageRadius: "2"
            },
            // 通过经纬度获取的地址
            addressByPoint: "",
            pointByClick: {},
            // 是否为按区县展示poi状态
            isCounty: false,
            // 是否为按公寓竞品展示poi状态
            isCompetitor: false,
            districtLabelUrl: "",
            lng: null,
            lat: null,
            mapType: null
        };
    },

    computed: {
        city() {
            return this.$store.state.city || "350200";
        }
    },
    asyncComputed: {
        allType: async function() {
            const res = await dict.getDictByType(LOCATION_TYPE);
            if (!res) {
                return [];
            }
            const arr = res.map(item => {
                return { desc: item.codeText, code: item.code };
            });
            arr.push({ desc: "按区县", code: "county" });
            return arr;
        },
        allRadius: async function() {
            const res = await dict.getDictByType(COVERAGE_RADIUSENUM);
            if (!res) {
                return [];
            }
            const arr = res.filter(item => {
                return item.code !== "0.1";
            });
            return arr.map(item => {
                return { desc: item.codeText, code: item.code };
            });
        }
    },

    watch: {
        city(val) {
            this.refreshMap();
            this.$logger.log("===>1");
            if (
                this.$refs.floatWindow &&
                this.$refs.floatWindow.changeState &&
                !this.isCompetitor &&
                this.mapType !== "depot"
            ) {
                this.$refs.floatWindow.changeState("init");
            }
            if (
                this.$refs.floatWindow &&
                this.$refs.floatWindow.onHidden &&
                !this.isCompetitor &&
                this.mapType !== "depot"
            ) {
                this.$refs.floatWindow.onHidden();
            }
        },
        "$store.state.month"(val) {
            this.main_readData();
        }
    },

    methods: {
        onTypeChange(e) {
            this.filter.locationType = e;
            this.clickMapStatus = e !== "click";
            this.isCounty = e === "county";
            this.switchVal = false;
            if (this.$refs.bimSwitch) {
                this.$refs.bimSwitch.style.transform = "translateX(4px)";
            }
            this.radio = 0;
            this.DialogType = "ADRESS";
            if (e === "competitor") {
                this.isCompetitor = true;
            } else {
                this.isCompetitor = false;
            }
            if (
                this.$refs.floatWindow &&
                this.$refs.floatWindow.onHiddenWindow &&
                !this.isCompetitor &&
                this.mapType !== "depot"
            ) {
                this.$refs.floatWindow.onHiddenWindow();
                this.simpleCompetitorDialogVisible = false;
            }
            this.$logger.log(111, this.$refs.floatWindow);
            this.filterChange();
        },
        onRadiusChange(e) {
            this.filter.coverageRadius = e;
            this.filterChange();
            if (this.filter.locationType === "click") {
                this.clickMapStatus = false;
            }
        },

        filterChange() {
            if (this.markerClusterer) {
                this.markerClusterer.setMap(null);
            }
            if (
                this.$refs.floatWindow &&
                this.$refs.floatWindow.changeState &&
                !this.isCompetitor &&
                this.mapType !== "depot"
            ) {
                this.$refs.floatWindow.changeState("init");
            }
            if (
                this.$refs.floatWindow &&
                this.$refs.floatWindow.onHidden &&
                !this.isCompetitor &&
                this.mapType !== "depot"
            ) {
                this.$refs.floatWindow.onHidden();
            }
            this.main_readData();
            if (!this.isCounty) {
                this.map.setZoomAndCenter(this.mapData.mapSize, [
                    this.point.lng,
                    this.point.lat
                ]);
            }
        },

        initMap() {
            //初始化
            this.map.setZoomAndCenter(this.mapData.mapSize, [
                this.point.lng,
                this.point.lat
            ]);
            // 添加点击事件
            this.map.on("click", this.mapClick);
            this.map.on("click", this.mapClickNewPosition);
            this.map.on("click", this.competitorMapClickNewPosition);
            this.map.on("click", this.competitorMarkerRemove);
            this.map.on("click", this.parkingWindowRemove);
        },

        setMapZoomByRadis() {
            const temp = radiusToZoom.find(item => {
                return item.radius + "" === this.filter.coverageRadius + "";
            });
            this.map.setZoom(temp.zoom);
        },

        onBusinessAreaChange(data) {
            //如果没有传data,则返回上一级
            if (!data) {
                this.readData();
                this.map.clearMap();
                return;
            }

            // 移动地图
            this.map.clearMap();
            if (this.markerClusterer) {
                this.markerClusterer.setMap(null);
            }
            const point = [data.location.lng, data.location.lat];
            this.map.panTo(point);
            this.makeCircle(point, data[this.mainKey]);
            this.setMapZoomByRadis();
            if (this.afterAreaChange) {
                this.afterAreaChange(data);
            }
        },

        async readData() {
            const res = await this.$request({
                url: this.url,
                method: "get",
                params: this.getParams()
            });
            this.poiList = res.data;
            this.aferDataChange();
        },

        aferDataChange() {
            if (
                this.$refs.floatWindow &&
                this.$refs.floatWindow.closeDropDown &&
                !this.isCompetitor &&
                this.mapType !== "depot"
            ) {
                this.$refs.floatWindow.closeDropDown();
            }
            this.map.setZoom(this.mapData.mapSize);
            // 每次请求数据后，重新画圆
            if (!this.isCounty) {
                this.handerMarkerLabel(this.poiList);
            }
        },

        //绘制地图上的点
        drawCompanyPoint(points) {
            this.map.remove(this.overflowMarkers);
            this.overflowMarkers = [];
            points.forEach((point, index) => {
                const mapPoint = [point.lng, point.lat];
                // 中心点和文字
                // const myIcon = new BMap.Icon(getPointSvg(index + 1), new BMap.Size(22, 28));
                const count = (index + 1) % 10 === 0 ? 10 : (index + 1) % 10;
                const content = `<div class="iconImg">${count}</div>`;
                const marker = new AMap.Marker({
                    map: this.map,
                    position: mapPoint,
                    content: content
                    // icon: new AMap.Icon({
                    //     size: new AMap.Size(40, 50), //图标大小
                    //     image: "http://webapi.amap.com/theme/v1.3/images/newpc/way_btn2.png",
                    //     imageOffset: new AMap.Pixel(0, -60)
                    // })
                });
                this.overflowMarkers.push(marker);
            });
            if (this.overflowMarkers[1]) {
                this.overflowMarkers[1].setzIndex(10);
            }
            if (this.markerClusterer) {
                this.markerClusterer.setMap(null);
            }
            // this.markerClusterer = new AMap.MarkerClusterer(this.map, this.overflowMarkers, {
            //     gridSize: 0
            // });
        },

        getPointFun(address) {
            return new Promise((resolve, reject) => {
                this.geocoder.getLocation(address, (status, result) => {
                    if (status === "complete" && result.info === "OK") {
                        resolve(result.geocodes[0].location);
                    } else {
                        reject(result);
                    }
                });
            });
        },
        getLocationCity(point) {
            this.geocoder.getAddress(point, (status, result) => {
                if (status === "complete" && result.info === "OK") {
                    this.addressByPoint = result.regeocode.formattedAddress;
                }
                this.$refs.floatWindow.getClickDetail(
                    this.pointByClick,
                    this.addressByPoint
                );
            });
        },

        transCodeToPoint() {
            const city = location.find(l => {
                return l.districts.id === this.$store.state.city;
            });
            return this.getPointFun(city.districts.name);
        },

        async refreshMap() {
            this.point = await this.transCodeToPoint();
            this.initMap();
            this.main_readData();
        },
        // 入口readData
        main_readData() {
            if (this.isCounty) {
                this.districtLabel_readData();
            } else if (this.isCompetitor) {
                this.readCompetitorData();
            } else {
                this.readData();
            }
        },

        initState() {
            this.map = new AMap.Map("container", {
                resizeEnable: true,
                zoom: this.mapData.mapSize,
                center: [118.089425, 24.479833]
            });
            this.geocoder = new AMap.Geocoder({});
            this.companyMarkers = [];

            this.refreshMap();
        },

        highOverflow(index) {
            const marker = this.overflowMarkers[index];
            marker.setzIndex(10);
            // 鼠标移过去时，marker高亮显示
            const count = (index + 1) % 10 === 0 ? 10 : (index + 1) % 10;
            const content = `<div class="iconImg iconImg_hover3">${count}</div>`;
            marker.setContent(content);
        },
        lowOverflow(index) {
            const marker = this.overflowMarkers[index];
            marker.setzIndex(0);
            // 鼠标移走时，marker恢复默认状态
            const count = (index + 1) % 10 === 0 ? 10 : (index + 1) % 10;
            const content = `<div class="iconImg">${count}</div>`;
            marker.setContent(content);
        },
        // 绘制该城市下所有的行政区
        handerAllDistrict(allCount) {
            const color = [
                "#7ED321",
                "#00BFFF",
                "#D45022",
                "#4A90E2",
                "#F5A623",
                "#1CBCB4"
            ];
            const len = color.length;
            allCount.forEach((item, index) => {
                const key = index % len;
                this.handerDistrict(item.countyName, color[key]);
            });
        },
        // 绘制单个行政区划边界
        handerDistrict(count, color) {
            AMap.service("AMap.DistrictSearch", () => {
                //加载行政区划插件
                const district = new AMap.DistrictSearch({
                    //实例化DistrictSearch
                    subdistrict: 1, //返回下一级行政区
                    extensions: "all", //返回行政区边界坐标组等具体信息
                    level: "district" //查询行政级别为 市
                });
                district.search(count, (status, result, districtList) => {
                    //行政区查询
                    if (status === "complete") {
                        const bounds = result.districtList[0].boundaries;
                        if (bounds) {
                            bounds.forEach((item, index) => {
                                const polygon = new AMap.Polygon({
                                    //生成行政区划polygon
                                    map: this.map,
                                    strokeWeight: 2,
                                    path: bounds[index],
                                    fillOpacity: 0.24,
                                    fillColor: color,
                                    strokeColor: color
                                });
                            });
                            this.map.setFitView(); //地图自适应
                        }
                    } else {
                        this.$logger.log(count + "不存在");
                    }
                });
            });
        },
        // 按区县选择时poi的标签制作
        async districtLabel_readData() {
            const res = await this.$request({
                url: this.districtLabelUrl,
                method: "get",
                params: this.getParams()
            });
            // 划行政区
            this.handerAllDistrict(res.data);
            // 添加文本标记
            this.handerMarkerLabel(res.data);
            this.$logger.log("===>1", res.data);
        }
    }
};

export default mapMixins;
