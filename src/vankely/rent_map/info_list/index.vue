<template lang="html">
  <div>
      <div class="breadcrumb">
          <el-breadcrumb separator="/">
              <el-breadcrumb-item>租金地图</el-breadcrumb-item>
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
                    <el-select v-if = "this.activeTab === 'type'" class="search-select" v-model="filter.houseLevel" @input="houseLevelChange" placeholder="请选择租房档次">
                      <el-option v-for="item in allHouseLevel" :key="item.code" :label="item.codeText" :value="item.code"></el-option>
                    </el-select>
                    <el-select v-if = "this.activeTab === 'county' || this.activeTab === 'traffic' || this.activeTab === 'business' " class="search-select" v-model="filter.houseType" @input="houseTypeChange" placeholder="户型">
                        <el-option v-for="item in allRentTypes" :key="item.code" :label="item.codeText" :value="item.code"></el-option>
                    </el-select>
                    <div class="search-input" v-if = "this.activeTab === 'rent' || this.activeTab === '' " >
                        <i class="tako-icon-search search"></i>
                        <el-input placeholder="标题" class='long' v-model="filter.keyword"/>
                    </div>
                  </li>
                  <li class="vk-btns">
                    <div>
                      <el-button  v-if = "this.activeTab !== 'rent'" type="primary" v-on:click="exportTabel">导出</el-button>
                    </div>
                  </li>
              </ul>
              <el-tab-pane label="租房信息" name="rent">
                  <div class="vk-style-two-detail tableShort_padding">
                      <el-table
                          ref="singleTable"  :data="tabelData" highlight-current-row
                          @select="select" @select-all="selectAll">
                          <!--<el-table-column-->
                              <!--type="selection"-->
                              <!--width="28"-->
                              <!--align="right">-->
                          <!--</el-table-column>-->
                          <el-table-column property="title" label="标题" show-overflow-tooltip  min-width="120"></el-table-column>
                          <el-table-column property="roomCharge" label="租金/元/月" show-overflow-tooltip></el-table-column>
                          <el-table-column property="houseTypeName" label="户型" show-overflow-tooltip></el-table-column>
                          <el-table-column property="area" label="面积/㎡" show-overflow-tooltip></el-table-column>
                          <el-table-column property="address" label="地址" show-overflow-tooltip></el-table-column>
                          <el-table-column property="middleman" label="经纪人" show-overflow-tooltip></el-table-column>
                          <el-table-column property="phone" label="电话" show-overflow-tooltip min-width="120"></el-table-column>
                          <el-table-column property="updateTime" label="更新时间" show-overflow-tooltip min-width="120"></el-table-column>
                        </el-table>
                        <div class="pagination">
                            <el-pagination :page-sizes="[15, 30, 50, 100]" :page-size="pageSize" @size-change="handleSizeChange" @current-change="handleCurrentChange" layout="total, sizes, prev, pager, next, jumper" :total="total" :current-page="pageNo">
                            </el-pagination>
                        </div>
                  </div>
              </el-tab-pane>
              <el-tab-pane label="按户型统计" name="type">
                  <div class="vk-style-two-detail tableShort_padding">
                      <el-table ref="singleTable"  :data="tabelData" highlight-current-row  @row-click="handleRowClick">
                          <el-table-column property="houseTypeName" label="户型" show-overflow-tooltip min-width="100"></el-table-column>
                          <el-table-column property="houseNum" label="租房数量/个" show-overflow-tooltip min-width="130"></el-table-column>
                          <el-table-column property="roomCharge" label="平均租金/元/月" show-overflow-tooltip min-width="140">
                              <template scope="scope">{{Number(scope.row.roomCharge).toFixed(2)}}</template>
                          </el-table-column>
                          <el-table-column property="area" label="平均面积/㎡" show-overflow-tooltip min-width="130">
                              <template scope="scope">{{Number(scope.row.area).toFixed(2)}}</template>
                          </el-table-column>
                          <el-table-column property="groundEffect" label="平均坪效" show-overflow-tooltip min-width="140">
                              <template scope="scope">{{Number(scope.row.groundEffect).toFixed(2)}}</template>
                          </el-table-column>
                      </el-table>
                      <!-- <div class="pagination">
                          <el-pagination :page-sizes="[15, 30, 50, 100]" :page-size="pageSize" @size-change="handleSizeChange" @current-change="handleCurrentChange" layout="total, sizes, prev, pager, next, jumper" :total="total" :current-page="pageNo">
                          </el-pagination>
                      </div> -->
                  </div>
              </el-tab-pane>
              <el-tab-pane label="按区(县)统计" name="county">
                  <div class="vk-style-two-detail tableShort_padding">
                      <el-table @row-click="handleRowClick" ref="singleTable" :data="tabelData" highlight-current-row>
                          <el-table-column property="countyName" label="行政区" show-overflow-tooltip min-width="140"></el-table-column>
                          <el-table-column property="houseNum" label="租房数量/个" show-overflow-tooltip min-width="140"></el-table-column>
                          <el-table-column property="roomCharge" label="平均租金/元/月" show-overflow-tooltip min-width="140">
                              <template scope="scope">{{Number(scope.row.roomCharge).toFixed(2)}}</template>
                          </el-table-column>
                          <el-table-column property="area" label="平均面积/㎡" show-overflow-tooltip min-width="140">
                              <template scope="scope">{{Number(scope.row.area).toFixed(2)}}</template>
                          </el-table-column>
                          <el-table-column property="groundEffect" label="平均坪效" show-overflow-tooltip min-width="140">
                              <template scope="scope">{{Number(scope.row.groundEffect).toFixed(2)}}</template>
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
                          <el-table-column property="location.locationName" label="商圈" show-overflow-tooltip min-width="120"></el-table-column>
                          <el-table-column property="houseNum" label="租房数量/个" show-overflow-tooltip min-width="120"></el-table-column>
                          <el-table-column property="roomCharge" label="平均租金/元/月" show-overflow-tooltip  min-width="140">
                              <template scope="scope">{{Number(scope.row.roomCharge).toFixed(2)}}</template>
                          </el-table-column>
                          <el-table-column property="area" label="平均面积/㎡" show-overflow-tooltip min-width="120">
                              <template scope="scope">{{Number(scope.row.area).toFixed(2)}}</template>
                          </el-table-column>
                          <el-table-column property="groundEffect" label="平均坪效" show-overflow-tooltip  min-width="140">
                              <template scope="scope">{{Number(scope.row.groundEffect).toFixed(2)}}</template>
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
                          <el-table-column property="location.locationName" label="交通枢纽" show-overflow-tooltip min-width="120"></el-table-column>
                          <el-table-column property="houseNum" label="租房数量/个" show-overflow-tooltip min-width="120"></el-table-column>
                          <el-table-column property="roomCharge" label="平均租金/元/月" show-overflow-tooltip min-width="140">
                              <template scope="scope">{{Number(scope.row.roomCharge).toFixed(2)}}</template>
                          </el-table-column>
                          <el-table-column property="area" label="平均面积/㎡" show-overflow-tooltip min-width="120">
                              <template scope="scope">{{Number(scope.row.area).toFixed(2)}}</template>
                          </el-table-column>
                          <el-table-column property="groundEffect" label="平均坪效" show-overflow-tooltip min-width="140">
                              <template scope="scope">{{Number(scope.row.groundEffect).toFixed(2)}}</template>
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
        COVERAGE_RADIUSENUM, HOUSE_RENT_TYPE_ENUM, HOUSE_LEVEL
    } from "@/net/dict.js";

    export default {
        mixins: [listMixin],
        data() {
            return {
                filter: {
                    coverageRadius: "",
                    enterpriseIds: "",
                    houseType: "",
                    houseLevel: "house_level_all"
                },
                tabLabel: "租房信息",
                activeTab: "rent",
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
            },
            allRentTypes: async function() {
                const res = await dict.getDictByType(HOUSE_RENT_TYPE_ENUM);
                if (!res) {
                    return [];
                }
                return res.map((item) => {
                    return {
                        codeText: item.codeText,
                        code: item.code
                    };
                });
            },
            allHouseLevel: async function() {
                const res = await dict.getDictByType(HOUSE_LEVEL);
                if (!res) {
                    return [];
                }
                return res.map((item) => {
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
                    this.$router.push("/admin/rent_map/info_list_detail?tab=" + this.$route.query.tab + "&rentType=" + row.houseType + "&rentTypeName=" + row.houseTypeName + "&houseLevel=" + this.filter.houseLevel);
                } else if (this.$route.query.tab === "2") {
                    this.$router.push("/admin/rent_map/info_list_detail?tab=" + this.$route.query.tab + "&county=" + row.county + "&countyName=" + row.countyName + "&houseType=" + this.filter.houseType);
                } else if (this.$route.query.tab === "3" || this.$route.query.tab === "4") {
                    let coverageRadius = 2;
                    if (this.filter.coverageRadius) {
                        coverageRadius = this.filter.coverageRadius;
                    }
                    this.$router.push("/admin/rent_map/info_list_detail?tab=" + this.$route.query.tab + "&locationId=" + row.locationId + "&locationName=" + row.location.locationName + "&coverageRadius=" + coverageRadius + "&houseType=" + this.filter.houseType);
                }
            },
            handleClick(tab, event) {
                let coverageRadius = "";
                if (this.$route.query.coverageRadius) {
                    coverageRadius = "&coverageRadius=" + this.$route.query.coverageRadius;
                }
                this.$router.push({
                    path: "/admin/rent_map/info_list?tab=" + tab.index + coverageRadius
                });
                if (this.activeTab === "rent") {
                    this.tabLabel = "租房信息";
                } else if (this.activeTab === "type") {
                    this.tabLabel = "按户型统计";
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
            houseTypeChange(val) {
                this.$logger.log("houseType", val);
                this.filter.houseType = val;
                this.readList();
            },
            onCoverageRadiusChange(val) {
                this.filter.coverageRadius = val;
                this.readList();
            },
            houseLevelChange(val) {
                this.filter.houseLevel = val;
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
                if (this.activeTab === "rent") {
                    api = this.$api.hotel_export;
                    params = {
                        hotelIds: this.filter.enterpriseIds,
                        city: this.city,
                        keyword: this.filter.keyword
                    };
                } else if (this.activeTab === "type") {
                    api = this.$api.house_rent_export_type;
                    params = {
                        city: this.city,
                        houseGrade: this.filter.houseLevel
                    };
                } else if (this.activeTab === "county") {
                    api = this.$api.house_rent_export_county;
                    params = {
                        city: this.city,
                        houseType: this.filter.houseType
                    };
                } else if (this.activeTab === "traffic" || this.activeTab === "business") {
                    api = this.$api.house_rent_poi_export;
                    const locationType = this.activeTab === "traffic" ? "traffic_hub" : "trading_area";
                    params = {
                        locationType: locationType,
                        coverageRadius: this.filter.coverageRadius || "2",
                        city: this.city,
                        houseType: this.filter.houseType
                        // locationIds: this.filter.enterpriseIds
                    };
                } else {
                    this.$logger.log("tab页为空");
                }
                params.startTime = this.startMonth;
                params.endTime = this.endMonth;
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
                //this.$logger.log("this.city", this.city);
                let url;
                let params;
                if (this.activeTab === "rent" || this.activeTab === "") {
                    url = this.$api.house_rent_page;
                    params = {
                        keyword: this.filter.keyword,
                        city: this.city
                    };
                }
                if (this.activeTab === "type") {
                    url = this.$api.house_rent_house_type_count;
                    params = {
                        city: this.city
                    };
                }
                if (this.activeTab === "county") {
                    url = this.$api.house_rent_page_county;
                    params = {
                        city: this.city,
                        houseType: this.filter.houseType
                    };
                }
                if (this.activeTab === "traffic" || this.activeTab === "business") {
                    url = this.$api.house_rent_page_locationType;
                    const locationType = this.activeTab === "traffic" ? "traffic_hub" : "trading_area";
                    params = {
                        locationType: locationType,
                        coverageRadius: this.filter.coverageRadius || "2",
                        city: this.city,
                        houseType: this.filter.houseType
                    };
                }
                params.startTime = this.startMonth;
                params.endTime = this.endMonth;
                this.$logger.log("params", params);
                if (this.activeTab === "type") {
                    const res = await this.$request({
                        url: url,
                        method: "get",
                        params: params
                    });
                    const arr = res.data.houseRentTypeGradeDTOList.filter((item, index) => {
                        return item.grade === this.filter.houseLevel;
                    });
                    this.tabelData = arr[0].houseRentChargeGradeStatisticList;
                } else {
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
            }
        },
        created() {
            if (this.$route.query.tab === "0") {
                this.activeTab = "rent";
                this.tabLabel = "租金地图";
            } else if (this.$route.query.tab === "1") {
                this.activeTab = "type";
                this.tabLabel = "按户型统计";
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
            if (this.$route.query.houseType) {
                this.filter.houseType = this.$route.query.houseType;
            } else this.filter.houseType = "1";
            if (this.$route.query.houseLevel) {
                this.filter.houseLevel = this.$route.query.houseLevel;
            }
        },

        mounted() {
            //this.$refs.popover1.doShow();
        }
    };
</script>

<style scoped>
    .sds{
        position: relative;
    }
    .sdsdddddddd{
        display: none;
    }
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
