<template lang="html">
  <div>
      <div class="breadcrumb">
          <el-breadcrumb separator="/">
              <el-breadcrumb-item>停车场地图</el-breadcrumb-item>
              <el-breadcrumb-item>信息列表</el-breadcrumb-item>
              <el-breadcrumb-item>{{tabLabel}}</el-breadcrumb-item>
          </el-breadcrumb>
      </div>
      <div class="vk-style-two_tabs">
          <el-tabs type="card" v-model="activeTab"  @tab-click="handleClick">
              <ul class="vk-tools-bar" style="margin: 20px 0 0;"></ul>
              <el-tab-pane label="停车场信息" name="parking">
                  <div class="vk-style-two-detail tableShort_padding">
                      <el-table ref="singleTable" @row-click="handleRowClick" :data="tabelData" highlight-current-row>
                          <el-table-column property="name" label="停车场名称" show-overflow-tooltip></el-table-column>
                          <el-table-column property="parkingNumber" label="车位数" show-overflow-tooltip></el-table-column>
                          <el-table-column property="load" label="负载率/%" show-overflow-tooltip></el-table-column>
                          <el-table-column property="averagePrice" label="费用/元/时" show-overflow-tooltip></el-table-column>
                          <el-table-column property="address" label="地址" show-overflow-tooltip></el-table-column>
                          <el-table-column property="depotTypeName" label="车场类型" show-overflow-tooltip></el-table-column>
                          <el-table-column label="操作">
                                <template scope="scope">
                                    <vk-actions>
                                      <vk-action-item>
                                        <el-button class="el-button--table" @click.stop="onEdit(scope.$index, scope.row)">编辑</el-button>
                                      </vk-action-item>
                                      <vk-action-item>
                                        <el-button class="el-button--table" @click.stop="onDelete(scope.$index, scope.row)">删除</el-button>
                                      </vk-action-item>
                                    </vk-actions>
                                </template>
                          </el-table-column>
                        </el-table>
                        <div class="pagination">
                            <el-pagination :page-sizes="[15, 30, 50, 100]" :page-size="pageSize" @size-change="handleSizeChange" @current-change="handleCurrentChange" layout="total, sizes, prev, pager, next, jumper" :total="total" :current-page="pageNo">
                            </el-pagination>
                        </div>
                  </div>
              </el-tab-pane>
              <el-tab-pane label="车场类型" name="parking_type">
                  <div class="vk-style-two-detail tableShort_padding">
                      <el-table ref="singleTable" @row-click="handleRowClick" :data="tabelData" highlight-current-row>
                          <el-table-column property="depotTypeName" label="车场类型" show-overflow-tooltip></el-table-column>
                          <el-table-column property="depotNumber" label="停车场数量" show-overflow-tooltip></el-table-column>
                          <el-table-column property="parkingNumber" label="车位数" show-overflow-tooltip></el-table-column>
                          <el-table-column property="averagePrice" label="平均费用/元/时" show-overflow-tooltip></el-table-column>
                          <el-table-column property="averageLoad" label="平均负载率/%" show-overflow-tooltip></el-table-column>
                      </el-table>
                      <!-- <div class="pagination">
                          <el-pagination :page-sizes="[15, 30, 50, 100]" :page-size="pageSize" @size-change="handleSizeChange" @current-change="handleCurrentChange" layout="total, sizes, prev, pager, next, jumper" :total="total" :current-page="pageNo">
                          </el-pagination>
                      </div> -->
                  </div>
              </el-tab-pane>
              <el-tab-pane label="车场质量" name="parking_quality">
                  <div class="vk-style-two-detail tableShort_padding">
                      <el-table ref="singleTable" @row-click="handleRowClick" :data="tabelData" highlight-current-row>
                          <el-table-column property="depotQualityName" label="停车场质量" show-overflow-tooltip></el-table-column>
                          <el-table-column property="depotNumber" label="停车场数量" show-overflow-tooltip></el-table-column>
                          <el-table-column property="parkingNumber" label="车位数" show-overflow-tooltip></el-table-column>
                          <el-table-column property="averagePrice" label="平均费用/元/时" show-overflow-tooltip></el-table-column>
                          <el-table-column property="averageLoad" label="平均负载率/%" show-overflow-tooltip></el-table-column>
                      </el-table>
                      <!-- <div class="pagination">
                          <el-pagination :page-sizes="[15, 30, 50, 100]" :page-size="pageSize" @size-change="handleSizeChange" @current-change="handleCurrentChange" layout="total, sizes, prev, pager, next, jumper" :total="total" :current-page="pageNo">
                          </el-pagination>
                      </div> -->
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
            filter: {},
            tabLabel: "停车场信息",
            activeTab: "parking",
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
                path: "/admin/parking_map/info_list?tab=" + tab.index
            });
            if (this.activeTab === "parking") {
                this.tabLabel = "停车场信息";
            } else if (this.activeTab === "parking_type") {
                this.tabLabel = "车场类型";
            } else if (this.activeTab === "parking_quality") {
                this.tabLabel = "车场质量";
            } else {
                this.$logger.log("activeTab不存在对应的值");
            }
            this.pageNo = 1;
            this.readList();
        },
        handleRowClick(row, event, column) {
            let query = {};
            if (this.$route.query.tab === "0" || this.$route.query.tab === "undefined" || !this.$route.query.tab) {
                query = {
                    id: row.id,
                    name: row.name
                };
            } else if (this.$route.query.tab === "1") {
                query = {
                    depotTypeName: row.depotTypeName,
                    depotType: row.depotType
                };
            } else if (this.$route.query.tab === "2") {
                query = {
                    depotQualityName: row.depotQualityName,
                    depotQuality: row.depotQuality
                };
            }
            query.tab = this.$route.query.tab && this.$route.query.tab !== "undefined" ? this.$route.query.tab : "0";
            this.$router.push({
                path: "/admin/parking_map/info_list_detail",
                query
            });
        },
        onEdit(index, row) {
            this.$router.push("/admin/parking_map/info_list_edit/" + row.id);
        },
        onDelete(index, row) {
            this.$confirm("确定删除？", "", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(async () => {
                await this.$request({
                    url: this.$api.depot_delete,
                    method: "delete",
                    path: {
                        id: row.id
                    }
                });
                this.$message({
                    type: "success",
                    message: "删除成功!"
                });
                this.readList();
            }).catch((err) => {
                if (err === "cancel") {
                    return;
                }
                this.$message.error(err.message);
            });
        },
        async readList() {
            this.$logger.log("this.city", this.city);
            let url;
            let params;
            if (this.activeTab === "parking" || this.activeTab === "") {
                url = this.$api.depot_page;
                params = {
                    city: this.city
                };
            }
            if (this.activeTab === "parking_type") {
                url = this.$api.depot_page_type;
                params = {
                    city: this.city
                };
            }
            if (this.activeTab === "parking_quality") {
                url = this.$api.depot_page_quality;
                params = {
                    city: this.city
                };
            }
            // this.$logger.log("this.startMonth,this.endMonth", this.startMonth, this.endMonth);
            // params.startTime = this.startMonth;
            // params.endTime = this.endMonth;
            const res = await this.$request({
                url: url,
                method: "get",
                path: {
                    pageSize: this.pageSize,
                    pageNo: this.pageNo
                },
                params: params
            });
            res.rows.forEach(element => {
                element.load = +element.load;
                element.averagePrice = +element.averagePrice;
                element.maxPrice = +element.maxPrice;
            });
            this.tabelData = res.rows;
            this.total = res.total;
        }
    },
    created() {
        if (this.$route.query.tab === "0") {
            this.activeTab = "parking";
            this.tabLabel = "停车场信息";
        } else if (this.$route.query.tab === "1") {
            this.activeTab = "parking_type";
            this.tabLabel = "车场类型";
        } else if (this.$route.query.tab === "2") {
            this.activeTab = "parking_quality";
            this.tabLabel = "车场质量";
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
