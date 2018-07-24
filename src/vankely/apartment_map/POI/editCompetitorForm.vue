<template>
    <div class="edit-competitor-window">
        <el-form :model="apartment" ref="basicform" :rules="apartmentsRules" label-position="right">
            <div class="item-container">
                <el-button class="close-btn" type="text" @click="removeHouseTyp()"  v-if="+apartment.sourceState===1&&addHouseTypeLength!==1"><i class="el-icon-close"></i></el-button>
                <div class="header-container" v-if="+apartment.sourceState!==1">
                    <div class="header-row">
                        <div class="header-col">
                            <el-form-item label-width="75px" label="户型" prop="houseType">
                                <div class="formItem houseType input-enable-item">
                                    {{apartment.houseType}}
                                </div>
                            </el-form-item>
                        </div>
                        <div class="header-col">
                            <el-form-item label-width="97px" label="剩余房间数" prop="surplusNum">
                                <el-input type="text" v-model="apartment.surplusNum"/>
                            </el-form-item>
                        </div>
                    </div>
                </div>
                <div class="row-container" v-if="+apartment.sourceState===1">
                    <div class="row-container_col">
                        <el-form-item label-width="88px" label="户型" prop="houseType" v-if="+apartment.sourceState===1">
                            <el-input type="text" v-model="apartment.houseType" />
                        </el-form-item>
                    </div>
                    <div class="row-container_col">
                        <el-form-item label-width="97px" label="剩余房间数" prop="surplusNum">
                            <el-input type="text" v-model="apartment.surplusNum"/>
                        </el-form-item>
                    </div>
                </div>
                <div class="row-container">
                    <el-row :gutter="5">
                        <div class="show-container" v-if="+apartment.sourceState!==1">
                            <div class="row">
                                面积范围
                                <div class="input-enable-item areaRange">
                                    <div class="formItem minArea">{{apartment.minArea}}  </div>
                                    -
                                    <div class="formItem maxArea">{{apartment.maxArea}}</div>
                                    ㎡
                                </div>
                            </div>
                            <div class="row">
                                租金范围
                                <div class="input-enable-item priceRange">
                                    <div class="formItem minPrice">{{apartment.minPrice}}  </div>
                                    -
                                    <div class="formItem maxPrice">{{apartment.maxPrice}}</div>
                                    元
                                </div>
                            </div>
                        </div>
                        <div class="input-range-container areaRange" v-if="+apartment.sourceState===1">
                            <div class="input-range">
                                <div class="input-title">
                                面积范围
                                </div>
                                <div class="input-range_inner">
                                    <div class="input-range-item">
                                        <el-form-item prop="minArea">
                                            <el-input type="text" v-model="apartment.minArea" placeholder="最小"/>
                                        </el-form-item>
                                    </div>
                                    <div class="input-middle"></div>
                                    <div class="input-range-item">
                                        <el-form-item prop="maxArea">
                                            <el-input type="text" v-model="apartment.maxArea" placeholder="最大"/>
                                        </el-form-item>
                                    </div>
                                    <div class="input-end">
                                        ㎡
                                    </div>
                                </div>
                            </div>                        
                            <div class="input-range">
                                <div class="input-title">
                                租金范围
                                </div>
                                <div class="input-range_inner">
                                    <div class="input-range-item">
                                        <el-form-item prop="minPrice">
                                            <el-input type="text" v-model="apartment.minPrice" placeholder="最小"/>
                                        </el-form-item>
                                    </div>
                                    <div class="input-middle"></div>
                                    <div class="input-range-item">
                                        <el-form-item prop="maxPrice">
                                            <el-input type="text" v-model="apartment.maxPrice" placeholder="最大"/>
                                        </el-form-item>
                                    </div>
                                    <div class="input-end">
                                        元
                                    </div>
                                </div>
                            </div>
                        </div>
                    </el-row>                  
                </div>
                <el-row :gutter="5">
                    <div class="input-range-container imgs-container">
                        <el-col :span="24">
                            <el-form-item label-width="75px" label="上传照片" prop="attachmentIds">
                                <vk-file-upload
                                :uploadFile=false
                                fileType=".jpg,.png,.image"
                                :fileSizeLimit=1
                                :arrayLength=4
                                :fileArray="fileArray"
                                @fileArrayFun="fileArrayFun"
                                :styleOfFile="styleOfFile"
                                />
                            </el-form-item>
                        </el-col>
                        <span class="left_tip">最多上传4张图片, 大小在1MB以内</span>
                    </div>
                </el-row>
            </div>
        </el-form>
    </div>
</template>

<script>

export default {
    name: "add-window",
    props: {
        addHouseTypeLength: {
            default: 1
        },
        apartment: {
            fileArray: []
        }
    },
    data() {
        return {
            apartmentsRules: {
                houseType: [
                    {
                        required: true,
                        message: "未填写户型名称",
                        trigger: "blur"
                    },
                    {
                        max: 14,
                        message: "户型名称长度不能超过14位",
                        trigger: "blur"
                    }
                ],
                minArea: [
                    {
                        pattern: /^\d+$/,
                        message: "请输入整数",
                        trigger: "blur"
                    },
                    {
                        pattern: /^[1-9](\d){0,8}?$|0$/,
                        message: "不能超过9位",
                        trigger: "blur"
                    }
                ],
                maxArea: [
                    {
                        pattern: /^\d+$/,
                        message: "请输入整数",
                        trigger: "blur"
                    },
                    {
                        pattern: /^[1-9](\d){0,8}?$|0$/,
                        message: "不能超过9位",
                        trigger: "blur"
                    }
                ],
                minPrice: [
                    {
                        pattern: /^\d+$/,
                        message: "请输入整数",
                        trigger: "blur"
                    },
                    {
                        pattern: /^[1-9](\d){0,8}?$|0$/,
                        message: "不能超过9位",
                        trigger: "blur"
                    }
                ],
                maxPrice: [
                    {
                        pattern: /^\d+$/,
                        message: "请输入整数",
                        trigger: "blur"
                    },
                    {
                        pattern: /^[1-9](\d){0,8}?$|0$/,
                        message: "不能超过9位",
                        trigger: "blur"
                    }
                ],
                surplusNum: [
                    {
                        pattern: /^\d+$/,
                        message: "请输入整数",
                        trigger: "blur"
                    },
                    {
                        pattern: /^[1-9](\d){0,8}?$|0$/,
                        message: "剩余房间数长度不能超过9位",
                        trigger: "blur"
                    }
                ]
            },
            fileArray: [],
            styleOfFile: {
                width: "130px",
                height: "65px"
            }
        };
    },
    watch: {
        apartment: {
            deep: true,
            handler(val) {
                this.fileArray = val.fileArray;
                this.$emit("update:apartment", val);
            }
        }
    },
    methods: {
        valid() {
            let valid;
            this.$refs.basicform.validate((res) => {
                valid = res;
            });
            return valid;
        },
        removeHouseTyp() {
            this.$emit("removeHouseTyp", this.apartment);
        },
        fileArrayFun(val) {
            if (val) {
                const attachmentIds = [];
                val.forEach(item => {
                    attachmentIds.push(item.id);
                });
                this.$set(this.apartment, "attachmentIds", attachmentIds);
                this.$set(this.apartment, "fileArray", val);
            }
        }
    },
    created() {
        this.fileArray = this.apartment.fileArray;
    },
    beforeUpdated() {
        this.fileArray = this.apartment.fileArray;
    }
};
</script>

<style lang="less" scoped>
.header-container {
  .header-row {
    &::after {
      content: "";
      display: block;
      clear: both;
    }
    .header-col {
      float: left;
      width: 360px;
      margin-bottom: 20px;
      &:nth-child(2) {
        width: 337px;
        margin-left: 15px;
      }
    }
  }
}
.row-container {
  // width: 240px;
  margin-bottom: 20px;
  &::after {
    content: "";
    display: block;
    clear: both;
  }
  .row-container_col {
    width: 328px;
    float: left;
    &:nth-child(2) {
      width: 335px;
    }
  }
}
.el-select {
  display: block;
}
.item-container {
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  margin-bottom: 20px;
  padding: 30px 0px 0px 30px;
  position: relative;
  .close-btn {
    position: absolute;
    right: 5px;
    top: -2px;
  }
}
.input-range-container {
  display: flex;
  align-items: center;
  margin-left: 24px;
  margin-bottom: 0px;
  color: #999;
  line-height: 30px;
  font-size: 14px;
  &.imgs-container {
    margin-left: 11px;
    display: block;
    .left_tip {
      margin-left: 76px;
    }
  }
  .input-range {
    display: flex;
    justify-content: center;
    align-items: center;
    &:nth-child(2) {
      margin-left: 30px;
    }
    .input-range_inner {
      width: 240px;
      margin-left: 10px;
      display: flex;
      justify-content: center;
      align-items: center;
      border: 1px solid #e8e8e8;
      border-radius: 4px;
      .el-form-item {
        margin-left: 10px;
        .el-form-item__content {
          margin-left: 0px !important;
          input {
            line-height: 30px;
            font-size: 14px;
            width: 90px;
            border: none;
          }
        }
      }
      .input-middle {
        width: 7px;
        height: 1px;
        background: #333;
      }
    }
  }
}
.show-container {
  margin-left: 20px;
  display: flex;
  .row {
    display: flex;
    align-items: center;
    margin-bottom: 0px;
    color: #999;
    line-height: 30px;
    font-size: 14px;
    .formItem {
      font-size: 14px;
      line-height: 32px;
      height: 32px;
      width: 120px;
      &.maxArea {
        padding-left: 10px;
      }
      &.maxPrice {
        padding-left: 10px;
      }
    }
  }
  .row:nth-child(2n) {
    margin-left: 82px;
  }
}
.input-enable-item {
  background: #f7f7f7;
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  font-size: 14px;
  padding: 0 10px;
  width: 240px;
  margin-left: 10px;
  display: flex;
  .areaRange {
    width: 250px;
  }
  .priceRange {
    width: 250px;
  }
}
</style>
