<template>
    <div>
        <div class="breadcrumb">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>酒店地图</el-breadcrumb-item>
                <el-breadcrumb-item>POI展示</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <div class="vk-list">
            <div>
                <ul class="vk-tools-bar vk-tools-map">
                    <li class="filter">
                        <el-select class="search-select" v-model="filter.locationType" @input="onTypeChange">
                            <el-option v-for="item in allType" :key="item.code" :label="item.desc" :value="item.code"></el-option>
                        </el-select>
                        <el-select :disabled="isCounty" class="search-select" v-model="filter.coverageRadius" @input="onRadiusChange">
                            <el-option v-for="item in allRadius" :key="item.code" :label="item.desc" :value="item.code"></el-option>
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
                <float-window
                    ref="floatWindow"
                    :propData = "poiList"
                    :propDisabled="isCounty"
                    :propAreaChange = "onBusinessAreaChange"
                    :coverageRadius = "filter.coverageRadius"
                    :propDrawCompanyPoint ="drawCompanyPoint"
                    :city="city"
                    @hoverColumn="highOverflow"
                    @leaveColumn="lowOverflow"
                ></float-window>
            </div>
        </div>
    </div>
</template>

<script>
import mapMixin from "@/mixins/map-mixins.js";
import { getLabelStyle, getPointSvg } from "@/util/mapUtils.js";
import location from "@/generated/location.json";
import floatWindow from "./floatWindow.vue";
import AMap from "AMap";
export default {
    name: "hello",
    data() {
        return {
            getPointSvg,
            poiList: [],
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

    mixins: [mapMixin],

    components: {
        floatWindow
    },

    watch: {
    },

    computed: {
        row() {
            return {
                mapType: "hotel",
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
        //根据获取数据画圆
        handerMarkerLabel(data) {
            this.map.clearMap();
            const markers = [];
            data.forEach((item, index) => {
                const point = this.isCounty ? [item.lng, item.lat] : [item.location.lng, item.location.lat];
                const title = this.isCounty ? item.countyName : item.location.locationName;
                const txt1 = this.isCounty ? item.averagePrice : item.lowestPrice;
                if (!this.isCounty) {
                    this.makeCircle(point, item.lowestPrice);
                }
                markers.push(new AMap.Marker({
                    position: point,
                    offset: new AMap.Pixel(-40, -40),
                    content: this.getText(item, title, txt1)
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
            if (Number(data) <= 200) {
                cicrleColor = "#00FF7F";
            } else if (Number(data) > 200 && Number(data) <= 400) {
                cicrleColor = "#FFC125";
            } else {
                cicrleColor = "#FF0000";
            }
            if (!data) {
                cicrleColor = "black";
                fillOpacity = 0.1;
            }
            const circle = new AMap.Circle({ // 新增
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

        getParams() {
            if (this.isCounty) {
                return {
                    city: this.city
                };
            } else {
                return {
                    locationType: this.filter.locationType,
                    coverageRadius: this.filter.coverageRadius,
                    city: this.city
                };
            }
        },
        // 单个文本编写
        getText(item, title, txt1) {
            const lowestPrice = !txt1 ? "暂无数据" : this.$utils.formatFloat2(txt1) + "元";
            const closeRate = !item.closeRate ? "暂无数据" : this.$utils.formatFloat2(item.closeRate) + "%";
            const txt = `<p class="circleTitle">${title}</p>
                          酒店数量: ${item.hotelNum}家</br>
                          平均价格: ${lowestPrice}</br>
                          平均关店率: ${closeRate}
                          `;
            return txt;
        },
        // 获取定位点列表信息
        getLocationPosition() {
            this.readData();
        }

    },

    created() {
        this.mainKey = "lowestPrice";
        // 按区县统计的url
        this.districtLabelUrl = this.$api.hotel_poi_county_list;
    },

    mounted: function () {
        this.initState();
        this.url = this.$api.hotel_poi_list;
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
