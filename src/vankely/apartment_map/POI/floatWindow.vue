<template>
    <div style="position: absolute;z-index: 999;right: 20px;top: 20px">
        <div v-show="state!=='detail' && clickMapStatus" class="main-box-style">
            <vk-select
                style="float: left"
                v-if="locationType !== 'click'"
                :propClass="selectClass"
                propLabel="区域选择"
                :options="selectOptions"
                :value="curArea"
                @input="onAreaInput"
            ></vk-select>
            <span v-if="state==='menu' && locationType !== 'click'"
                  style="float: right;
                  height: 46px;
                  line-height: 46px;
                  margin-right: 20px;
                  font-size: 13px;
                  color: #1CBCB4;"
            >共{{totalNum}}套</span>
            <ul v-if="locationType === 'click'" class="clickDetail">
                <li class="CDadress">{{clickDetail.addressByPoint}}</li>
                <li class="CDli">公寓家数:{{clickDetail.apartmentNum}}家</li>
                <li class="CDli">平均租金:{{clickDetail.averagePrice}}元</li>
                <li class="CDli">平均面积:{{clickDetail.averageArea}}㎡</li>
                <hr class="hr" v-if="total>0" />
                <windowList
                    clickClass = "clickList"
                    :subMenuHeight="subMenuHeight>150?subMenuHeight-150:subMenuHeight"
                    :roomList = "roomList"
                    :total = "total"
                    :toDetail = "toDetail"
                    :onColumnMouseEnter = "onColumnMouseEnter"
                    :onColumnMouseLeave = "onColumnMouseLeave"
                    :getPointSvg = "getPointSvg"
                    :onPageChange = "onPageChange"
                />
            </ul>
            <windowList
                v-show="state==='menu' && locationType !== 'click'"
                :subMenuHeight="subMenuHeight"
                :roomList = "roomList"
                :total = "total"
                :toDetail = "toDetail"
                :onColumnMouseEnter = "onColumnMouseEnter"
                :onColumnMouseLeave = "onColumnMouseLeave"
                :getPointSvg = "getPointSvg"
                :onPageChange = "onPageChange"
            />
        </div>
        <div v-if="state==='detail'">
            <div class="detail-title" @click="state='menu'">返回列表</div>
            <div class="detail-body" :style="{height:subMenuHeight + 'px'}">
                <header>
                    <img
                        class="img-style"
                        :src="getPointSvg(curCompanyIndex+1)"
                    >
                    <span style="margin-left: 10px">{{roomList[curCompanyIndex].name}}</span>
                </header>
                <div>品&emsp;&emsp;牌: {{roomList[curCompanyIndex].brand}}</div>
                <div v-for="(item, index) in roomList[curCompanyIndex].apartments" :key="index">
                  <div>户&emsp;&emsp;型: {{item.houseType}}</div>
                  <div>租金范围: {{item.priceRange}}元</div>
                  <div>面积范围: {{item.areaRange}}㎡</div>
                </div>
                <div>{{roomList[curCompanyIndex].address}}</div>
            </div>
        </div>
    </div>
</template>

<script>
import { getPointSvg } from "@/util/mapUtils.js";
import windowMixins from "@/mixins/floatWindow-mixins.js";
import windowList from "./floatWindowList";
const floatStates = {
    init: "init",
    menu: "menu",
    detail: "detail"
};
export default {
    name: "float-window",
    props: {
        propData: [Array],
        coverageRadius: [Number, String],
        locationType: [Number, String],
        propAreaChange: [Function],
        propDrawCompanyPoint: [Function],
        city: [Number, String],
        clickMapStatus: [Boolean],
        pointByClick: [Object],
        propDisabled: {
            type: Boolean,
            default: false
        }
    },

    mixins: [
        windowMixins
    ],

    data() {
        return {
            state: floatStates.init,

            getPointSvg,
            // 当前公司详情
            curCompanyIndex: {},
            //当前区域
            curArea: "",

            areaSelect: "",
            areaList: [],
            totalNum: null,
            businessList: [],
            roomList: [],
            //当前行业
            curBusinessIndex: null,
            // 点击地图定位
            clickDetail: {}
        };
    },

    watch: {
        state(val) {
            this.$emit("floatWindowState", val);
        }

    },

    computed: {
        selectClass() {
            return {
                "float-window-style": true,
                "isDisabled": this.propDisabled
            };
        },

        selectOptions() {
            const options = [{ label: "全部", value: "" }];
            this.propData.forEach((item) => {
                options.push({
                    label: item.location.locationName,
                    value: item.id
                });
            });
            return options;
        }
    },

    components: {
        windowList
    },

    methods: {
        changeState(state) {
            this.state = state;
        },

        toDetail(index) {
            this.state = floatStates.detail;
            this.curCompanyIndex = index;
        },

        readList() {
            let url = null;
            let params = null;
            if (this.locationType === "click") {
                url = this.$api.apartment_poi_page_mapLocation;
                params = {
                    lat: this.pointByClick.lat,
                    lng: this.pointByClick.lng,
                    coverageRadius: this.coverageRadius
                };
            } else {
                url = this.$api.apartment_poi_page_locationType;
                params = {
                    locationId: this.selectArea.locationId,
                    coverageRadius: this.coverageRadius,
                    locationType: this.locationType
                };
            }
            this.$request({
                url: url,
                method: "get",
                path: {
                    pageSize: this.pageSize,
                    pageNo: this.pageNo
                },
                params: params
            }).then((res) => {
                // this.state = floatStates.detail;
                this.roomList = res.rows;
                this.total = res.total;
                this.totalNum = this.total;
                this.propDrawCompanyPoint(this.roomList);
            }).catch((err) => {
                this.$logger.error("err", err.message);
            });
        },

        closeDropDown() {
            if (this.totalNum) {
                this.totalNum = null;
                this.propAreaChange();
                this.curArea = "";
            }
        },

        getImageSrc(itemIndex) {
            return getPointSvg(itemIndex);
        },

        onAreaInput(e) {
            this.curArea = e;
            //当选择全部时
            if (!e) {
                this.state = floatStates.init;
                this.propAreaChange();
                return;
            }
            this.selectArea = this.propData.find((item) => {
                return item.id === e;
            });
            this.resetListState();
            this.readList();
            this.state = floatStates.menu;
            this.propAreaChange(this.selectArea);
        },

        // 点击地图定位时详情
        getClickDetail(point, addressByPoint) {
            this.$request({
                url: this.$api.apartment_poi_map_list,
                method: "get",
                params: {
                    lat: point.lat,
                    lng: point.lng,
                    coverageRadius: this.coverageRadius
                }
            }).then((res) => {
                this.clickDetail = res.data[0];
                this.clickDetail.addressByPoint = addressByPoint;
                this.$emit("onClickDetail", this.clickDetail);
            }).catch((err) => {
                this.$logger.log("err", err.message);
            });
        }
    },

    mounted() {
    },

    created() {

    }
};
</script>

<style lang="less">
@import "~@/assets/less/vankely/POI/floatWindow.less";
</style>
