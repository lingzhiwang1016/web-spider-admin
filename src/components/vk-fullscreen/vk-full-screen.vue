<template xmlns:v-bind="http://www.w3.org/1999/xhtml">
    <div :class="{fullscreen: isOpen,noFullScreen: !isOpen}">
         <div v-show="!isOpen&&iconShow" class="fullScreen-button" ref="iconFull" @click="openFullScreen()"><i class="tako-icon-quanpingxianshi"></i></div>
         <slot style="width: 100%;"></slot>
         <el-button ref="offFullButon" v-show="isOpen" class="signOut" @click="offFullScreen()"><i class="tako-icon-quanpingxianshi"></i> 退出全屏</el-button>
         <div class="full-mes" v-show="isOpen&&fullTextShow">
            按<span class="full-text">esc</span>即可退出全屏模式
         </div>
    </div>
</template>

<script>
    export default {
        name: "vk-full-screen",
        props: {
            iconRight: "",
            iconShow: true,
            isRang: ""
        },

        data () {
            return {
                isOpen: false,
                fullTextShow: false
            };
        },
        computed: {
        },
        methods: {
            openFullScreen () {
                this.isOpen = true;
                this.fullTextShow = true;
                //告诉父组件开启全屏
                this.$emit("isOpen", true);
                //开启esc监听
                this.onkeydown();
                //关闭esc提示
                setTimeout(() => {
                    this.fullTextShow = false;
                }, 2000);
            },
            //按钮关闭全屏
            offFullScreen () {
                this.isOpen = false;
                this.$emit("isOpen", false);
            },
            //esc关闭全屏
            onkeydown () {
                document.onkeydown = (event) => {
                    if (event.keyCode === 27) {
                        this.isOpen = false;
                        this.$emit("isOpen", false);
                    }
                };
            }
        },
        mounted: function () {
            //icon的图标位置
            if (this.iconRight) {
                this.$refs.iconFull.style.right = this.iconRight;
            }
            if (this.isRang) {
                this.$refs.offFullButon.$el.style.right = this.isRang;
            }
        },
        beforeDestroy () {
            document.onkeydown = "";
        }
    };
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style scoped  lang="less">
    .fullscreen{
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 999;
        background-color: #ffffff;
    }
    .noFullScreen{
        position: relative;
        width: 100%;
        height: 383px;
    }
    .fullScreen-button{
        position: absolute;
        top: 18px;
        right: 20px;
        z-index: 99;
        cursor: pointer;
        color: #999999;
    }
    .signOut{
        position: fixed;
        top: 10px;
        right: 20px;
        z-index: 99;
        color: #999999;
    }
    .full-mes {
        position: fixed;
        width: 240px;
        height: 52px;
        left: 50%;
        top: 1%;
        transform: translateX(-50%);
        background-color: #2A303C;
        border-radius: 4px;
        color: #FFFFFF;
        font-size: 14px;
        line-height: 52px;
        display: flex;
        justify-content: center;
        z-index: 3;
        .full-text {
            color: #2A303C;
            display: block;
            height: 32px;
            line-height: 32px;
            margin: 10px 4px;
            padding: 0 10px;
            border-radius: 4px;
            background-color: #FFFFFF;
        }
    }
    .hasRight{
        right:150px!important
    }
</style>
