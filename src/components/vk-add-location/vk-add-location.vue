<template lang="html">
    <el-dialog :show-close="showClose" custom-class="el-dialog-one" :title="title" :visible="visible">
        <el-form :model="baseForm" ref="baseForm" :rules="baseFormRules" label-position="right" label-width="130px">
            <el-row :gutter="20" type="flex" justify="center">
                 <el-col :span="20">
                    <el-form-item label="定位点名称" prop="locationName">
                        <el-input type="text" v-model="baseForm.locationName"/>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20" type="flex" justify="center">
                <el-col :span="20">
                   <el-form-item label="定位点地址">
                       <el-row :gutter="10" type="flex" justify="center">
                        <el-col :span="12">
                            <div class="city">
                                {{getCityNameByDict(baseForm.city)}}
                            </div>
                        </el-col>
                        <el-col :span="12" v-if="DialogType==='MAP'">
                            <div class="city">
                                {{baseForm.addressComponent.district ? baseForm.addressComponent.district : "暂无数据"}}
                            </div>
                        </el-col>
                        <el-col :span="12" v-if="DialogType==='ADRESS'">
                            <el-form-item  prop="county">
                               <el-select v-model="baseForm.county" placeholder="请选择" required style="width: 100%;" >
                                  <el-option v-for="item in row.countys" :key="item.id" :label="item.name" :value="item.id"></el-option>
                               </el-select>
                           </el-form-item>
                        </el-col>
                       </el-row>
                       <el-row :gutter="10" type="flex" justify="center">
                            <el-col :span="24" v-if="DialogType==='MAP'">
                                <div class="city">
                                    {{baseForm.addressComponent.township ? baseForm.addressComponent.township : "暂无数据"}}
                                    {{baseForm.addressComponent.street ? baseForm.addressComponent.street : ""}}
                                    {{baseForm.addressComponent.streetNumber ? baseForm.addressComponent.streetstreetNumber : ""}}
                                </div>
                            </el-col>
                       </el-row>
                       <el-form-item  prop="locationAddress" v-if="DialogType==='ADRESS'">
                            <el-input type="text" v-model="baseForm.locationAddress" placeholder="请输入详细地址"/>
                       </el-form-item>
                   </el-form-item>
                </el-col>
            </el-row>

        </el-form>

        <div slot="footer" class="dialog-footer">
          <el-button type="default" @click="onClose">取消</el-button>
          <el-button type="primary" @click="handleYes">确定</el-button>
        </div>
    </el-dialog>
</template>

<script>
import dict, { MAP_TYPE, LOCATION_TYPE } from "@/net/dict.js";
import location from "@/generated/location.json";

export default {
    name: "vk-add-location",
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        DialogType: {
            type: String,
            default: "ADRESS"
        },
        index: null,
        row: null,
        title: String
    },

    data() {
        return {
            baseFormRules: {
                locationName: [{ required: true, message: "请输入定位点名称" }],
                locationAddress: [{ required: true, message: "请输入详细地址" }],
                locationType: [
                    { required: true, message: "请选择定位点类型" }
                ],
                mapType: [{ required: true, message: "请选择地图类型" }],
                city: [{ required: true, message: "请选择" }],
                county: [{ required: true, message: "请选择" }]
            },

            baseForm: {
                locationName: null,
                locationAddress: null,
                mapType: null,
                locationType: null,
                addressComponent: {
                    district: null,
                    township: null
                },
                lat: null,
                lng: null,
                province: this.$store.state.province || null,
                city: this.$store.state.city || null,
                county: null
            },
            options: [],
            defaultLocation: [],
            provinces: [],
            showClose: false
        };
    },
    computed: {
        cityOptions() {
            return location.map((cityTemp) => {
                return { name: cityTemp.districts.name, id: cityTemp.districts.id };
            });
        }
    },

    methods: {
        getCityNameByDict(val) {
            let obj = {};
            obj = location.filter((element) => {
                return element.districts.id === +val;
            })[0];
            return obj.districts.name;
        },
        async cityChange(val) {
            if (this.baseForm.county) this.baseForm.county = "";
            const countyRes = await this.$request({
                url: this.$api.districts_getCityByProvince,
                method: "get",
                params: {
                    province: this.baseForm.city
                }
            });
            if (countyRes.data.length) this.countys = countyRes.data;
        },
        onClose() {
            this.$emit("update:visible", false);
            if (this.DialogType === "ADRESS") {
                this.$emit("clearRadio");
            }
        },
        handleYes() {
            this.$refs.baseForm.validate((valid) => {
                if (valid) {
                    this.onAdd();
                }
            });
        },
        onAdd() {
            this.$request({
                url: this.$api.location_add,
                method: "post",
                data: this.baseForm
            }).then((res) => {
                this.$message({
                    type: "success",
                    message: "新增成功",
                    duration: 1000
                });
                this.$emit("addFinish");
                this.onClose();
            }).catch((err) => {
                this.$message({
                    type: "error",
                    message: err.message
                });
            });
        },
        async initState() {
            const res = await this.$request({
                url: this.$api.districts_getProvince,
                method: "get"
            });
            if (res.data.length) this.provinces = res.data;
            if (this.DialogType === "MAP" && this.row) {
                this.baseForm.lat = this.row.lat;
                this.baseForm.lng = this.row.lng;
                this.baseForm.locationAddress = this.row.locationAddress;
                this.baseForm.addressComponent = this.row.addressComponent;
                this.baseForm.county = this.row.addressComponent.district;
            }
            this.baseForm.mapType = this.row.mapType;
            this.baseForm.locationType = this.row.locationType;
            this.baseForm.locationName = this.row.locationName;
        }
    },

    created: function () {
        this.initState();
    }

};
</script>

<style scoped>
.city {
  padding-left: 10px;
  line-height: 32px;
  background-color: #eee;
  border: 1px solid #ddd;
  border-radius: 3px;
}
</style>
