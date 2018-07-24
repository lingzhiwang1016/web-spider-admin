<template lang="html">
  <div>
      <div class="breadcrumb">
          <el-breadcrumb separator="/">
              <el-breadcrumb-item>企业地图</el-breadcrumb-item>
              <el-breadcrumb-item>信息列表</el-breadcrumb-item>
              <el-breadcrumb-item class="breadlink" :to="{path: '/admin/company_map/info_list?tab='+ this.$route.query.tab}">{{tabName}}</el-breadcrumb-item>
              <el-breadcrumb-item>{{detailTitle}}</el-breadcrumb-item>
          </el-breadcrumb>
      </div>
      <div class="vk-list">
          <ul class="vk-tools-bar">
              <li class="filter">
                <div class="search-input">
                    <i class="tako-icon-search search"></i>
                    <el-input placeholder="企业名称" class='long' v-model="filter.keyword"/>
                </div>
              </li>
              <li class="vk-btns">
                    <el-button style="color: #999999;padding: 0px 13px 0 9px;" @click="toReturn"><i class="tako-icon-back"></i> 返回</el-button>
                    <el-button type="primary" @click="exportTabel">
                        导出
                    </el-button>
              </li>
          </ul>
          <el-table :data="tabelData" style="width: 100%">
            <el-table-column type="expand">
              <template scope="props">
                <el-table :data="props.row.jobsList" style="width: 100%;height: 100%;" class="props-table">
                    <el-table-column label=""  prop="" width="44" ></el-table-column>
                    <el-table-column label="招聘职位"  prop="workName"  show-overflow-tooltip></el-table-column>
                    <el-table-column label="招聘人数/人"  prop="recruitNum" show-overflow-tooltip></el-table-column>
                    <el-table-column label="平均薪资/元" prop="salary" show-overflow-tooltip>
                      <template scope="propsItem">
                        {{propsItem.row.salary?$utils.formatFloat2(propsItem.row.salary):"--"}}
                      </template>
                    </el-table-column>
                    <el-table-column label="工作地址" prop="workAddress" show-overflow-tooltip></el-table-column>
                </el-table>
              </template>
            </el-table-column>
            <el-table-column label="企业名称" prop="enterpriseName" show-overflow-tooltip></el-table-column>
            <el-table-column label="招聘人数/人" prop="sumRecruitNum"></el-table-column>
            <el-table-column label="平均薪资/元" prop="avgSalary">
                <template scope="props">
                    {{props.row.avgSalary?$utils.formatFloat2(props.row.avgSalary):"--"}}
                </template>
            </el-table-column>
            <el-table-column label="企业规模/人" prop="enterpriseScale"></el-table-column>
          </el-table>
          <div class="pagination">
              <el-pagination :page-sizes="[15, 30, 50, 100]" :page-size="pageSize" @size-change="handleSizeChange" @current-change="handleCurrentChange" layout="total, sizes, prev, pager, next, jumper" :total="total"
                             :current-page="pageNo">
              </el-pagination>
          </div>
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
                activeTab: "enterprise",
                tabelData: [],
                total: 0
            };
        },
        computed: {
            city () {
                return this.$store.state.city || "350200";
            },
            month () {
                return this.$store.state.month || { startMonth: "", endMonth: "" };
            },
            tabName () {
                if (this.$route.query.tab === "1") {
                    return "按行业统计";
                } else if (this.$route.query.tab === "2") {
                    return "按区(县)统计";
                } else if (this.$route.query.tab === "3") {
                    return "按商圈统计";
                } else if (this.$route.query.tab === "4") {
                    return "按交通枢纽统计";
                }
            },
            detailTitle () {
                if (this.$route.query.tab === "1") {
                    return this.$route.query.industry;
                } else if (this.$route.query.tab === "2") {
                    return this.$route.query.countyName;
                } else if (this.$route.query.tab === "3") {
                    return this.$route.query.locationName;
                } else if (this.$route.query.tab === "4") {
                    return this.$route.query.locationName;
                }
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
            //返回
            toReturn () {
                window.history.go(-1);
            },
            handleCurrentChange(index) {
                this.pageNo = index;
                this.readList();
            },
            handleSizeChange(val) {
                this.pageSize = val;
                this.pageNo = 1;
                this.readList();
            },
            //导出
            exportTabel() {
                let params = {};
                let api = null;
                if (this.$route.query.tab === "1") {
                    //按行业统计
                    api = this.$api.recruitment_industry_enterprise_export;
                    params = {
                        city: this.city,
                        industry: this.$route.query.industry,
                        keyword: this.filter.keyword
                    };
                } else if (this.$route.query.tab === "2") {
                    //按区(县)统计
                    api = this.$api.recruitment_county_enterprise_export;
                    params = {
                        city: this.city,
                        county: this.$route.query.county,
                        keyword: this.filter.keyword
                    };
                } else if (this.$route.query.tab === "3" || this.$route.query.tab === "4") {
                    //按商圈统计、按交通枢纽统计
                    api = this.$api.recruitment_poi_enterprise_export;
                    params = {
                        keyword: this.filter.keyword,
                        coverageRadius: this.$route.query.coverageRadius,
                        locationId: this.$route.query.locationId,
                        city: this.city
                    };
                }
                //导出请求
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
                let url;
                let params;
                if (this.$route.query.tab === "1") {
                    url = this.$api.recruitment_industry_enterprise;
                    params = {
                        city: this.city,
                        industry: this.$route.query.industry,
                        keyword: this.filter.keyword
                    };
                }
                if (this.$route.query.tab === "2") {
                    url = this.$api.recruitment_county_enterprise;
                    params = {
                        city: this.city,
                        county: this.$route.query.county,
                        keyword: this.filter.keyword
                    };
                }
                if (this.$route.query.tab === "3" || this.$route.query.tab === "4") {
                    url = this.$api.recruitment_poi_enterprise;
                    params = {
                        keyword: this.filter.keyword,
                        coverageRadius: this.$route.query.coverageRadius,
                        locationId: this.$route.query.locationId,
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
                this.tabelData = res.rows;
                this.total = res.total;
            },
            async initState() {
                this.readList();
            }

        }
    };
</script>
<style lang="less">
    .el-table__expand-icon{
        text-align: center;
    }
    .props-table tr{
        background-color: #FAFAFA;
    }
    .props-table th div.cell{
        color: #666;
        font-weight: 700!important;
    }
</style>
