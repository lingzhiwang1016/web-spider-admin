<template>
    <div style="position: absolute;z-index: 999;right: 20px;top: 20px">
        <div v-show="!isDetail" class="main-box-style">
            <vk-select
                style="float: left"
                :propClass="selectClass"
                propLabel="区域选择"
                :options="selectOptions"
                :value="curArea"
                @input="onAreaInput"
                @onHeaderClick="onVkSelectClick"
            ></vk-select>
            <span v-if="totalNum"
                  style="float: right;
                  height: 46px;
                  line-height: 46px;
                  margin-right: 20px;
                  font-size: 13px;
                  color: #1CBCB4;"
            >共{{totalNum}}家酒店</span>
            <div v-if="totalNum" class="spread-list">
                <el-menu
                    ref="elMenu"
                    style="overflow-y: scroll;"
                    @open="onOpen"
                    @close="onClose"
                    :unique-opened="true"
                    :style="{height:subMenuHeight + 'px'}"
                >
                    <el-submenu
                        v-for="(business,itemIndex) in businessList"
                        :key="itemIndex"
                        :index="itemIndex+''"
                        style="padding-left: 0px"
                    >
                        <template slot="title">
                            <div
                                style="width:215px;
                                height:36px;
                                line-height: 36px;
                                padding-left: 10px;
                                overflow-x: hidden"
                            >{{business.hotelType}}({{business.hotelNum}}家)
                            </div>
                        </template>
                        <div v-if="itemIndex==curBusinessIndex" slot style="width: 100%;text-align: center">
                            <div v-for="(company,cmpIndex) in companyList"
                                 :key="cmpIndex"
                                 class="inner-list-item"
                                 @click="toDetail(cmpIndex)"
                                 @mouseenter="onColumnMouseEnter(cmpIndex)"
                                 @mouseleave="onColumnMouseLeave(cmpIndex)"
                            >
                                <header>
                                    <img
                                        class="img-style"
                                        :src="getPointSvg(cmpIndex+1)"
                                    >
                                    <div
                                        style="font-size: 13px;
                                        color:#1CBCB4;
                                        margin-left: 10px;
                                            white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
                                        {{company.hotelName}}
                                    </div>
                                </header>
                                <footer>
                                    {{company.address}}
                                </footer>
                            </div>
                            <el-pagination
                                style="margin: 20px auto 30px"
                                small
                                @current-change="onPageChange"
                                layout="prev, pager, next"
                                :total="total">
                            </el-pagination>
                        </div>
                    </el-submenu>
                </el-menu>
            </div>
        </div>
        <div v-if="isDetail">
            <div class="detail-title" @click="isDetail=false">返回列表</div>
            <div class="detail-body">
                <header>
                    <img
                        class="img-style"
                        :src="getPointSvg(curCompanyIndex+1)"
                    >
                    <span style="margin-left: 10px">{{companyList[curCompanyIndex].hotelName}}</span>
                </header>
                <div>酒店地址: {{companyList[curCompanyIndex].address}}</div>
                <div>平均价格: {{companyList[curCompanyIndex].lowestPrice}}元</div>
                <div>关闭率: {{companyList[curCompanyIndex].closeRate}}%</div>
                <div>酒店评分: {{companyList[curCompanyIndex].customerScore}}</div>
            </div>
        </div>
    </div>
</template>

<script>
    import { getPointSvg } from "@/util/mapUtils.js";
    import windowMixins from "@/mixins/floatWindow-mixins.js";
    export default{
        name: "float-window",
        props: {
            propData: [Array],
            coverageRadius: [Number, String],
            propAreaChange: [Function],
            propDrawCompanyPoint: [Function],
            city: [Number, String],
            propDisabled: {
                type: Boolean,
                default: false
            }
        },

        data() {
            return {
                getPointSvg,
                // 是否显示详情
                isDetail: false,
                // 当前公司详情
                curCompanyIndex: {},
                //当前区域
                curArea: "",

                areaSelect: "",
                areaList: [],
                totalNum: null,
                businessList: [],
                companyList: [],
                //当前行业
                curBusinessIndex: null
            };
        },

        mixins: [
            windowMixins
        ],

        watch: {
            propData(val) {
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

        methods: {
            toDetail(index) {
                this.isDetail = true;
                this.curCompanyIndex = index;
            },
            changeState(state) {
                this.isDetail = false;
                this.totalNum = null;
                this.curArea = "";
            },

            readList() {
                this.$request({
                    url: this.$api.hotel_page_location_detail,
                    method: "get",
                    path: {
                        pageSize: this.pageSize,
                        pageNo: this.pageNo
                    },
                    params: {
                        locationId: this.selectArea.locationId,
                        coverageRadius: this.coverageRadius,
                        hotelType: this.businessList[this.curBusinessIndex].hotelType
                    }
                }).then((res) => {
                    this.companyList = res.rows;
                    this.total = res.total;
                    this.propDrawCompanyPoint(this.companyList);
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

            getIndustryList(locationId) {
                this.$request({
                    url: this.$api.hotel_location_type,
                    method: "get",
                    params: {
                        locationId,
                        coverageRadius: this.coverageRadius,
                        city: this.city
                    }
                }).then((res) => {
                    this.businessList = res.data;
                }).catch((err) => {
                    this.$logger.log("err", err.message);
                });
            },

            onAreaInput(e) {
                this.curArea = e;
                //当选择全部时
                if (!e) {
                    this.totalNum = null;
                    this.propAreaChange();
                    return;
                }
                this.selectArea = this.propData.find((item) => {
                    return item.id === e;
                });
                //当前有选中的 关闭menu
                if (this.curBusinessIndex && this.$refs.elMenu) {
                    this.$refs.elMenu.closeMenu(this.curBusinessIndex);
                    this.curBusinessIndex = null;
                }
                this.resetListState();
                this.getIndustryList(this.selectArea.locationId);
                this.propAreaChange(this.selectArea);
                this.totalNum = this.selectArea.hotelNum;
            }
        },

        mounted() {},

        created() {

        }
    };
</script>

<style lang="less">
    @import "~@/assets/less/vankely/POI/floatWindow.less";
</style>
