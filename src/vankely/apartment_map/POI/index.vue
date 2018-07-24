<template>
    <div :class="['apartment_map', { 'apartment_map_competitor': filter.locationType==='competitor' }]">
        <div class="breadcrumb">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>公寓地图</el-breadcrumb-item>
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
                        <div class="addPositonWrapper" v-if="filter.locationType==='trading_area'||filter.locationType==='traffic_hub'||filter.locationType==='competitor'">
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
                                <el-radio-group v-model="radio" @change="onAddCompetitor" v-if="filter.locationType==='competitor'">
                                    <el-radio :label="1">输入地址添加定位</el-radio>
                                    <el-radio :label="2">点击地图添加定位</el-radio>
                                </el-radio-group>
                            </div>
                        </div>
                        <add-competitor-window
                            v-if="competitorDialogVisible"
                            :visible.sync="competitorDialogVisible"
                            @addFinish = "readCompetitorData"
                            :CompetitorDialogType="CompetitorDialogType"
                            :competitorRow="competitorRow"
                            :title="title"
                            @clearRadio="clearRadio"
                         ></add-competitor-window>
                        <edit-add-competitor-window
                            v-if="editCompetitorDialogVisible"
                            :visible.sync="editCompetitorDialogVisible"
                            @addFinish = "readCompetitorData"
                            :CompetitorDialogType="CompetitorDialogType"
                            :ids="competitorId"
                            :title="title"
                            @clearRadio="clearRadio"
                         ></edit-add-competitor-window>
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
                <div id="container" class="amap" style="width: 100%;height: 100%"></div>
                <float-window
                    ref="floatWindow"
                    :propData="poiList"
                    :propDisabled="isCounty"
                    :propAreaChange="onBusinessAreaChange"
                    :coverageRadius="filter.coverageRadius"
                    :locationType="filter.locationType"
                    :propDrawCompanyPoint="drawCompanyPoint"
                    :city="city"
                    :clickMapStatus="clickMapStatus"
                    :pointByClick="pointByClick"
                    @floatWindowState="onWindowState"
                    @hoverColumn="highOverflow"
                    @leaveColumn="lowOverflow"
                    @onClickDetail="onClickDetail"
                    v-if="!isCompetitor"
                ></float-window>
                <competitor-float-window
                    ref="competitorFloatWindow"
                    :propData="propData"
                    @isShowChange="isShowChange"
                    @editPropData="editPropData"
                />
                <div class="colors-list" v-if="filter.locationType==='competitor'">
                    <ul>
                        <li>
                            <div class="left">
                                <div class="circle-first"></div>
                            </div>
                            <div class="right">万科自营</div>
                        </li>
                        <li>
                            <div class="left">
                                <div class="circle-second"></div>
                            </div>
                            <div class="right">国企运营</div>
                        </li>
                        <li>
                            <div class="left">
                                <div class="circle-third"></div>
                            </div>
                            <div class="right">私企运营</div>
                        </li>
                        <li>
                            <div class="left">
                                <div class="circle-fourth"></div>
                            </div>
                            <div class="right">民营</div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import dict, { LOCATION_TYPE, COVERAGE_RADIUSENUM } from "@/net/dict.js";
import { getLabelStyle, getPointSvg } from "@/util/mapUtils.js";
import location from "@/generated/location.json";
import floatWindow from "./floatWindow.vue";
import competitorFloatWindow from "./competitorFloatWindow.vue";
import addCompetitorWindow from "./addCompetitorWindow.vue";
import editAddCompetitorWindow from "./editAddCompetitorWindow.vue";
import mapMixin from "@/mixins/map-mixins.js";
import AMap from "AMap";
export default {
    name: "hello",
    data() {
        return {
            competitorId: null,
            getPointSvg,
            poiList: [],
            poiListCompetitor: [],
            statistic: {
                windowShow: false
            },
            clickMapStatus: true,
            switchVal: false, // 锁定为false，添加为true
            radio: 0, // 输入地址添加定位为1，点击地图添加定位为2
            dialogVisible: false,
            DialogType: null, // 一般情况下，添加定位点的类型，按地址或点击地图
            CompetitorDialogType: null, // 选中公寓竞品情况下，添加定位点的类型，按地址或点击地图
            index: null,
            title: null,
            countys: null,
            competitorDialogVisible: false, // 公寓竞品的弹窗
            editCompetitorDialogVisible: false, // 公寓竞品的编辑弹窗
            simpleCompetitorDialogVisible: false, // 公寓竞品右侧的简单信息弹窗
            propData: {
                ids: [],
                name: null,
                operationSubject: null,
                brand: null,
                province: null,
                city: null,
                county: null,
                address: null,
                lng: this.lng,
                lat: this.lat,
                apartments: [{
                    webId: 0,
                    id: null,
                    houseType: null,
                    minArea: null,
                    maxArea: null,
                    areaRange: null,
                    minPrice: null,
                    maxPrice: null,
                    priceRange: null,
                    surplusNum: null,
                    attachmentIds: [],
                    fileArray: [],
                    sourceState: null// 0和null是爬虫，1是人工
                }]
            },
            locationAddress: null,
            addressComponent: null
        };
    },

    computed: {
        row() {
            return {
                mapType: "apartment",
                locationType: this.filter.locationType,
                locationName: null,
                locationAddress: this.locationAddress,
                addressComponent: this.addressComponent,
                country: null,
                countys: this.countys,
                id: null,
                lng: this.lng,
                lat: this.lat,
                circles: null
            };
        },
        competitorRow() {
            return {
                ids: [],
                name: null,
                operationSubject: null,
                brand: null,
                province: "350000",
                city: this.$store.state.city,
                county: null,
                address: null,
                lng: this.lng,
                lat: this.lat,
                locationAddress: this.locationAddress,
                addressComponent: this.addressComponent,
                apartments: [{
                    webId: 0,
                    id: null,
                    houseType: null,
                    minArea: null,
                    maxArea: null,
                    areaRange: null,
                    minPrice: null,
                    maxPrice: null,
                    priceRange: null,
                    surplusNum: null,
                    attachmentIds: [],
                    fileArray: [],
                    sourceState: null// 0和null是爬虫，1是人工
                }]
            };
        }
    },
    components: {
        floatWindow,
        addCompetitorWindow,
        editAddCompetitorWindow,
        competitorFloatWindow
    },

    mixins: [mapMixin],

    asyncComputed: {
        allType: async function () {
            const res = await dict.getDictByType(LOCATION_TYPE);
            if (!res) {
                return [];
            }
            const arr = res.map((item) => {
                return { desc: item.codeText, code: item.code };
            });
            arr.push({ desc: "点击地图定位", code: "click" });
            arr.push({ desc: "按区县", code: "county" });
            arr.push({ desc: "公寓竞品", code: "competitor" });
            return arr;
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
        // 点击地图获取经纬度，弹出弹窗
        async competitorMapClickNewPosition(e) {
            if (this.CompetitorDialogType === "COMPETITOR_MAP" && this.radio === 2) {
                this.lng = e.lnglat.getLng();
                this.lat = e.lnglat.getLat();
                const point = [this.lng, this.lat];
                await this.geocoder.getAddress(point, (status, result) => {
                    if (status === "complete" && result.info === "OK") {
                        this.locationAddress = result.regeocode.formattedAddress;
                        this.addressComponent = result.regeocode.addressComponent;
                        this.competitorDialogVisible = true;
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
                // this.CompetitorDialogType = "COMPETITOR_ADRESS";
                this.dialogVisible = true;
            } else if (val === 2) {
                this.DialogType = "MAP";
                // this.CompetitorDialogType = "COMPETITOR_MAP";
            }
            this.title = "新增定位点";
        },
        // 公寓竞品,按地址或按点击地图添加定位点
        onAddCompetitor(val) {
            if (val === 1) {
                this.lng = null;
                this.lat = null;
                this.CompetitorDialogType = "COMPETITOR_ADRESS";
                this.competitorDialogVisible = true;
            } else if (val === 2) {
                this.CompetitorDialogType = "COMPETITOR_MAP";
            }
            this.title = "新增公寓竞品";
        },
        // 是否开启添加定位点功能
        switchChane() {
            if (this.switchVal) {
                this.$refs.bimSwitch.style.transform = "translateX(4px)";
                this.switchVal = false;
                this.radio = 0;
                this.DialogType = "ADRESS";
                this.CompetitorDialogType = "COMPETITOR_ADRESS";
            } else {
                this.$refs.bimSwitch.style.transform = "translateX(33px)";
                this.switchVal = true;
            }
        },
        // 公寓竞品,编辑选中的定位点信息
        editPropData(propData) {
            this.competitorId = this.propData.ids;
            this.CompetitorDialogType = "COMPETITOR_EDIT";
            this.title = "编辑公寓竞品";
            this.editCompetitorDialogVisible = true;
            this.simpleCompetitorDialogVisible = false;
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
                    this.makeCircle(point, item.averagePrice);
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

            if (Number(data) <= 1800) {
                cicrleColor = "#00FF7F";
            } else if (Number(data) > 1800 && Number(data) <= 2400) {
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

        backTop() {
            this.readData();
            // this.map.clearOverlays();
            // this.markerClusterer.clearMarkers();
            this.map.clearMap();
        },

        getParams() {
            if (this.isCounty || this.isCompetitor) {
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
        getText(item, title) {
            const txt = `<p class="circleTitle">${title}</p>
                          公寓家数: ${item.apartmentNum}家</br>
                          平均租金: ${item.averagePrice}元</br>
                          平均面积: ${item.averageArea}㎡
                          `;
            return txt;
        },

        // 点击地图定位
        mapClick(e) {
            if (this.filter.locationType === "click") {
                this.$confirm("确定以此为圆心, " + this.filter.coverageRadius + "公里为半径画圆吗?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then((res) => {
                    this.$refs.floatWindow.resetListState();
                    this.pointByClick = e.lnglat;
                    this.getLocationCity(this.pointByClick);
                    this.clickMapStatus = true;
                }).catch((err) => {
                    this.$logger.log("err", err);
                });
            }
        },
        onClickDetail(val) {
            this.map.clearMap();
            const point = [this.pointByClick.lng, this.pointByClick.lat];
            const circle = this.makeCircle(point, val.averagePrice);
            this.$refs.floatWindow.readList();
        },
        // 获取定位点列表信息
        getLocationPosition() {
            this.readData();
        },
        // 绘制地图上的点
        drawCompanyPoint() {
            if (this.markerClusterer) {
                this.markerClusterer.setMap(null);
            }
            this.map.remove(this.overflowMarkers);
            this.overflowMarkers = [];
            let contentClass;
            this.poiListCompetitor.forEach((item, index) => {
                const position = [item.lng, item.lat];
                if (item.operationSubject === "民营") {
                    contentClass = "apartment_iconImg_default1";
                } else if (item.operationSubject === "私企运营") {
                    contentClass = "apartment_iconImg_default2";
                } else if (item.operationSubject === "万科自营") {
                    contentClass = "apartment_iconImg_default3";
                } else if (item.operationSubject === "国企运营") {
                    contentClass = "apartment_iconImg_default4";
                } else {
                    contentClass = "apartment_iconImg_default1";
                }
                const content = `<div class="iconImg ${contentClass}"></div>`;
                const marker = new AMap.Marker({
                    map: this.map,
                    position: position,
                    content: content
                });
                this.overflowMarkers.push(marker);
                // 给marker添加鼠标移进移出事件
                marker.on("mouseover", (e) => {
                    this.mouseover(item, index, marker);
                });
                marker.on("mouseout", (e) => {
                    this.mouseout(e, item);
                });
                marker.on("click", () => {
                    this.markerClick(item, index, marker);
                });
            });
            // this.markerClusterer = new AMap.MarkerClusterer(this.map, this.overflowMarkers, {
            //     gridSize: 80
            // });
        },
        // 鼠标靠进点时触发
        mouseover(item, index, marker) {
            const position = [item.lng, item.lat];
            const name = item.name ? item.name : "暂无数据";
            const operationSubject = item.operationSubject ? item.operationSubject : "民营";
            const brand = item.brand ? item.brand : "暂无数据";
            const content = `<div class="info_window"><div class="info_title">${name}</div>
                                 <div class="detail">公寓类型：${operationSubject}</div>
                                 <div class="last_detail">品牌：${brand}</div></div>`;
            this.infoWindow = new AMap.InfoWindow({
                isCustom: true,
                content: content,
                offset: new AMap.Pixel(90, 110)
            });
            this.infoWindow.open(this.map, position);

            // hover到未有点击状态的marker时，更新状态
            const str = marker.Uh.contentDom.children[0].className;
            if (str.indexOf("iconImg_click") < 0) {
                let contentClass;
                if (item.operationSubject === "民营") {
                    contentClass = "apartment_iconImg_hover1";
                } else if (item.operationSubject === "私企运营") {
                    contentClass = "apartment_iconImg_hover2";
                } else if (item.operationSubject === "万科自营") {
                    contentClass = "apartment_iconImg_hover3";
                } else if (item.operationSubject === "国企运营") {
                    contentClass = "apartment_iconImg_hover4";
                } else {
                    contentClass = "apartment_iconImg_hover1";
                }
                const content1 = `<div class="iconImg ${contentClass}"></div>`;
                marker.setContent(content1);
            }
        },
        // 鼠标移出点时触发
        mouseout(e, item) {
            this.infoWindow.close();
            // hover移出未有点击状态的当前marker更新状态，其余marker点击状态等不改变
            const str = e.target.Uh.contentDom.children[0].className;
            if (str.indexOf("iconImg_click") < 0) {
                const index = e.target.Uh.contentDom.children[0].innerHTML;
                let contentClass;
                if (item.operationSubject === "民营") {
                    contentClass = "apartment_iconImg_default1";
                } else if (item.operationSubject === "私企运营") {
                    contentClass = "apartment_iconImg_default2";
                } else if (item.operationSubject === "万科自营") {
                    contentClass = "apartment_iconImg_default3";
                } else if (item.operationSubject === "国企运营") {
                    contentClass = "apartment_iconImg_default4";
                } else {
                    contentClass = "apartment_iconImg_default1";
                }
                const content = `<div class="iconImg ${contentClass}"></div>`;
                e.target.setContent(content);
            }
        },
        markerClick(item, index, marker) {
            this.propData = item;
            this.getImgInfo();
            // 将右侧信息窗口开启
            if (!this.simpleCompetitorDialogVisible) {
                this.$refs.competitorFloatWindow.onShow();
                this.simpleCompetitorDialogVisible = true;
            }
            this.resetMarkerStatus();
            // 将当前点击对象的icon更新
            let contentClass;
            if (item.operationSubject === "民营") {
                contentClass = "apartment_iconImg_click1";
            } else if (item.operationSubject === "私企运营") {
                contentClass = "apartment_iconImg_click2";
            } else if (item.operationSubject === "万科自营") {
                contentClass = "apartment_iconImg_click3";
            } else if (item.operationSubject === "国企运营") {
                contentClass = "apartment_iconImg_click4";
            } else {
                contentClass = "apartment_iconImg_click1";
            }
            const content = `<div class="iconImg ${contentClass}"></div>`;
            marker.setContent(content);
        },
        competitorMarkerRemove() {
            if (this.simpleCompetitorDialogVisible) {
                this.$refs.competitorFloatWindow.onHiddenWindow();
                this.simpleCompetitorDialogVisible = false;
            }
        },
        getImgInfo() {
            if (this.propData.apartments[0].attachmentIds) {
                this.propData.apartments.forEach((apartment, i) => {
                    const imgInfo = [];
                    apartment.attachmentIds.forEach((item, index) => {
                        this.$request({
                            url: this.$api.ali_attachmentId,
                            method: "get",
                            path: { attachmentId: item }
                        }).then(res => {
                            if (res && res.data) {
                                const obj = res.data;
                                obj.imgUrl = res.data.bucket && res.data.endpoint && res.data.alyId ? "http://" + res.data.bucket + "." + res.data.endpoint + "/" + res.data.alyId : "";
                                imgInfo.push(obj);
                            }
                        }).catch(err => {
                            this.$logger.log("err", err);
                        });
                    });
                    this.$set(apartment, "imgInfo", imgInfo);
                });
            }
        },
        async readCompetitorData() {
            this.map.clearMap();
            const res = await this.$request({
                url: this.$api.apartment_poi_query_competition,
                method: "get",
                params: {
                    city: this.city
                }
            });
            this.poiListCompetitor = res.data.apartmentCompetitionStatistics;
            this.drawCompanyPoint();
        },
        isShowChange(val) {
            // if (val) {
            //     this.resetMarkerStatus();
            // }
        },
        // 重置icon为默认您状态
        resetMarkerStatus() {
            let contentClass;
            this.overflowMarkers.forEach((item, index) => {
                if (this.poiListCompetitor[index].operationSubject === "民营") {
                    contentClass = "apartment_iconImg_default1";
                } else if (this.poiListCompetitor[index].operationSubject === "私企运营") {
                    contentClass = "apartment_iconImg_default2";
                } else if (this.poiListCompetitor[index].operationSubject === "万科自营") {
                    contentClass = "apartment_iconImg_default3";
                } else if (this.poiListCompetitor[index].operationSubject === "国企运营") {
                    contentClass = "apartment_iconImg_default4";
                } else {
                    contentClass = "apartment_iconImg_default1";
                }
                const content = `<div class="iconImg ${contentClass}"></div>`;
                item.setContent(content);
            });
        }
    },

    created() {
        this.mainKey = "averagePrice";
        // 按区县统计的url
        this.districtLabelUrl = this.$api.apartment_poi_county_list;
    },

    mounted: function () {
        // 地址坐标转换
        this.initState();
        this.url = this.$api.apartment_poi_list;
        this.getCountys();
    }
};
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style lang="less" scoped>
@import "~@/assets/less/vankely/POI/index.less";
.colors-list {
  position: absolute;
  left: 10px;
  bottom: 10px;
  width: 118px;
  height: 138px;
  padding: 20px;
  background: #fff;
  ul {
    li {
      display: flex;
      margin-bottom: 11px;
      &:last-child {
        margin-bottom: 0px;
      }
      .left {
        height: 10px;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 17px;
        & > div {
          width: 10px;
          height: 10px;
          border-radius: 50%;
        }
        .circle-first {
          background: #f75827;
        }
        .circle-second {
          background: #7550ff;
        }
        .circle-third {
          background: #ffbb12;
        }
        .circle-fourth {
          background: #37ce9f;
        }
      }
      .right {
        font-size: 12px;
        line-height: 17px;
        margin-left: 10px;
      }
    }
  }
}
</style>
<style media="screen">
.circleTitle {
  font-weight: bold;
}
</style>
