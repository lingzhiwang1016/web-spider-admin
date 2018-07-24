<template xmlns:v-bind="http://www.w3.org/1999/xhtml">
    <el-submenu v-if="item.hasChild && !item.hidden" :index='itemIndex'>
        <template slot='title'>
            <span v-bind:class="{'scoped-root-item': item.isRoot, 'scoped-sub-item': !item.isRoot}">
              <i :class='item.icon'></i>
              {{item.name}}
            </span>
        </template>

        <!-- <el-menu-item-group> -->
        <template v-for='child in item.children'>
            <vk-menu-item :key="child.id" v-if="!item.hidden" :item='child' :parentIndex='itemIndex'></vk-menu-item>
        </template>
        <!-- </el-menu-item-group> -->
    </el-submenu>
    <el-menu-item v-else-if="!item.hasChild && !item.hidden" class="i" v-bind:class="{'scoped-root-item': item.isRoot, 'scoped-sub-item': !item.isRoot}" :index='itemIndex'>
        <i :class='item.icon'></i>{{item.name}}
    </el-menu-item>
</template>

<script>
    export default {
        name: "vk-menu-item",
        props: {
            item: {
                type: Object
            },
            parentIndex: {
                type: String
            }
        },

        data () {
            return {};
        },
        computed: {
            itemIndex: function () {
                if (!this.item.path) {
                    if (!this.parentIndex) {
                        return "/admin";
                    } else {
                        return this.parentIndex;
                    }
                }
                if (!this.parentIndex) {
                    return "/admin/" + this.item.path + "";
                } else {
                    return this.parentIndex + "/" + this.item.path;
                }
            },
            routeObj: function () {
                return {
                    path: this.item.path
                };
            }
        }
    };
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style scoped>
</style>
