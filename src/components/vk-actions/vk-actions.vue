<template lang="html" xmlns:v-bind="http://www.w3.org/1999/xhtml">
    <div class="vk-actions">
        <slot>
            <div>--</div>
        </slot>
    </div>
</template>

<script>
    export default {
        name: "vkActions",
        componentName: "vk-actions",
        props: {
        },

        data () {
            return {};
        },

        computed: {},

        watch: {},

        methods: {}
    };
</script>

<style lang="less" scoped>
@import "~@/assets/less-variable/index.less";
.vk-actions {
    div{
      color: @fontColor-label;
    }
}
</style>
