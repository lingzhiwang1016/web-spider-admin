<template lang="html">
    <div>
        <div class="breadcrumb">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>酒店地图</el-breadcrumb-item>
                <el-breadcrumb-item>统计图表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="vk-report">
            <ul class="report1">
                <li class="left">
                    <vk-full-screen @isOpen="fullScreenOne" :iconShow="reportShow.oneShow">
                        <div class="title">酒店类型-酒店数量关系图</div>
                        <reportOne v-show="reportShow.oneShow" :class="{'hasPadding': reportShowOne}" :isFull="reportShowOne" :reportData="allReportData.hotelTypeCount" />
                    </vk-full-screen>
                </li>
                <li class="right">
                    <vk-full-screen @isOpen="fullScreenTwo" :iconShow="reportShow.twoShow">
                        <div class="title">房间数-酒店数量关系图</div>
                        <reportTwo v-show="reportShow.twoShow" :class="{'hasPadding': reportShowTwo}" :isFull="reportShowTwo" :reportData="allReportData.hotelRoomNumGradeProportion" />
                    </vk-full-screen>
                </li>
            </ul>

            <ul class="report2">
                <li class="left">
                    <vk-full-screen @isOpen="fullScreenThree"  :iconShow="reportShow.threeShow">
                        <div class="title">按酒店类型划分的酒店数量和平均房价关系图</div>
                        <reportThree v-show="reportShow.threeShow" :class="{'hasPadding': reportShowThree}" :isFull="reportShowThree"  :reportData="allReportData.hotelTypeCount" />
                    </vk-full-screen>
                </li>
                <li class="right">
                    <vk-full-screen @isOpen="fullScreenFour" :iconShow="reportShow.fourShow">
                        <div class="title">按区(县)划分的酒店数量和平均房价关系图</div>
                        <reportFour v-show="reportShow.fourShow" :class="{'hasPadding': reportShowFour}" :isFull="reportShowFour" :reportData="allReportData.hotelCountyCount" />
                    </vk-full-screen>
                </li>
            </ul>

            <ul class="report2">
                <li class="all">
                    <vk-full-screen iconRight="160px" @isOpen="fullScreenFive" :iconShow="reportShow.fiveShow" isRang="150px">
                        <div class="title">按商圈划分的酒店数量和平均房价关系图</div>
                        <el-select clearable v-model="businessAddressRange" style="position: absolute;top:10px;right: 20px;width: 120px;" placeholder="覆盖半径">
                            <el-option
                              v-for="item in addressRanges"
                              :key="item.code"
                              :label="item.codeText"
                              :value="item.code">
                            </el-option>
                        </el-select>
                        <reportFive v-show="reportShow.fiveShow" :class="{'hasPadding': reportShowFive}" :isFull="reportShowFive" :reportData="allReportData.poiOnLocationCount" :addressRange="businessAddressRange"/>
                    </vk-full-screen>
                </li>
            </ul>

            <ul class="report2">
                 <li class="all">
                    <vk-full-screen iconRight="160px" @isOpen="fullScreenSix" :iconShow="reportShow.sixShow" isRang="150px">
                        <div class="title">按交通枢纽划分的酒店数量和平均房价关系图</div>
                        <el-select clearable v-model="trafficAddressRange" style="position: absolute;top:10px;right: 20px;width: 120px;" placeholder="覆盖半径">
                            <el-option
                              v-for="item in addressRanges"
                              :key="item.code"
                              :label="item.codeText"
                              :value="item.code">
                            </el-option>
                        </el-select>
                        <reportSix  v-show="reportShow.sixShow" :class="{'hasPadding': reportShowSix}" :isFull="reportShowSix" :reportData="allReportData.poiOnLocationCount" :addressRange="trafficAddressRange"/>
                    </vk-full-screen>
                </li>
            </ul>

            <div class="bottom">数据来源：携程网及去哪儿网酒店数据</div>
        </div>

    </div>
</template>
<script type="text/javascript">
import reportOne from "./report_one.vue";
import reportTwo from "./report_two.vue";
import reportThree from "./report_three.vue";
import reportFour from "./report_four.vue";
import reportFive from "./report_five.vue";
import reportSix from "./report_six.vue";

export default {
    // 组合其它组件
    extends: {},
    // 组件属性、变量
    props: {},
    // 变量
    data () {
        return {
            allReportData: {
                hotelCountyCount: {},
                hotelTypeCount: {},
                hotelRoomNumGradeProportion: {},
                poiOnLocationCount: {}
            },
            reportShow: {
                oneShow: true,
                twoShow: true,
                threeShow: true,
                fourShow: true,
                fiveShow: true,
                sixShow: true
            },
            reportShowOne: false,
            reportShowTwo: false,
            reportShowThree: false,
            reportShowFour: false,
            reportShowFive: false,
            reportShowSix: false,
            trafficAddressRange: "",
            businessAddressRange: "",
            addressRanges: [
                { code: 0.5, codeText: "500m" }, { code: 1, codeText: "1km" }, { code: 2, codeText: "2km" }, { code: 3, codeText: "3km" }
            ]
        };
    },
    components: {
        reportOne,
        reportTwo,
        reportThree,
        reportFour,
        reportFive,
        reportSix
    },
    computed: {
        city() {
            return this.$store.state.city || "350200";
        },
        startMonth () {
            return this.$store.state.month.startMonth || "";
        },
        endMonth () {
            return this.$store.state.month.endMonth || "";
        }
    },
    // 方法
    watch: {
        city(val) {
            this.getChartDatas();
        },
        startMonth(val) {
            this.getChartDatas();
        },
        endMonth(val) {
            this.getChartDatas();
        }
    },
    methods: {
        fullScreenOne (val) {
            this.reportShowOne = val;
        },
        fullScreenTwo (val) {
            this.reportShowTwo = val;
        },
        fullScreenThree (val) {
            this.reportShowThree = val;
        },
        fullScreenFour (val) {
            this.reportShowFour = val;
        },
        fullScreenFive (val) {
            this.reportShowFive = val;
        },
        fullScreenSix (val) {
            this.reportShowSix = val;
        },
        //获取报表数据
        async getChartDatas() {
            this.$logger.log("city", this.city);
            const res = await this.$request({
                url: this.$api.hotel_poi_hotel_statistical,
                method: "get",
                params: {
                    city: this.city,
                    startTime: this.startMonth,
                    endTime: this.endMonth
                }
            });
            this.$logger.log("$res", res.data);
            this.showOrNot(res.data);
            this.allReportData = res.data;
        },
        showOrNot(res) {
            if (res.hotelTypeCount.hotelTypeStatisticList) {
                this.reportShow.oneShow = true;
            } else {
                this.reportShow.oneShow = false;
            }

            if (res.hotelRoomNumGradeProportion.hotelRoomNumGradeStatistics) {
                this.reportShow.twoShow = true;
            } else {
                this.reportShow.twoShow = false;
            }

            if (res.hotelTypeCount.hotelTypeStatisticList.length > 0) {
                this.reportShow.threeShow = true;
            } else {
                this.reportShow.threeShow = false;
            }

            if (res.hotelCountyCount.hotelCountyStatisticList.length > 0) {
                this.reportShow.fourShow = true;
            } else {
                this.reportShow.fourShow = false;
            }

            if (res.poiOnLocationCount.tradingAreaPoiList.length > 0) {
                this.reportShow.fiveShow = true;
            } else {
                this.reportShow.fiveShow = false;
            }

            if (res.poiOnLocationCount.trafficHubPoiList.length > 0) {
                this.reportShow.sixShow = true;
            } else {
                this.reportShow.sixShow = false;
            }
        }
    },
    // 生命周期函数
    created () {
        this.getChartDatas();
    },
    beforeCreate () {
    },
    mounted () {}
};
</script>
<style lang="less">
    .hasPadding{
        padding: 40px 0 60px 0!important;
    }
</style>

<style src="@/assets/less/data/financeReport/index.less" lang="less" scoped></style>
