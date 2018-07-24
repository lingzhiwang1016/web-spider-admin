<template lang="html">
  <div>
      <div class="breadcrumb">
          <el-breadcrumb separator="/">
              <el-breadcrumb-item>公寓地图</el-breadcrumb-item>
              <el-breadcrumb-item>信息列表</el-breadcrumb-item>
              <el-breadcrumb-item>{{tabLabel}}</el-breadcrumb-item>
          </el-breadcrumb>
      </div>
      <div class="vk-style-two_tabs">
          <el-tabs type="card" v-model="activeTab"  @tab-click="handleClick">
              <ul class="vk-tools-bar">
                  <li class="filter">
                    <div class="search-input" v-if = "this.activeTab === 'apartment' || this.activeTab === '' " >
                        <i class="tako-icon-search search"></i>
                        <el-input placeholder="公寓名称/户型" class='long' v-model="filter.keyword"/>
                    </div>
                  </li>
                  <li class="vk-btns">
                    <div>
                      <el-button type="primary" v-on:click="exportTabel">导出</el-button>
                    </div>
                  </li>
              </ul>
              <el-tab-pane label="公寓信息" name="apartment">
                  <div class="vk-style-two-detail tableShort_padding">
                      <el-table
                          ref="singleTable"  :data="tabelData" highlight-current-row
                          @select="select" @select-all="selectAll">
                          <el-table-column
                              type="selection"
                              width="28"
                              align="right">
                          </el-table-column>
                          <el-table-column property="name" label="公寓名称" show-overflow-tooltip></el-table-column>
                          <el-table-column property="brand" label="公寓品牌" show-overflow-tooltip></el-table-column>
                          <el-table-column property="houseType" label="户型" show-overflow-tooltip></el-table-column>
                          <el-table-column property="priceRange" label="租金范围/元" show-overflow-tooltip></el-table-column>
                          <el-table-column property="areaRange" label="面积范围/㎡" show-overflow-tooltip></el-table-column>
                          <el-table-column property="address" label="详细地址" show-overflow-tooltip></el-table-column>
                          <el-table-column property="updateTime" label="更新时间" show-overflow-tooltip></el-table-column>
                        </el-table>
                        <div class="pagination">
                            <el-pagination :page-sizes="[15, 30, 50, 100]" :page-size="pageSize" @size-change="handleSizeChange" @current-change="handleCurrentChange" layout="total, sizes, prev, pager, next, jumper" :total="total" :current-page="pageNo">
                            </el-pagination>
                        </div>
                  </div>
              </el-tab-pane>
              <el-tab-pane label="按公寓品牌统计" name="brandType">
                  <div class="vk-style-two-detail tableShort_padding">
                      <el-table
                          ref="singleTable"  :data="tabelData" highlight-current-row>
                          <el-table-column property="brand" label="公寓品牌" show-overflow-tooltip></el-table-column>
                          <el-table-column property="num" label="在营公寓数/家" show-overflow-tooltip></el-table-column>
                          <el-table-column property="averagePrice" label="平均租金/元" show-overflow-tooltip>
                            <template scope="scope">{{scope.row.averagePrice?Number(scope.row.averagePrice).toFixed(2):scope.row.averagePrice}}</template>
                          </el-table-column>
                          <el-table-column property="averageArea" label="平均面积/㎡" show-overflow-tooltip>
                            <template scope="scope">{{scope.row.averageArea?Number(scope.row.averageArea).toFixed(2):scope.row.averageArea}}</template>
                          </el-table-column>
                          <el-table-column property="effect" label="平均坪效" show-overflow-tooltip>
                            <template scope="scope">{{scope.row.effect?Number(scope.row.effect).toFixed(2):scope.row.effect}}</template>
                          </el-table-column>
                      </el-table>
                      <div class="pagination">
                          <el-pagination :page-sizes="[15, 30, 50, 100]" :page-size="pageSize" @size-change="handleSizeChange" @current-change="handleCurrentChange" layout="total, sizes, prev, pager, next, jumper" :total="total" :current-page="pageNo">
                          </el-pagination>
                      </div>
                  </div>
              </el-tab-pane>
          </el-tabs>

      </div>
  </div>
</template>

<script type="text/javascript">
import {
    listMixin
} from "@/mixins/list-mixins";

export default {
    mixins: [listMixin],
    data() {
        return {
            filter: {
                coverageRadius: "",
                enterpriseIds: ""
            },
            tabLabel: "公寓信息",
            activeTab: "apartment",
            tabelData: []
        };
    },
    computed: {
        city() {
            return this.$store.state.city || "350200";
        },
        startMonth() {
            return this.$store.state.month.startMonth || "";
        },
        endMonth() {
            return this.$store.state.month.endMonth || "";
        }
    },
    asyncComputed: {},
    watch: {
        city(val) {
            this.readList();
        },
        startMonth(val) {
            this.readList();
        },
        endMonth(val) {
            this.readList();
        }
    },
    methods: {
        handleClick(tab, event) {
            this.$router.push({
                path: "/admin/apartment_map/info_list?tab=" + tab.index
            });
            if (this.activeTab === "apartment") {
                this.tabLabel = "公寓信息";
            } else if (this.activeTab === "brandType") {
                this.tabLabel = "按公寓品牌统计";
            } else {
                this.$logger.log("activeTab不存在对应的值");
            }
            this.pageNo = 1;
            this.readList();
        },
        // 勾选
        select: function (selection, row) {
            if (selection.length > 0) {
                const arr = [];
                selection.forEach((ele) => {
                    arr.push(ele.id);
                });
                this.filter.enterpriseIds = arr.join(",");
            } else {
                this.filter.enterpriseIds = "";
            }
        },
        // 全选
        selectAll: function (selection) {
            if (selection.length > 0) {
                const arr = [];
                selection.forEach((ele) => {
                    arr.push(ele.id);
                });
                this.filter.enterpriseIds = arr.join(",");
            } else {
                this.filter.enterpriseIds = "";
            }
        },
        exportTabel() {
            let params = {};
            let api = null;
            if (this.activeTab === "apartment") {
                api = this.$api.apartment_export;
                params = {
                    ids: this.filter.enterpriseIds,
                    city: this.city,
                    keyword: this.filter.keyword
                };
            } else if (this.activeTab === "brandType") {
                api = this.$api.apartment_export_brand;
                params = {
                    city: this.city
                };
            } else {
                this.$logger.log("tab页为空");
            }
            // params.startTime = this.startMonth;
            // params.endTime = this.endMonth;
            if (this.tabelData.length !== 0) {
                const url = this.$utils.addParamsForUrl(api, params);
                this.$utils.downloadExcel(url);
            } else {
                this.$message({
                    type: "warning",
                    message: "当前没有可导出的数据!",
                    duration: 1000
                });
            }
        },
        async readList() {
            let url;
            let params;
            if (this.activeTab === "apartment" || this.activeTab === "") {
                url = this.$api.apartment_page;
                params = {
                    keyword: this.filter.keyword,
                    city: this.city
                };
            }
            if (this.activeTab === "brandType") {
                url = this.$api.apartment_page_brand;
                params = {
                    city: this.city
                };
            }
            params.startTime = this.startMonth;
            params.endTime = this.endMonth;
            const res = await this.$request({
                url: url,
                method: "get",
                path: {
                    pageSize: this.pageSize,
                    pageNo: this.pageNo
                },
                params: params
            });
            this.tabelData = res.rows;
            this.total = res.total;
        }
    },
    created() {
        if (this.$route.query.tab === "0") {
            this.activeTab = "apartment";
            this.tabLabel = "公寓信息";
        } else if (this.$route.query.tab === "1") {
            this.activeTab = "brandType";
            this.tabLabel = "按公寓品牌统计";
        }
    }
};
</script>

<style scoped>
.map {
  width: 100%;
  height: calc(100% - 72px);
}

.reset-btn {
  position: absolute;
  right: 100px;
}

.vk-style-two-detail {
  .vk-top-title {
    display: flex;
    justify-content: flex-end;
    padding: 20px 0;
  }
  .warn-item {
    margin-top: 30px;
    margin-bottom: 11px;
    .warn-item-gray {
      color: @fontColor-label;
    }
    .warn-item-blue {
      color: @fontColor-active;
    }
  }
  .el-col {
    margin-bottom: calc(~"@{marginBottom} - 10px");
  }
}
</style>
