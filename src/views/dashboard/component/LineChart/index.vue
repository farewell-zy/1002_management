<template>
  <div :style="{width,height}"></div>
</template>

<script>
import echarts from 'echarts'; // 引入echarts
require('echarts/theme/mecarons'); // 引入主题，需要require
export default {
  name: '',
  props:{
    width:{
      type: String,
      default: '100%',
    },
    height:{
      type: String,
      default: '350px'
    },
    chartData:{
      type: Object,
      required: true
    },
    yTittle:{
      type: String,
      required: true
    }
  },
  data(){
    return {
      chart: null
    }
  },
  mounted() {
    // 初始化echart画图
    this.initChart()  
  },
  methods: {
    initChart(){
      this.chart = echarts.init(this.$el,'mecarons')
      this.setOption(this.chartData)
    },
    setOption({expectedData = [], actualData = []}){
      this.chart.setOption({
        tooltip: {
          trigger: 'axis', 
          axisPointer:{
            type:'cross'
          }
        },
        legend: {
          data: ["期望","实际"]
        },
        xAxis: {
          data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
          boundaryGap: false
        },
        yAxis: {
          name: 'this.yTittle'
        },
        grid: {
          left: 10,
          right: 10,
          top: 40,
          bottom: 20,
          containLabel: true
        },
        series: [
          {
            name: '期望',
            type: 'line',
            data: expectedData,
            itemStyle:{
              color: 'red'
            },
            lineStyle:{
              width:2
            },
            areaStyle:{
              color: 'hotpink'
            }
          },
          {
            name: '实际',
            type: 'line',
            data: actualData
          },
        ]
      })
    }
  },
  watch:{
    chartData:{
      deep: true,
      handler(newVal){
        this.setOption(newVal)
      }
    }
  }
}
</script>

<style lang="less" scoped>

</style>
