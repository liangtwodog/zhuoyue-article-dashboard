<template>
  <div class="userChardiv">
    <div id="myChart1" style="width:100%;height: 370px" />
  </div>
</template>

<script>
import statisticsApi from '@/api/statistics/index'
import echarts from 'echarts'
import moment from 'moment'
export default {
  data() {
    return {
      strArrayProps: {
        label: 'name',
        value: 'id'
      },
      chartData: {
        time: [],
        user: []
      }
    }
  },
  mounted() {},
  methods: {
    drawLine(chartData) {
      const myChart = echarts.init(document.getElementById('myChart1'))
      // 绘制图表
      myChart.setOption({
        grid: {

        },
        tooltip: {
          trigger: 'axis'
        },
        xAxis: {
          type: 'category',
          boundaryGap: true,
          name: '(日期)',
          nameTextStyle: {
            padding: [25, 0, 0, 0],
            color: '#333333'
          },
          axisLine: {
            lineStyle: {
              color: '#ced8dc'
            }
          },
          axisTick: {
            lineStyle: {
              color: '#ffffff',
              width: 0
            }
          },
          axisLabel: {
            color: '#666666',
            fontSize: 12
          },
          data: chartData.timeArray
        },
        yAxis: {
          type: 'value',
          scale: true,
          name: '(人数)',
          nameTextStyle: {
            padding: [0, 40, 10, 0],
            color: '#333333'
          },
          splitLine: {
            lineStyle: {
              color: '#ced8dc',
              type: 'dashed'
            }
          },
          axisLine: {
            lineStyle: {
              color: '#ced8dc'
            }
          },
          axisTick: {
            lineStyle: {
              color: '#ffffff',
              width: 0
            }
          },
          axisLabel: {
            color: '#666666',
            fontSize: 12
            // formatter: '{value} (k)'
          }
        },
        series: [{
          name: '用户数',
          type: 'line',
          color: '#d16d6c',
          areaStyle: {},
          data: chartData.userArray
        }]
      })
      window.addEventListener('resize', function() {
        myChart.resize()
      })
    },
    getNumber(time) {
      this.listLoading = true
      const requestData = {
        start: moment(time[0]).unix(),
        end: moment(time[1]).unix()
      }
      statisticsApi.getUserTotalLineData(requestData).then(async res => {
        const data = res.data
        this.drawLine(this.setChartData(time, data))
      })
      this.listLoading = false
    },
    setChartData(time, data) {
      const allTime = [...new Array(moment(time[1]).diff(moment(time[0]).subtract(1, 'days'), 'days'))].map((i, idx) => moment(time[0]).startOf('day').add(idx, 'days').format('YYYY-MM-DD'))
      const chartData = {
        timeArray: [],
        userArray: [...new Array(moment(time[1]).diff(moment(time[0]).subtract(1, 'days'), 'days'))].map((i, idx) => 0)
      }
      for (let j = 0; j < allTime.length; j++) {
        chartData.timeArray.push(moment(allTime[j]).format('MM.DD'))
        for (let k = 0; k < data.length; k++) {
          if (allTime[j] === data[k].created_at) {
            chartData.userArray[j] = data[k].count
          }
        }
      }
      return chartData
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .userChardiv{
    width: 100%;
    padding: 20px 10px;
    position: relative;
    background-color: #f3f3f3;
  }

</style>
