<template>
    <div>
        <div class="breadcrumb">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>停车场地图</el-breadcrumb-item>
                <el-breadcrumb-item>POI展示</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <div class="vk-list">
            <div>
                <ul class="vk-tools-bar vk-tools-map">
                    <li class="filter">
                        <el-select class="search-select" :value="filter.depotType" @input="onDepotTypeChange" placeholder="车场类型">
                            <el-option v-for="item in allDepotType" :key="item.code" :label="item.desc" :value="item.code"></el-option>
                        </el-select>
                        <el-select class="search-select" :value="filter.depotQuality" @input="onDepotQualityChange" placeholder="车场质量">
                            <el-option v-for="item in allDepotQuality" :key="item.code" :label="item.desc" :value="item.code"></el-option>
                        </el-select>
                        <div class="addPositonWrapper">
                            <div class="bimHeaderSwitch select">
                                <div :class="{ 'active': switchVal }">锁定</div>
                                <div class="bimSwitch" @click="switchChane">
                                    <div class="bimSwitchIcon" ref="bimSwitch"></div>
                                </div>
                                <div :class="{ 'active': switchVal }">添加</div>
                            </div>
                            <div class="redioWrapper" v-if="switchVal">
                                <el-radio-group v-model="radio" @change="onAdd">
                                    <el-radio :label="1">输入地址添加定位</el-radio>
                                    <el-radio :label="2">点击地图添加定位</el-radio>
                                </el-radio-group>
                            </div>
                        </div>
                         <add-window
                            v-if="dialogVisible"
                            :visible.sync="dialogVisible"
                            @addFinish = "getLocationPosition"
                            :DialogType="DialogType"
                            :row="row"
                            :title="title"
                            @clearRadio="clearRadio"
                         ></add-window>
                         <edit-window
                            v-if="editDialogVisible"
                            :visible.sync="editDialogVisible"
                            @addFinish="getLocationPosition"
                            :parkingId="parkingId"
                            :title="title"
                         ></edit-window>
                    </li>
                    <li class="vk-btns">
                    </li>
                </ul>
            </div>

            <div style="position: relative" class="map">
                <div id="container" style="width: 100%;height: 100%"></div>
                <float-window
                    ref="parkingFloatWindow"
                    :propData="propData"
                    @isShowChange="isShowChange"
                    @editPropData="editPropData"
                />
                <div class="colors-list">
                    <ul>
                        <li>
                            <div class="left">
                                <div class="circle-first"></div>
                            </div>
                            <div class="right">质量好</div>
                        </li>
                        <li>
                            <div class="left">
                                <div class="circle-second"></div>
                            </div>
                            <div class="right">质量适中</div>
                        </li>
                        <li>
                            <div class="left">
                                <div class="circle-third"></div>
                            </div>
                            <div class="right">质量差</div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import dict, { DEPOT_TYPE, DEPOT_QUALITY } from "@/net/dict.js";
import mapMixin from "@/mixins/map-mixins.js";
import AMap from "AMap";
import floatWindow from "./floatWindow.vue";
import addWindow from "./addWindow.vue";
import editWindow from "./editWindow.vue";
export default {
    name: "hello",
    data() {
        return {
            poiList: [],
            filter: {
                depotType: null,
                depotQuality: null
            },
            propData: null,
            switchVal: false, // 锁定为false，添加为true
            radio: 0, // 输入地址添加定位为1，点击地图添加定位为2
            dialogVisible: false,
            editDialogVisible: false,
            simpleCompetitorDialogVisible: false, // 右侧的简单信息弹窗
            DialogType: null,
            index: null,
            title: null,
            countys: null,
            formattedAddress: null,
            addressComponent: null,
            parkingId: null
        };
    },

    computed: {
        row() {
            return {
                mapType: "depot",
                locationType: this.filter.locationType,
                locationName: null,
                formattedAddress: this.formattedAddress,
                addressComponent: this.addressComponent,
                country: null,
                countys: this.countys,
                id: null,
                lng: this.lng,
                lat: this.lat,
                depotType: this.filter.depotType,
                depotQuality: this.filter.depotQuality
            };
        }
    },

    components: {
        floatWindow,
        addWindow,
        editWindow
    },

    mixins: [mapMixin],

    asyncComputed: {
        allDepotType: async function () {
            const res = await dict.getDictByType(DEPOT_TYPE);
            if (!res) {
                return [];
            }
            const arr = res.map((item) => {
                return { desc: item.codeText, code: item.code };
            });
            return arr;
        },
        allDepotQuality: async function () {
            const res = await dict.getDictByType(DEPOT_QUALITY);
            if (!res) {
                return [];
            }
            const arr = res.map((item) => {
                return { desc: item.codeText, code: item.code };
            });
            return arr;
        }
    },
    watch: {
        editDialogVisible(val) {
            this.$logger.log("editDialogVisible", val);
        }
    },

    methods: {
        // 编辑选中的定位点信息
        async editPropData(propData) {
            this.parkingId = propData.id;
            this.title = "编辑停车场信息";
            this.simpleCompetitorDialogVisible = false;
            this.editDialogVisible = true;
        },
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
                        this.formattedAddress = result.regeocode.formattedAddress;
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
        onAdd(val) {
            if (val === 1) {
                this.lng = null;
                this.lat = null;
                this.DialogType = "ADRESS";
                this.dialogVisible = true;
            } else if (val === 2) {
                this.DialogType = "MAP";
            }
            this.title = "新增停车场信息";
        },
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
        onDepotTypeChange(e) {
            this.filter.depotType = e;
            this.filterChange();
        },
        onDepotQualityChange(e) {
            this.filter.depotQuality = e;
            this.filterChange();
        },
        isShowChange(val) {
            // if (!val) {
            //     this.resetMarkerStatus();
            // }
        },
        // 绘制地图上的点
        drawCompanyPoint() {
            this.map.remove(this.overflowMarkers);
            this.overflowMarkers = [];
            this.poiList.forEach((item, index) => {
                const position = [item.lng, item.lat];
                let contentClass;
                if (item.quality === "depot_bad") {
                    contentClass = "iconImg_default1";
                } else if (item.quality === "depot_moderation") {
                    contentClass = "iconImg_default2";
                } else {
                    contentClass = "iconImg_default3";
                }
                const content = `<div class="iconImg ${contentClass}">${index + 1}</div>`;
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
                marker.on("mouseout", this.mouseout);
                marker.on("click", () => {
                    this.markerClick(item, index, marker);
                });
            });
            if (this.markerClusterer) {
                this.markerClusterer.setMap(null);
            }
            // this.markerClusterer = new AMap.MarkerClusterer(this.map, this.overflowMarkers, {
            //     gridSize: 80
            // });
        },
        // 鼠标靠进点时触发
        mouseover(item, index, marker) {
            const position = [item.lng, item.lat];
            const name = item.name ? item.name : "暂无数据";
            const parkingNumber = item.parkingNumber ? item.parkingNumber : "暂无数据";
            const load = item.load ? item.load + "%" : "暂无数据";
            const content = `<div class="info_window"><div class="info_title">${name}</div>
                                 <div class="detail">车位数：${parkingNumber}</div>
                                 <div class="last_detail">负载率：${load}</div></div>`;
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
                if (item.quality === "depot_bad") {
                    contentClass = "iconImg_hover1";
                } else if (item.quality === "depot_moderation") {
                    contentClass = "iconImg_hover2";
                } else {
                    contentClass = "iconImg_hover3";
                }
                const content1 = `<div class="iconImg ${contentClass}">${index + 1}</div>`;
                marker.setContent(content1);
            }
        },
        // 鼠标移出点时触发
        mouseout(e) {
            this.infoWindow.close();
            // hover移出未有点击状态的当前marker更新状态，其余marker点击状态等不改变
            const str = e.target.Uh.contentDom.children[0].className;
            if (str.indexOf("iconImg_click") < 0) {
                const index = e.target.Uh.contentDom.children[0].innerHTML;
                const contentClass = "iconImg_default" + str.substr(str.length - 1, 1);
                const content = `<div class="iconImg ${contentClass}">${index}</div>`;
                e.target.setContent(content);
            }
        },
        markerClick(item, index, marker) {
            this.propData = item;
            this.propData.index = index;
            let contentClass;
            this.infoWindow.close();
            if (!this.simpleCompetitorDialogVisible) {
                this.$refs.parkingFloatWindow.onShow();
                this.simpleCompetitorDialogVisible = true;
            }
            this.resetMarkerStatus();
            // 将当前点击对象的icon更新
            if (item.quality === "depot_bad") {
                contentClass = "iconImg_click1 iconImg_click";
            } else if (item.quality === "depot_moderation") {
                contentClass = "iconImg_click2 iconImg_click";
            } else {
                contentClass = "iconImg_click3 iconImg_click";
            }
            const content = `<div class="iconImg ${contentClass}">${index + 1}</div>`;
            marker.setContent(content);
        },
        parkingWindowRemove() {
            if (this.simpleCompetitorDialogVisible) {
                this.$refs.parkingFloatWindow.onHiddenWindow();
                this.simpleCompetitorDialogVisible = false;
            }
        },
        // 重置icon为默认您状态
        resetMarkerStatus() {
            let contentClass;
            this.overflowMarkers.forEach((m, i) => {
                if (this.poiList[i].quality === "depot_bad") {
                    contentClass = "iconImg_default1";
                } else if (this.poiList[i].quality === "depot_moderation") {
                    contentClass = "iconImg_default2";
                } else {
                    contentClass = "iconImg_default3";
                }
                const content = `<div class="iconImg ${contentClass}">${i + 1}</div>`;
                m.setContent(content);
            });
        },

        async readData() {
            const res = await this.$request({
                url: this.$api.depot_list,
                method: "get",
                params: {
                    depotType: this.filter.depotType,
                    depotQuality: this.filter.depotQuality,
                    city: this.city
                }
            });
            this.poiList = res.data;
            this.drawCompanyPoint();
        },
        // 获取定位点列表信息
        getLocationPosition() {
            this.readData();
        }
    },

    created() {
        this.mapType = "depot";
    },

    mounted: function () {
        this.initState();
    }
};
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style lang="less" scoped>
@import "~@/assets/less/vankely/POI/index.less";
.add-window {
  .list {
    margin-bottom: 20px;
    .title {
      font-size: 13px;
    }
  }
}
.colors-list {
  position: absolute;
  left: 10px;
  bottom: 10px;
  width: 118px;
  height: 113px;
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
          background: #1cbcb4;
        }
        .circle-second {
          background: #f8a922;
        }
        .circle-third {
          background: #898989;
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
