<template lang="html">
  <div>
      <div class="breadcrumb">
          <el-breadcrumb separator="/">
              <el-breadcrumb-item>租金地图</el-breadcrumb-item>
              <el-breadcrumb-item>信息列表</el-breadcrumb-item>
              <el-breadcrumb-item class="breadlink" :to="{path: '/admin/rent_map/info_list?tab='+ this.$route.query.tab}">{{tabName}}</el-breadcrumb-item>
              <el-breadcrumb-item>{{detailTitle}}</el-breadcrumb-item>
          </el-breadcrumb>
      </div>
      <div class="vk-list">
          <ul class="vk-tools-bar">
              <li class="filter">
                <div class="search-input">
                    <i class="tako-icon-search search"></i>
                    <el-input placeholder="标题" class='long' v-model="filter.keyword"/>
                </div>
              </li>
              <li class="vk-btns">
                    <el-button style="color: #999999;padding: 0px 13px 0 9px;" @click="toReturn"><i class="tako-icon-back"></i> 返回</el-button>
                    <el-button type="primary" @click="exportTabel">
                        导出
                    </el-button>
              </li>
          </ul>
          <el-table :data="tabelData" ref="singleTable" @selection-change="handleSelectionChange">
              <el-table-column type="selection" width="28" align="right"></el-table-column>
              <el-table-column label="标题" property="title" show-overflow-tooltip min-width="120"></el-table-column>
              <el-table-column label="租金/元/月" property="roomCharge" show-overflow-tooltip></el-table-column>
              <el-table-column v-if="$route.query.tab!=='1'" label="户型" property="houseTypeName" show-overflow-tooltip></el-table-column>
              <el-table-column label="面积/㎡" property="area" show-overflow-tooltip></el-table-column>
              <!--<el-table-column label="社区" property="field" show-overflow-tooltip></el-table-column>-->
              <el-table-column label="地址" property="address" show-overflow-tooltip></el-table-column>
              <el-table-column label="经纪人" property="middleman" show-overflow-tooltip></el-table-column>
              <el-table-column label="电话" property="phone" show-overflow-tooltip min-width="120"></el-table-column>
              <el-table-column label="更新时间" property="updateTime" show-overflow-tooltip min-width="120"></el-table-column>
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
                    enterpriseIds: []
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
            startMonth () {
                return this.$store.state.month.startMonth || "";
            },
            endMonth () {
                return this.$store.state.month.endMonth || "";
            },
            tabName () {
                if (this.$route.query.tab === "1") {
                    return "按户型统计";
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
                    return this.$route.query.rentTypeName;
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
            startMonth(val) {
                this.readList();
            },
            endMonth(val) {
                this.readList();
            }
        },
        methods: {
            //返回
            toReturn () {
                window.history.go(-1);
            },
            handleSelectionChange(selection) {
                this.filter.enterpriseIds = [];
                selection.forEach((item) => {
                    this.filter.enterpriseIds.push(item.id);
                });
            },
            //导出
            exportTabel() {
                let params = {};
                let api = null;
                if (this.$route.query.tab === "1") {
                    api = this.$api.house_rent_export;
                    params = {
                        city: this.city,
                        houseType: this.$route.query.rentType,
                        keyword: this.filter.keyword,
                        houseLevel: this.$route.query.houseLevel
                    };
                } else if (this.$route.query.tab === "2") {
                    //按区(县)统计
                    api = this.$api.house_rent_export;
                    params = {
                        city: this.city,
                        county: this.$route.query.county,
                        houseType: this.$route.query.houseType,
                        keyword: this.filter.keyword
                    };
                } else if (this.$route.query.tab === "3" || this.$route.query.tab === "4") {
                    //按商圈统计、按交通枢纽统计
                    api = this.$api.house_rent_export_location_detail;
                    const locationType = this.$route.query.tab === "4" ? "traffic_hub" : "trading_area";
                    params = {
                        keyword: this.filter.keyword,
                        coverageRadius: this.$route.query.coverageRadius || "2",
                        locationId: this.$route.query.locationId,
                        city: this.city,
                        locationType: locationType,
                        houseType: this.$route.query.houseType
                    };
                }
                //导出请求
                params.startTime = this.startMonth;
                params.endTime = this.endMonth;
                params.ids = this.filter.enterpriseIds + "";
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
                if (this.$route.query.tab === "1") {
                    url = this.$api.house_rent_page;
                    params = {
                        city: this.city,
                        houseType: this.$route.query.rentType,
                        keyword: this.filter.keyword,
                        houseLevel: this.$route.query.houseLevel
                    };
                    this.$logger.log("params", params);
                }
                if (this.$route.query.tab === "2") {
                    url = this.$api.house_rent_page;
                    params = {
                        city: this.city,
                        county: this.$route.query.county,
                        keyword: this.filter.keyword,
                        houseType: this.$route.query.houseType
                    };
                }
                if (this.$route.query.tab === "3" || this.$route.query.tab === "4") {
                    const myLocationType = this.$route.query.tab === "3" ? "trading_area" : "traffic_hub";
                    url = this.$api.house_rent_page_location_detail;
                    params = {
                        keyword: this.filter.keyword,
                        coverageRadius: this.$route.query.coverageRadius,
                        locationId: this.$route.query.locationId,
                        city: this.city,
                        locationType: myLocationType,
                        houseType: this.$route.query.houseType
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
                this.$logger.log("res", res);
                this.tabelData = res.rows;
                this.total = res.total;
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
