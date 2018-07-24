<template lang="html" xmlns:v-bind="http://www.w3.org/1999/xhtml">
    <div>
        <div class="daterange" :class="propClass" v-if="type !== 'quarter'">
            <el-date-picker
                v-model="val.start"
                class="vk-daterange vk-start"
                :type=type
                align="center"
                :clearable="false"
                placeholder="初始时间"
                @change="handleStartChange"
                :editable="false"
                :picker-options="dateOptions.start||optionsStart">
            </el-date-picker>
            <div class="middle-text"></div>
            <el-date-picker
                v-model="val.end"
                class="vk-daterange vk-end"
                :type=type
                align="center"
                placeholder="截止时间"
                @change="handleEndChange"
                :editable="false"
                :picker-options="dateOptions.end||optionsEnd">
            </el-date-picker>
            <div class="iconChange">
                <i class="tako-icon-riqixuanzetubiao icon-data"></i>
                <i class="tako-icon-xiangmuqingkong icon-delete" @click="handleDelete" style="display: none"></i>
            </div>

        </div>

        <!--<div class="daterange" v-if="type === 'quarter'">-->
            <!--<el-date-picker-->
                <!--v-model="qval.start"-->
                <!--class="vk-daterange vk-start"-->
                <!--type="year"-->
                <!--placeholder="起始年份"-->
                <!--@change="handleStartChange"-->
                <!--:editable="false"-->
                <!--:picker-options="pickerOptionsStart">-->
            <!--</el-date-picker>-->
            <!--<el-select-->
                <!--v-model="qval.sq"-->
                <!--class="daterange-select"-->
                <!--placeholder="季度"-->
                <!--@change="handleQuarter">-->
                <!--<el-option-->
                    <!--v-for="item in quarterList"-->
                    <!--:key="item.value"-->
                    <!--:value="item.value"-->
                    <!--:label="item.label">-->
                <!--</el-option>-->
            <!--</el-select>-->
            <!--<div class="middle-text">至</div>-->
            <!--<el-date-picker-->
                <!--v-model="qval.end"-->
                <!--class="vk-daterange vk-end"-->
                <!--type="year"-->
                <!--placeholder="截止年份"-->
                <!--@change="handleEndChange"-->
                <!--:editable="false"-->
                <!--:picker-options="pickerOptionsEnd">-->
            <!--</el-date-picker>-->
            <!--<el-select-->
                <!--v-model="qval.eq"-->
                <!--class="daterange-select"-->
                <!--placeholder="季度"-->
                <!--@change="handleQuarter">-->
                <!--<el-option-->
                    <!--v-for="item in quarterList"-->
                    <!--:key="item.value"-->
                    <!--:value="item.value"-->
                    <!--:label="item.label">-->
                <!--</el-option>-->
            <!--</el-select>-->
        <!--</div>-->
    </div>
</template>

<script>
    const year = "year";
    const month = "month";
    const quarter = "quarter";
    export default {
        name: "vkDaterange",
        componentName: "vk-daterange",
        props: {
            // 支持v-model
            value: [Object],
            type: {
                type: String,
                default: year
            },
            dateOptions: {
                type: Object,
                default() {
                    return {};
                }
            },
            propDate: [Object],
            propClass: [Object]
        },

        data () {
            return {
                val: {
                    start: this.propDate.startDate || "",
                    end: this.propDate.endDate || ""
                },
                qval: {
                    start: "",
                    sq: "",
                    end: "",
                    eq: ""
                },
                quarterList: [
                    {
                        label: "Q1",
                        value: 1
                    },
                    {
                        label: "Q2",
                        value: 2
                    },
                    {
                        label: "Q3",
                        value: 3
                    },
                    {
                        label: "Q4",
                        value: 4
                    }
                ]
            };
        },

        computed: {
            optionsStart() {
                return {
                    disabledDate: (time) => {
                        let mark = false;
                        mark = this.val.end ? time.getTime() > this.$utils.formatStringToDate(this.val.end) : time.getTime() > this.$utils.formatStringToDate(this.dateOptions.endDate);
                        if (!mark && this.dateOptions.startDate) mark = time.getTime() < this.$utils.formatStringToDate(this.dateOptions.startDate);
                        return mark;
                    }
                };
            },
            optionsEnd() {
                return {
                    disabledDate: (time) => {
                        let mark = false;
                        mark = this.val.start ? time.getTime() < this.$utils.formatStringToDate(this.val.start) : time.getTime() < this.$utils.formatStringToDate(this.dateOptions.startDate);
                        if (!mark && this.dateOptions.endDate) mark = time.getTime() > this.$utils.formatStringToDate(this.dateOptions.endDate);
                        return mark;
                    }
                };
            }
        },

        watch: {
        },

        methods: {
            handleStartChange (value) {
                if (this.type !== quarter) {
                    const result = this.val.start;
                    this.val.start = value;
                    this.$emit("change", this.val);
                } else if (this.type === quarter) {
                    const result = this.qval.start;
                    this.qval.start = value;
                    this.$emit("change", this.qval);
                }
            },
            handleEndChange (value) {
                if (this.type !== quarter) {
                    const result = this.val.end;
                    //                    if (!result) {
                    //                        this.val.start = "";
                    //                    }
                    this.val.end = value;
                    this.$emit("change", this.val);
                } else if (this.type === quarter) {
                    const result = this.qval.end;
                    this.qval.end = value;
                    this.$emit("change", this.qval);
                }
            },
            handleDelete () {
                this.val.start = "";
                this.val.end = "";
                this.$emit("change", this.val);
            },
            handleQuarter () {
                this.$emit("change", this.qval);
            }
        },

        created () {
        }
    };
</script>

<style lang="less">
.daterange {
    display: flex;
    //border: 1px solid rgba(255,255,255,0.20);
    border: 1px solid #373E4D;
    border-radius: 4px;
    background: #373E4D;

    .vk-daterange {
        width: 100px !important;
        input {
            width: 100px !important;
            border: none !important;
            text-align: center;
            color: #999999;
            background-color: #373E4D;
        }
        input::-webkit-input-placeholder { /* WebKit browsers*/
            color: #999999!important;
        }
        input:-moz-placeholder {  /* Mozilla Firefox 4 to 18*/
            color: #999999!important;
        }
        input::-moz-placeholder {  /* Mozilla Firefox 19+*/
            color: #999999!important;
        }
        input:-ms-input-placeholder { /* Internet Explorer 10+*/
            color: #999999!important;
        }
    }
    .vk-start {
        input {
            border-top-right-radius: 0px !important;
            border-bottom-right-radius: 0px !important;
        }
        .el-input__icon {
            display: none;
        }
    }
    .vk-end {
        input {
            border-top-left-radius: 0px !important;
            border-bottom-left-radius: 0px !important;
        }
        .el-input__icon {
            display: none;
        }
    }

    .middle-text {
        height: 1px;
        width: 10px;
        background-color: #999999;
        margin: auto;
        margin-left: -16px;
        z-index: 999;
    }

    .daterange-select {
        width: 70px;
        .el-input__icon {
            display: none;
        }
        input {
            padding-right: 0px;
            border: none;
            border-radius: none;
            &:hover {
                border: none;
            }
            &:focus {
                border: none;
            }
        }
    }
    .iconChange{
        margin: auto 8px auto -21px;
        line-height: 27px;
        z-index: 99;
        color: #999999;
    }
    .iconChange:hover .icon-data{
        display: none;
    }
    .iconChange:hover .icon-delete{
        display: inline-block!important;
        cursor: pointer;
    }
}
</style>
