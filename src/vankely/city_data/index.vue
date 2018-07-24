<template lang="html">
    <div>
        <div class="breadcrumb">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>城市数据</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <div class="vk-report">
            <!-- 城市经济状况 -->
            <cityEconomy
                :cityEconomyData="allReportData.cityEconomy"
                :onUpdata="getAllData"
            />

            <ul class="report2">
                <li class="left">
                  <vk-full-screen @isOpen="fullScreenOne" :iconShow="reportShow.oneShow || reportShow.twoShow">
                      <div class="title">
                          <span class="inner_title">基本人口信息</span>
                          <span class="tip">
                              (数据来源：
                              {{allReportData.populationBasicInfo.permanentcount === null ?
                              "" :
                              allReportData.populationBasicInfo.permanentcount.sourcesOfDate}})
                        </span>
                          <i @click="$refs.basicInfoEdit.open()" class="tako-icon-bianji edit_icon"></i>
                      </div>
                      <ul class="flex_model">
                          <li class="left_right">
                            <span class="flex_model_title">常住人口/人：</span>
                            <span class="data">
                                {{allReportData.populationBasicInfo.permanentcount === null ?
                                 "" :
                                  allReportData.populationBasicInfo.permanentcount.peopleNum}}
                            </span>
                          </li>
                      </ul>

                      <ul class="child_two">
                          <li class="child">
                            <reportOne :class="{'hasPadding': fullScreenShow.oneShow}" :isFull="fullScreenShow.oneShow" :reportData="allReportData.populationBasicInfo.education" />
                          </li>
                          <li class="child">
                            <reportTwo :class="{'hasPadding': fullScreenShow.oneShow}" :isFull="fullScreenShow.oneShow" :reportData="allReportData.populationBasicInfo.generation" />
                          </li>
                      </ul>
                  </vk-full-screen>
                  <basicInfoEdit
                      ref="basicInfoEdit"
                      :propIds="allReportData.populationBasicInfo.ids"
                      :onUpdata="getAllData"
                  />
                </li>
                <li class="right">
                    <vk-full-screen @isOpen="fullScreenTwo" :iconShow="reportShow.threeShow">
                        <div class="title">
                            <span class="inner_title">房价现状</span>
                            <span class="tip">（数据来源：中国房价行情网）</span>
                        </div>
                        <ul class="flex_model">
                            <li class="top_bottom">
                              <div class="flex_model_title">今日（元/㎡）</div>
                              <div class="flex_model_bottom">
                                <span class="data">{{allReportData.cityEconomyCacheStatistic.housePrice.todayMoney}}</span>
                                <span :class="todayStatus"><i :class="todayIcon"></i><span>{{allReportData.cityEconomyCacheStatistic.housePrice.todayRate}}</span></span>
                              </div>
                            </li>
                            <li class="top_bottom">
                              <div class="flex_model_title">近一月（元/㎡）</div>
                              <div class="flex_model_bottom">
                                <span class="data">{{allReportData.cityEconomyCacheStatistic.housePrice.recentOneMonthMoney}}</span>
                                <span :class="lastMonthStatus"><i :class="lastMonthIcon"></i><span>{{allReportData.cityEconomyCacheStatistic.housePrice.lastMonthRate}}</span></span>
                              </div>
                            </li>
                            <li class="top_bottom">
                              <div class="flex_model_title">预测（元/㎡）</div>
                              <div class="flex_model_bottom">
                                <span class="data">{{allReportData.cityEconomyCacheStatistic.housePrice.predictPrice}}</span>
                              </div>
                            </li>
                        </ul>
                        <ul class="child_two child_two_infoBT">
                            <li class="child child_only">
                              <reportThree :class="{'hasPadding': fullScreenShow.twoShow}" v-show="reportShow.threeShow" :isFull="fullScreenShow.twoShow" :reportData="allReportData.cityEconomyCacheStatistic.housePriceGain" />
                            </li>
                        </ul>
                    </vk-full-screen>
                </li>
            </ul>

            <ul class="report2 report2_height">
                <li class="all">
                    <vk-full-screen @isOpen="fullScreenThree" :iconShow="reportShow.fourShow">
                        <div class="title">
                            <span class="inner_title">房价走势</span>
                            <span class="tip">（数据来源：中国房价行情网）</span>
                        </div>
                        <ul class="child_two">
                            <li class="child">
                              <reportFour :class="{'hasPadding': fullScreenShow.threeShow}" v-show="reportShow.fourShow" :isFull="fullScreenShow.threeShow" :reportData="allReportData.cityEconomyCacheStatistic.housePriceTrend"/>
                            </li>
                            <li class="child">
                              <reportFive  :class="{'hasPadding': fullScreenShow.threeShow}" v-show="reportShow.fiveShow" :isFull="fullScreenShow.threeShow" :reportData="allReportData.cityEconomyCacheStatistic.houseDistribution"/>
                            </li>
                        </ul>
                    </vk-full-screen>
                </li>
            </ul>
        </div>
    </div>
</template>
<script type="text/javascript">
import cityEconomy from "./economy.vue";
import reportOne from "./report_one.vue";
import reportTwo from "./report_two.vue";
import reportThree from "./report_three.vue";
import reportFour from "./report_four.vue";
import reportFive from "./report_five.vue";
import basicInfoEdit from "./basicInfo_edit.vue";

export default {
    // 组合其它组件
    extends: {},
    // 组件属性、变量
    props: {},
    // 变量
    data() {
        return {
            allReportData: {
                cityEconomy: {},
                populationBasicInfo: {
                    permanentcount: {},
                    education: [],
                    generation: [],
                    ids: []
                },
                cityEconomyCacheStatistic: {
                    housePrice: {},
                    housePriceGain: [],
                    housePriceTrend: [],
                    houseDistribution: []
                }
            },
            todayIcon: "",
            todayStatus: "",
            lastMonthIcon: "",
            lastMonthStatus: "",
            reportShow: {
                oneShow: true,
                twoShow: true,
                threeShow: true,
                fourShow: true,
                fiveShow: true
            },
            fullScreenShow: {
                oneShow: false,
                twoShow: false,
                threeShow: false
            }
        };
    },
    components: {
        cityEconomy,
        reportOne,
        reportTwo,
        reportThree,
        reportFour,
        reportFive,
        basicInfoEdit
    },
    computed: {
        city() {
            return this.$store.state.city || "350200";
        },
        month() {
            return this.$store.state.month || { startMonth: "", endMonth: "" };
        }
    },
    // 方法
    watch: {
        city(val) {
            this.getAllData();
        },
        month(val) { }
    },
    methods: {
        fullScreenOne(val) {
            this.fullScreenShow.oneShow = val;
        },
        fullScreenTwo(val) {
            this.fullScreenShow.twoShow = val;
        },
        fullScreenThree(val) {
            this.fullScreenShow.threeShow = val;
        },
        //获取报表数据
        async getAllData() {
            this.$logger.log("city", this.city);
            const res = await this.$request({
                url: this.$api.city_economy_query,
                method: "get",
                params: {
                    city: this.city
                }
            });
            this.$logger.log("$res", res.data);
            this.showOrNot(res.data);
            this.allReportData = res.data;
            this.todayStatus = this.allReportData.cityEconomyCacheStatistic.housePrice.todayChange === "fall" ? "fall" : "rise";
            this.todayIcon = this.allReportData.cityEconomyCacheStatistic.housePrice.todayChange === "fall" ? "tako-icon-xia" : "tako-icon-shang";
            this.lastMonthStatus = this.allReportData.cityEconomyCacheStatistic.housePrice.lastMonthChange === "fall" ? "fall" : "rise";
            this.lastMonthIcon = this.allReportData.cityEconomyCacheStatistic.housePrice.lastMonthChange === "fall" ? "tako-icon-xia" : "tako-icon-shang";
        },
        showOrNot(res) {
            if (res.populationBasicInfo.education.length > 0) {
                this.reportShow.oneShow = true;
            } else {
                this.reportShow.oneShow = false;
            }

            if (res.populationBasicInfo.generation.length > 0) {
                this.reportShow.twoShow = true;
            } else {
                this.reportShow.twoShow = false;
            }

            if (res.cityEconomyCacheStatistic.housePriceGain.length > 0) {
                this.reportShow.threeShow = true;
            } else {
                this.reportShow.threeShow = false;
            }

            if (res.cityEconomyCacheStatistic.housePriceTrend.length > 0) {
                this.reportShow.fourShow = true;
            } else {
                this.reportShow.fourShow = false;
            }

            if (res.cityEconomyCacheStatistic.houseDistribution.length > 0) {
                this.reportShow.fiveShow = true;
            } else {
                this.reportShow.fiveShow = false;
            }
        }
    },
    // 生命周期函数
    created() {
        this.getAllData();
    },
    beforeCreate() {
    },
    mounted() { }
};
</script>
<style lang="less">
.hasPadding {
  padding: 40px 0 60px 0 !important;
}
</style>

<style src="@/assets/less/data/financeReport/index.less" lang="less" scoped></style>
<style src="@/assets/less/vankely/city_data/economy.less" lang="less" scoped></style>
