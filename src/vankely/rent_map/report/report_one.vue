<template lang="html">
    <div class="report_option1 item"></div>
</template>
<script type="text/javascript">
import echarts from "echarts";
import { getPinColor, commonStyle } from "@/util/report-help.js";
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
            charts: null,

            labelPosition: "outside",
            labelShow: false, //是否为暂无数据
            pinColor: null
        };
    },
    computed: {},

    // 方法
    watch: {
        reportData: function (val) {
            this.getChartData(val);
        },
        isFull: function (val) {
            this.getChartData(this.reportData);
            this.charts.resize();
        }
    },
    methods: {
        //渲染环形图echart
        async getChartData(res) {
            if (res) {
                const legendData = [];
                const seriesData = [];
                res.houseRentTypeStatisticList.forEach((ele) => {
                    if (Number(ele.houseNum) > 0) {
                        seriesData.push({ value: ele.houseNum, name: ele.houseTypeName });
                        legendData.push(ele.houseTypeName);
                    }
                });

                // 数据全空判断
                if (res.totalHouseNum === 0) {
                    seriesData.splice(0, 0, { value: 0, name: "暂无数据" });
                    this.labelPosition = "center";
                    this.labelShow = true;
                    this.pinColor = getPinColor(true);
                } else {
                    this.labelShow = false;
                    this.labelPosition = "outside";
                    this.pinColor = getPinColor();
                }
                this.initState(legendData, seriesData);
                // 让图表随着窗口尺寸改变自适应大小
                window.onresize = () => {
                    this.charts.resize();
                };
            } else {
                this.$logger.log("父组件传过来的数据有问题");
            }
        },
        //初始化
        async initState(legendData, seriesData) {
            const tooltip = {
                trigger: "item",
                formatter: this.labelShow ? "{b}" : "占比:{d}% <br/>租房户型:{b} <br/>租房数量:{c}套"
            };
            const legend = {
                data: legendData,
                ...commonStyle.commonLegend
            };
            const series = [
                {
                    name: "访问来源",
                    color: this.pinColor,
                    ...commonStyle.commonSeriesPieColor,
                    label: {
                        normal: {
                            show: this.labelShow || this.isFull, //全屏或者没数据
                            formatter: this.labelShow ? "{b}" : "{b}\n{d}%",
                            position: this.labelPosition,
                            color: "#999999"
                        },
                        emphasis: {
                            show: this.labelShow || this.isFull, //全屏或者没数据
                            formatter: (this.labelShow || !this.isFull) ? "{b}" : "{b}\n{d}%",
                            position: this.labelPosition,
                            color: "#999999"
                        }
                    },
                    labelLine: {
                        normal: {
                            show: this.labelShow || this.isFull //全屏或者没数据
                        }
                    },
                    data: seriesData
                }
            ];
            const option = {
                tooltip: tooltip,
                legend: legend,
                series: series,
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
        this.charts = echarts.init(document.getElementsByClassName("report_option1")[0]);
    }
};
</script>
