<template lang="html">
    <div class="report_option5 item"></div>
</template>

<script type="text/javascript">
import echarts from "echarts";
import { getMinMax, getDivision, commonStyle } from "@/util/report-help.js";
export default {
    // 组合其它组件
    extends: {},
    // 组件属性、变量
    props: {
        reportData: {
            type: Object
        },
        addressRange: "",
        houseType: "",
        isFull: false
    },
    // 变量
    data () {
        return {
            charts: null
        };
    },
    computed: {},

    // 方法
    watch: {
        reportData: function (val) {
            this.getChartData(val);
        },
        addressRange: function (val) {
            this.getChartData(this.reportData);
        },
        houseType: function (val) {
            this.getChartData(this.reportData);
        },
        isFull: function (val) {
            this.charts.resize();
        }
    },
    methods: {
        //渲染环形图echart
        async getChartData(res) {
            if (res) {
                const xAxisData = [];
                const yAxisData = [
                    {
                        min: 0,
                        max: 0,
                        interval: 0
                    },
                    {
                        min: 0,
                        max: 0,
                        interval: 0
                    }
                ];
                const seriesData = [[], []];
                const coverageRadius = this.addressRange || 2;
                const houseType = this.houseType || 1;
                if (res.tradingAreaPoiList.length < 1) return;
                const arr = res.tradingAreaPoiList.filter(item => {
                    return item.coverageRadius === Number(coverageRadius).toFixed(2) + "" && item.houseType === houseType;
                });
                //this.$logger.log("第五的表arr", arr);
                if (arr.length < 1) {
                    this.$emit("fiveData", false);
                    return;
                }
                this.$emit("fiveData", true);

                arr.forEach((item) => {
                    seriesData[0].push(item.houseNum);
                    seriesData[1].push(item.roomCharge ? item.roomCharge : 0);
                    xAxisData.push(item.location.locationName);
                });

                // 获取所有数据中的最大值最小值
                const minMax0 = getMinMax(arr, "houseNum");
                const minMax1 = getMinMax(arr, "roomCharge");
                // 获取y轴的最大值最小值
                yAxisData[0].min = getDivision(minMax0.min, minMax0.max).min;
                yAxisData[0].max = getDivision(minMax0.min, minMax0.max).max;
                yAxisData[0].interval = getDivision(minMax0.min, minMax0.max).interval;

                yAxisData[1].min = getDivision(minMax1.min, minMax1.max).min;
                yAxisData[1].max = getDivision(minMax1.min, minMax1.max).max;
                yAxisData[1].interval = getDivision(minMax1.min, minMax1.max).interval;

                this.initState(xAxisData, yAxisData, seriesData);
                // 让图表随着窗口尺寸改变自适应大小
                window.onresize = () => {
                    this.charts.resize();
                };
            } else {
                this.$logger.log("父组件传过来的数据有问题");
            }
        },
        //初始化
        async initState(xAxisData, yAxisData, seriesData) {
            const tooltip = {
                ...commonStyle.commonTooltip_rent
            };
            const legend = {
                data: [
                    { name: "租房数量" },
                    { name: "平均价格" }
                ],
                ...commonStyle.commonLegend
            };
            const xAxis = {
                type: "category",
                data: xAxisData,
                ...commonStyle.commonX
            };
            const yAxis = [
                {
                    name: "租房数量",
                    min: yAxisData[0].min,
                    max: yAxisData[0].max,
                    interval: yAxisData[0].interval,
                    ...commonStyle.commonY
                },
                {
                    name: "平均价格/元",
                    min: yAxisData[1].min,
                    max: yAxisData[1].max,
                    interval: yAxisData[1].interval,
                    ...commonStyle.commonY
                }
            ];
            const series = [
                {
                    name: "租房数量",
                    data: seriesData[0],
                    ...commonStyle.commonSeriesBarColor
                },
                {
                    name: "平均价格",
                    data: seriesData[1],
                    ...commonStyle.commonSeriesLineColor
                }
            ];
            const grid = {
                ...commonStyle.commonGrig
            };
            const option = {
                tooltip,
                legend,
                xAxis,
                yAxis,
                series,
                grid,
                ...commonStyle.commonBgColor
            };
            this.charts.setOption(option);
        }
    },
    // 生命周期函数
    created () {},
    beforeCreate () {
    },
    mounted () {
        this.charts = echarts.init(document.getElementsByClassName("report_option5")[0]);
    }
};
</script>
