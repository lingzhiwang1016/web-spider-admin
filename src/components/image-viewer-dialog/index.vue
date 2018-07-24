<template lang="html">
    <el-dialog key="ImageViewerDialog" custom-class="el-dialog-two" title="图片查看" v-model="visible" :before-close="handleClose">
        <ul class="content-img" style="margin: 20px 0px">
            <li ref="contentDom" class="content" style="width: 100%;height: calc(70vh - 100px)">
                <div class="bg-style" ref="bgDom" style="height: calc(70vh - 100px)"></div>
            </li>
            <li v-if="type==='multi'" class="page-button page-button-left" @click="onRight"><img src="~@/assets/img/arrow_left.svg" alt=""></li>
            <li v-if="type==='multi'" class="page-button page-button-right" @click="onLeft"><img src="~@/assets/img/arrow_right.svg" alt=""></li>
        </ul>

        <div v-if="type==='multi'" class="content-foot">
            <span>
                <i v-for="(item,key) in urls" :key="key" :class="[key===curIndex?'tako-icon-danjutupiandangqian':'tako-icon-danjutupianyuan','icon-font-class']"></i>
            </span>
        </div>
    </el-dialog>
</template>

<script>
    export default {
        name: "ImageViewerDialog",
        props: {
            // visible:  {
            //     type: Boolean,
            //     default: false
            // },
            //
            // url: {
            //     type: String,
            //     required:true
            // }
        },

        data () {
            return {
                visible: false,
                // single multi
                type: null,
                url: "",
                urls: [],
                curIndex: 0,

                imgSize: null,
                sbShowBtn: true,
                domBox: ""
            };
        },

        computed: {
            getUrl() {
                if (this.type === "single") {
                    return this.url;
                } else {
                    return this.urls[this.curIndex];
                }
            }
        },

        watch: {
            getUrl (val) {
                this.$nextTick(() => {
                    this.$refs.bgDom.style.backgroundImage = "url('" + this.getUrl + "')";
                });
            }
        },

        methods: {
            show (data) {
                this.visible = true;
                if (data instanceof Array) {
                    this.urls = data;
                    if (this.urls.length > 1) {
                        this.type = "multi";
                    }
                } else {
                    this.url = data;
                    this.type = "single";
                }
            },
            close () {
                this.visible = false;
                if (this.$el) {
                    this.$el.parentNode.removeChild(this.$el);
                }
                this.$destroy();
            },
            handleClose: function (done) {
                this.close();
                done();
            },

            onRight() {
                if (this.curIndex === this.urls.length - 1) {
                    this.curIndex = 0;
                } else {
                    this.curIndex++;
                }
            },

            onLeft() {
                if (this.curIndex === 0) {
                    this.curIndex = this.urls.length - 1;
                } else {
                    this.curIndex--;
                }
            }
        },

        created: function () {
        },

        mounted: function () {
        },
        updated: function() {
        }
    };
</script>

<style lang="less" scoped>
@import "~@/assets/less-variable/index.less";

.content-img {
    position: relative;
    background-color: @bgColor-origin;
    li.content{
      display: flex;
      justify-content: center;
      align-items: center;
      .imgW{width: 100%;}
      .imgH{height: 100%;}
        .bg-style {
            width: 100%;
            background-size:contain;
            background-repeat:no-repeat;
            background-position:center;
        }
    }

    .page-button{
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
    }
    .page-button-left{
      left: 46px;
    }
    .page-button-right{
      right:46px;
    }

    .sbShowBtn{
        position: absolute;
        right: 10px;
        bottom: 10px;
        font-size: 18px;
        color: @fontColor-label;
    }
}

.content-foot{
    width:100%;
    height:44px;
    line-height: 44px;
    text-align: center;
    .icon-font-class{
      margin-left: 1px;
      margin-right: 1px;
      color:@bgColor-active;
    }
}

/*.el-dialog-two{*/
  /*li.content{height: 337px;}*/
/*}*/
</style>
