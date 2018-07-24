<template lang="html">
    <el-dialog :show-close="showClose" custom-class="el-dialog-one add-window" :title="title" :visible="visible">
        <el-form :model="basicForm" ref="basicForm" :rules="basicFormRules" label-position="right" label-width="120px">
            <el-row :gutter="5">
                <el-col :span="12">
                    <el-form-item label="停车场名称" prop="name">
                        <el-input type="text" v-model="basicForm.name"/>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="5">
            <el-form-item label="车场地址" required>
                <div class="list" v-if="DialogType==='ADRESS'">
                    <div class="left cityName">
                        <!-- <el-select v-model="basicForm.city" placeholder="请选择">
                            <el-option v-for="item in allCity" :key="item.code" :label="item.codeText" :value="item.code"></el-option>
                        </el-select> -->
                        {{cityName.codeText}}
                    </div>
                    <div class="left">
                        <el-form-item prop="county">
                        <el-select v-model="basicForm.county" placeholder="请选择">
                            <el-option v-for="item in allCounty" :key="item.code" :label="item.codeText" :value="item.code"></el-option>
                        </el-select>
                        </el-form-item>
                    </div>
                    <div class="right">
                        <el-form-item prop="addressConcrete">
                        <el-input type="text" v-model="basicForm.addressConcrete" placeholder="请输入详细地址"/>
                        </el-form-item>
                    </div>
                </div>
                <div class="map-list" v-if="DialogType==='MAP'">
                    <div class="address left">{{basicForm.addressComponent.city?basicForm.addressComponent.city:"暂无数据" }}</div>
                    <div class="address left">{{basicForm.addressComponent.county?basicForm.addressComponent.county:"暂无数据" }}</div>
                    <div class="address right">
                        {{basicForm.addressConcrete ? basicForm.addressConcrete : "暂无数据"}}
                    </div>
                </div>
            </el-form-item>
            </el-row>
            <el-row :gutter="5">
                <el-col :span="12">
                    <el-form-item label="停车场类型" prop="depotType">
                    <el-select v-model="basicForm.depotType" placeholder="请选择">
                        <el-option v-for="item in allDepotType" :key="item.code" :label="item.codeText" :value="item.code"></el-option>
                    </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="停车场质量" prop="depotQuality">
                    <el-select v-model="basicForm.depotQuality" placeholder="请选择">
                        <el-option v-for="item in allDepotQuality" :key="item.code" :label="item.codeText" :value="item.code"></el-option>
                    </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="5">
                <el-col :span="12">
                    <el-form-item label="车位数" prop="parkingNumber">
                        <el-input type="text" v-model="basicForm.parkingNumber">
                        <template slot="append">个</template>
                        </el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="负载率" prop="load">
                        <el-input type="text" v-model="basicForm.load">
                        <template slot="append">%</template>
                        </el-input>
                    </el-form-item>
                </el-col>                      
            </el-row>
            <el-row :gutter="5">
                <el-col :span="12">
                    <el-form-item label="每小时收费" prop="averagePrice">
                        <el-input type="text" v-model="basicForm.averagePrice">
                        <template slot="append">元</template>
                        </el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="业主信息" prop="ownerMessage">
                        <el-input type="text" v-model="basicForm.ownerMessage"/>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="5">
                <el-col :span="12">
                    <el-form-item label="封顶收费" prop="maxPrice">
                        <el-input type="text" v-model="basicForm.maxPrice">
                        <template slot="append">元</template>
                        </el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="出入口情况" prop="doorway">
                        <el-input type="text" v-model="basicForm.doorway"/>
                    </el-form-item>
                </el-col>                      
            </el-row>
            <el-row :gutter="5">
                <el-col :span="12">
                    <el-form-item label="设备" prop="equipment">
                        <el-input type="text" v-model="basicForm.equipment"/>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="周边情况" prop="ambitus">
                        <el-input type="text" v-model="basicForm.ambitus"/>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="5">
                <el-col :span="24">
                    <el-form-item label="备注" prop="remark">
                        <el-input type="text" v-model="basicForm.remark"/>
                    </el-form-item>
                </el-col>
            </el-row>                  
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
        </el-form>

        <div slot="footer" class="dialog-footer">
            <el-button type="default" @click="onClose">取消</el-button>
            <el-button type="primary" @click="onAdd">确定</el-button>
        </div>
    </el-dialog>
</template>

<script type="text/javascript">
import location from "@/generated/location.json";
import dict, { DEPOT_TYPE, DEPOT_QUALITY } from "@/net/dict.js";
export default {
    name: "add-window",
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        DialogType: {
            type: String,
            default: "ADRESS"
        },
        row: {
            locationType: null,
            locationName: null,
            locationAddress: null,
            addressComponent: {
                province: null,
                city: null,
                district: null,
                township: null
            },
            country: null,
            countys: this.countys,
            id: null,
            lng: null,
            lat: null
        },
        title: String
    },
    data() {
        return {
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
                name: "",
                addressConcrete: "",
                depotType: "",
                depotQuality: "",
                parkingNumber: "",
                load: "",
                averagePrice: "",
                maxPrice: "",
                ownerMessage: "",
                equipment: "",
                doorway: "",
                ambitus: "",
                remark: "",
                attachmentIds: [],
                lng: null,
                lat: null,
                isPost: false
            },
            basicFormRules: {
                name: [
                    {
                        required: true,
                        message: "未填写停车场名称",
                        trigger: "blur"
                    },
                    {
                        max: 14,
                        message: "停车场名称长度不能超过14位",
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
                    }
                ],
                depotType: [
                    { required: true, message: "未填写停车场类型", trigger: "change" }
                ],
                depotQuality: [
                    { required: true, message: "未填写停车场质量", trigger: "change" }
                ],
                parkingNumber: [
                    {
                        pattern: /^\d+$/,
                        message: "请输入整数",
                        trigger: "blur"
                    },
                    {
                        pattern: /^[1-9](\d){0,7}?$|0$/,
                        message: "车位数长度不能超过8位",
                        trigger: "blur"
                    }
                ],
                averagePrice: [
                    {
                        pattern: /^\d+$/,
                        message: "请输入整数",
                        trigger: "blur"
                    },
                    {
                        pattern: /^[1-9](\d){0,4}?(\.(\d+)?)?$|0$/,
                        message: "每小时收费整数长度不能超过5位",
                        trigger: "blur"
                    },
                    {
                        pattern: /^[1-9](\d){0,4}?(\.(\d+))?$|0$/,
                        message: "请输入正确的数字格式",
                        trigger: "blur"
                    },
                    {
                        pattern: /^[1-9](\d){0,4}?(\.(\d){1,2})?$|0$/,
                        message: "请最多保留两位小数点",
                        trigger: "blur"
                    }
                ],
                doorway: [
                    {
                        max: 20,
                        message: "出入口情况长度不能超过20位",
                        trigger: "blur"
                    }
                ],
                load: [
                    {
                        pattern: /^\d+$/,
                        message: "请输入整数",
                        trigger: "blur"
                    },
                    {
                        pattern: /^[1-9](\d){0,4}?(\.(\d+)?)?$|0$/,
                        message: "负载率整数长度不能超过5位",
                        trigger: "blur"
                    },
                    {
                        pattern: /^[1-9](\d){0,4}?(\.(\d+))?$|0$/,
                        message: "请输入正确的数字格式",
                        trigger: "blur"
                    },
                    {
                        pattern: /^[1-9](\d){0,4}?(\.(\d){1,2})?$|0$/,
                        message: "请最多保留两位小数点",
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
                        pattern: /^[1-9](\d){0,4}?(\.(\d+)?)?$|0$/,
                        message: "封顶费用整数长度不能超过5位",
                        trigger: "blur"
                    },
                    {
                        pattern: /^[1-9](\d){0,4}?(\.(\d+))?$|0$/,
                        message: "请输入正确的数字格式",
                        trigger: "blur"
                    },
                    {
                        pattern: /^[1-9](\d){0,4}?(\.(\d){1,2})?$|0$/,
                        message: "请最多保留两位小数点",
                        trigger: "blur"
                    }
                ],
                ambitus: [
                    {
                        max: 20,
                        message: "周边情况长度不能超过20位",
                        trigger: "blur"
                    }
                ],
                ownerMessage: [
                    {
                        max: 20,
                        message: "业主信息长度不能超过20位",
                        trigger: "blur"
                    }
                ],
                equipment: [
                    {
                        max: 20,
                        message: "设备名称长度不能超过20位",
                        trigger: "blur"
                    }
                ],
                remark: [
                    {
                        max: 40,
                        message: "备注长度不能超过40位",
                        trigger: "blur"
                    }
                ]
            },
            showClose: false,
            styleOfFile: {
                width: "150px",
                height: "75px"
            }
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
            const res = await dict.getDictByType(DEPOT_TYPE);
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
            const arr = res.filter(item => {
                return item.code !== "all_quality";
            });
            return arr.map((item) => {
                return { codeText: item.codeText, code: item.code };
            });
        }
    },
    watch: {
        id(val) {
            this.resetBasicForm();
            this.initState();
        }
    },
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
        onAdd() {
            if (!this.isPost) {
                this.$refs.basicForm.validate((valid) => {
                    if (valid) {
                        this.isPost = true;
                        this.basicForm.addressComponent = null;
                        this.$request({
                            url: this.$api.depot_add,
                            method: "post",
                            data: this.basicForm
                        }).then(res => {
                            this.$message({
                                message: "新增成功",
                                type: "success"
                            });
                            this.resetBasicForm();
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
        resetBasicForm() {
            for (const item in this.basicForm) {
                this.basicForm[item] = "";
            }
            this.basicForm.attachmentIds = [];
            this.$refs.basicForm.resetFields();
        },
        initState() {
            if (this.DialogType === "MAP") {
                this.action = "EDIT";
                this.basicForm.addressComponent.city = this.row.addressComponent.city;
                this.basicForm.county = this.row.addressComponent.adcode;
                this.basicForm.addressComponent.county = this.row.addressComponent.district;
                this.basicForm.township = this.row.addressComponent.township;
                this.basicForm.street = this.row.addressComponent.street;
                this.basicForm.streetstreetNumber = this.row.addressComponent.streetstreetNumber;
                this.row.addressConcrete = this.row.addressComponent.township + this.row.addressComponent.street + this.row.addressComponent.streetNumber;
                this.basicForm.addressConcrete = this.row.addressConcrete;
                this.basicForm.lng = this.row.lng;
                this.basicForm.lat = this.row.lat;
            }
            if (this.row.depotType === "all_type") {
                this.basicForm.depotType = null;
            } else {
                this.basicForm.depotType = this.row.depotType;
            }
            if (this.row.depotQuality === "all_quality") {
                this.basicForm.depotQuality = null;
            } else {
                this.basicForm.depotQuality = this.row.depotQuality;
            }
        }
    },
    created() {
        this.initState();
    }
};
</script>

<style lang="less">
.add-window {
  width: 870px !important;
  .list {
    display: flex;
    padding-left: 2px;
    padding-bottom: 20px;
    .left {
      flex-basis: 134px;
      margin-right: 10px;
      &.cityName {
        flex: 1 0 134px;
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
      flex-basis: 397px;
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
        flex: 1 0 133px;
        margin-right: 10px;
      }
      &.right {
        flex: 1 0 397px;
      }
    }
  }
  .el-select {
    display: block;
  }
}
</style>
