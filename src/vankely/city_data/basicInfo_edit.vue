<template>
  <el-dialog custom-class="el-dialog-two" title="编辑基本人口信息" :visible.sync="dialogVisible">
      <div class="dialog-edit">
          <el-form :model="basicForm" ref="basicForm" :rules="basicFormRules" label-position="right" label-width="120px">
              <el-row :gutter="20">
                  <el-col :span="12">
                      <el-form-item label="常住人口" prop="permanent">
                          <el-input type="text" v-model="basicForm.permanent">
                            <template slot="append">人</template>
                          </el-input>
                      </el-form-item>
                  </el-col>
              </el-row>
              <el-row :gutter="20">
                  <el-col :span="12">
                      <el-form-item label="数据源" prop="sourcesOfDate">
                          <el-input type="text"  class="unitTwo" v-model="basicForm.sourcesOfDate"></el-input>
                      </el-form-item>
                  </el-col>
              </el-row>
              <hr class="hr" />
              <p class="vk-content-title"><span>受教育程度</span></p>
              <el-row :gutter="20">
                  <el-col :span="12">
                      <el-form-item label="未上过学" prop="weiShangXue">
                          <el-input type="text" v-model="basicForm.weiShangXue">
                            <template slot="append">人</template>
                          </el-input>
                      </el-form-item>
                  </el-col>
                  <el-col :span="12">
                      <el-form-item label="小学" prop="xiaoXue">
                          <el-input type="text" v-model="basicForm.xiaoXue">
                            <template slot="append">人</template>
                          </el-input>
                      </el-form-item>
                  </el-col>
              </el-row>
              <el-row :gutter="20">
                  <el-col :span="12">
                      <el-form-item label="初中" prop="chuZhong">
                          <el-input type="text" v-model="basicForm.chuZhong">
                            <template slot="append">人</template>
                          </el-input>
                      </el-form-item>
                  </el-col>
                  <el-col :span="12">
                      <el-form-item label="高中" prop="gaoZhong">
                          <el-input type="text" v-model="basicForm.gaoZhong">
                            <template slot="append">人</template>
                          </el-input>
                      </el-form-item>
                  </el-col>
              </el-row>
              <hr class="hr" />
              <p class="vk-content-title"><span>年龄段</span></p>
              <el-row :gutter="20">
                  <el-col :span="12">
                      <el-form-item label="0~14岁" prop="oneToFourteen">
                          <el-input type="text" v-model="basicForm.oneToFourteen">
                            <template slot="append">人</template>
                          </el-input>
                      </el-form-item>
                  </el-col>
                  <el-col :span="12">
                      <el-form-item label="15~64岁" prop="fifteenToSixtyFour">
                          <el-input type="text" v-model="basicForm.fifteenToSixtyFour">
                            <template slot="append">人</template>
                          </el-input>
                      </el-form-item>
                  </el-col>
              </el-row>
              <el-row :gutter="20">
                  <el-col :span="12">
                      <el-form-item label="65岁及以上" prop="sixtyFiveAbove">
                          <el-input type="text" v-model="basicForm.sixtyFiveAbove">
                            <template slot="append">人</template>
                          </el-input>
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
        propIds: [Array],
        onUpdata: [Function]
    },
    data() {
        return {
            dialogVisible: false,
            basicForm: {
                ids: [],
                permanent: "",
                weiShangXue: "",
                xiaoXue: "",
                chuZhong: "",
                gaoZhong: "",
                educationNum: "",
                oneToFourteen: "",
                fifteenToSixtyFour: "",
                sixtyFiveAbove: "",
                generationNum: "",
                sourcesOfDate: "",
                city: this.$store.state.city || "350200"
            },
            basicFormRules: {
                permanent: [
                    { pattern: /^[1-9](\d+)?$/, message: "请输入正整数", trigger: "blur" }
                ],
                weiShangXue: [
                    { pattern: /^[1-9](\d+)?$|0$/, message: "请输入非负整数", trigger: "blur" }
                ],
                xiaoXue: [
                    { pattern: /^[1-9](\d+)?$|0$/, message: "请输入非负整数", trigger: "blur" }
                ],
                chuZhong: [
                    { pattern: /^[1-9](\d+)?$|0$/, message: "请输入非负整数", trigger: "blur" }
                ],
                gaoZhong: [
                    { pattern: /^[1-9](\d+)?$|0$/, message: "请输入非负整数", trigger: "blur" }
                ],
                oneToFourteen: [
                    { pattern: /^[1-9](\d+)?$|0$/, message: "请输入非负整数", trigger: "blur" }
                ],
                fifteenToSixtyFour: [
                    { pattern: /^[1-9](\d+)?$|0$/, message: "请输入非负整数", trigger: "blur" }
                ],
                sixtyFiveAbove: [
                    { pattern: /^[1-9](\d+)?$|0$/, message: "请输入非负整数", trigger: "blur" }
                ]
            }
        };
    },

    computed: {},

    methods: {
        open() {
            this.dialogVisible = true;
            this.initState();
        },
        close() {
            this.dialogVisible = false;
        },
        onConfirm() {
            this.$request({
                url: this.$api.city_economy_population_update,
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
        },
        initState() {
            this.$request({
                url: this.$api.city_economy_population,
                method: "get",
                path: { ids: this.propIds }
            }).then(res => {
                for (const item in this.basicForm) {
                    this.basicForm[item] = res.data[item] || "";
                }
                this.basicForm.city = this.$store.state.city || "350200";
            }).catch(err => {
                this.$logger.log("err", err);
            });
        }
    },
    created() { },
    mounted: function () {
    }
};
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<!-- <style src="@/assets/less/vankely/city_data/economy.less" lang="less" scoped></style> -->
