<template>
    <router-view v-loading.fullscreen.lock="$store.state.fullscreenLoading" :element-loading-text="$store.state.fullscreenLoadingContent || '内容加载中...'" class="root-views"></router-view>
    <!-- <router-view class="root-views"></router-view> -->
</template>

<script>
    export default {
        name: "app",

        data () {
            return {};
        },

        computed: {},
        methods: {
            test: function (e) {
            }
        },

        created: function () {
        },

        components: {}
    };
</script>

<!-- <script src="http://gosspublic.alicdn.com/aliyun-oss-sdk-4.4.4.min.js"></script> -->
