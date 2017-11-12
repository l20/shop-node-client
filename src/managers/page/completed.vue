<style scoped>
.completed-charts {
  width: 100%;
}
</style>

<template>
    <div class="completed-charts">
        <IEcharts :option="bar"></IEcharts>
    </div>
</template>

<script>
// manually
import IEcharts from "vue-echarts-v3/src/lite";
import "echarts/lib/chart/bar";
// echarts components
import "echarts/lib/component/tooltip";

export default {
  name: "completed",
  props: ["frontFunc"],
  components: {
    IEcharts
  },
  computed: {
    bar() {
      let yAxisData = [],
        seriesData = [];
      this.frontFunc.forEach(item => {
        let label = { normal: { 
            show: true,
            fontWeight: 'bold',
        } };
        yAxisData.push(item.name);
        item.label = label;
      });

      return {
        baseOption: {
          tooltip: {
            trigger: "item",
            formatter: "{a} <br/>{b} : {c}%",
            axisPointer: {
              type: "shadow"
            }
          },
          calculable: true,
          xAxis: {
            type: "value",
            boundaryGap: [0, 0.01],
            max: 100
          },
          yAxis: {
            type: "category",
            data: yAxisData
          },
          series: [
            {
              name: "组件功能完成度",
              type: "bar",
              label: {
                normal: {
                  show: true,
                  formatter: "{c}%",
                  position: "right"
                }
              },
              data: this.frontFunc
            }
          ]
        },
        media: [
          {
            query: {
              minWidth: 100
            },
            option: {
              series: [
                {
                  radius: [20, "50%"],
                  center: ["50%", "30%"]
                }
              ]
            }
          }
        ]
      };
    }
  },
  data() {
    return {};
  }
};
</script>
