<template>
    <div class="add-competitor-window">
        <el-dialog :show-close="showClose" custom-class="el-dialog-one" :title="title" :visible="visible">
            <el-form :model="basicForm" ref="basicForm" :rules="basicFormRules" label-position="right" label-width="120px">
                <div class="header-container">
                    <el-row :gutter="5">
                        <div class="name">
                            <el-col :span="12">
                                <el-form-item label="公寓名称" prop="name">
                                    <el-input type="text" v-model="basicForm.name"/>
                                </el-form-item>
                            </el-col>
                        </div>
                        <div class="operationSubject">
                            <el-col :span="12">
                                <el-form-item label="公寓类型" prop="operationSubject">
                                <el-select v-model="basicForm.operationSubject" placeholder="请选择">
                                    <el-option v-for="item in allDepotType" :key="item.code" :label="item.codeText" :value="item.code"></el-option>
                                </el-select>
                                </el-form-item>
                            </el-col>
                        </div>
                    </el-row>
                    <el-row :gutter="5">
                        <el-form-item label="公寓地址" required>
                            <div class="list" v-if="CompetitorDialogType==='COMPETITOR_ADRESS'">
                                <div class="left cityName">
                                    {{cityName.codeText}}
                                </div>
                                <div class="left county">
                                    <el-form-item prop="county">
                                    <el-select v-model="basicForm.county" placeholder="请选择">
                                        <el-option v-for="item in allCounty" :key="item.code" :label="item.codeText" :value="item.code"></el-option>
                                    </el-select>
                                    </el-form-item>
                                </div>
                                <div class="right addressConcrete">
                                    <el-form-item prop="addressConcrete">
                                    <el-input type="text" v-model="basicForm.addressConcrete" placeholder="请输入详细地址"/>
                                    </el-form-item>
                                </div>
                            </div>
                            <div class="map-list" v-if="CompetitorDialogType==='COMPETITOR_MAP'">
                                <div class="address city left">{{basicForm.addressComponent.city?basicForm.addressComponent.city:"暂无数据" }}</div>
                                <div class="address county left">{{basicForm.addressComponent.county?basicForm.addressComponent.county:"暂无数据" }}</div>
                                <div class="address addressConcrete right">
                                    {{basicForm.addressConcrete ? basicForm.addressConcrete : "暂无数据"}}
                                </div>
                            </div>
                        </el-form-item>
                    </el-row>
                    <el-row :gutter="5">
                        <el-col :span="12">
                            <el-form-item label="品牌" prop="brand">
                                <el-input type="text" v-model="basicForm.brand"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </div>
            </el-form>
            <div class="apartment" v-for="(apartment, index) in basicForm.apartments" :key="apartment.webId">
                <addCompetitorForm :apartment.sync="apartment" :addHouseTypeLength="addHouseTypeLength" @apartmentValidMethod="apartmentValidMethod" @removeHouseTyp="removeHouseTyp(index)" @addHouseTyp="addHouseTyp" ref="addCompetitorForm"></addCompetitorForm>
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
import addCompetitorForm from "./addCompetitorForm.vue";

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
        competitorRow: {
            ids: [],
            name: null,
            operationSubject: null,
            brand: null,
            province: "350000",
            city: "350200",
            county: null,
            township: null,
            street: null,
            streetstreetNumber: null,
            addressComponent: {
                province: null,
                city: null,
                district: null,
                township: null
            },
            address: null,
            addressConcrete: null,
            apartments: [{
                webId: 0,
                id: null,
                houseType: null,
                minArea: null,
                maxArea: null,
                areaRange: null,
                minPrice: null,
                maxPrice: null,
                priceRange: null,
                surplusNum: null,
                attachmentIds: [],
                fileArray: [],
                sourceState: null// 0和null是爬虫，1是人工
            }]
        }
    },
    data() {
        return {
            addHouseTypeLength: 1,
            fileArray: [],
            basicForm: {
                province: "350000",
                city: "350200",
                county: null,
                township: null,
                street: null,
                streetstreetNumber: null,
                addressComponent: {
                    province: null,
                    city: null,
                    district: null,
                    township: null
                },
                ids: [],
                name: null,
                operationSubject: null,
                brand: null,
                apartments: [{
                    address: null,
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
                    fileArray: null,
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
                ]
            },
            showClose: false,
            styleOfFile: {
                width: "120px"
            },
            apartmentValid: true,
            isPost: false
        };
    },
    computed: {
        city() {
            return this.$store.state.city || "350200";
        },
        id() {
            return this.$route.params.id;
        },
        cityName() {
            const allCity = [{
                codeText: "厦门市",
                code: "350200"
            }];
            return allCity.filter((item) => {
                return this.basicForm.city === item.code;
            })[0];
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
        addCompetitorForm
    },
    methods: {
        apartmentValidMethod(val) {
            this.apartmentValid = val;
        },
        fileArrayFun(val, index) {
            if (val) {
                this.basicForm.apartments[index].attachmentIds = [];
                val.forEach(item => {
                    this.basicForm.apartments[index].attachmentIds.push(item.id);
                });
                this.basicForm.apartments[index].fileArray = val;
            }
        },
        getImgInfo() { // 编辑页面时，通过id获取图片信息
            if (this.basicForm.attachmentIds) {
                this.fileArray = [];
                this.basicForm.attachmentIds.forEach((item, index) => {
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
        onAdd() {
            let apartmentValid = true;
            if (!this.isPost) {
                this.$refs.basicForm.validate((valid) => {
                    if (valid) {
                        if (this.basicForm.apartments) {
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
                        }
                        if (this.$refs.addCompetitorForm) {
                            this.$refs.addCompetitorForm.forEach((item) => {
                                if (!item.valid()) {
                                    apartmentValid = item.valid();
                                }
                            });
                        }
                        if (!apartmentValid) {
                            return false;
                        }
                        this.isPost = true;
                        this.$request({
                            url: this.$api.apartment_poi_add_competition,
                            method: "post",
                            data: this.basicForm
                        }).then(res => {
                            this.$message({
                                message: "新增成功",
                                type: "success"
                            });
                            // this.resetbasicForm();
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
            this.$emit("clearRadio");
            this.$emit("update:visible", false);
        },
        async editData() {
            const res = await this.$request({
                url: this.$api.depot_queryById,
                path: {
                    id: this.id
                }
            });
            this.basicForm = res.data;
            this.basicForm.attachmentIds = this.basicForm.attachmentIds ? this.basicForm.attachmentIds : [];
            this.getImgInfo();
        },
        initState() {
            if (this.CompetitorDialogType === "COMPETITOR_MAP") {
                this.editData();
                this.basicForm.addressComponent.city = this.competitorRow.addressComponent.city;
                this.basicForm.county = this.competitorRow.addressComponent.adcode;
                this.basicForm.addressComponent.county = this.competitorRow.addressComponent.district;
                this.basicForm.township = this.competitorRow.addressComponent.township;
                this.basicForm.street = this.competitorRow.addressComponent.street;
                this.basicForm.streetstreetNumber = this.competitorRow.addressComponent.streetstreetNumber;
                this.basicForm.addressConcrete = this.competitorRow.addressComponent.township + this.competitorRow.addressComponent.street + this.competitorRow.addressComponent.streetNumber;
                this.basicForm.lng = this.competitorRow.lng;
                this.basicForm.lat = this.competitorRow.lat;
            }
        },
        addHouseType() {
            const obj = {
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
                fileArray: null,
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
        removeHouseTyp(index) {
            this.basicForm.apartments.splice(index, 1);
        },
        addHouseTyp(apartment) {
            this.basicForm.apartments = this.basicForm.apartments.forEach((item) => {
                if (item.webId === apartment.webId) {
                    item = apartment;
                }
            });
        }
    },
    created() {
        this.initState();
    }
};
</script>

<style lang="less" scoped>
.add-competitor-window {
  width: 850px !important;
  .icon-add {
    color: #1cbcb4;
    margin-right: 6px;
  }
  .header-container {
    margin: 10px 34px 10px 30px;
  }
  .list {
    display: flex;
    padding-left: 2px;
    padding-bottom: 20px;
    .left {
      flex: 1 0 113px;
      margin-right: 8px;
      &.cityName {
        flex: 1 0 113px;
        background: #f7f7f7;
        border-radius: 4px;
        height: 32px;
        border: 1px solid #e8e8e8;
        line-height: 32px;
        text-align: left;
        padding: 0px 10px;
      }
    }
    .right {
      flex: 1 0 354px;
    }
  }
  .el-select {
    display: block;
  }
  .item-container {
    border: 1px solid #e8e8e8;
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
    margin-bottom: 0px;
    color: #999;
    line-height: 30px;
    font-size: 14px;
    &::after {
      content: "";
      display: block;
      clear: both;
    }
    .input-range {
      float: left;
      margin-left: 41px;
      &:nth-child(2) {
        margin-left: 52px;
      }
      .input-title {
        float: left;
        width: 62px;
      }
      .input-range_inner {
        float: left;
        margin-left: 10px;
        display: flex;
        justify-content: center;
        align-items: center;
        border: 1px solid #e8e8e8;
        width: 240px;
        border-radius: 4px;
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
    margin-left: 2px;
    margin-bottom: 20px;
    .address {
      background: #f7f7f7;
      border: 1px solid #e8e8e8;
      border-radius: 4px;
      font-size: 14px;
      padding: 0 10px;
      &.left {
        flex: 1 0 113px;
        margin-right: 10px;
      }
      &.right {
        flex: 1 0 354px;
      }
    }
  }
}
</style>
