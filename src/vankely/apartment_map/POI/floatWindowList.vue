<template>
  <div
      v-if="total>0"
      class="spread-list"
      :class="clickClass"
      style="width: 100%;text-align: center;background: #FFFFFF;overflow: scroll;padding-bottom: 20px"
      :style="{maxHeight:subMenuHeight + 'px'}"
  >
      <div v-for="(room,cmpIndex) in roomList"
           :key="cmpIndex"
           class="inner-list-item"
           @click="toDetail(cmpIndex)"
           @mouseenter="onColumnMouseEnter(cmpIndex)"
           @mouseleave="onColumnMouseLeave(cmpIndex)"
      >
          <header>
              <img
                  class="img-style"
                  :src="getPointSvg(cmpIndex+1)"
              >
              <div
                  style="font-size: 13px;
                          width: 220px;
                              color:#1CBCB4;
                              margin-left: 10px;
                                  white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
                  {{room.name}}
              </div>
          </header>
          <footer>
              <div>{{room.address}}</div>
              <span style="text-align: left;margin-top:10px;background:#f7f7f7;border-radius:1px;padding:10px;display: inline-block;">
                {{room.brand}}
              </span>
          </footer>
      </div>
      <el-pagination
          style="margin-top: 20px"
          small
          @current-change="onPageChange"
          layout="prev, pager, next"
          :total="total">
      </el-pagination>
  </div>
</template>

<script>
    export default{
        name: "float-window-list",
        props: {
            clickClass: [String],
            subMenuHeight: [String, Number],
            roomList: [Array],
            toDetail: [Function],
            onColumnMouseEnter: [Function],
            onColumnMouseLeave: [Function],
            getPointSvg: [Function],
            onPageChange: [Function],
            total: [Number, String]
        },

        data() {
            return {
            };
        },

        watch: {
        },

        methods: {},

        mounted() {},

        created() {}
    };
</script>

<style lang="less">
    @import "~@/assets/less/vankely/POI/floatWindow.less";
</style>
