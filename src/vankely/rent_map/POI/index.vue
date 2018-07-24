<template>
    <div>
        <div class="breadcrumb">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>租金地图</el-breadcrumb-item>
                <el-breadcrumb-item>POI展示</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <div class="vk-list">
            <div>
                <ul class="vk-tools-bar vk-tools-map">
                    <li class="filter">
                        <el-select class="search-select" :value="filter.locationType" @input="onTypeChange">
                            <el-option v-for="item in allType" :key="item.code" :label="item.desc" :value="item.code"></el-option>
                        </el-select>
                        <el-select :disabled="isCounty" class="search-select" :value="filter.coverageRadius" @input="onRadiusChange">
                            <el-option v-for="item in allRadius" :key="item.code" :label="item.desc" :value="item.code"></el-option>
                        </el-select>
                        <el-select class="search-select" :value="filter.houseType" @input="onhouseTypeChange">
                            <el-option v-for="item in allhouseType" :key="item.code" :label="item.codeText" :value="item.code"></el-option>
                        </el-select>
                        <div class="addPositonWrapper" v-if="filter.locationType==='trading_area'||filter.locationType==='traffic_hub'">
                            <div class="bimHeaderSwitch select">
                                <div :class="{ 'active': switchVal }">锁定</div>
                                <div class="bimSwitch" @click="switchChane">
                                    <div class="bimSwitchIcon" ref="bimSwitch"></div>
                                </div>
                                <div :class="{ 'active': switchVal }">添加</div>
                            </div>
                            <div class="redioWrapper" v-if="switchVal">
                                <el-radio-group v-model="radio" @change="onAdd" v-if="filter.locationType==='trading_area'||filter.locationType==='traffic_hub'">
                                    <el-radio :label="1">输入地址添加定位</el-radio>
                                    <el-radio :label="2">点击地图添加定位</el-radio>
                                </el-radio-group>
                            </div>
                        </div>
                        <vk-add-location
                            v-if="dialogVisible"
                            :visible.sync="dialogVisible"
                            @addFinish = "getLocationPosition"
                            :DialogType="DialogType"
                            :index="index"
                            :row="row"
                            :title="title"
                            @clearRadio="clearRadio"
                         ></vk-add-location>
                    </li>

                    <li class="vk-btns">
                    </li>
                </ul>
            </div>

            <div style="position: relative" class="map">
                <div id="container" class="amap" style="width: 100%;height: 100%">
                </div>
                <statistic-window
                    v-if="statistic.windowShow"
                    class="stc-window-style"
                    :title="statistic.title"
                    :data="statistic.data"
                ></statistic-window>
                <float-window
                    ref="floatWindow"
                    :propData="poiList"
                    :propDisabled="isCounty"
                    :propAreaChange="onBusinessAreaChange"
                    :coverageRadius="filter.coverageRadius"
                    :houseType="filter.houseType"
                    :propDrawCompanyPoint="drawCompanyPoint"
                    :city="city"
                    @floatWindowState="onWindowState"
                    @hoverColumn="highOverflow"
                    @leaveColumn="lowOverflow"
                ></float-window>
            </div>
        </div>
    </div>
</template>

<script>
import dict, { LOCATION_TYPE, COVERAGE_RADIUSENUM } from "@/net/dict.js";
import { getLabelStyle, getPointSvg } from "@/util/mapUtils.js";
import location from "@/generated/location.json";
import floatWindow from "./floatWindow.vue";
import statisticWindow from "./statisticWindow.vue";
import mapMixin from "@/mixins/map-mixins.js";
import AMap from "AMap";
export default {
    name: "hello",
    data() {
        return {
            getPointSvg,
            poiList: [],
            filter: {
                houseType: 1
            },
            statistic: {
                windowShow: false,
                title: "",
                data: {}
            },
            switchVal: false, // 锁定为false，添加为true
            radio: 0, // 输入地址添加定位为1，点击地图添加定位为2
            dialogVisible: false,
            DialogType: null,
            index: null,
            title: null,
            countys: null,
            locationAddress: null,
            addressComponent: null
        };
    },

    components: {
        floatWindow,
        statisticWindow
    },

    mixins: [mapMixin],

    asyncComputed: {
        allhouseType() {
            return [
                { code: 1, codeText: "一室" },
                { code: 2, codeText: "二室" },
                { code: 3, codeText: "三室" },
                { code: 4, codeText: "四室" }
            ];
        }
    },

    computed: {
        row() {
            return {
                mapType: "house_rent",
                locationType: this.filter.locationType,
                locationName: null,
                locationAddress: this.locationAddress,
                addressComponent: this.addressComponent,
                country: null,
                countys: this.countys,
                id: null,
                lng: this.lng,
                lat: this.lat
            };
        }
    },

    watch: {
        city(val) {
            this.refreshMap();
        },
        "$store.state.month"(val) {
            this.readData();
        }
    },

    methods: {
        clearRadio() {
            this.radio = 0;
        },
        // 点击地图获取经纬度，弹出弹窗
        async mapClickNewPosition(e) {
            if (this.DialogType === "MAP" && this.radio === 2) {
                this.lng = e.lnglat.getLng();
                this.lat = e.lnglat.getLat();
                const point = [this.lng, this.lat];
                await this.geocoder.getAddress(point, (status, result) => {
                    if (status === "complete" && result.info === "OK") {
                        this.locationAddress = result.regeocode.formattedAddress;
                        this.addressComponent = result.regeocode.addressComponent;
                        this.dialogVisible = true;
                    }
                });
            }
        },
        async getCountys(val) {
            const countyRes = await this.$request({
                url: this.$api.districts_getCityByProvince,
                method: "get",
                params: {
                    province: this.$store.state.city
                }
            });
            this.countys = countyRes.data;
        },
        // 按地址或按点击地图添加定位点
        onAdd(val) {
            if (val === 1) {
                this.lng = null;
                this.lat = null;
                this.DialogType = "ADRESS";
                this.dialogVisible = true;
            } else if (val === 2) {
                this.DialogType = "MAP";
            }
            this.title = "新增定位点";
        },
        // 是否开启添加定位点功能
        switchChane() {
            if (this.switchVal) {
                this.$refs.bimSwitch.style.transform = "translateX(4px)";
                this.switchVal = false;
                this.radio = 0;
                this.DialogType = "ADRESS";
            } else {
                this.$refs.bimSwitch.style.transform = "translateX(33px)";
                this.switchVal = true;
            }
        },
        onhouseTypeChange(e) {
            this.filter.houseType = e;
            this.filterChange();
        },

        onWindowState(state) {
            if (state === "init") {
                this.onBusinessAreaChange();
                this.statistic.windowShow = false;
            } else {
                this.statistic.windowShow = true;
            }
        },

        //根据获取数据画圆
        handerMarkerLabel(data) {
            this.map.clearMap();
            const markers = [];
            data.forEach((item, index) => {
                const point = this.isCounty ? [item.lng, item.lat] : [item.location.lng, item.location.lat];
                const title = this.isCounty ? item.countyName : item.location.locationName;
                if (!this.isCounty) {
                    this.makeCircle(point, item.roomCharge);
                }
                markers.push(new AMap.Marker({
                    position: point,
                    offset: new AMap.Pixel(-40, -40),
                    content: this.getText(item, title)
                }));
            });
            if (this.markerClusterer) {
                this.markerClusterer.setMap(null);
            }
            this.markerClusterer = new AMap.MarkerClusterer(this.map, markers, {
                gridSize: 80
            });
        },

        makeCircle(point, data) {
            let cicrleColor = "#00FF7F";
            let fillOpacity = 0.5;
            const radis = parseFloat(this.filter.coverageRadius) * 1000;
            let lowPrice = 0;
            let highPrice = 0;
            if (this.filter.houseType === 1) {
                lowPrice = 1500;
                highPrice = 2500;
            } else if (this.filter.houseType === 2) {
                lowPrice = 2500;
                highPrice = 4500;
            } else {
                lowPrice = 3000;
                highPrice = 5000;
            }
            if (Number(data) <= lowPrice) {
                cicrleColor = "#00FF7F";
            } else if (Number(data) > lowPrice && Number(data) <= highPrice) {
                cicrleColor = "#FFC125";
            } else {
                cicrleColor = "#FF0000";
            }
            if (!data) {
                cicrleColor = "black";
                fillOpacity = 0.1;
            }
            const circle = new AMap.Circle({
                center: point, // 圆心位置
                radius: radis, //半径
                strokeColor: "transparent", //线颜色
                strokeOpacity: 0, //线透明度
                strokeWeight: 0, //线粗细度
                fillColor: cicrleColor, //填充颜色
                fillOpacity: fillOpacity //填充透明度
            });
            circle.setMap(this.map);
        },

        backTop() {
            this.readData();
            // this.map.clearOverlays();
            // this.markerClusterer.clearMarkers();
            this.map.clearMap();
        },

        getParams() {
            if (this.isCounty) {
                return {
                    city: this.city,
                    startTime: this.$store.state.month.startMonth,
                    endTime: this.$store.state.month.endMonth,
                    houseType: this.filter.houseType
                };
            } else {
                return {
                    locationType: this.filter.locationType,
                    coverageRadius: this.filter.coverageRadius,
                    houseType: this.filter.houseType,
                    city: this.city,
                    startTime: this.$store.state.month.startMonth,
                    endTime: this.$store.state.month.endMonth
                };
            }
        },
        // 单个文本编写
        getText(item, title) {
            const avgPrice = !item.roomCharge ? "暂无数据" : this.$utils.formatFloat2(item.roomCharge) + "元";
            const area = !item.area ? "暂无数据" : this.$utils.formatFloat2(item.area);
            const txt = `<p class="circleTitle">${title}</p>
                          租房数: ${item.houseNum}间</br>
                          平均价格: ${avgPrice}</br>
                          平均面积: ${area}㎡
                          `;
            return txt;
        },

        afterAreaChange(data) {
            const type = this.allhouseType.find((house) => {
                return house.code === this.filter.houseType;
            });
            this.statistic.title = data.location.locationName + " " + type.codeText;
            this.$request({
                url: this.$api.house_rent_location_count,
                method: "get",
                params: {
                    locationId: data.locationId,
                    coverageRadius: this.filter.coverageRadius,
                    houseType: this.filter.houseType,
                    city: this.city
                }
            }).then((res) => {
                this.statistic.data = res.data;
            }).catch((err) => {
                this.$logger.error("err", err.message);
            });
        },
        // 获取定位点列表信息
        getLocationPosition() {
            this.readData();
        }

    },

    created() {
        this.mainKey = "roomCharge";
        // 按区县统计的url
        this.districtLabelUrl = this.$api.house_rent_poi_county_list;
    },

    mounted: function () {
        // 地址坐标转换
        this.initState();
        this.url = this.$api.house_rent_poi_list;
        this.getCountys();
    }
};
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style lang="less" scoped>
@import "~@/assets/less/vankely/POI/index.less";
</style>
<style media="screen">
.circleTitle {
  font-weight: bold;
}
</style>
