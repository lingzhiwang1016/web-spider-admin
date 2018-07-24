<template lang="html">
    <div>
        <div class="breadcrumb">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>企业地图</el-breadcrumb-item>
                <el-breadcrumb-item>统计图表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="vk-report">
            <ul class="report1">
                <li class="left">
                    <vk-full-screen @isOpen="fullScreenOne" :iconShow="reportShow.oneShow">
                        <div class="title">注册资本-企业数量关系图</div>
                        <reportOne :class="{'hasPadding': reportShowOne}" :isFull="reportShowOne" :reportData="allReportData.capitalEnterpriseNumProportion" />
                    </vk-full-screen>
                </li>
                <li class="right">
                    <vk-full-screen @isOpen="fullScreenTwo" :iconShow="reportShow.twoShow">
                        <div class="title">企业人数-企业数量关系图</div>
                        <reportTwo :class="{'hasPadding': reportShowTwo}" :isFull="reportShowTwo" :reportData="allReportData.countEnterpriseNumByScale" />
                    </vk-full-screen>
                </li>
            </ul>

            <ul class="report2">
                <li class="left">
                    <vk-full-screen @isOpen="fullScreenThree"  :iconShow="reportShow.threeShow">
                        <div class="title">企业数量-年份关系图</div>
                        <reportThree :class="{'hasPadding': reportShowThree}" v-show="reportShow.threeShow" :isFull="reportShowThree"  :reportData="allReportData.countEnterpriseNumByYear" />
                    </vk-full-screen>
                </li>
                <li class="right">
                    <vk-full-screen @isOpen="fullScreenFour" :iconShow="reportShow.fourShow">
                        <div class="title">按区(县)划分企业数量和平均薪资图</div>
                        <reportFour :class="{'hasPadding': reportShowFour}" v-show="reportShow.fourShow" :isFull="reportShowFour" :reportData="allReportData.countRecruitmentStatisticsByCounty" />
                    </vk-full-screen>
                </li>
            </ul>

            <ul class="report2">
                <li class="left">
                    <vk-full-screen iconRight="160px" @isOpen="fullScreenFive" :iconShow="reportShow.fiveShow" isRang="150px">
                        <div class="title">按商圈划分的企业数量和平均薪资图</div>
                        <el-select v-model="businessAddressRange" clearable style="position: absolute;top:10px;right: 20px;width: 120px;" placeholder="覆盖半径">
                            <el-option
                              v-for="item in addressRanges"
                              :key="item.code"
                              :label="item.codeText"
                              :value="item.code">
                            </el-option>
                        </el-select>
                        <reportFive :class="{'hasPadding': reportShowFive}" v-show="reportShow.fiveShow" :isFull="reportShowFive" :reportData="allReportData.recruitmentPoiOnLocation" :addressRange="businessAddressRange"/>
                    </vk-full-screen>
                </li>
                 <li class="right">
                    <vk-full-screen iconRight="160px" @isOpen="fullScreenSix" :iconShow="reportShow.sixShow" isRang="150px">
                        <div class="title">按交通枢纽划分的企业数量和平均薪资图</div>
                        <el-select v-model="trafficAddressRange" clearable style="position: absolute;top:10px;right: 20px;width: 120px;" placeholder="覆盖半径">
                            <el-option
                              v-for="item in addressRanges"
                              :key="item.code"
                              :label="item.codeText"
                              :value="item.code">
                            </el-option>
                        </el-select>
                        <reportSix  :class="{'hasPadding': reportShowSix}" v-show="reportShow.sixShow" :isFull="reportShowSix" :reportData="allReportData.recruitmentPoiOnLocation" :addressRange="trafficAddressRange"/>
                    </vk-full-screen>
                </li>
            </ul>

            <ul class="report3">
                <li class="all">
                    <vk-full-screen @isOpen="fullScreenSeven" :iconShow="reportShow.sevenShow">
                        <div class="title">按行业划分的企业数量和平均薪资图</div>
                        <reportSeven :class="{'hasPadding': reportShowSeven}"  v-show="reportShow.sevenShow" :isFull="reportShowSeven" :reportData="allReportData.countRecruitmentStatisticsByIndustry" />
                    </vk-full-screen>
                </li>
            </ul>
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
import reportSeven from "./report_seven.vue";

export default {
    // 组合其它组件
    extends: {},
    // 组件属性、变量
    props: {},
    // 变量
    data () {
        return {
            allReportData: {
                capitalEnterpriseNumProportion: {},
                countEnterpriseNumByScale: {},
                countEnterpriseNumByYear: {},
                countRecruitmentStatisticsByCounty: {},
                recruitmentPoiOnLocation: {},
                countRecruitmentStatisticsByIndustry: {}
            },
            reportShow: {
                oneShow: true,
                twoShow: true,
                threeShow: true,
                fourShow: true,
                fiveShow: true,
                sixShow: true,
                sevenShow: true
            },
            reportShowOne: false,
            reportShowTwo: false,
            reportShowThree: false,
            reportShowFour: false,
            reportShowFive: false,
            reportShowSix: false,
            reportShowSeven: false,
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
        reportSix,
        reportSeven
    },
    computed: {
        city() {
            return this.$store.state.city || "350200";
        },
        month () {
            return this.$store.state.month || { startMonth: "", endMonth: "" };
        }
    },
    // 方法
    watch: {
        city(val) {
            this.getChartDatas();
        },
        month(val) {
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
        fullScreenSeven (val) {
            this.reportShowSeven = val;
        },
        //获取报表数据
        async getChartDatas() {
            this.$logger.log("city", this.city);
            const res = await this.$request({
                url: this.$api.recruitment_poi_enterprise_statistical,
                method: "get",
                params: {
                    city: this.city,
                    startTime: this.month.startMonth || "",
                    endTime: this.month.endMonth || ""
                }
            });
            this.$logger.log("$res", res.data);
            this.showOrNot(res.data);
            this.allReportData = res.data;
        },
        showOrNot(res) {
            this.$logger.log("res.capitalEnterpriseNumProportion.elements.length", res.capitalEnterpriseNumProportion.elements);
            if (res.capitalEnterpriseNumProportion.elements) {
                this.reportShow.oneShow = true;
            } else {
                this.reportShow.oneShow = false;
            }

            if (res.countEnterpriseNumByScale.elements) {
                this.reportShow.twoShow = true;
            } else {
                this.reportShow.twoShow = false;
            }

            if (res.countEnterpriseNumByYear.list.length > 0) {
                this.reportShow.threeShow = true;
            } else {
                this.reportShow.threeShow = false;
            }

            if (res.countRecruitmentStatisticsByCounty.list.length > 0) {
                this.reportShow.fourShow = true;
            } else {
                this.reportShow.fourShow = false;
            }

            if (res.recruitmentPoiOnLocation.tradingAreaPois.length > 0) {
                this.reportShow.fiveShow = true;
            } else {
                this.reportShow.fiveShow = false;
            }

            if (res.recruitmentPoiOnLocation.trafficHubPois.length > 0) {
                this.reportShow.sixShow = true;
            } else {
                this.reportShow.sixShow = false;
            }

            if (res.countRecruitmentStatisticsByIndustry.industryRecruitmentStatisticsList && res.countRecruitmentStatisticsByIndustry.industryRecruitmentStatisticsList.length > 0) {
                this.reportShow.sevenShow = true;
            } else {
                this.reportShow.sevenShow = false;
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
