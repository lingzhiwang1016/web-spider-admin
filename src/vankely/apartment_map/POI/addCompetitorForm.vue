<template>
    <div class="addCompetitorForm">
        <el-form :model="apartment" ref="basicform" :rules="apartmentsRules" label-position="right">
            <div class="addCompetitorForm_inner">
                <el-button class="close-btn" type="text" @click="removeHouseTyp()" v-if="addHouseTypeLength!==1"><i class="el-icon-close"></i></el-button>
                <div class="row-container">
                    <div class="row-container_col">
                        <div class="input-title require">*</div>
                        <div class="input-title">
                            户型
                        </div>
                        <div class="houseType">
                            <el-form-item prop="houseType">
                                <el-input type="text" v-model="apartment.houseType"/>
                            </el-form-item>
                        </div>
                    </div>
                    <div class="row-container_col">
                        <div class="input-title">
                        剩余房间数
                        </div>
                        <div class="surplusNum">
                            <el-form-item prop="surplusNum">
                                <el-input type="text" v-model="apartment.surplusNum"/>
                            </el-form-item>
                        </div>
                    </div>
                </div>
                <el-row :gutter="5">
                    <div class="input-range-container">
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
                                    元/月
                                </div>
                            </div>
                        </div>
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
                    </div>
                </el-row>
                <div class="imgs-container">
                    <el-row :gutter="5">
                        <el-col :span="24">
                            <el-form-item label="上传照片" prop="attachmentIds">
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
                    </el-row>
                </div>             
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
        apartment: {}
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
                width: "120px"
            }
        };
    },
    watch: {
        apartment: {
            // deep: true,
            handler(val) {
                this.$emit("update:apartment", val);
                this.$emit("addHouseTyp", this.apartment);
                if (this.$refs.basicForm) {
                    this.$refs.basicForm.validate((valid) => {
                        this.$emit("apartmentValidMethod", valid);
                    });
                }
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
            this.$emit("removeHouseTyp");
        },
        fileArrayFun(val) {
            if (val) {
                this.apartment.attachmentIds = [];
                val.forEach(item => {
                    this.apartment.attachmentIds.push(item.id);
                });
                this.fileArray = val;
            }
        }
    }
};
</script>

<style lang="less" scoped>
.addCompetitorForm {
  .addCompetitorForm_inner {
    border: 1px solid #e8e8e8;
    border-radius: 4px;
    margin-bottom: 20px;
    padding: 30px 30px 10px;
    position: relative;
    .close-btn {
      position: absolute;
      right: 5px;
      top: -2px;
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
        float: left;
        margin-left: 77px;
        line-height: 32px;
        color: rgb(153, 153, 153);
        .input-title {
          margin-right: 10px;
          &.require {
            color: #ff4949;
            margin-right: 0px;
          }
        }
        .houseType {
          width: 240px;
        }
        .surplusNum {
          width: 240px;
        }
        &:nth-child(2) {
          margin-left: 38px;
        }
        &::after {
          content: "";
          display: block;
          clear: both;
        }
        & > div {
          float: left;
        }
      }
    }
    .input-range-container {
      margin-bottom: 20px;
      color: #999;
      line-height: 30px;
      font-size: 14px;
      margin-left: 0px;
      &::after {
        content: "";
        display: block;
        clear: both;
      }
      .input-range {
        float: left;
        //   width: 300px;
        margin-left: 51px;
        &:nth-child(2) {
          // width: 300px;
          margin-left: 47px;
        }
        .input-title {
          float: left;
          width: 62px;
        }
        .input-range_inner {
          float: left;
          margin-left: 10px;
          width: 240px;
          border: 1px solid #e8e8e8;
          border-radius: 4px;
          &::after {
            border-radius: 4px;
            content: "";
            display: block;
            clear: both;
          }
          .input-range-item {
            float: left;
            &.input-middle {
              width: 7px;
              height: 1px;
              background: #333;
              z-index: 99;
            }
            &.input-end {
              width: 40px;
            }
          }
        }
      }
    }
  }
  .imgs-container {
    margin-left: 59px;
    .left_tip {
      margin-left: 64px;
    }
  }
}
</style>
