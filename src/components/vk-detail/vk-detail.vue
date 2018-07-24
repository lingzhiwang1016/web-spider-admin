<template lang="html" xmlns:v-bind="http://www.w3.org/1999/xhtml">
    <div class="vk-detail">
        <p class="key">
          <el-tooltip :disabled="!contentKey||contentKey.length<3" :content="contentKey" popper-class="limit-width">
            <i class="key-i">{{label}}</i>
          </el-tooltip>
          <i class="key-after">:</i>
        </p>
        <div class="key-content">
          <el-tooltip :disabled="!content||content.length<len" :content="content" popper-class="limit-width">
            <div :class="normal?'normal':'nowrap'">{{descriptions}} {{units}}</div>
          </el-tooltip>
          <slot></slot>
        </div>
    </div>
</template>

<script>
export default {
    name: "vkDetail",
    componentName: "vk-detail",
    props: {
        label: "",
        description: "",
        unit: "",
        contentKey: "",
        content: "",
        len: {
            type: Number,
            default: 15
        },
        normal: { //正常换行，默认不换行
            type: Boolean,
            default: false
        }
    },

    data() {
        return {};
    },

    computed: {
        units() {
            if (this.description) {
                if (this.unit === "㎡") {
                    return "㎡";
                } else if (this.unit === "every") {
                    return "个";
                } else if (this.unit === "%") {
                    return "%";
                } else if (this.unit === "￥") {
                    return "元";
                } else {
                    return this.unit;
                }
            } else {
                return "";
            }
        },
        descriptions() {
            if (!this.description) {
                return "--";
            } else {
                return this.description;
            }
        }
    },

    watch: {},

    methods: {},
    mounted() {
    }
};
</script>

<style lang="less" scoped>
@import "~@/assets/less-variable/index.less";
.vk-detail {
  width: 100%;
  .key {
    display: inline-block;
    width: @label-width;
    height: @input-height;
    line-height: @input-height;
    color: @fontColor-label;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    .key-i {
      max-width: calc(~"@{label-width} - 20px");
      padding-left: 4px;
      font-style: normal;
      overflow: hidden;
      text-overflow: ellipsis;
      display: inline-block;
      white-space: nowrap;
    }
    .key-after {
      font-style: normal;
      position: relative;
      top: -11px;
    }
  }
  .key-content {
    float: right;
    color: @fontColor-normal;
    width: calc(~"100% - @{label-width}");
    line-height: @input-height;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .nowrap {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .normal {
    white-space: normal;
  }
}
</style>
