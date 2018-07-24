<template>
    <span class="vk-action-item">
        <span class="vk-action-item__separator line">|</span>
        <slot></slot>
    </span>
</template>
<script>
    export default {
        name: "vkActionItem",
        props: {},
        data() {
        },
        mounted() {
        }
    };
</script>

<style lang="less" scoped>
@import "~@/assets/less-variable/index.less";
.vk-actions {
    color: @fontColor-label;
    .vk-action-item:first-child .vk-action-item__separator {
      display: none;
    }
    .vk-action-item{
      .line{
        color: @borderColor;
        font-size: 10px;
        padding: 0 5px;
        position: relative;
        top: -2px;
      }
    }
}
</style>
