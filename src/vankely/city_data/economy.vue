<template>
    <div class="info_show_basic_container">
        <ul class="flex_model">
            <li class="left_right">
               <div class="header">城市经济状况</div>
               <div class="tip">(数据来源：{{cityEconomyData.sourcesOfDate}})</div>
            </li>
            <li @click="$refs.economyEdit.open()">
                <i class="tako-icon-bianji"></i>
            </li>
        </ul>
        <hr class="hr"/>
        <ul class="flex_model">
            <li class="left_right">
              <span class="flex_model_title">城市GDP/万元:</span>
              <span class="data">{{cityEconomyData.cityGdp}}</span>
            </li>
            <li class="left_right">
              <span class="flex_model_title">人均GDP/万元:</span>
              <span class="data">{{cityEconomyData.perCapitaGdp}}</span>
            </li>
            <li class="left_right">
              <span class="flex_model_title">人均可支配收入/万元:</span>
              <span class="data">{{cityEconomyData.perCapitaDisposableIncome}}</span>
            </li>
            <li class="left_right">
              <span class="flex_model_title">私人机动车保有量/万辆:</span>
              <span class="data">{{cityEconomyData.privateVehicleOwnership}}</span>
            </li>
        </ul>

        <economyEdit
            ref="economyEdit"
            :propData="cityEconomyData"
            :onUpdata="onUpdata"
        />
    </div>
</template>

<script>
import economyEdit from "./economy_edit.vue";

export default {
    name: "hello",
    props: {
        cityEconomyData: [Object],
        onUpdata: [Function]
    },
    data () {
        return {};
    },
    components: {
        economyEdit
    },

    methods: {
    },
    mounted: function () {
    }
};
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style src="@/assets/less/vankely/city_data/economy.less" lang="less" scoped></style>
