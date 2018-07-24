/*Created by vyouyou on 17-7-25.*/
import Vue from "vue";

export const getMinMax = (datas, key) => {
    let min = datas[0][key];
    let max = datas[0][key];
    datas.forEach((data) => {
        if (Number(data[key]) > Number(max)) {
            max = data[key];
        }
        if (Number(data[key]) < Number(min)) {
            min = data[key];
        }
    });
    return { min, max };
};
/**通过最大值，最小值，格子数目计算1*/
export const getDivision = (min, max, isPercent = false) => {
    min = Math.floor(0.9 * min);
    max = Math.ceil(1.1 * max);

    const result = {
        min: 0,
        max: 0,
        interval: 0
    };
    const gridNum = 5;

    // 最大值
    const re1 = Number((max % gridNum).toFixed(2));
    if (isPercent) { //当为百分数，最大不超过100
        result.max = max > 100 ? 100 : (max - re1 + gridNum);
    } else {
        result.max = max - re1 + gridNum;
    }

    // 最小值
    const re2 = Number((min % gridNum).toFixed(2));
    result.min = min - re2;
    if (result.min < 0) result.min = 0;
    // 间隔数
    result.interval = (result.max - result.min) / gridNum;
    return result;
};

// 饼图颜色
export const getPinColor = (isEmpty = false) => {
    let color = [];
    if (isEmpty) {
        color = ["#f7f7f7"];
    } else {
        color = ["#9771E3", "#FF6476", "#99D358", "#6A90FE", "#FFC15B", "#29C1E8", "#F8683F", " #8CA7F9"];
    }
    return color;
};

export const commonStyle = { //报表公共部分
    commonTooltip: {
        trigger: "axis",
        formatter(params) {
            let str = "";
            params.forEach(param => {
                let value = "";
                if ((param.seriesName === "平均薪资") && param.value) {
                    value = Number(param.value).toFixed(2) + "元";
                } else {
                    value = param.value;
                }
                str += `<br>${param.seriesName}:${value}`;
            });
            return `${params[0].axisValue}${str}`;
        }
    },
    commonTooltip_hotel: {
        trigger: "axis",
        formatter: "{b} <br/>酒店数量:{c0}家 <br/>平均房价:{c1}元"
    },
    commonTooltip_rent: {
        trigger: "axis",
        formatter: "{b} <br/>租房数量:{c0}套 <br/>平均房价:{c1}元"
    },
    commonLegend: {
        icon: "roundRect",
        bottom: 0,
        itemGap: 20,
        itemWidth: 12,
        itemHeight: 12,
        textStyle: { color: "#999999" }
    },
    commonGrig: {
        top: "50px",
        bottom: "40px",
        left: "40px",
        right: "40px",
        containLabel: true
    },
    commonX: {
        boundaryGap: true,
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
    },
    commonY: {
        nameTextStyle: {
            color: "#999999"
        },
        axisLabel: {
            formatter: "{value}",
            color: "#999999"
        },
        splitLine: {
            lineStyle: {
                color: "#e8e8e8",
                type: "dashed"
            }
        },
        axisLine: { show: false },
        axisTick: { show: false }
    },
    commonSeriesColor1: { // 仅折线图+投影
        type: "line",
        smooth: true,
        itemStyle: {
            normal: {
                color: "#1CBCB4"
            }
        },
        areaStyle: {
            normal: {
                color: "rgba(28,188,180,0.1)"
            }
        }
    },
    commonSeriesLineColor: { // 仅折线图
        type: "line",
        smooth: true,
        yAxisIndex: 1,
        itemStyle: {
            normal: {
                color: "#FFC15B"
            }
        }
    },
    commonSeriesLineColor2: { // 仅折线图
        type: "line",
        smooth: true,
        yAxisIndex: 1,
        itemStyle: {
            normal: {
                color: "#29C1E8"
            }
        }
    },
    commonSeriesBarColor: { // 仅柱状图
        type: "bar",
        barWidth: 6,
        itemStyle: {
            normal: {
                color: "#29C1E8"
            }
        }
    },
    commonSeriesBarColor2: { // 仅柱状图
        type: "bar",
        barWidth: 6,
        itemStyle: {
            normal: {
                color: "#FFC15A"
            }
        }
    },
    commonSeriesPieColor: { // 仅饼图
        type: "pie",
        center: ["50%", "50%"],
        radius: ["40%", "50%"]
    },
    commonBgColor: {
        backgroundColor: "#ffffff"
    }
};
