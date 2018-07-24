<template>
  <div>
      <div class="breadcrumb">
          <el-breadcrumb separator="/">
              <el-breadcrumb-item>停车场地图</el-breadcrumb-item>
              <el-breadcrumb-item v-if="action==='ADD'">信息录入</el-breadcrumb-item>
              <el-breadcrumb-item v-if="action==='EDIT'">信息列表</el-breadcrumb-item>
              <el-breadcrumb-item v-if="action==='EDIT'" class="breadlink" :to="{path: '/admin/parking_map/info_list?tab='+ this.$route.query.tab}">停车场信息</el-breadcrumb-item>
              <el-breadcrumb-item v-if="action==='EDIT'">信息编辑</el-breadcrumb-item>
          </el-breadcrumb>
      </div>

      <div class="vk-style-one">
          <p class="vk-top-title">
            <el-button type="default" @click="onCancle" v-if="action==='EDIT'">取消</el-button>
            <el-button type="primary" @click="onSave">保存</el-button>
          </p>
          <div class="vk-style-one-edit first">
              <el-form :model="basicForm" ref="basicForm" :rules="basicFormRules" label-position="right" label-width="120px">
                  <el-row :gutter="20">
                      <el-col :span="8">
                          <el-form-item label="停车场名称" prop="name">
                              <el-input type="text" v-model="basicForm.name"/>
                          </el-form-item>
                      </el-col>
                      <el-col :span="16"></el-col>
                  </el-row>
                  <el-row :gutter="20">
                      <el-col :span="21">
                          <el-form-item label="停车场地址" required>
                                <!-- <el-select v-model="basicForm.province" placeholder="请选择">
                                    <el-option v-for="item in allProvince" :key="item.code" :label="item.codeText" :value="item.code"></el-option>
                                </el-select> -->
                                <div class="city">
                                    {{cityName.codeText}}
                                </div>
                                <!-- <el-select v-model="basicForm.city" placeholder="请选择">
                                    <el-option v-for="item in allCity" :key="item.code" :label="item.codeText" :value="item.code"></el-option>
                                </el-select> -->
                            <el-form-item prop="county">
                                <el-select v-model="basicForm.county" placeholder="请选择">
                                    <el-option v-for="item in allCounty" :key="item.code" :label="item.codeText" :value="item.code"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item prop="addressConcrete">
                                <el-input type="text" v-model="basicForm.addressConcrete" placeholder="请输入详细地址"/>
                            </el-form-item>
                          </el-form-item>
                      </el-col>
                  </el-row>
                  <el-row :gutter="20">
                      <el-col :span="8">
                          <el-form-item label="停车场类型" prop="depotType">
                            <el-select v-model="basicForm.depotType" placeholder="请选择">
                                <el-option v-for="item in allDepotType" :key="item.code" :label="item.codeText" :value="item.code"></el-option>
                            </el-select>
                          </el-form-item>
                      </el-col>
                      <el-col :span="16"></el-col>
                  </el-row>
                  <el-row :gutter="20">
                      <el-col :span="8">
                          <el-form-item label="停车场质量" prop="depotQuality">
                            <el-select v-model="basicForm.depotQuality" placeholder="请选择">
                                <el-option v-for="item in allDepotQuality" :key="item.code" :label="item.codeText" :value="item.code"></el-option>
                            </el-select>
                          </el-form-item>
                      </el-col>
                      <el-col :span="16"></el-col>
                  </el-row>
                  <hr class="hr" />
                  <el-row :gutter="20">
                      <el-col :span="8">
                          <el-form-item label="车位数" prop="parkingNumber">
                              <el-input type="text" v-model="basicForm.parkingNumber">
                                <template slot="append">个</template>
                              </el-input>
                          </el-form-item>
                      </el-col>
                      <el-col :span="8">
                          <el-form-item label="每小时收费" prop="averagePrice">
                              <el-input type="text" v-model="basicForm.averagePrice">
                                <template slot="append">元</template>
                              </el-input>
                          </el-form-item>
                      </el-col>
                      <el-col :span="8">
                          <el-form-item label="出入口情况" prop="doorway">
                              <el-input type="text" v-model="basicForm.doorway"/>
                          </el-form-item>
                      </el-col>
                  </el-row>
                  <el-row :gutter="20">
                      <el-col :span="8">
                          <el-form-item label="负载率" prop="load">
                              <el-input type="text" v-model="basicForm.load">
                                <template slot="append">%</template>
                              </el-input>
                          </el-form-item>
                      </el-col>
                      <el-col :span="8">
                          <el-form-item label="封顶收费" prop="maxPrice">
                              <el-input type="text" v-model="basicForm.maxPrice">
                                <template slot="append">元</template>
                              </el-input>
                          </el-form-item>
                      </el-col>
                      <el-col :span="8">
                          <el-form-item label="周边情况" prop="ambitus">
                              <el-input type="text" v-model="basicForm.ambitus"/>
                          </el-form-item>
                      </el-col>
                  </el-row>
                  <el-row :gutter="20">
                      <el-col :span="8">
                          <el-form-item label="业主信息" prop="ownerMessage">
                              <el-input type="text" v-model="basicForm.ownerMessage"/>
                          </el-form-item>
                      </el-col>
                      <el-col :span="8">
                          <el-form-item label="设备" prop="equipment">
                              <el-input type="text" v-model="basicForm.equipment"/>
                          </el-form-item>
                      </el-col>
                      <el-col :span="8">
                          <el-form-item label="备注" prop="remark">
                              <el-input type="text" v-model="basicForm.remark"/>
                          </el-form-item>
                      </el-col>
                  </el-row>
                  <el-row :gutter="20">
                      <el-col :span="24">
                          <el-form-item label="导入照片" prop="attachmentIds">
                              <vk-file-upload
                                :uploadFile=false
                                fileType=".jpg,.png,.image"
                                :fileSizeLimit=1
                                :arrayLength=4
                                :fileArray="fileArray"
                                @fileArrayFun="fileArrayFun"
                              />
                          </el-form-item>
                      </el-col>
                      <span class="left_tip">最多上传4张图片, 大小在1MB以内</span>
                  </el-row>
              </el-form>
          </div>
      </div>
  </div>
</template>

<script type="text/javascript">
import location from "@/generated/location.json";
import dict, { DEPOT_TYPE, DEPOT_QUALITY } from "@/net/dict.js";
export default {
    data() {
        return {
            fileArray: [],
            basicForm: {
                name: "",
                province: "350000",
                city: "350200",
                county: "",
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
                attachmentIds: []
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
                    { required: true, message: "未填写停车场类型", trigger: "blur" }
                ],
                depotQuality: [
                    { required: true, message: "未填写停车场质量", trigger: "blur" }
                ],
                parkingNumber: [
                    {
                        pattern: /^[1-9](\d+)?$|0$/,
                        message: "请输入数字",
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
                        pattern: /^[1-9](\d+)?$|0$/,
                        message: "请输入数字",
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
                        pattern: /^[1-9](\d+)?$|0$/,
                        message: "请输入数字",
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
                        pattern: /^[1-9](\d+)?$|0$/,
                        message: "请输入数字",
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
            this.$logger.log(22);
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
        city(val) { },
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
                this.$logger.log("this.fileArray", this.fileArray);
            }
        },
        onSave() {
            this.$refs.basicForm.validate((valid) => {
                this.$logger.log("this.basicForm", this.basicForm);
                if (valid) {
                    this.$request({
                        url: this.$api.depot_add,
                        method: "post",
                        data: this.basicForm
                    }).then(res => {
                        this.$message({
                            message: this.action === "EDIT" ? "编辑成功" : "保存成功",
                            type: "success"
                        });
                        if (this.action === "EDIT") {
                            window.history.go(-1);
                        } else {
                            this.resetBasicForm();
                        }
                    }).catch(err => {
                        this.$message({
                            message: err.message,
                            type: "error"
                        });
                    });
                }
            });
        },
        onCancle() {
            window.history.go(-1);
        },
        resetBasicForm() {
            for (const item in this.basicForm) {
                this.basicForm[item] = "";
            }
            this.basicForm.province = "350000";
            this.basicForm.city = "350200";
            this.basicForm.attachmentIds = [];
            this.getImgInfo();
            this.$refs.basicForm.resetFields();
        },
        async editData() {
            const res = await this.$request({
                url: this.$api.depot_queryById,
                path: {
                    id: this.id
                }
            });
            this.basicForm = res.data;
            this.basicForm.lng = null;
            this.basicForm.lat = null;
            this.basicForm.attachmentIds = this.basicForm.attachmentIds ? this.basicForm.attachmentIds : [];
            this.getImgInfo();
        },
        initState() {
            if (this.$route.params.id) {
                this.action = "EDIT";
                this.editData();
            } else {
                this.action = "ADD";
            }
        }
    },
    created() {
        this.initState();
    }
};
</script>

<style scoped>
.city {
  flex: 1 0 212px;
  background: #f7f7f7;
  border-radius: 4px;
  height: 32px;
  border: 1px solid #e8e8e8;
  line-height: 32px;
  text-align: left;
  padding: 0px 10px;
}
</style>
