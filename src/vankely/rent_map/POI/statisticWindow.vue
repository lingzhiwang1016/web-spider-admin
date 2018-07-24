<template>
    <div @click="onClick">
        <header v-if="curState==='open'" class="stc-header">
            <div class="table-block">
                <table>
                    <tr v-for="rowData in leftTableData" :key="rowData[0]">
                        <td v-for="(columnData,index) in rowData" :key="index">{{columnData}}</td>
                    </tr>
                </table>
            </div>
            <div class="divider-line"></div>
            <div class="table-block">
                <table>
                    <tr v-for="rowData in rightTableData" :key="rowData[0]">
                        <td v-for="(columnData,index) in rowData" :key="index">{{columnData}}</td>
                    </tr>
                </table>
            </div>
        </header>
        <div :class="{'is-close': curState==='close','is-open':curState!=='close'}">
            {{title}}
            <i class="el-icon-caret-top" :class="{'icon-anim':curState!=='close'}"></i>
        </div>
    </div>
</template>

<script>
    export default{
        name: "statisticWindow",
        props: {
            title: [String],
            data: [Object]
        },

        computed: {
            leftTableData() {
                const baseForm = [
                    ["价格分档"],
                    ["数量/户"],
                    ["平均租金/元"],
                    ["平均面积/㎡"],
                    ["坪效(元/㎡)"]
                ];
                this.data.houseRentChargeGradeStatisticList.forEach((item) => {
                    baseForm[0].push(item.gradeName);
                    baseForm[1].push(item.houseNum);
                    baseForm[2].push(item.roomCharge);
                    baseForm[3].push(item.area);
                    baseForm[4].push(item.groundEffect);
                });
                return baseForm;
            },
            rightTableData() {
                const baseForm = [
                    ["面积分档"],
                    ["数量/户"],
                    ["平均租金/元"],
                    ["平均面积/㎡"],
                    ["坪效(元/㎡)"]
                ];
                this.data.houseRentAreaGradeStatisticList.forEach((item) => {
                    baseForm[0].push(item.gradeName);
                    baseForm[1].push(item.houseNum);
                    baseForm[2].push(item.roomCharge);
                    baseForm[3].push(item.area);
                    baseForm[4].push(item.groundEffect);
                });
                return baseForm;
            }
        },

        data() {
            return {
                curState: "close"
            };
        },
        methods: {
            onClick() {
                this.curState = this.curState === "close" ? "open" : "close";
            }
        }
    };
</script>

<style lang="less" scoped>
    @import "~@/assets/less/vankely/POI/statisticWindow.less";
</style>
