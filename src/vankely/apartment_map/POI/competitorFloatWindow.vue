<template>
    <div class="click_show_container competitor" v-if="isShow">
        <header>
            <div class="title">公寓信息</div>
            <i class="tako-icon-bianji" @click="onHidden"></i>
        </header>
        <hr/>
        <div class="propData_container">
            <div class="proData_title">      
                {{propData.name?propData.name:"暂无数据"}}
            </div>
            <div :class="['propData_operationSubject', { 'apartment_iconImg_float1': propData.operationSubject==='国企运营'}, { 'apartment_iconImg_float2': propData.operationSubject==='私企运营'}, { 'apartment_iconImg_float3': propData.operationSubject==='民营'}, { 'apartment_iconImg_float3': propData.operationSubject===null}, { 'apartment_iconImg_float4': propData.operationSubject==='万科自营'}, ]">                            
            </div>
            <div class="propData_brand">
                <div class="left">
                    品&ensp;&ensp;&ensp;&ensp;牌：
                </div>
                <div class="right">
                    {{propData.brand?propData.brand:"暂无数据"}}
                </div>
            </div>
            <div class="propData_brand">
                <div class="left">
                    地&ensp;&ensp;&ensp;&ensp;址：
                </div>
                <div class="right">
                    {{propData.address?propData.address:"暂无数据"}}
                </div>
            </div>
            <div class="propData_form" v-for="(apartment, index) in propData.apartments" :key="index">
                <ul>
                    <li>
                        <div class="left">
                            户&ensp;&ensp;&ensp;&ensp;型：
                        </div>
                        <div class="right">
                            {{apartment.houseType?apartment.houseType:"暂无数据"}}
                        </div>
                    </li>
                    <li>
                        <div class="left">
                            剩余房间：
                        </div>
                        <div class="right">
                            {{apartment.surplusNum?`${apartment.surplusNum}间`:"暂无数据"}}
                        </div>
                    </li>
                    <li>
                        <div class="left">
                            租金范围：
                        </div>
                        <div class="right">
                            {{apartment.priceRange?`${apartment.priceRange}元`:"暂无数据"}}
                        </div>
                    </li>
                    <li>
                        <div class="left">
                            面积范围：
                        </div>
                        <div class="right">
                            {{apartment.areaRange?`${apartment.areaRange}㎡`:"暂无数据"}}
                        </div>
                    </li>
                </ul>
                <div class="imgs_container">
                    <div class="img_box" v-for="(imgItem, index) in apartment.imgInfo" :key="index">
                        <img :src="imgItem.imgUrl" alt="图片">          
                    </div>
                </div>
                <hr/>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "competitor-float-window",
    props: {
        propData: [Object]
    },

    mixins: [],

    data() {
        return {
            isShow: false
        };
    },

    watch: {
        isShow(val) {
            this.$emit("isShowChange", val);
        }
    },

    components: {},

    methods: {
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
  border-radius: 6px;
  header {
    margin-bottom: 18px;
    font-size: 13px;
    color: #666666;
    display: flex;
    justify-content: space-between;
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
  .propData_container {
    .proData_title {
      margin-top: 20px;
      font-size: 16px;
      color: #666666;
    }
    .propData_operationSubject {
      width: 68px;
      height: 26px;
      font-size: 12px;
      line-height: 26px;
      text-align: center;
      margin-top: 11px;
      margin-bottom: 11px;
    }
    .propData_brand {
      margin-bottom: 6px;
      font-size: 12px;
      color: #999999;
      letter-spacing: 0;
      line-height: 24px;
      display: flex;
      .left {
        white-space: nowrap;
      }
      .right {
        white-space: wrap;
      }
    }
  }
  .propData_form {
    margin-bottom: 20px;
    ul {
      li {
        margin-bottom: 6px;
        font-size: 12px;
        color: #999999;
        letter-spacing: 0;
        line-height: 24px;
        display: flex;
        .left {
          white-space: nowrap;
        }
        .right {
          white-space: wrap;
        }
      }
    }
    .imgs_container {
      display: flex;
      flex-wrap: wrap;
      margin-bottom: 20px;
      .img_box {
        width: 113px;
        height: 56px;
        margin-right: 10px;
        margin-bottom: 10px;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .img:nth-child(2n) {
        margin-right: 0px;
      }
    }
  }
}
// 公寓竞品浮窗
.apartment_iconImg_float1 {
  background-image: url("~@/assets/img/apartment_map/operation_state_owned.png");
}
.apartment_iconImg_float2 {
  background-image: url("~@/assets/img/apartment_map/private_state_owned.png");
}
.apartment_iconImg_float3 {
  background-image: url("~@/assets/img/apartment_map/privately_operated.png");
}
.apartment_iconImg_float4 {
  background-image: url("~@/assets/img/apartment_map/vanke_self-support.png");
}
</style>
