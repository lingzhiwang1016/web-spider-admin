<template>
  <el-dialog custom-class="el-dialog-one" title="编辑城市经济情况" :visible.sync="dialogVisible">
    <div>
        <el-form :model="basicForm" ref="basicForm" :rules="basicFormRules" label-position="right" label-width="120px">
            <el-row :gutter="20">
                <el-col :span="24">
                    <el-form-item label="城市GDP" prop="cityGdp">
                        <el-input type="text" class="unitTwo" v-model="basicForm.cityGdp">
                          <template slot="append">万元</template>
                        </el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="24">
                    <el-form-item label="人均GDP" prop="perCapitaGdp">
                        <el-input type="text"  class="unitTwo" v-model="basicForm.perCapitaGdp">
                          <template slot="append">万元</template>
                        </el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="24">
                    <el-form-item label="人均可支配收入" prop="perCapitaDisposableIncome">
                        <el-input type="text" class="unitTwo" v-model="basicForm.perCapitaDisposableIncome">
                          <template slot="append">万元</template>
                        </el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="24">
                    <el-form-item label="私人机动车保有量" prop="privateVehicleOwnership">
                        <el-input type="text" class="unitTwo" v-model="basicForm.privateVehicleOwnership">
                          <template slot="append">万辆</template>
                        </el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="24">
                    <el-form-item label="数据源" prop="sourcesOfDate">
                        <el-input type="text" v-model="basicForm.sourcesOfDate"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
    </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="default" @click="close">取消</el-button>
        <el-button type="primary" @click="onConfirm">确定</el-button>
      </div>
  </el-dialog>
</template>

<script>
export default {
    name: "hello",
    props: {
        propData: [Object],
        onUpdata: [Function]
    },
    data() {
        return {
            dialogVisible: false,
            basicForm: {
                id: "",
                city: this.$store.state.city || "350200",
                cityGdp: "",
                perCapitaGdp: "",
                perCapitaDisposableIncome: "",
                privateVehicleOwnership: "",
                sourcesOfDate: ""
            },
            basicFormRules: {
                cityGdp: [{ pattern: /^\d+(\.\d+)?$/, message: "必须为不小于0的数字", trigger: "blur" }],
                perCapitaGdp: [{ pattern: /^\d+(\.\d+)?$/, message: "必须为不小于0的数字", trigger: "blur" }],
                perCapitaDisposableIncome: [{ pattern: /^\d+(\.\d+)?$/, message: "必须为不小于0的数字", trigger: "blur" }],
                privateVehicleOwnership: [{ pattern: /^\d+(\.\d+)?$/, message: "必须为不小于0的数字", trigger: "blur" }]
            }
        };
    },

    methods: {
        open() {
            this.dialogVisible = true;
            this.initState();
        },
        close() {
            this.dialogVisible = false;
            this.$refs.basicForm.resetFields();
        },
        onConfirm() {
            this.$refs.basicForm.validate((valid) => {
                if (valid) {
                    this.$request({
                        url: this.$api.city_economy_add,
                        method: "post",
                        data: this.basicForm
                    }).then(res => {
                        this.close();
                        this.$message({
                            type: "success",
                            message: "更新成功"
                        });
                        this.onUpdata();
                    }).catch(err => {
                        this.$logger.log("err", err);
                    });
                } else {
                    return false;
                }
            });
        },
        initState() {
            for (const item in this.basicForm) {
                this.basicForm[item] = this.propData[item] || "";
            }
            this.basicForm.city = this.$store.state.city || "350200";
        }
    },
    created() { },
    mounted: function () {
    }
};
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<!-- <style src="@/assets/less/vankely/city_data/economy.less" lang="less" scoped></style> -->
