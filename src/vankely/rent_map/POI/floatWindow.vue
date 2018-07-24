<template>
    <div style="position: absolute;z-index: 999;right: 20px;top: 20px">
        <div v-show="state!=='detail'" class="main-box-style">
            <vk-select
                style="float: left"
                :propClass="selectClass"
                propLabel="区域选择"
                :options="selectOptions"
                :value="curArea"
                @input="onAreaInput"
            ></vk-select>
            <span v-if="state==='menu'"
                  style="float: right;
                  height: 46px;
                  line-height: 46px;
                  margin-right: 20px;
                  font-size: 13px;
                  color: #1CBCB4;"
            >共{{totalNum}}个租房</span>
            <div
                v-show="state==='menu'"
                class="spread-list"
                style="width: 100%;text-align: center;background: #FFFFFF;overflow: scroll;padding-bottom: 20px"
                :style="{height:subMenuHeight + 'px'}"
            >
                <div v-for="(room,cmpIndex) in roomList"
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
                                    width: 220px;
                                        color:#1CBCB4;
                                        margin-left: 10px;
                                            white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
                            {{room.title}}
                        </div>
                    </header>
                    <footer>
                        {{room.address}}
                    </footer>
                </div>
                <el-pagination
                    style="margin-top: 20px"
                    small
                    @current-change="onPageChange"
                    layout="prev, pager, next"
                    :total="total">
                </el-pagination>
            </div>
        </div>
        <div v-if="state==='detail'">
            <div class="detail-title" @click="state='menu'">返回列表</div>
            <div class="detail-body">
                <header>
                    <img
                        class="img-style"
                        :src="getPointSvg(curCompanyIndex+1)"
                    >
                    <span style="margin-left: 10px">{{roomList[curCompanyIndex].title}}</span>
                </header>
                <div>地址: {{roomList[curCompanyIndex].address}}</div>
                <div>价格: {{roomList[curCompanyIndex].roomCharge}}元</div>
                <div>面积: {{roomList[curCompanyIndex].area}}㎡</div>
                <div>类别: {{roomType}}</div>
            </div>
        </div>
    </div>
</template>

<script>
    import { getPointSvg } from "@/util/mapUtils.js";
    import windowMixins from "@/mixins/floatWindow-mixins.js";
    import net from "@/net/dict";
    const floatStates = {
        init: "init",
        menu: "menu",
        detail: "detail"
    };
    export default{
        name: "float-window",
        props: {
            propData: [Array],
            coverageRadius: [Number, String],
            houseType: [Number, String],
            propAreaChange: [Function],
            propDrawCompanyPoint: [Function],
            city: [Number, String],
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
                curBusinessIndex: null
            };
        },

        watch: {
            propData(val) {
            },

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
            },

            roomType() {
                return net.getDictNameSync("HOUSE_RENT_TYPE_ENUM", this.roomList[this.curCompanyIndex].houseType);
            }
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
                this.$request({
                    url: this.$api.house_rent_page_location,
                    method: "get",
                    path: {
                        pageSize: this.pageSize,
                        pageNo: this.pageNo
                    },
                    params: {
                        locationId: this.selectArea.locationId,
                        coverageRadius: this.coverageRadius,
                        houseType: this.houseType
                    }
                }).then((res) => {
                    //                    this.state = floatStates.detail;
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
