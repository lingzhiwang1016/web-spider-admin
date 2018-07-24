<template lang="html">
  <div>
      <div class="breadcrumb">
          <el-breadcrumb separator="/">
              <el-breadcrumb-item>停车场地图</el-breadcrumb-item>
              <el-breadcrumb-item>信息列表</el-breadcrumb-item>
              <el-breadcrumb-item class="breadlink" :to="{path: '/admin/parking_map/info_list?tab='+ this.$route.query.tab}">{{tabName}}</el-breadcrumb-item>
              <el-breadcrumb-item>{{detailTitle}}</el-breadcrumb-item>
          </el-breadcrumb>
      </div>
      <div class="vk-list" v-if="this.$route.query.tab !== '0'">
          <ul class="vk-tools-bar">
              <li class="filter">
              </li>
              <li class="vk-btns">
                    <el-button style="color: #999999;padding: 0px 13px 0 9px;" @click="toReturn"><i class="tako-icon-back"></i> 返回</el-button>
              </li>
          </ul>
          <el-table :data="tabelData" style="width: 100%">
            <el-table-column label="停车场名称" prop="name" show-overflow-tooltip></el-table-column>
            <el-table-column label="车位数" prop="parkingNumber" show-overflow-tooltip></el-table-column>
            <el-table-column label="负载率/%" prop="load" show-overflow-tooltip></el-table-column>
            <el-table-column label="费用/元/时" prop="averagePrice" show-overflow-tooltip></el-table-column>
            <el-table-column label="封顶费用/元" prop="maxPrice" show-overflow-tooltip></el-table-column>
            <el-table-column label="地址" prop="address" show-overflow-tooltip></el-table-column>
            <el-table-column v-if="$route.query.tab === '1'" label="车场质量" prop="qualityName" show-overflow-tooltip></el-table-column>
            <el-table-column v-if="$route.query.tab === '2'" label="车场类型" prop="depotTypeName" show-overflow-tooltip></el-table-column>
          </el-table>
          <div class="pagination">
              <el-pagination :page-sizes="[15, 30, 50, 100]" :page-size="pageSize" @size-change="handleSizeChange" @current-change="handleCurrentChange" layout="total, sizes, prev, pager, next, jumper" :total="total"
                             :current-page="pageNo">
              </el-pagination>
          </div>
      </div>
      <!-- 停车场信息详情 -->
      <parkingDetail
          ref="parkingDetail"
          @onDetailTitle="onDetailTitle"
          v-if="this.$route.query.tab === '0'"
      />
  </div>
</template>

<script type="text/javascript">
import { listMixin } from "@/mixins/list-mixins";
import parkingDetail from "./parking_detail.vue";

export default {
    mixins: [listMixin],
    data() {
        return {
            tabelData: [],
            myDetailTitle: ""
        };
    },
    components: {
        parkingDetail
    },
    computed: {
        city() {
            return this.$store.state.city || "350200";
        },
        month() {
            return this.$store.state.month || { startMonth: "", endMonth: "" };
        },
        tabName() {
            if (this.$route.query.tab === "0") {
                return "停车场信息";
            } else if (this.$route.query.tab === "1") {
                return "车场类型";
            } else if (this.$route.query.tab === "2") {
                return "车场质量";
            }
        },
        detailTitle() {
            if (this.$route.query.tab === "0") {
                return this.myDetailTitle || this.$route.query.name;
            } else if (this.$route.query.tab === "1") {
                return this.$route.query.depotTypeName;
            } else if (this.$route.query.tab === "2") {
                return this.$route.query.depotQualityName;
            }
        }
    },
    watch: {
        city(val) {
            this.readList();
        },
        month(val) {
            this.readList();
        }
    },
    methods: {
        onDetailTitle(val) {
            this.myDetailTitle = val;
        },
        toReturn() {
            window.history.go(-1);
        },
        async readList() {
            if (this.$route.query.tab === "0") {
                this.$refs.parkingDetail.initState();
            }
            if (this.$route.query.tab === "1" || this.$route.query.tab === "2") {
                const res = await this.$request({
                    url: this.$api.depot_page,
                    method: "get",
                    path: {
                        pageSize: this.pageSize,
                        pageNo: this.pageNo
                    },
                    params: {
                        depotType: this.$route.query.depotType || "",
                        depotQuality: this.$route.query.depotQuality || "",
                        city: this.city,
                        startTime: this.month.startMonth || "",
                        endTime: this.month.endMonth || ""
                    }
                });
                this.tabelData = res.rows;
                this.total = res.total;
            }
        },
        async initState() {
            this.readList();
        }

    }
};
</script>
<style lang="less">
.el-table__expand-icon {
  text-align: center;
}
.props-table tr {
  background-color: #fafafa;
}
.props-table th div.cell {
  color: #666;
  font-weight: 700 !important;
}
</style>
