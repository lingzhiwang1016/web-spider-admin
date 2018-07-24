<template lang="html">
    <div>
        <div class="breadcrumb">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>租金地图</el-breadcrumb-item>
                <el-breadcrumb-item>统计图表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="vk-report">
            <ul class="report1">
                <li class="left">
                    <vk-full-screen @isOpen="fullScreenOne" :iconShow="reportShow.oneShow">
                        <div class="title">租房户型-租房数量关系图</div>
                        <reportOne v-show="reportShow.oneShow" :class="{'hasPadding': reportShowOne}" :isFull="reportShowOne" :reportData="allReportData.houseRentCount.houseRentTypeCount"/>
                    </vk-full-screen>
                </li>
                <li class="right">
                    <vk-full-screen iconRight="160px" isRang="150px" @isOpen="fullScreenTwo" :iconShow="reportShow.twoShow">
                        <div class="title">价格区间-租房数量关系图</div>
                        <el-select clearable v-model="priceRentType" style="position: absolute;top:10px;right: 20px;width: 120px;" placeholder="户型">
                            <el-option
                              v-for="item in rentTypes"
                              :key="item.code"
                              :label="item.codeText"
                              :value="item.code">
                            </el-option>
                        </el-select>
                        <reportTwo v-show="reportShow.twoShow" :class="{'hasPadding': reportShowTwo}" :isFull="reportShowTwo" :reportData="allReportData.houseRentCount.houseRentGradeCount" :houseType="priceRentType"/>
                    </vk-full-screen>
                </li>
            </ul>

            <ul class="report2">
                <li class="left">
                    <vk-full-screen iconRight="160px" isRang="150px" @isOpen="fullScreenThree"  :iconShow="reportShow.threeShow">
                        <div class="title">面积区间-租房数量关系图</div>
                        <el-select clearable v-model="areaRentType" style="position: absolute;top:10px;right: 20px;width: 120px;" placeholder="户型">
                            <el-option
                              v-for="item in rentTypes"
                              :key="item.code"
                              :label="item.codeText"
                              :value="item.code">
                            </el-option>
                        </el-select>
                        <reportThree  :class="{'hasPadding': reportShowThree}" :isFull="reportShowThree" :reportData="allReportData.houseRentCount.houseRentAreaGradeCount" :houseType="areaRentType"/>
                    </vk-full-screen>
                </li>
                <li class="right">
                    <vk-full-screen iconRight="160px" isRang="150px" @isOpen="fullScreenFour" :iconShow="reportShow.fourShow">
                        <div class="title">按区(县)划分的租房数量和平均价格关系图</div>
                        <el-select clearable v-model="countyRentType" style="position: absolute;top:10px;right: 20px;width: 120px;" placeholder="户型">
                            <el-option
                              v-for="item in rentTypes"
                              :key="item.code"
                              :label="item.codeText"
                              :value="item.code">
                            </el-option>
                        </el-select>
                        <reportFour v-show="reportShow.fourShow"  :class="{'hasPadding': reportShowFour}" :isFull="reportShowFour" :reportData="allReportData.houseRentCount.houseRentCountyCount" :houseType="countyRentType"/>
                    </vk-full-screen>
                </li>
            </ul>

            <ul class="report2">
                <li class="all">
                    <vk-full-screen iconRight="287px" isRang="279px" @isOpen="fullScreenFive" :iconShow="reportShow.fiveShow">
                        <div class="title">按商圈划分的租房数量和平均价格关系图</div>
                        <el-select clearable v-model="businessRentType" style="position: absolute;top:10px;right: 20px;width: 120px;" placeholder="户型">
                            <el-option
                              v-for="item in rentTypes"
                              :key="item.code"
                              :label="item.codeText"
                              :value="item.code">
                            </el-option>
                        </el-select>
                        <el-select clearable v-model="businessAddressRange" style="position: absolute;top:10px;right: 149px;width: 120px;" placeholder="覆盖半径">
                            <el-option
                              v-for="item in addressRanges"
                              :key="item.code"
                              :label="item.codeText"
                              :value="item.code">
                            </el-option>
                        </el-select>
                        <reportFive v-show="reportShow.fiveShow && hasFiveData" @fiveData="fiveDataChange" :class="{'hasPadding': reportShowFive}" :isFull="reportShowFive" :reportData="allReportData.poiOnLocationCount" :addressRange="businessAddressRange"  :houseType="businessRentType"/>
                    </vk-full-screen>
                </li>
            </ul>

            <ul class="report2">
                 <li class="all">
                    <vk-full-screen iconRight="287px" isRang="279px" @isOpen="fullScreenSix" :iconShow="reportShow.sixShow">
                        <div class="title">按交通枢纽划分的租房数量和平均价格关系图</div>
                        <el-select clearable v-model="trafficRentType" style="position: absolute;top:10px;right: 20px;width: 120px;" placeholder="户型">
                            <el-option
                              v-for="item in rentTypes"
                              :key="item.code"
                              :label="item.codeText"
                              :value="item.code">
                            </el-option>
                        </el-select>
                        <el-select clearable v-model="trafficAddressRange" style="position: absolute;top:10px;right: 149px;width: 120px;" placeholder="覆盖半径">
                            <el-option
                              v-for="item in addressRanges"
                              :key="item.code"
                              :label="item.codeText"
                              :value="item.code">
                            </el-option>
                        </el-select>
                        <reportSix  v-show="reportShow.sixShow && hasSixData" @sixData="sixDataChange" :class="{'hasPadding': reportShowSix}" :isFull="reportShowSix" :reportData="allReportData.poiOnLocationCount" :addressRange="trafficAddressRange" :houseType="trafficRentType"/>
                    </vk-full-screen>
                </li>
            </ul>

            <div class="bottom">数据来源：58同城及链家网</div>
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
import dict, { COVERAGE_RADIUSENUM, HOUSE_RENT_TYPE_ENUM } from "@/net/dict.js";

export default {
    // 组合其它组件
    extends: {},
    // 组件属性、变量
    props: {},
    // 变量
    data () {
        return {
            allReportData: {
                houseRentCount: {},
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
            hasFourData: true,
            hasFiveData: true,
            hasSixData: true,
            //addressRanges: [
            //    { code: 0.5, codeText: "500m" }, { code: 1, codeText: "1km" }, { code: 2, codeText: "2km" }, { code: 3, codeText: "3km" }
            //],
            //rentTypes: [
            //    { code: 1, codeText: "1房" }, { code: 2, codeText: "2房" }, { code: 3, codeText: "3房" }, { code: 4, codeText: "4房" }, { code: 0, codeText: "隔断间" }, { code: 5, codeText: "其他" }
            //],
            priceRentType: "",
            areaRentType: "",
            countyRentType: "",
            businessRentType: "",
            trafficRentType: ""
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
    asyncComputed: {
        addressRanges: async function() {
            const res = await dict.getDictByType(COVERAGE_RADIUSENUM);
            if (!res) {
                return [];
            }
            const arr = res.filter(item => {
                return item.code !== "0.1";
            });
            return arr.map((item) => {
                return {
                    codeText: item.codeText,
                    code: Number(item.code)
                };
            });
        },
        rentTypes: async function() {
            const res = await dict.getDictByType(HOUSE_RENT_TYPE_ENUM);
            if (!res) {
                return [];
            }
            return res.map((item) => {
                return {
                    codeText: item.codeText,
                    code: Number(item.code)
                };
            });
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
        fourDataChange (val) {
            this.hasFourData = val;
        },
        fiveDataChange (val) {
            this.hasFiveData = val;
        },
        sixDataChange (val) {
            this.hasSixData = val;
        },
        //获取报表数据
        async getChartDatas() {
            this.$logger.log("city", this.city);
            const res = await this.$request({
                url: this.$api.house_rent_poi_statistical,
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
            this.$logger.log("SDD", res.houseRentCount.houseRentAreaGradeCount.houseRentAreaGradeNumList);
            if (res.houseRentCount.houseRentTypeCount.houseRentTypeStatisticList) {
                this.reportShow.oneShow = true;
            } else {
                this.reportShow.oneShow = false;
            }

            if (res.houseRentCount.houseRentGradeCount.houseRentGradeNumList) {
                this.reportShow.twoShow = true;
            } else {
                this.reportShow.twoShow = false;
            }

            if (res.houseRentCount.houseRentAreaGradeCount.houseRentAreaGradeNumList) {
                this.reportShow.threeShow = true;
            } else {
                this.reportShow.threeShow = false;
            }

            if (res.houseRentCount.houseRentCountyCount.houseRentCountyStatisticList.length > 0) {
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
