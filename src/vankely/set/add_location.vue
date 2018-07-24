z<template lang="html">
    <el-dialog custom-class="el-dialog-one" :title="title" :visible="visible" :before-close="onClose">
        <el-form :model="baseForm" ref="baseForm" :rules="baseFormRules" label-position="right" label-width="130px">
            <el-row :gutter="20" type="flex" justify="center">
                <el-col :span="20">
                    <el-form-item label="地图类型" prop="mapType">
                      <el-select v-model="baseForm.mapType" placeholder="请选择" required style="width: 100%;" >
                          <el-option v-for="item in mapTypes" :key="item.code" :label="item.codeText" :value="item.code"></el-option>
                      </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20" type="flex" justify="center">
                <el-col :span="20">
                    <el-form-item label="定位点类型" prop="locationType">
                      <el-select v-model="baseForm.locationType" placeholder="请选择" required style="width: 100%;" >
                          <el-option v-for="item in locationTypes" :key="item.code" :label="item.codeText" :value="item.code"></el-option>
                      </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20" type="flex" justify="center">
                 <el-col :span="20">
                    <el-form-item label="定位点名称" prop="locationName">
                        <el-input type="text" v-model="baseForm.locationName"/>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20" type="flex" justify="center">
                <el-col :span="20">
                   <el-form-item label="定位点地址" prop="locationAddress">
                       <!--<el-cascader-->
                         <!--:options="options"-->
                         <!--change-on-select-->
                         <!--v-model="defaultLocation"-->
                         <!--@change = "cascaderChange"-->
                         <!--style="width: 100%;margin-bottom: 10px;"-->
                       <!--&gt;</el-cascader>-->
                       <el-row :gutter="10" type="flex" justify="center">
                        <el-col :span="12">
                            <el-form-item   prop="city">
                               <el-select v-model="baseForm.city" placeholder="请选择" required style="width: 100%;" @change="cityChange">
                                  <el-option v-for="item in cityOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
                               </el-select>
                             </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item  prop="county">
                               <el-select v-model="baseForm.county" placeholder="请选择" required style="width: 100%;" >
                                  <el-option v-for="item in countys" :key="item.id" :label="item.name" :value="item.id"></el-option>
                               </el-select>
                           </el-form-item>
                        </el-col>
                       </el-row>
                       <el-form-item  prop="locationAddress">
                            <el-input type="text" v-model="baseForm.locationAddress"/>
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
import location from "../../generated/location.json";

export default {
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        DialogType: {
            type: String,
            default: "ADD"
        },
        index: null,
        row: null,
        title: String
    },

    data () {
        return {
            baseFormRules: {
                locationName: [{ required: true, message: "请填写定位点名称" }],
                locationType: [
                    { required: true, message: "请选择定位点类型" }
                ],
                mapType: [{ required: true, message: "请选择地图类型" }],
                city: [{ required: true, message: "请选择" }],
                county: [{ required: true, message: "请选择" }],
                locationAddress: [{ required: true, message: "请填写详细地址" }]
            },

            baseForm: {
                locationName: null,
                locationType: null,
                mapType: null,
                locationAddress: null,
                province: null,
                city: null,
                county: null
            },
            options: [],
            defaultLocation: [],
            provinces: [],
            countys: []
            // test: [350000, 350200, 350201]
        };
    },
    computed: {
        city() {
            return this.$store.state.city || "";
        },
        province() {
            return this.$store.state.province || "";
        },
        cityOptions() {
            return location.map((cityTemp) => {
                return { name: cityTemp.districts.name, id: cityTemp.districts.id };
            });
        }
    },
    asyncComputed: {
        async mapTypes() {
            const res = await dict.getDictByType(MAP_TYPE);
            if (!res) {
                return [];
            }
            //暂时
            const mapType = res.filter(index => {
                return index.codeText !== "住宅地图";
            });
            return mapType.map((item) => {
                return { code: item.code, codeText: item.codeText };
            });
        },
        async locationTypes() {
            const res = await dict.getDictByType(LOCATION_TYPE);
            if (!res) {
                return [];
            }
            return res.map((item) => {
                return { codeText: item.codeText, code: item.code };
            });
        }
    },

    watch: {
    },

    methods: {
        async cityChange (val) {
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
        //省市区联动(作废了)
        async cascaderChange(val) {
            //this.$logger.log("val", val);
            const theProvince = this.options.filter((ele) => {
                return ele.value === val[0];
            });
            if (val.length === 1) {
                this.$logger.log("该省的数据", theProvince);
                const res = await this.$request({
                    url: this.$api.districts_getCityByProvince,
                    method: "get",
                    params: {
                        province: val[0].toString()
                    }
                });
                const childCity = [];
                res.data.forEach((ele, index) => {
                    childCity.push({ label: ele.name, value: ele.id, children: [] });
                });
                theProvince[0].children = childCity;
                this.baseForm.province = val[0].toString();
                this.baseForm.city = null;
                this.baseForm.county = null;
            }
            if (val.length === 2) {
                const cityRes = await this.$request({
                    url: this.$api.districts_getCityByProvince,
                    method: "get",
                    params: {
                        province: val[0].toString()
                    }
                });
                const childCity = [];
                cityRes.data.forEach((ele, index) => {
                    childCity.push({ label: ele.name, value: ele.id, children: [] });
                });
                theProvince[0].children = childCity;
                const theCity = theProvince[0].children.filter((ele) => {
                    return ele.value === val[1];
                });
                //this.$logger.log("该省的数据", theProvince);
                //this.$logger.log("该市的数据", theCity);
                const res = await this.$request({
                    url: this.$api.districts_getAreaByCity,
                    method: "get",
                    params: {
                        city: val[1].toString()
                    }
                });
                //this.$logger.log("该市的res", res);
                res.data.forEach((ele, index) => {
                    const sec = {
                        label: ele.name,
                        value: ele.id
                    };
                    theCity[0].children.push(sec);
                });
                this.baseForm.province = val[0].toString();
                this.baseForm.city = val[1].toString();
                this.baseForm.county = null;
            }
            if (val.length === 3) {
                this.baseForm.province = val[0].toString();
                this.baseForm.city = val[1].toString();
                this.baseForm.county = val[2].toString();
            }
        },
        close () {
            this.$emit("update:visible", false);
        },
        onClose () {
            this.close();
        },
        handleYes() {
            this.$refs.baseForm.validate((valid) => {
                if (valid) {
                    if (this.DialogType === "EDIT") {
                        this.onEdit(this.index, this.row);
                    } else {
                        this.onAdd();
                    }
                }
            });
        },
        onAdd () {
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
                this.close();
            }).catch((err) => {
                this.$message({
                    type: "error",
                    message: err.message
                });
            });
        },
        onEdit(index, row) {
            this.$logger.log("row", row);
            const path = {
                id: row.id
            };
            this.$request({
                url: this.$api.location_update,
                method: "put",
                path: path,
                data: this.baseForm
            }).then((res) => {
                this.$message({
                    type: "success",
                    message: "编辑成功!",
                    duration: "1000"
                });
                this.$emit("addFinish");
                this.close();
            }).catch((err) => {
                this.$logger.log("edit err", err);
                this.$message({
                    type: "error",
                    message: err.message
                });
            });
        },
        async initState() {
            // this.$logger.log("store.state.city", this.$store.state.city);
            if (this.DialogType === "EDIT") {
                this.baseForm.mapType = this.row.mapType;
                this.baseForm.locationType = this.row.locationType;
                this.baseForm.locationName = this.row.locationName;
            }
            const res = await this.$request({
                url: this.$api.districts_getProvince,
                method: "get"
            });
            //this.$logger.log("districts_getProvince", res);
            if (res.data.length) this.provinces = res.data;
            if (this.DialogType === "EDIT" && this.row) {
                this.baseForm.locationAddress = this.row.locationAddress;
                if (this.row.city) {
                    this.baseForm.city = Number(this.row.city);
                    const countyRes = await this.$request({
                        url: this.$api.districts_getCityByProvince,
                        method: "get",
                        params: {
                            province: this.baseForm.city
                        }
                    });
                    if (countyRes.data.length) this.countys = countyRes.data;
                    if (this.row.county) this.baseForm.county = Number(this.row.county);
                }
            }
            if (this.DialogType === "ADD") {
                if (this.city) {
                    this.baseForm.city = Number(this.city);
                    const countyRes = await this.$request({
                        url: this.$api.districts_getCityByProvince,
                        method: "get",
                        params: {
                            province: this.baseForm.city
                        }
                    });
                    if (countyRes.data.length) this.countys = countyRes.data;
                }
            }
            //const arr = [];
            //            res.data.forEach((ele, index) => {
            //                arr[index] = {
            //                    label: ele.name,
            //                    value: ele.id,
            //                    children: []
            //                };
            //            });
            //            this.options = arr;
            //            if (this.DialogType === "EDIT" && this.row) {
            //                this.baseForm.locationAddress = this.row.locationAddress;
            //                if (this.row.province) {
            //                    this.defaultLocation[0] = Number(this.row.province);
            //                    this.cascaderChange(this.defaultLocation);
            //                    if (this.row.city) {
            //                        this.defaultLocation[1] = Number(this.row.city);
            //                        this.cascaderChange(this.defaultLocation);
            //                        if (this.row.county) {
            //                            this.defaultLocation[2] = Number(this.row.county);
            //                            this.cascaderChange(this.defaultLocation);
            //                        }
            //                    }
            //                }
            //            }
            //            if (this.DialogType === "ADD") {
            //                if (this.province) {
            //                    this.defaultLocation[0] = Number(this.province);
            //                    this.cascaderChange(this.defaultLocation);
            //                    if (this.city) {
            //                        this.defaultLocation[1] = Number(this.city);
            //                        this.cascaderChange(this.defaultLocation);
            //                    }
            //                }
            //            }
        }
    },

    created: function () {
        this.initState();
    }

};
</script>

<style scoped>
</style>
