<template lang="html">
    <div class="editAddCompetitor-container">
        <el-dialog :show-close="showClose" custom-class="el-dialog-one add-window" :title="title" :visible="visible" >
            <el-form :model="basicForm" ref="basicForm" :rules="basicFormRules" label-position="right" label-width="120px">
                <div class="header-container">
                    <div class="header-row" v-if="+basicForm.sourceState!==1" >
                        <div class="header-col">
                            <el-form-item label="公寓名称" prop="name">
                                <div class="name input-enable-item" v-if="+basicForm.sourceState!==1">
                                    {{basicForm.name}}
                                </div>
                            </el-form-item>
                        </div>
                        <div class="header-col">
                            <el-form-item label-width="75px" label="公寓类型" prop="operationSubject">
                            <el-select v-model="basicForm.operationSubject" placeholder="请选择">
                                <el-option v-for="item in allDepotType" :key="item.code" :label="item.codeText" :value="item.code"></el-option>
                            </el-select>
                            </el-form-item>
                        </div>
                    </div>
                    <div class="header-row-input" v-if="+basicForm.sourceState===1">
                        <div class="header-col-input">
                            <el-form-item label="公寓名称" prop="name">
                                <el-input type="text" v-model="basicForm.name"/>
                            </el-form-item>
                        </div>
                        <div class="header-col-input">
                            <el-form-item label-width="75px" label="公寓类型" prop="operationSubject">
                            <el-select v-model="basicForm.operationSubject" placeholder="请选择">
                                <el-option v-for="item in allDepotType" :key="item.code" :label="item.codeText" :value="item.code"></el-option>
                            </el-select>
                            </el-form-item>
                        </div>
                    </div>
                </div>
                <el-row :gutter="5">
                <el-form-item label-width="122px" label="公寓地址" required>
                    <div class="list">
                        <div class="left">
                            <el-select v-model="basicForm.city" placeholder="请选择" v-if="+basicForm.sourceState===1">
                                <el-option v-for="item in allCity" :key="item.code" :label="item.codeText" :value="item.code"></el-option>
                            </el-select>
                            <div class="city input-enable-item" v-if="+basicForm.sourceState!==1">
                                {{basicForm.cityName}}
                            </div>
                        </div>
                        <div class="left">
                        <el-form-item prop="county">
                            <el-select v-model="basicForm.county" placeholder="请选择"  v-if="+basicForm.sourceState===1">
                                <el-option v-for="item in allCounty" :key="item.code" :label="item.codeText" :value="item.code"></el-option>
                            </el-select>
                        </el-form-item>
                            <div class="county input-enable-item" v-if="+basicForm.sourceState!==1">
                                {{basicForm.countyName}}
                            </div>
                        </div>
                        <div class="right">
                        <el-form-item prop="addressConcrete">
                            <el-input type="text" v-model="basicForm.addressConcrete" placeholder="请输入详细地址" v-if="+basicForm.sourceState===1"/>
                        </el-form-item>
                            <div class="address input-enable-item" v-if="+basicForm.sourceState!==1">
                                {{basicForm.addressConcrete}}
                            </div>
                        </div>
                    </div>
                </el-form-item>
                </el-row>
                <div class="header-container">
                    <div class="header-row-input" v-if="+basicForm.sourceState===1">
                        <div class="header-col-input">
                            <el-form-item label="品牌" prop="brand">
                                <el-input type="text" v-model="basicForm.brand"/>
                            </el-form-item>
                        </div>
                    </div>
                </div>
                <div class="header-container">
                    <div class="header-row" v-if="+basicForm.sourceState!==1">
                        <div class="header-col">
                            <el-form-item label="品牌" prop="brand">
                            <div class="brand input-enable-item">
                                {{basicForm.brand}}
                            </div>
                            </el-form-item>
                        </div>
                    </div>
                </div>
            </el-form>
            <div class="apartment" v-for="apartment in basicForm.apartments">
                <editCompetitorForm :apartment.sync="apartment" :addHouseTypeLength="addHouseTypeLength" @apartmentValidMethod="apartmentValidMethod" @removeHouseTyp="removeHouseTyp"
                ref="editCompetitorForm"></editCompetitorForm>
            </div>
            <div class="add-btn-container" v-if="addHouseTypeLength < 5">
                <i class="el-icon-plus icon-add"></i>
                <el-button type="text" @click="addHouseType()">添加户型</el-button>
            </div>

            <div slot="footer" class="dialog-footer">
                <el-button type="default" @click="onClose">取消</el-button>
                <el-button type="primary" @click="onAdd">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script type="text/javascript">
import location from "@/generated/location.json";
import dict, { DEPOT_TYPE, DEPOT_QUALITY, APARTMENT_OPERATION_SUBJECT } from "@/net/dict.js";
import editCompetitorForm from "./editCompetitorForm.vue";
export default {
    name: "add-window",
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        CompetitorDialogType: {
            type: String,
            default: "ADRESS"
        },
        title: String,
        ids: {}
    },
    data() {
        return {
            apartmentValid: true,
            addHouseTypeLength: 1,
            webId: 1,
            fileArray: [],
            apartment: {
                fileArray: []
            },
            basicForm: {
                ids: [],
                province: "350000",
                city: null,
                county: null,
                address: null,
                addressConcrete: null,
                township: null,
                street: null,
                streetstreetNumber: null,
                brand: null,
                name: null,
                operationSubject: null,
                locationAddress: null,
                addressComponent: {
                    province: null,
                    city: null,
                    district: null,
                    township: null,
                    street: null,
                    streetNumber: null
                },
                apartments: [{
                    address: null,
                    addressConcrete: null,
                    aprattachmentIds: [],
                    areaRange: null,
                    asc: null,
                    attachmentIds: [],
                    averageArea: null,
                    averagePrice: null,
                    brand: null,
                    city: null,
                    county: null,
                    createBy: null,
                    createTime: null,
                    delFlg: null,
                    fields: null,
                    fileArray: [],
                    geoHash: null,
                    houseType: null,
                    id: null,
                    keyword: null,
                    lat: null,
                    lng: null,
                    maxArea: null,
                    maxPrice: null,
                    minArea: null,
                    minPrice: null,
                    name: null,
                    operationSubject: null,
                    orderBy: null,
                    priceRange: null,
                    province: null,
                    remark: null,
                    surplusNum: null,
                    updateBy: null,
                    webId: new Date().getTime(),
                    sourceState: 1
                }]
            },
            basicFormRules: {
                name: [
                    {
                        required: true,
                        message: "未填写公寓名称",
                        trigger: "blur"
                    },
                    {
                        max: 14,
                        message: "公寓名称长度不能超过14位",
                        trigger: "blur"
                    }
                ],
                // operationSubject: [],
                brand: [
                    {
                        required: true,
                        message: "未填写品牌名称",
                        trigger: "blur"
                    },
                    {
                        max: 14,
                        message: "品牌名称长度不能超过14位",
                        trigger: "blur"
                    }
                ],
                county: [
                    {
                        required: true,
                        message: "未填写区县",
                        trigger: "blur"
                    }
                ],
                addressConcrete: [
                    {
                        required: true,
                        message: "请输入详细地址",
                        trigger: "blur"
                    },
                    {
                        max: 25,
                        message: "地址长度不能超过25位",
                        trigger: "blur"
                    }
                ],
                apartments: {
                    houseType: [
                        {
                            required: true,
                            message: "未填写品牌名称",
                            trigger: "blur"
                        },
                        {
                            max: 14,
                            message: "品牌名称长度不能超过14位",
                            trigger: "blur"
                        }
                    ],
                    minArea: [
                        {
                            pattern: /^[1-9](\d+)?$|0$/,
                            message: "请输入数字",
                            trigger: "blur"
                        },
                        {
                            pattern: /^[1-9](\d){0,9}?(\.(\d+)?)?$|0$/,
                            message: "最小租金整数长度不能超过10位",
                            trigger: "blur"
                        },
                        {
                            pattern: /^[1-9](\d){0,9}?(\.(\d+))?$|0$/,
                            message: "请输入正确的数字格式",
                            trigger: "blur"
                        },
                        {
                            pattern: /^[1-9](\d){0,9}?(\.(\d){1,2})?$|0$/,
                            message: "请最多保留两位小数点",
                            trigger: "blur"
                        }
                    ],
                    maxArea: [
                        {
                            pattern: /^[1-9](\d+)?$|0$/,
                            message: "请输入数字",
                            trigger: "blur"
                        },
                        {
                            pattern: /^[1-9](\d){0,9}?(\.(\d+)?)?$|0$/,
                            message: "最大租金整数长度不能超过10位",
                            trigger: "blur"
                        },
                        {
                            pattern: /^[1-9](\d){0,9}?(\.(\d+))?$|0$/,
                            message: "请输入正确的数字格式",
                            trigger: "blur"
                        },
                        {
                            pattern: /^[1-9](\d){0,9}?(\.(\d){1,2})?$|0$/,
                            message: "请最多保留两位小数点",
                            trigger: "blur"
                        }
                    ],
                    minPrice: [
                        {
                            pattern: /^[1-9](\d+)?$|0$/,
                            message: "请输入数字",
                            trigger: "blur"
                        },
                        {
                            pattern: /^[1-9](\d){0,9}?(\.(\d+)?)?$|0$/,
                            message: "最小租金整数长度不能超过10位",
                            trigger: "blur"
                        },
                        {
                            pattern: /^[1-9](\d){0,9}?(\.(\d+))?$|0$/,
                            message: "请输入正确的数字格式",
                            trigger: "blur"
                        },
                        {
                            pattern: /^[1-9](\d){0,9}?(\.(\d){1,2})?$|0$/,
                            message: "请最多保留两位小数点",
                            trigger: "blur"
                        }
                    ],
                    maxPrice: [
                        {
                            pattern: /^[1-9](\d+)?$|0$/,
                            message: "请输入数字",
                            trigger: "blur"
                        },
                        {
                            pattern: /^[1-9](\d){0,9}?(\.(\d+)?)?$|0$/,
                            message: "最小租金整数长度不能超过10位",
                            trigger: "blur"
                        },
                        {
                            pattern: /^[1-9](\d){0,9}?(\.(\d+))?$|0$/,
                            message: "请输入正确的数字格式",
                            trigger: "blur"
                        },
                        {
                            pattern: /^[1-9](\d){0,9}?(\.(\d){1,2})?$|0$/,
                            message: "请最多保留两位小数点",
                            trigger: "blur"
                        }
                    ],
                    surplusNum: [
                        {
                            pattern: /^[1-9](\d+)?$|0$/,
                            message: "请输入整数",
                            trigger: "blur"
                        },
                        {
                            pattern: /^[1-9](\d){0,9}?$|0$/,
                            message: "剩余房间数长度不能超过10位",
                            trigger: "blur"
                        }
                    ]
                }
            },
            showClose: false,
            styleOfFile: {
                width: "120px"
            },
            locationAddress: null,
            addressComponent: {
                province: null,
                city: null,
                district: null,
                township: null,
                street: null,
                streetNumber: null
            },
            isPost: false
        };
    },
    computed: {
        city() {
            return this.$store.state.city || "350200";
        }
    },
    asyncComputed: {
        allProvince: async function () {
            return [{
                codeText: "福建省",
                code: "350000"
            }];
        },
        allCity: async function () {
            return [{
                codeText: "厦门市",
                code: "350200"
            }];
        },
        allCounty: async function () {
            const city = location.find((l) => {
                return l.districts.id === 350200 || l.districts.id === "350200";
            });
            return city.countyList.map(item => {
                return {
                    codeText: item.name,
                    code: item.id + ""
                };
            });
        },
        allDepotType: async function () {
            const res = await dict.getDictByType(APARTMENT_OPERATION_SUBJECT);
            if (!res) {
                return [];
            }
            const arr = res.filter(item => {
                return item.code !== "all_type";
            });
            return arr.map((item) => {
                return { codeText: item.codeText, code: item.code };
            });
        },
        allDepotQuality: async function () {
            const res = await dict.getDictByType(DEPOT_QUALITY);
            if (!res) {
                return [];
            }
            return res.map((item) => {
                return { codeText: item.codeText, code: item.code };
            });
        }
    },
    watch: {
        basicForm: {
            deep: true,
            handler(val) {
                this.addHouseTypeLength = val.apartments ? val.apartments.length : 0;
            }
        }
    },
    components: {
        editCompetitorForm
    },
    methods: {
        apartmentValidMethod(val) {
            this.apartmentValid = val;
        },
        // fileArrayFun(val, index) {
        //     if (val) {
        //         this.basicForm.apartments[index].attachmentIds = [];
        //         val.forEach(item => {
        //             this.basicForm.apartments[index].attachmentIds.push(item.id);
        //         });
        //         this.basicForm.apartments[index].fileArray = val;
        //     }
        // },
        onAdd() {
            let apartmentValid = true;
            this.basicForm.lng = null;
            this.basicForm.lat = null;
            if (!this.isPost) {
                this.$refs.basicForm.validate(async (valid) => {
                    if (valid) {
                        this.basicForm.apartments.forEach((apartment) => {
                            if (+apartment.maxArea && +apartment.minArea && +apartment.maxArea - +apartment.minArea < 0) {
                                this.$message.error("最小面积不能大于最大面积");
                                apartmentValid = false;
                                return false;
                            } else if (+apartment.maxPrice && +apartment.minPrice && +apartment.maxPrice - +apartment.minPrice < 0) {
                                this.$message.error("最低价格不能大于最高价格");
                                apartmentValid = false;
                                return false;
                            }
                            apartment.areaRange = null;
                            apartment.priceRange = null;
                        });
                        this.$refs.editCompetitorForm.forEach((item) => {
                            if (!item.valid()) {
                                apartmentValid = item.valid();
                            }
                        });
                        if (!apartmentValid) {
                            return false;
                        }
                        this.isPost = true;
                        await this.$request({
                            url: this.$api.apartment_poi_add_competition,
                            method: "post",
                            data: this.basicForm
                        }).then(res => {
                            this.$message({
                                message: "编辑成功",
                                type: "success"
                            });
                            this.resetbasicForm();
                            this.$emit("addFinish");
                            this.onClose();
                            this.isPost = false;
                        }).catch(err => {
                            this.$message({
                                message: err.message,
                                type: "error"
                            });
                            this.isPost = false;
                        });
                    }
                });
            }
        },
        onClose() {
            this.$emit("update:visible", false);
            this.$emit("clearRadio");
        },
        resetbasicForm() {
            for (const item in this.basicForm) {
                this.basicForm[item] = "";
            }
            this.basicForm.province = "350000";
            this.basicForm.city = "350200";
            this.basicForm.attachmentIds = [];
            // this.getImgInfo();
            this.$refs.basicForm.resetFields();
        },
        async initState() {
            if (this.CompetitorDialogType === "COMPETITOR_EDIT") {
                const idsArr = this.ids.join(",");
                const res = await this.$request({
                    url: this.$api.apartment_poi_query_ids,
                    params: {
                        ids: idsArr
                    }
                });
                if (+res.data.sourceState === 1) {
                    res.data.city = "350200";
                }
                const allDepotType = await dict.getDictByType(APARTMENT_OPERATION_SUBJECT);
                const allDepotTypeArr = allDepotType.filter(item => {
                    let operationSubject;
                    if (res.data.operationSubject === null) {
                        operationSubject = "民营";
                    } else {
                        operationSubject = res.data.operationSubject;
                    }
                    return item.codeText === operationSubject;
                });
                this.$logger.log("allDepotTypeArr", allDepotTypeArr);
                res.data.operationSubject = allDepotTypeArr[0].code;
                res.data.addressConcrete = res.data.addressConcrete ? res.data.addressConcrete : "";
                this.basicForm = res.data;
                this.getImgInfo();
            }
        },
        getImgInfo() { // 编辑页面时，通过id获取图片信息
            const apartments = [];
            this.basicForm.apartments.forEach((apartment) => {
                this.$logger.log("apartment.attachmentIds", apartment.attachmentIds);
                apartment.attachmentIds = apartment.attachmentIds ? apartment.attachmentIds : [];
                if (apartment.attachmentIds) {
                    apartment.fileArray = [];
                    apartment.attachmentIds.forEach((item, index) => {
                        apartment.fileArray.push({
                            name: "img",
                            url: this.$api.ali_download_attachmentId + "/" + item,
                            size: 1024 * 1024,
                            id: item
                        });
                    });
                }
                apartments.push(apartment);
            });
            this.$set(this.basicForm, "apartments", apartments);
        },
        addHouseType() {
            const obj = {
                address: null,
                addressConcrete: null,
                areaRange: null,
                asc: null,
                fileArray: [],
                attachmentIds: [],
                averageArea: null,
                averagePrice: null,
                brand: null,
                city: null,
                county: null,
                createBy: null,
                createTime: null,
                delFlg: null,
                fields: null,
                geoHash: null,
                houseType: null,
                id: null,
                keyword: null,
                lat: null,
                lng: null,
                maxArea: null,
                maxPrice: null,
                minArea: null,
                minPrice: null,
                name: null,
                operationSubject: null,
                orderBy: null,
                priceRange: null,
                province: null,
                remark: null,
                surplusNum: null,
                updateBy: null,
                webId: new Date().getTime(),
                sourceState: 1
            };
            this.basicForm.apartments.push(obj);
        },
        removeHouseTyp(apartment) {
            this.basicForm.apartments = this.basicForm.apartments.filter((item) => {
                let isTrue;
                if (apartment.webId && item.webId) {
                    isTrue = item.webId !== apartment.webId;
                } else {
                    isTrue = item.id !== apartment.id;
                }
                return isTrue;
            });
        }
    },
    created() {
        this.initState();
    }
};
</script>

<style lang="less" scoped>
.add-window {
  .icon-add {
    color: #1cbcb4;
    margin-right: 6px;
  }
  .header-container {
    &::after {
      content: "";
      display: block;
      clear: both;
    }
    .header-row {
      .header-col {
        float: left;
        width: 360px;
        margin-bottom: 20px;
        &:nth-child(2) {
          width: 315px;
          margin-left: 70px;
        }
      }
    }
    .header-row-input {
      .header-col-input {
        float: left;
        width: 360px;
        margin-bottom: 20px;
        &:nth-child(2) {
          width: 315px;
          margin-left: 70px;
        }
      }
    }
  }
  .list {
    margin-bottom: 20px;
    &::after {
      content: "";
      display: block;
      clear: both;
    }
    .left {
      float: left;
      margin-right: 8px;
      width: 115px;
      &:nth-child(2) {
        margin-right: 8px;
      }
    }
    .right {
      width: 380px;
      float: left;
    }
  }
  .el-select {
    display: block;
  }
  .item-container {
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
  }
  .input-range-container {
    display: flex;
    align-items: center;
    margin-left: 55px;
    margin-bottom: 20px;
    color: #999;
    line-height: 30px;
    font-size: 14px;
    .input-range {
      display: flex;
      justify-content: center;
      align-items: center;
      &:nth-child(2) {
        margin-left: 77px;
      }
      .input-range_inner {
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
  .map-list {
    display: flex;
    align-items: center;
    line-height: 32px;
    height: 32px;
    margin-left: 4px;
    margin-bottom: 20px;
    .address {
      background: #f7f7f7;
      border: 1px solid #e8e8e8;
      border-radius: 4px;
      font-size: 14px;
      padding: 0 10px;
      &.left {
        width: 128px;
        margin-right: 10px;
      }
      &.right {
        width: 381px;
      }
    }
  }
  .input-enable-item {
    background: #f7f7f7;
    border: 1px solid #e8e8e8;
    border-radius: 4px;
    font-size: 14px;
    padding: 0 10px;
    &.city {
      width: 115px;
    }
    &.county {
      width: 115px;
      margin-left: 0px;
    }
    &.address {
      width: 380px;
    }
  }
}
</style>
