<template>
    <div class="click_show_container" v-if="isShow">
          <header>停车场信息            
              <i class="tako-icon-bianji" @click="onHidden"></i>
          </header>
          <hr />
          <h6><i class="iconImg" :class="iconMarker">{{propData.index + 1}}</i><span>{{propData.name}}</span></h6>
          <ul>
            <li>
                <div class="left">
                    车&ensp;位&ensp;数：
                </div>
                <div class="right">
                    {{propData.parkingNumber?propData.parkingNumber:"暂无数据"}}
                </div>
            </li>
            <li>
                <div class="left">
                    地&emsp;&emsp;址：
                </div>
                <div class="right">
                    {{propData.address?propData.address:"暂无数据"}}
                </div>
            </li>
            <li>
                <div class="left">
                    每小时收费：
                </div>
                <div class="right">
                    {{propData.averagePrice?`${propData.averagePrice}元`:"暂无数据"}}
                </div>                
            </li>            
            <li>
                <div class="left">
                    封顶收费：
                </div>
                <div class="right">
                    {{propData.maxPrice?`${propData.maxPrice}元`:"暂无数据"}}
                </div>                
            </li>
            <li>
                <div class="left">
                    车场类型：
                </div>
                <div class="right">
                    {{propData.depotTypeName?propData.depotTypeName:"暂无数据"}}                    
                </div>                
            </li>
            <li>
                <div class="left">
                    车场质量：
                </div>
                <div class="right">
                    {{propData.qualityName?propData.qualityName:"暂无数据"}}
                </div>                
            </li>
            <li>
                <div class="left">
                    负&ensp;载&ensp;率：
                </div>
                <div class="right">
                    {{propData.load?propData.load + "%":"暂无数据"}}
                </div>
            </li>
            <li>
                <div class="left">
                    业主信息：
                </div>
                <div class="right">
                    {{propData.ownerMessage?propData.ownerMessage:"暂无数据"}}
                </div>                
            </li>
            <li>
                <div class="left">
                    设&emsp;&emsp;备：
                </div>
                <div class="right">
                    {{propData.equipment?propData.equipment:"暂无数据"}}
                </div>                
            </li>
            <li>
                <div class="left">
                    出入口情况：
                </div>
                <div class="right">
                    {{propData.doorway?propData.doorway:"暂无数据"}}
                </div>                
            </li>       
            <li>
                <div class="left">
                    周边情况：
                </div>
                <div class="right">
                    {{propData.ambitus?propData.ambitus:"暂无数据"}}
                </div>                
            </li>
            <li>
                <div class="left">
                    备&emsp;&emsp;注：
                </div>
                <div class="right">
                    {{propData.remark?propData.remark:"暂无数据"}}
                </div>                
            </li>
                <div class="imgs-container">
                    <div class="img-box" v-for="(item, index) in fileArray" :key="index">
                        <img :src="item.url" alt="">
                    </div>
                </div>       
           </ul>
    </div>
</template>

<script>
export default {
    name: "parking-float-window",
    props: {
        propData: [Object]
    },

    mixins: [],

    data() {
        return {
            isShow: false,
            iconMarker: "",
            fileArray: []
        };
    },

    watch: {
        propData(val) {
            this.$logger.log("propData222", val);
            this.getImgInfo();
            if (val.quality === "depot_bad") {
                this.iconMarker = "iconImg_default1";
            } else if (val.quality === "depot_moderation") {
                this.iconMarker = "iconImg_default2";
            } else {
                this.iconMarker = "iconImg_default3";
            }
        },
        isShow(val) {
            this.$emit("isShowChange", val);
        }
    },

    computed: {},

    components: {},

    methods: {
        fileArrayFun(val) {
            if (val) {
                this.basicForm.attachmentIds = [];
                val.forEach(item => {
                    this.basicForm.attachmentIds.push(item.id);
                });
                this.fileArray = val;
            }
        },
        getImgInfo() { // 编辑页面时，通过id获取图片信息
            if (this.propData.attachmentIds) {
                this.$logger.log(333);
                this.fileArray = [];
                this.propData.attachmentIds.forEach((item, index) => {
                    this.$request({
                        url: this.$api.ali_attachmentId,
                        method: "get",
                        path: { attachmentId: item }
                    }).then(res => {
                        if (res && res.data) {
                            const imgUrl = res.data.bucket && res.data.endpoint && res.data.alyId ? "http://" + res.data.bucket + "." + res.data.endpoint + "/" + res.data.alyId : "";
                            this.fileArray.push({
                                name: res.data.sourceName,
                                url: imgUrl,
                                size: res.data.size,
                                id: res.data.id
                            });
                        }
                    }).catch(err => {
                        this.$logger.log("err", err);
                    });
                });
            }
        },
        onShow() {
            this.isShow = true;
        },
        onHidden() {
            this.isShow = false;
            this.$emit("editPropData", this.propData);
        },
        onHiddenWindow() {
            this.isShow = false;
        }
    },

    mounted() {
    },

    created() {
    }
};
</script>

<style lang="less" scoped>
.click_show_container {
  position: absolute;
  top: 20px;
  right: 20px;
  background-color: #ffffff;
  padding: 18px 20px 24px;
  width: 300px;
  height: 400px;
  overflow-y: scroll;
  header {
    margin-bottom: 18px;
    font-size: 13px;
    color: #666666;
    line-height: 14px;
    i {
      float: right;
      color: #999999;
      cursor: pointer;
    }
  }
  hr {
    border: none;
    border-top: 1px solid #e8e8e8;
  }
  h6 {
    font-size: 16px;
    color: #666666;
    letter-spacing: 0;
    line-height: 16px;
    margin: 34px 0 24px;
    font-weight: normal;
    display: flex;
    align-items: center;
    i {
      font-style: normal;
      font-size: 10px;
    }
    span {
      margin-left: 10px;
    }
  }
  ul > li {
    margin-bottom: 6px;
    font-size: 12px;
    color: #999999;
    letter-spacing: 0;
    line-height: 24px;
    &::after {
      content: "";
      display: block;
      clear: both;
    }
    .left {
      float: left;
      width: 72px;
      white-space: nowrap;
      text-align: left;
    }
    .right {
      width: 150px;
      float: left;
      white-space: wrap;
    }
  }
  .imgs-container {
    display: flex;
    flex-wrap: wrap;
    .img-box {
      width: 115px;
      height: 56px;
      margin: 0 10px 10px 0;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
}
</style>
