<template lang="html">
  <div>
      <div class="breadcrumb">
          <el-breadcrumb separator="/">
              <el-breadcrumb-item>企业地图</el-breadcrumb-item>
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
                      <div class="search-input" v-if = "this.activeTab === 'enterprise' || this.activeTab === '' " >
                          <i class="tako-icon-search search"></i>
                          <el-input placeholder="公司名称/法人代表/地址" class='long' v-model="filter.keyword"/>
                      </div>
                    </li>
                    <li class="vk-btns">
                      <div>
                        <el-button v-if = "this.activeTab !== 'enterprise'" type="primary" v-on:click="exportTabel">导出</el-button>
                      </div>
                    </li>
                </ul>
                <el-tab-pane label="企业信息列表" name="enterprise">
                    <div class="vk-style-two-detail tableShort_padding">
                          <el-table
                              ref="singleTable"  :data="tabelData" highlight-current-row
                              @select="select" @select-all="selectAll">
                              <!--<el-table-column-->
                                  <!--type="selection"-->
                                  <!--width="28"-->
                                  <!--align="right">-->
                              <!--</el-table-column>-->
                              <el-table-column property="enterpriseName" label="公司名称" show-overflow-tooltip min-width="140"></el-table-column>
                              <el-table-column property="industry" label="所属行业" show-overflow-tooltip min-width="140"></el-table-column>
                              <el-table-column property="corporation" label="法人代表" show-overflow-tooltip  min-width="80"></el-table-column>
                              <el-table-column property="capital" label="注册资本/万元" show-overflow-tooltip  min-width="120">
                                  <template scope="scope">
                                    {{Number(scope.row.capital) === 0 ? "未知注册资本":scope.row.capital}}
                                  </template>
                              </el-table-column>
                              <el-table-column property="registrationTime" label="注册时间" show-overflow-tooltip min-width="100"></el-table-column>
                              <el-table-column property="phone" label="联系方式"  show-overflow-tooltip min-width="160"></el-table-column>
                              <el-table-column property="address" label="地址" show-overflow-tooltip min-width="280"></el-table-column>
                          </el-table>
                          <div class="pagination">
                              <el-pagination :page-sizes="[15, 30, 50, 100]" :page-size="pageSize" @size-change="handleSizeChange" @current-change="handleCurrentChange" layout="total, sizes, prev, pager, next, jumper" :total="total"
                                             :current-page="pageNo">
                              </el-pagination>
                          </div>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="按行业统计" name="industry">
                  <div class="vk-style-two-detail tableShort_padding">
                        <el-table
                            @row-click="handleRowClick"
                            ref="singleTable"  :data="tabelData" highlight-current-row>
                            <el-table-column property="industry" label="行业"  min-width="140">
                              <template scope="scope">
                                {{scope.row.industry ? scope.row.industry:"其他"}}
                              </template>
                            </el-table-column>
                            <el-table-column property="enterpriseNum" label="企业数量/家"  min-width="140"></el-table-column>
                            <el-table-column property="salary" label="平均薪资/元"  min-width="140">
                              <template scope="scope">
                                {{scope.row.salary?$utils.formatFloat2(scope.row.salary):scope.row.salary}}
                              </template>
                            </el-table-column>
                            <el-table-column property="recruitNum" label="招聘人数/人"  min-width="140"></el-table-column>
                        </el-table>
                        <div class="pagination">
                            <el-pagination :page-sizes="[15, 30, 50, 100]" :page-size="pageSize" @size-change="handleSizeChange" @current-change="handleCurrentChange" layout="total, sizes, prev, pager, next, jumper" :total="total"
                                           :current-page="pageNo">
                            </el-pagination>
                        </div>
                  </div>
                </el-tab-pane>
                <el-tab-pane label="按区(县)统计" name="county">
                  <div class="vk-style-two-detail tableShort_padding">
                        <el-table
                            @row-click="handleRowClick"
                            ref="singleTable"  :data="tabelData" highlight-current-row>
                            <el-table-column property="countyName" label="行政区"  min-width="140"></el-table-column>
                            <el-table-column property="enterpriseNum" label="企业数量/家"  min-width="140"></el-table-column>
                            <el-table-column property="salary" label="平均薪资/元"  min-width="140">
                              <template scope="scope">
                                {{scope.row.salary?$utils.formatFloat2(scope.row.salary):scope.row.salary}}
                              </template>
                            </el-table-column>
                            <el-table-column property="recruitNum" label="招聘人数/人"  min-width="140"></el-table-column>
                        </el-table>
                        <div class="pagination">
                            <el-pagination :page-sizes="[15, 30, 50, 100]" :page-size="pageSize" @size-change="handleSizeChange" @current-change="handleCurrentChange" layout="total, sizes, prev, pager, next, jumper" :total="total"
                                           :current-page="pageNo">
                            </el-pagination>
                        </div>
                  </div>
                </el-tab-pane>
                <el-tab-pane label="按商圈统计" name="business">
                  <div class="vk-style-two-detail tableShort_padding">
                        <el-table
                            @row-click="handleRowClick"
                            ref="singleTable"  :data="tabelData" highlight-current-row
                            @select="select" @select-all="selectAll">
                            <el-table-column
                                type="selection"
                                width="28"
                                align="right">
                            </el-table-column>
                            <el-table-column property="location.locationName" label="商圈"  min-width="140"></el-table-column>
                            <el-table-column property="enterpriseNum" label="企业数量/家"  min-width="140"></el-table-column>
                            <el-table-column property="salary" label="平均薪资/元"  min-width="140">
                              <template scope="scope">
                                {{scope.row.salary?$utils.formatFloat2(scope.row.salary):scope.row.salary}}
                              </template>
                            </el-table-column>
                            <el-table-column property="recruitNum" label="招聘人数/人"  min-width="140"></el-table-column>
                        </el-table>
                        <div class="pagination">
                            <el-pagination :page-sizes="[15, 30, 50, 100]" :page-size="pageSize" @size-change="handleSizeChange" @current-change="handleCurrentChange" layout="total, sizes, prev, pager, next, jumper" :total="total"
                                           :current-page="pageNo">
                            </el-pagination>
                        </div>
                  </div>
                </el-tab-pane>
                <el-tab-pane label="按交通枢纽统计" name="traffic">
                  <div class="vk-style-two-detail tableShort_padding">
                        <el-table
                            @row-click="handleRowClick"
                            ref="singleTable"  :data="tabelData" highlight-current-row
                            @select="select" @select-all="selectAll">
                            <el-table-column
                                type="selection"
                                width="28"
                                align="right">
                            </el-table-column>
                            <el-table-column property="location.locationName" label="交通枢纽"  min-width="140"></el-table-column>
                            <el-table-column property="enterpriseNum" label="企业数量/家"  min-width="140"></el-table-column>
                            <el-table-column property="salary" label="平均薪资/元"  min-width="140">
                              <template scope="scope">
                                {{scope.row.salary?$utils.formatFloat2(scope.row.salary):scope.row.salary}}
                              </template>
                            </el-table-column>
                            <el-table-column property="recruitNum" label="招聘人数/人"  min-width="140"></el-table-column>
                        </el-table>
                        <div class="pagination">
                            <el-pagination :page-sizes="[15, 30, 50, 100]" :page-size="pageSize" @size-change="handleSizeChange" @current-change="handleCurrentChange" layout="total, sizes, prev, pager, next, jumper" :total="total"
                                           :current-page="pageNo">
                            </el-pagination>
                        </div>
                  </div>
                </el-tab-pane>
            </el-tabs>

          </div>
        </div>
</template>

<script type="text/javascript">
    import { listMixin } from "@/mixins/list-mixins";
    import dict, { COVERAGE_RADIUSENUM } from "@/net/dict.js";

    export default {
        mixins: [listMixin],
        data () {
            return {
                filter: {
                    coverageRadius: "",
                    enterpriseIds: ""
                },
                tabLabel: "企业信息列表",
                activeTab: "enterprise",
                tabelData: []
            };
        },
        computed: {
            city () {
                return this.$store.state.city || "350200";
            },
            month () {
                return this.$store.state.month || { startMonth: "", endMonth: "" };
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
                    return { codeText: item.codeText, code: item.code };
                });
            }
        },
        watch: {
            city (val) {
                this.readList();
            },
            month(val) {
                this.readList();
            }
        },
        methods: {
            handleRowClick (row, event, column) {
                this.$logger.log("row", row);
                if (this.$route.query.tab === "1") {
                    this.$router.push("/admin/company_map/info_list_detail?tab=" + this.$route.query.tab + "&industry=" + row.industry);
                } else if (this.$route.query.tab === "2") {
                    this.$router.push("/admin/company_map/info_list_detail?tab=" + this.$route.query.tab + "&county=" + row.county + "&countyName=" + row.countyName);
                } else if (this.$route.query.tab === "3" || this.$route.query.tab === "4") {
                    let coverageRadius = 2;
                    if (this.filter.coverageRadius) {
                        coverageRadius = this.filter.coverageRadius;
                    }
                    this.$router.push("/admin/company_map/info_list_detail?tab=" + this.$route.query.tab + "&locationId=" + row.location.id + "&locationName=" + row.location.locationName + "&coverageRadius=" + coverageRadius);
                }
            },
            handleClick(tab, event) {
                let coverageRadius = "";
                if (this.$route.query.coverageRadius) {
                    coverageRadius = "&coverageRadius=" + this.$route.query.coverageRadius;
                }
                this.$router.push({
                    path: "/admin/company_map/info_list?tab=" + tab.index + coverageRadius
                });
                if (this.$route.query.tab === "0") {
                    this.tabLabel = "企业信息列表";
                } else if (this.$route.query.tab === "1") {
                    this.tabLabel = "按行业统计";
                } else if (this.$route.query.tab === "2") {
                    this.tabLabel = "按区(县)统计";
                } else if (this.$route.query.tab === "3") {
                    this.tabLabel = "按商圈统计";
                } else if (this.$route.query.tab === "4") {
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
            handleCurrentChange(index) {
                this.pageNo = index;
                this.readList();
                this.$logger.log("this.pageNo", this.pageNo);
            },
            handleSizeChange(val) {
                this.pageSize = val;
                this.pageNo = 1;
                this.readList();
            },
            // 勾选
            select: function (selection, row) {
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
            selectAll: function (selection) {
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
                if (this.activeTab === "enterprise") {
                    api = this.$api.enterprise_export;
                    params = {
                        enterpriseIds: this.filter.enterpriseIds,
                        city: this.city
                    };
                } else if (this.activeTab === "industry") {
                    api = this.$api.recruitment_industry_export;
                    params = {
                        city: this.city
                    };
                } else if (this.activeTab === "county") {
                    api = this.$api.recruitment_county_export;
                    params = {
                        city: this.city
                    };
                } else if (this.activeTab === "traffic" || this.activeTab === "business") {
                    api = this.$api.recruitment_poi_export;
                    const locationType = this.activeTab === "traffic" ? "traffic_hub" : "trading_area";
                    params = {
                        locationType: locationType,
                        coverageRadius: this.filter.coverageRadius,
                        city: this.city,
                        poiIds: this.filter.enterpriseIds
                    };
                } else {
                    api = this.$api.enterprise_export;
                    params = {
                        enterpriseIds: this.filter.enterpriseIds,
                        city: this.city
                    };
                }
                //this.$logger.log("api, params", api, params);
                params.startTime = this.month.startMonth || "";
                params.endTime = this.month.endMonth || "";
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
            async readList () {
                this.$logger.log("this.city", this.city);
                let url;
                let params;
                if (this.activeTab === "enterprise" || this.activeTab === "") {
                    url = this.$api.enterprise_page;
                    params = {
                        keyword: this.filter.keyword,
                        city: this.city
                    };
                }
                if (this.activeTab === "industry") {
                    url = this.$api.recruitment_industry;
                    params = {
                        // keyword: this.filter.keyword,
                        city: this.city
                    };
                }
                if (this.activeTab === "traffic" || this.activeTab === "business") {
                    url = this.$api.recruitment_poi_page;
                    const locationType = this.activeTab === "traffic" ? "traffic_hub" : "trading_area";
                    params = {
                        // keyword: this.filter.keyword,
                        locationType: locationType,
                        coverageRadius: this.filter.coverageRadius || "2",
                        city: this.city
                    };
                }
                if (this.activeTab === "county") {
                    url = this.$api.recruitment_county;
                    params = {
                        city: this.city
                    };
                }
                params.startTime = this.month.startMonth || "";
                params.endTime = this.month.endMonth || "";
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
            },
            async initState() {
                this.readList();
            }

        },
        created() {
            if (this.$route.query.tab === "0") {
                this.activeTab = "enterprise";
                this.tabLabel = "企业信息列表";
            } else if (this.$route.query.tab === "1") {
                this.activeTab = "industry";
                this.tabLabel = "按行业统计";
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
    .reset-btn{
      position: absolute;
      right: 100px;
    }
    .vk-style-two-detail{
        .vk-top-title{
          display: flex;
          justify-content: flex-end;
          padding: 20px 0;
        }
        .warn-item{
            margin-top:30px;
            margin-bottom: 11px;
            .warn-item-gray{
              color: @fontColor-label;
            }
            .warn-item-blue{
              color:@fontColor-active;
            }
        }
        .el-col{
        margin-bottom: calc(~"@{marginBottom} - 10px");
      }
    }
</style>
