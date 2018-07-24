/**
 * Created by vyouyou on 17-8-1.
 */
import { transMonthCh } from "@/util/statisticUtils.js";
import Vue from "vue";
const statisticOptions = [
    //=====================================[1]平均租金走势==================================
    {
        title: {
            text: ""
        },
        legend: {
            data: [
                { name: "经营建面平均租金", icon: "roundRect" },
                { name: "可租赁面积平均租金", icon: "roundRect" }
            ],
            bottom: "0px",
            itemGap: 40,
            itemWidth: 12,
            itemHeight: 12,
            textStyle: {}
        },
        tooltip: {
            trigger: "axis",
            formatter(params) {
                let str = "";
                params.forEach(param => {
                    str += `<br>${param.seriesName}:${param.value}元`;
                });
                return `${params[0].axisValue}${str}`;
            }
        },
        grid: {
            top: "30px",
            right: "30px",
            bottom: "50px",
            left: "20px",
            containLabel: true
        },
        yAxis: {
            // name: "元",
            axisLine: {
                lineStyle: {}
            },
            axisLabel: {
                color: "#999999"
            },
            splitLine: {
                lineStyle: {
                    color: "#e8e8e8",
                    type: "dashed"
                }
            }

        },
        series: [
            {
                name: "经营建面平均租金",
                type: "line",
                data: [],
                smooth: true,
                itemStyle: {
                    normal: {
                        color: "#979AC9"
                    }
                }
            },
            {
                name: "可租赁面积平均租金",
                type: "line",
                data: [],
                smooth: true,
                itemStyle: {
                    normal: {
                        color: "#9ACA82"
                    }
                }
            }
        ],
        backgroundColor: "#FFFFFF"
    },
    //=====================================[2]出租率走势==================================
    {
        title: {
            text: ""
        },
        yAxis: {
            // name: "出租率",
            axisLabel: {
                formatter: "{value}%"
            },
            splitLine: {
                lineStyle: {
                    color: "#e8e8e8",
                    type: "dashed"
                }
            },
            axisLine: {
                lineStyle: {}
            }
        },
        tooltip: {
            formatter: "{b} <br>{a} : {c}%"
        },
        grid: {
            top: "30px",
            right: "30px",
            bottom: "29px",
            left: "20px",
            containLabel: true
        },
        series: [{
            name: "出租率",
            type: "line",
            data: [],
            smooth: true,
            itemStyle: {
                normal: {
                    color: "#EFAF77"
                }
            },
            areaStyle: {
                normal: {
                    color: "#FCEFE4"
                }
            }
        }],
        backgroundColor: "#FFFFFF"
    },
    //=====================================[3]收缴率==================================
    {
        title: {
            text: ""
        },
        tooltip: {
            formatter(params) {
                let str = "";
                params.forEach(param => {
                    let unit;
                    if (param.seriesName === "当月收缴率") {
                        unit = "%";
                    } else {
                        unit = "元";
                    }
                    str += `<br>${param.seriesName}:${param.value}${unit}`;
                });
                return `${params[0].axisValue}${str}`;
            }
            // formatter: "{b} <br>{a0} : {c0} (元)<br>{a1} : {c1} (元)<br>{a2} : {c2}%"
        },
        yAxis: [
            {
                type: "value",
                // name: "当月/元",
                axisLine: {
                    lineStyle: {}
                },
                axisLabel: {},
                splitLine: {
                    lineStyle: {
                        color: "#e8e8e8",
                        type: "dashed"
                    }
                }
            },
            {
                type: "value",
                // name: "当月收缴率",
                axisLine: {
                    lineStyle: {}
                },
                axisLabel: {
                    formatter: "{value}%"
                },
                splitLine: {
                    show: false
                }
            }
        ],
        legend: {
            data: [
                { name: "当月应收", icon: "roundRect" },
                { name: "当月已收", icon: "roundRect" },
                { name: "当月收缴率", icon: "roundRect" }
            ],
            bottom: 0,
            itemGap: 40,
            itemWidth: 12,
            itemHeight: 12,
            textStyle: {}
        },
        grid: {
            top: "30px",
            right: "20px",
            bottom: "50px",
            left: "20px",
            containLabel: true
        },
        series: [
            {
                name: "当月应收",
                type: "bar",
                barMaxWidth: "20px",
                barMinWidth: "10px",
                barWidth: 12,
                barCategoryGap: "0px",
                barGap: "0px",
                data: [],
                itemStyle: {
                    normal: {
                        color: "#8CA7F9"
                    }
                }
            },
            {
                name: "当月已收",
                type: "bar",
                barMaxWidth: "20px",
                barMinHeight: "10px",
                barWidth: 12,
                barCategoryGap: "0px",
                barGap: "0px",
                data: [],
                itemStyle: {
                    normal: {
                        color: "#DEE4FC"
                    }
                }
            },
            {
                name: "当月收缴率",
                type: "line",
                yAxisIndex: 1,
                data: [],
                smooth: true,
                itemStyle: {
                    normal: {
                        color: "#E3B07B"
                    }
                }
            }
        ],
        backgroundColor: "#FFFFFF"
    },
    //========================[4]收入占比==============================
    {
        title: {
            text: "",
            left: 4
        },
        legend: {
            data: [],
            icon: "roundRect",
            bottom: 0,
            itemGap: 20,
            itemWidth: 12,
            itemHeight: 12,
            textStyle: {}
        },
        series: [
            {
                name: "",
                type: "pie",
                color: ["#FEAD73", "#8CA7F9", "#FFC966", "#9C94CF", "#5ED179", "#23B7E5", "#F8683F", "#D5D3D2"],
                center: ["50%", "50%"],
                radius: ["40%", "58%"],
                data: [],
                areaStyle: { normal: {}},
                label: {
                    normal: {
                        formatter: "{d}% {b}\n{c}人",
                        textStyle: {}
                    }
                }
            }
        ],
        backgroundColor: "#FFFFFF"
    }
];
export const setSeries = (tmp, name, data, key) => {
    const colors = ["#9996CD", "#85CD7E", "#FEAD73", "#8CA7F9", "#FFC966", "#23B7E5", "#8F8C95", "#D5D3D2"];
    tmp.series.push({
        name: name,
        type: "line",
        data: data,
        smooth: true,
        itemStyle: {
            normal: {
                color: colors[key]
            }
        }
    });
    return tmp;
};
export const setPieEmpty = (isEmpty, option) => {
    if (isEmpty) {
        option.series[0].data.push({ value: 0, name: "暂无数据" });
        option.tooltip.formatter = "暂无数据";
        option.series[0].itemStyle = {
            normal: {
                color: "#f4f4f4"
            }
        };
        option.series[0].label.normal.textStyle.color = "#999999";
        option.series[0].label.normal.position = "center";
        option.series[0].label.normal.formatter = "暂无数据";
    } else {
        option.tooltip = {
            trigger: "item",
            formatter: "{a} {b} : <br>{c}元({d}%)"
        };
        option.series[0].itemStyle = null;
        option.series[0].label.normal.textStyle.color = null;
        option.series[0].label.normal.position = "outer";
        option.series[0].label.normal.formatter = "{b}\n{d}%";
    }
};

export const setPieEmpty2 = (isEmpty, option) => {
    if (isEmpty) {
        option.series[0].data.push({ value: 0, name: "暂无数据" });
        option.tooltip.formatter = "暂无数据";
        option.series[0].itemStyle = {
            normal: {
                color: "#f4f4f4"
            }
        };
        option.series[0].label.normal.textStyle.color = "#999999";
        option.series[0].label.normal.position = "center";
        option.series[0].label.normal.formatter = "暂无数据";
    } else {
        option.tooltip = {
            trigger: "item",
            formatter: "占比：{d}% <br>企业数量：{a} {b} <br>注册资金：{c}万元以下"
        };
        option.series[0].itemStyle = null;
        option.series[0].label.normal.textStyle.color = null;
        option.series[0].label.normal.position = "outer";
        option.series[0].label.normal.formatter = "{b}\n{d}%";
    }
};

export const getStatisticOptions = () => {
    statisticOptions.forEach((option, index) => {
        //设置titile
        option.title = Object.assign(option.title, {
            left: "20px",
            top: "14px",
            textStyle: {
                fontSize: 12,
                color: "#2F3453"
            }
        });
        //设置tooltip
        if (index !== 3) {
            option.tooltip.trigger = "axis";
            if (index === 5) {
                option.xAxis = [{
                    type: "category",
                    //设置是否在行内
                    boundaryGap: false,
                    data: [],
                    axisTick: {
                        boundaryGap: true,
                        interval: 0
                    },
                    axisLine: {
                        lineStyle: {
                            color: "#e8e8e8"
                        }
                    },
                    axisLabel: {
                        color: "#999999"
                    }
                }, {
                    type: "category",
                    //设置是否在行内
                    boundaryGap: false,
                    data: [],
                    axisTick: {
                        boundaryGap: true,
                        interval: 0
                    },
                    axisLine: {
                        lineStyle: {
                            color: "#e8e8e8"
                        }
                    },
                    axisLabel: {
                        color: "#999999"
                    }
                }
                ];
            } else {
                option.xAxis = {
                    type: "category",
                    //设置是否在行内
                    boundaryGap: false,
                    data: [],
                    axisTick: {
                        boundaryGap: true,
                        interval: 0
                    },
                    axisLine: {
                        lineStyle: {
                            color: "#e8e8e8"
                        }
                    },
                    axisLabel: {
                        color: "#999999"
                    }
                };
            }
            if (option.yAxis instanceof Array) {
                option.yAxis = option.yAxis.map(ya => {
                    ya.axisLine.lineStyle.color = "#e8e8e8";
                    ya.axisLabel = Object.assign({}, ya.axisLabel);
                    ya.axisLabel.color = "#999999";
                    ya.nameTextStyle = {
                        color: "#999999",
                        align: "left"
                    };
                    return ya;
                });
            } else {
                option.yAxis.axisLine.lineStyle.color = "#e8e8e8";
                option.yAxis.axisLabel = Object.assign({}, option.yAxis.axisLabel);
                option.yAxis.axisLabel.color = "#999999";
                option.yAxis.nameTextStyle = { color: "#999999" };
            }
            if (index === 2) {
                option.xAxis.boundaryGap = true;
            }
        }
        // 设置legend图例文字颜色
        if (option.legend && option.legend.textStyle) {
            option.legend.textStyle.color = "#666666";
        }
    });
    setPieEmpty(false, statisticOptions[3]);
    return statisticOptions;
};
