<template lang="html">
  <div class='vk-style-one'>
      <div class="vk-top-title">
          <el-button style="color: #999999;padding: 0px 13px 0 9px;" @click="toReturn"><i class="tako-icon-back"></i> 返回</el-button>
          <el-button type="primary" @click="onEdit">编辑</el-button>
      </div>

      <div class="vk-style-one-detail first">
        <p class="vk-content-title"><span>停车场信息</span></p>
        <el-row :gutter="20">
            <el-col :span="8">
                <vk-detail
                  label="停车场名称"
                  :description="detailData.name"
                  :content="detailData.name"
                  >
                </vk-detail>
            </el-col>
            <el-col :span="8">
                <vk-detail
                  label="负载率"
                  :description="detailData.load"
                  :content="detailData.load"
                  unit="%"
                  >
                </vk-detail>
            </el-col>
            <el-col :span="8">
                <vk-detail
                  label="车位数"
                  :description="detailData.parkingNumber"
                  :content="detailData.parkingNumber"
                  unit="every"
                  >
                </vk-detail>
            </el-col>
        </el-row>

        <el-row :gutter="20">
            <el-col :span="8">
                <vk-detail
                  label="停车场地址"
                  :description="detailData.address"
                  :content="detailData.address"
                  >
                </vk-detail>
            </el-col>
            <el-col :span="8">
                <vk-detail
                  label="出入口情况"
                  :description="detailData.doorway"
                  :content="detailData.doorway"
                  >
                </vk-detail>
            </el-col>
            <el-col :span="8">
                <vk-detail
                  label="每小时收费"
                  :description="detailData.averagePrice"
                  :content="detailData.averagePrice"
                  unit="￥"
                  >
                </vk-detail>
            </el-col>
        </el-row>

        <el-row :gutter="20">
            <el-col :span="8">
                <vk-detail
                  label="停车场类型"
                  :description="detailData.depotTypeName"
                  :content="detailData.depotTypeName"
                  >
                </vk-detail>
            </el-col>
            <el-col :span="8">
              <vk-detail
                label="周边情况"
                :description="detailData.ambitus"
                :content="detailData.ambitus"
                >
              </vk-detail>
            </el-col>
            <el-col :span="8">
                <vk-detail
                label="封顶收费"
                :description="detailData.maxPrice"
                :content="detailData.maxPrice"
                unit="￥"
                >
              </vk-detail>
            </el-col>
        </el-row>

        <el-row :gutter="20">
            <el-col :span="8">
                <vk-detail
                  label="停车场质量"
                  :description="detailData.qualityName"
                  :content="detailData.qualityName"
                  >
                </vk-detail>
            </el-col>
            <el-col :span="8">
              <vk-detail
                label="设备"
                :description="detailData.equipment"
                :content="detailData.equipment"
                >
              </vk-detail>
            </el-col>
            <el-col :span="8">
                <vk-detail
                label="备注"
                :description="detailData.remark"
                :content="detailData.remark"
                >
              </vk-detail>
            </el-col>
            <el-col :span="8">
                <vk-detail
                label="业主信息"
                :description="detailData.ownerMessage"
                :content="detailData.ownerMessage"
                >
              </vk-detail>
            </el-col>
        </el-row>

        <el-row :gutter="20">
            <el-col :span="24">
                <vk-detail
                    label="图片"
                    description=" "
                >
                    <div class="image-box" v-for="item,index in imgInfo" :key="index">
                        <img :src="item.imgUrl" />
                    </div>
                </vk-detail>
            </el-col>
        </el-row>
      </div>
  </div>
</template>

<script type="text/javascript">
export default {
    data() {
        return {
            detailData: {},
            imgInfo: []
        };
    },
    watch: {},
    methods: {
        toReturn() {
            window.history.go(-1);
        },
        async initState() {
            if (this.$route.query.tab === "0") {
                const res = await this.$request({
                    url: this.$api.depot_queryById,
                    path: {
                        id: this.$route.query.id
                    }
                });
                this.detailData = res.data;
                this.$emit("onDetailTitle", this.detailData.name);
                this.getImgInfo();
            }
        },
        getImgInfo() {
            if (this.detailData.attachmentIds) {
                this.imgInfo = [];
                this.detailData.attachmentIds.forEach((item, index) => {
                    this.$request({
                        url: this.$api.ali_attachmentId,
                        method: "get",
                        path: { attachmentId: item }
                    }).then(res => {
                        if (res && res.data) {
                            const obj = res.data;
                            obj.imgUrl = res.data.bucket && res.data.endpoint && res.data.alyId ? "http://" + res.data.bucket + "." + res.data.endpoint + "/" + res.data.alyId : "";
                            this.imgInfo.push(obj);
                        }
                    }).catch(err => {
                        this.$logger.log("err", err);
                    });
                });
                this.$logger.log("this.imgInfo", this.imgInfo);
            }
        },
        onEdit() {
            this.$router.push("/admin/parking_map/info_list_edit/" + this.detailData.id);
        }
    },
    created() { }
};
</script>

<style scoped></style>
