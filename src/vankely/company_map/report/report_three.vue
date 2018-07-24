<template lang="html">
    <div class="report_option3 item"></div>
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
        isFull: function (val) {
            this.charts.resize();
        }
    },
    methods: {
        //渲染环形图echart
        async getChartData(res) {
            if (res) {
                const legendData = [];
                const xAxisData = [];
                const yAxisData = {
                    min: 0,
                    max: 0,
                    interval: 0
                };
                const seriesData = [];
                if (res.list.length < 1) return;
                res.list.forEach((item) => {
                    seriesData.push(item.enterpriseNum);
                    xAxisData.push(item.year);
                });

                // 获取所有数据中的最大值最小值
                const minMax = getMinMax(res.list, "enterpriseNum");
                // 获取y轴的最大值最小值
                yAxisData.min = getDivision(minMax.min, minMax.max).min;
                yAxisData.max = getDivision(minMax.min, minMax.max).max;
                yAxisData.interval = getDivision(minMax.min, minMax.max).interval;

                this.initState(legendData, xAxisData, yAxisData, seriesData);
                // 让图表随着窗口尺寸改变自适应大小
                window.onresize = () => {
                    this.charts.resize();
                };
            } else {
                this.$logger.log("父组件传过来的数据有问题");
            }
        },
        //初始化
        async initState(legendData, xAxisData, yAxisData, seriesData) {
            const tooltip = {
                trigger: "axis",
                formatter: "{b}年: {c}"
            };
            const legend = {
                data: legendData,
                ...commonStyle.commonLegend
            };
            const xAxis = {
                type: "category",
                data: xAxisData,
                ...commonStyle.commonX
            };
            const yAxis = {
                name: "企业数量",
                min: yAxisData.min,
                max: yAxisData.max,
                interval: yAxisData.interval,
                ...commonStyle.commonY
            };
            const series = [
                {
                    name: "企业数量与年份关系图",
                    data: seriesData,
                    ...commonStyle.commonSeriesColor1
                }
            ];
            const option = {
                tooltip,
                legend,
                xAxis,
                yAxis,
                series,
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
        this.charts = echarts.init(document.getElementsByClassName("report_option3")[0]);
    }
};
</script>
