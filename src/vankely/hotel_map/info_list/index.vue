<template lang="html">
  <div>
      <div class="breadcrumb">
          <el-breadcrumb separator="/">
              <el-breadcrumb-item>酒店地图</el-breadcrumb-item>
              <el-breadcrumb-item>信息列表</el-breadcrumb-item>
              <el-breadcrumb-item>{{tabLabel}}</el-breadcrumb-item>
          </el-breadcrumb>
      </div>
      <div class="vk-style-two_tabs">
          <el-tabs type="card" v-model="activeTab"  @tab-click="handleClick">
              <ul class="vk-tools-bar">
                  <li class="filter">
                    <el-select clearable v-if = "this.activeTab === 'traffic' || this.activeTab === 'business' " class="search-select" v-model="filter.coverageRadius" @input="onCoverageRadiusChange" placeholder="覆盖半径">
                        <el-option v-for="item in allCoverageRadius" :key="item.code" :label="item.codeText" :value="item.code"></el-option>
                    </el-select>
                    <div class="search-input" v-if = "this.activeTab === 'hotel' || this.activeTab === '' " >
                        <i class="tako-icon-search search"></i>
                        <el-input placeholder="酒店名称/酒店地址" class='long' v-model="filter.keyword"/>
                    </div>
                  </li>
                  <li class="vk-btns">
                    <div>
                      <el-button  v-if = "this.activeTab !== 'hotel'" type="primary" v-on:click="exportTabel">导出</el-button>
                    </div>
                  </li>
              </ul>
              <el-tab-pane label="酒店信息" name="hotel">
                  <div class="vk-style-two-detail tableShort_padding">
                      <el-table
                          ref="singleTable"  :data="tabelData" highlight-current-row
                          @select="select" @select-all="selectAll">
                          <!--<el-table-column-->
                              <!--type="selection"-->
                              <!--width="28"-->
                              <!--align="right">-->
                          <!--</el-table-column>-->
                          <el-table-column property="hotelName" label="酒店名称" show-overflow-tooltip></el-table-column>
                          <el-table-column property="address" label="酒店地址" show-overflow-tooltip></el-table-column>
                          <el-table-column property="roomNum" label="房间数/间" show-overflow-tooltip></el-table-column>
                          <el-table-column property="lowestPrice" label="最低房价/元" show-overflow-tooltip></el-table-column>
                          <el-table-column label="酒店评分" property="customerScore" show-overflow-tooltip>
                              <template scope="scope">{{$utils.formatFloat2(scope.row.customerScore)}}</template>
                          </el-table-column>
                          <el-table-column property="hotelType" label="酒店类型" show-overflow-tooltip></el-table-column>
                          <el-table-column property="commentNum" label="评论数量/条" show-overflow-tooltip></el-table-column>
                          <el-table-column property="meetingRoom" label="有无会厅" show-overflow-tooltip>
                            <template scope="scope">{{scope.row.meetingRoom === 1?"有":"无"}}</template>
                          </el-table-column>
                          <el-table-column property="recommendRate" label="推荐率/%" show-overflow-tooltip>
                            <template scope="scope">{{scope.row.recommendRate}}</template>
                          </el-table-column>
                          <el-table-column property="closeRate" label="关闭率/%" show-overflow-tooltip>
                            <template scope="scope">{{$utils.formatFloat2(scope.row.closeRate)}}</template>
                          </el-table-column>
                        </el-table>
                        <div class="pagination">
                            <el-pagination :page-sizes="[15, 30, 50, 100]" :page-size="pageSize" @size-change="handleSizeChange" @current-change="handleCurrentChange" layout="total, sizes, prev, pager, next, jumper" :total="total" :current-page="pageNo">
                            </el-pagination>
                        </div>
                  </div>
              </el-tab-pane>
              <el-tab-pane label="按类型统计" name="type">
                  <div class="vk-style-two-detail tableShort_padding">
                      <el-table
                          ref="singleTable"  :data="tabelData" highlight-current-row  @row-click="handleRowClick">
                          <el-table-column property="hotelType" label="酒店类型" show-overflow-tooltip>
                            <template scope="scope">{{scope.row.hotelType ? scope.row.hotelType:"其他"}}</template>
                          </el-table-column>
                          <el-table-column property="hotelNum" label="酒店数量/家" show-overflow-tooltip></el-table-column>
                          <el-table-column property="roomNum" label="房间总数/间" show-overflow-tooltip></el-table-column>
                          <el-table-column property="lowestPrice" label="平均房价/元" show-overflow-tooltip></el-table-column>
                          <el-table-column property="customerScore" label="平均评分" show-overflow-tooltip>
                            <template scope="scope">{{$utils.formatFloat2(scope.row.customerScore)}}</template>
                          </el-table-column>
                          <el-table-column property="recommendRate" label="平均推荐率/%" show-overflow-tooltip>
                            <template scope="scope">{{scope.row.recommendRate}}</template>
                          </el-table-column>
                          <el-table-column property="closeRate" label="平均关闭率/%" show-overflow-tooltip>
                            <template scope="scope">{{$utils.formatFloat2(scope.row.closeRate)}}</template>
                          </el-table-column>
                      </el-table>
                      <div class="pagination">
                          <el-pagination :page-sizes="[15, 30, 50, 100]" :page-size="pageSize" @size-change="handleSizeChange" @current-change="handleCurrentChange" layout="total, sizes, prev, pager, next, jumper" :total="total" :current-page="pageNo">
                          </el-pagination>
                      </div>
                  </div>
              </el-tab-pane>
              <el-tab-pane label="按区(县)统计" name="county">
                  <div class="vk-style-two-detail tableShort_padding">
                      <el-table @row-click="handleRowClick" ref="singleTable" :data="tabelData" highlight-current-row>
                          <el-table-column property="countyName" label="行政区" show-overflow-tooltip></el-table-column>
                          <el-table-column property="hotelNum" label="酒店数量/家" show-overflow-tooltip></el-table-column>
                          <el-table-column property="roomNum" label="房间总数/间" show-overflow-tooltip></el-table-column>
                          <el-table-column property="lowestPrice" label="平均房价/元" show-overflow-tooltip></el-table-column>
                          <el-table-column property="customerScore" label="平均评分" show-overflow-tooltip>
                            <template scope="scope">{{$utils.formatFloat2(scope.row.customerScore)}}</template>
                          </el-table-column>
                          <el-table-column property="recommendRate" label="平均推荐率/%" show-overflow-tooltip>
                            <template scope="scope">{{scope.row.recommendRate}}</template>
                          </el-table-column>
                          <el-table-column property="closeRate" label="平均关闭率/%" show-overflow-tooltip>
                            <template scope="scope">{{$utils.formatFloat2(scope.row.closeRate)}}</template>
                          </el-table-column>
                      </el-table>
                      <div class="pagination">
                          <el-pagination :page-sizes="[15, 30, 50, 100]" :page-size="pageSize" @size-change="handleSizeChange" @current-change="handleCurrentChange" layout="total, sizes, prev, pager, next, jumper" :total="total" :current-page="pageNo">
                          </el-pagination>
                      </div>
                  </div>
              </el-tab-pane>
              <el-tab-pane label="按商圈统计" name="business">
                  <div class="vk-style-two-detail tableShort_padding">
                      <el-table @row-click="handleRowClick" ref="singleTable" :data="tabelData" highlight-current-row @select="select" @select-all="selectAll">
                          <!-- <el-table-column type="selection" width="28" align="right"></el-table-column> -->
                          <el-table-column property="location.locationName" label="商圈" min-width="140"></el-table-column>
                          <el-table-column property="hotelNum" label="酒店数量/家" min-width="140"></el-table-column>
                          <el-table-column property="roomNum" label="房间总数/间" min-width="140"></el-table-column>
                          <el-table-column property="lowestPrice" label="平均房价/元" min-width="140"></el-table-column>
                          <el-table-column property="customerScore" label="平均评分" min-width="140">
                              <template scope="scope">{{$utils.formatFloat2(scope.row.customerScore)}}</template>
                          </el-table-column>
                          <el-table-column property="recommendRate" label="平均推荐率/%" min-width="140">
                              <template scope="scope">{{scope.row.recommendRate}}</template>
                          </el-table-column>
                          <el-table-column property="closeRate" label="平均关闭率/%" min-width="140">
                              <template scope="scope">{{$utils.formatFloat2(scope.row.closeRate)}}</template>
                          </el-table-column>
                      </el-table>
                      <div class="pagination">
                          <el-pagination :page-sizes="[15, 30, 50, 100]" :page-size="pageSize" @size-change="handleSizeChange" @current-change="handleCurrentChange" layout="total, sizes, prev, pager, next, jumper" :total="total" :current-page="pageNo">
                          </el-pagination>
                      </div>
                  </div>
              </el-tab-pane>
              <el-tab-pane label="按交通枢纽统计" name="traffic">
                  <div class="vk-style-two-detail tableShort_padding">
                      <el-table @row-click="handleRowClick" ref="singleTable" :data="tabelData" highlight-current-row @select="select" @select-all="selectAll">
                          <!-- <el-table-column type="selection" width="28" align="right"></el-table-column> -->
                          <el-table-column property="location.locationName" label="交通枢纽" min-width="140"></el-table-column>
                          <el-table-column property="hotelNum" label="酒店数量/家" min-width="140"></el-table-column>
                          <el-table-column property="roomNum" label="房间总数/间" min-width="140"></el-table-column>
                          <el-table-column property="lowestPrice" label="平均房价/元" min-width="140"></el-table-column>
                          <el-table-column property="customerScore" label="平均评分" min-width="140">
                              <template scope="scope">{{$utils.formatFloat2(scope.row.customerScore)}}</template>
                          </el-table-column>
                          <el-table-column property="recommendRate" label="平均推荐率/%" min-width="140">
                              <template scope="scope">{{scope.row.recommendRate}}</template>
                          </el-table-column>
                          <el-table-column property="closeRate" label="平均关闭率/%" min-width="140">
                              <template scope="scope">{{$utils.formatFloat2(scope.row.closeRate)}}</template>
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
    import dict, {
        COVERAGE_RADIUSENUM
    } from "@/net/dict.js";

    export default {
        mixins: [listMixin],
        data() {
            return {
                filter: {
                    coverageRadius: "",
                    enterpriseIds: ""
                },
                tabLabel: "酒店信息",
                activeTab: "hotel",
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
        asyncComputed: {
            allCoverageRadius: async function() {
                const res = await dict.getDictByType(COVERAGE_RADIUSENUM);
                if (!res) {
                    return [];
                }
                const arr = res.filter(item => {
                    return item.code !== "0.1";
                });
                return arr.map((item) => {
                    return {
                        codeText: item.codeText,
                        code: item.code
                    };
                });
            }
        },
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
            handleRowClick(row, event, column) {
                this.$logger.log("row", row);
                if (this.$route.query.tab === "1") {
                    const hotelType = row.hotelType ? row.hotelType : "其他";
                    this.$router.push("/admin/hotel_map/info_list_detail?tab=" + this.$route.query.tab + "&hotelType=" + hotelType);
                } else if (this.$route.query.tab === "2") {
                    this.$router.push("/admin/hotel_map/info_list_detail?tab=" + this.$route.query.tab + "&county=" + row.county + "&countyName=" + row.countyName);
                } else if (this.$route.query.tab === "3" || this.$route.query.tab === "4") {
                    let coverageRadius = 2;
                    if (this.filter.coverageRadius) {
                        coverageRadius = this.filter.coverageRadius;
                    }
                    this.$router.push("/admin/hotel_map/info_list_detail?tab=" + this.$route.query.tab + "&locationId=" + row.locationId + "&locationName=" + row.location.locationName + "&coverageRadius=" + coverageRadius);
                }
            },
            handleClick(tab, event) {
                let coverageRadius = "";
                if (this.$route.query.coverageRadius) {
                    coverageRadius = "&coverageRadius=" + this.$route.query.coverageRadius;
                }
                this.$router.push({
                    path: "/admin/hotel_map/info_list?tab=" + tab.index + coverageRadius
                });
                if (this.activeTab === "hotel") {
                    this.tabLabel = "酒店信息";
                } else if (this.activeTab === "type") {
                    this.tabLabel = "按类型统计";
                } else if (this.activeTab === "county") {
                    this.tabLabel = "按区(县)统计";
                } else if (this.activeTab === "business") {
                    this.tabLabel = "按商圈统计";
                } else if (this.activeTab === "traffic") {
                    this.tabLabel = "按交通枢纽统计";
                } else {
                    this.$logger.log("activeTab不存在对应的值");
                }
                this.pageNo = 1;
                this.readList();
            },
            onCoverageRadiusChange(val) {
                this.$logger.log("onCoverageRadiusChange", val);
                this.filter.coverageRadius = val;
                this.readList();
            },
            // 勾选
            select: function(selection, row) {
                this.$logger.log("this.selection", selection);
                if (selection.length > 0) {
                    const arr = [];
                    selection.forEach((ele) => {
                        arr.push(ele.id);
                    });
                    this.filter.enterpriseIds = arr.join(",");
                } else {
                    this.filter.enterpriseIds = "";
                }
                this.$logger.log("this.filter.enterpriseIds", this.filter.enterpriseIds);
            },
            // 全选
            selectAll: function(selection) {
                this.$logger.log("this.selections", selection);
                if (selection.length > 0) {
                    const arr = [];
                    selection.forEach((ele) => {
                        arr.push(ele.id);
                    });
                    this.filter.enterpriseIds = arr.join(",");
                } else {
                    this.filter.enterpriseIds = "";
                }
                this.$logger.log("this.filter.enterpriseIds", this.filter.enterpriseIds);
            },
            exportTabel() {
                let params = {};
                let api = null;
                if (this.activeTab === "hotel") {
                    api = this.$api.hotel_export;
                    params = {
                        hotelIds: this.filter.enterpriseIds,
                        city: this.city,
                        keyword: this.filter.keyword
                    };
                } else if (this.activeTab === "type") {
                    api = this.$api.hotel_export_type;
                    params = {
                        city: this.city
                    };
                } else if (this.activeTab === "county") {
                    api = this.$api.hotel_export_county;
                    params = {
                        city: this.city
                    };
                } else if (this.activeTab === "traffic" || this.activeTab === "business") {
                    api = this.$api.hotel_poi_export;
                    const locationType = this.activeTab === "traffic" ? "traffic_hub" : "trading_area";
                    params = {
                        locationType: locationType,
                        coverageRadius: this.filter.coverageRadius || "2",
                        city: this.city
                        // locationIds: this.filter.enterpriseIds
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
                this.$logger.log("this.city", this.city);
                let url;
                let params;
                if (this.activeTab === "hotel" || this.activeTab === "") {
                    url = this.$api.hotel_page;
                    params = {
                        keyword: this.filter.keyword,
                        city: this.city
                    };
                }
                if (this.activeTab === "type") {
                    url = this.$api.hotel_page_type;
                    params = {
                        city: this.city
                    };
                }
                if (this.activeTab === "county") {
                    url = this.$api.hotel_page_county;
                    params = {
                        city: this.city
                    };
                }
                if (this.activeTab === "traffic" || this.activeTab === "business") {
                    url = this.$api.hotel_poi_page_locationType;
                    const locationType = this.activeTab === "traffic" ? "traffic_hub" : "trading_area";
                    params = {
                        locationType: locationType,
                        coverageRadius: this.filter.coverageRadius || "2",
                        city: this.city
                    };
                }
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
                this.$logger.log("res", res);
                this.tabelData = res.rows;
                this.total = res.total;
            }
        },
        created() {
            if (this.$route.query.tab === "0") {
                this.activeTab = "hotel";
                this.tabLabel = "酒店信息";
            } else if (this.$route.query.tab === "1") {
                this.activeTab = "type";
                this.tabLabel = "按类型统计";
            } else if (this.$route.query.tab === "2") {
                this.activeTab = "county";
                this.tabLabel = "按区(县)统计";
            } else if (this.$route.query.tab === "3") {
                this.activeTab = "business";
                this.tabLabel = "按商圈统计";
            } else if (this.$route.query.tab === "4") {
                this.activeTab = "traffic";
                this.tabLabel = "按交通枢纽统计";
            }
            if (this.$route.query.coverageRadius) {
                this.filter.coverageRadius = this.$route.query.coverageRadius;
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
