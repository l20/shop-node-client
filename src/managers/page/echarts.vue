<style scoped>
.echarts-wrap {
  width: 100%;
}
.echarts {
  /* margin-left: 20px; */
  width: 100%;
}
.echarts-item {
  /* float: left; */
  /* width: 500px; */
  height: 400px;
}
</style>

<template>
<div class="echarts-wrap">
    <Row class="echarts" type="flex">
        <Col class="echarts-item" span="12">
            <IEcharts :option="pie"></IEcharts>
        </Col>
        <Col class="echarts-item" span="12">
            <IEcharts :option="radar"></IEcharts>
        </Col>
    </Row>
    <Row class="echarts" type="flex">
        <Col class="echarts-item" span="12">
            <IEcharts :option="line"></IEcharts>
        </Col>
        <Col class="echarts-item" span="12">
            <IEcharts :option="bar"></IEcharts>
        </Col>
    </Row>
</div>

</template>

<script>
// import Row from "iview/src/components/grid/row";
// import Col from "iview/src/components/grid/col";
// manually
import IEcharts from "vue-echarts-v3/src/lite";
import "echarts/lib/chart/pie";
import "echarts/lib/chart/radar";
import "echarts/lib/chart/line";
import "echarts/lib/chart/bar";
// echarts components
import "echarts/lib/component/title";
import "echarts/lib/component/legend";
import "echarts/lib/component/tooltip";
var spring = [
  [55, 9, 56, 0.46, 18, 6, 1],
  [25, 11, 21, 0.65, 34, 9, 2],
  [56, 7, 63, 0.3, 14, 5, 3],
  [33, 7, 29, 0.33, 16, 6, 4],
  [42, 24, 44, 0.76, 40, 16, 5],
  [82, 58, 90, 1.77, 68, 33, 6],
  [74, 49, 77, 1.46, 48, 27, 7],
  [78, 55, 80, 1.29, 59, 29, 8],
  [267, 216, 280, 4.8, 108, 64, 9],
  [185, 127, 216, 2.52, 61, 27, 10],
  [39, 19, 38, 0.57, 31, 15, 11],
  [41, 11, 40, 0.43, 21, 7, 12],
  [64, 38, 74, 1.04, 46, 22, 13],
  [108, 79, 120, 1.7, 75, 41, 14],
  [108, 63, 116, 1.48, 44, 26, 15],
  [33, 6, 29, 0.34, 13, 5, 16],
  [94, 66, 110, 1.54, 62, 31, 17],
  [186, 142, 192, 3.88, 93, 79, 18],
  [57, 31, 54, 0.96, 32, 14, 19],
  [22, 8, 17, 0.48, 23, 10, 20],
  [39, 15, 36, 0.61, 29, 13, 21],
  [94, 69, 114, 2.08, 73, 39, 22],
  [99, 73, 110, 2.43, 76, 48, 23],
  [31, 12, 30, 0.5, 32, 16, 24],
  [42, 27, 43, 1, 53, 22, 25],
  [154, 117, 157, 3.05, 92, 58, 26],
  [234, 185, 230, 4.09, 123, 69, 27],
  [160, 120, 186, 2.77, 91, 50, 28],
  [134, 96, 165, 2.76, 83, 41, 29],
  [52, 24, 60, 1.03, 50, 21, 30],
  [46, 5, 49, 0.28, 10, 6, 31]
];

var summer = [
  [26, 37, 27, 1.163, 27, 13, 1],
  [85, 62, 71, 1.195, 60, 8, 2],
  [78, 38, 74, 1.363, 37, 7, 3],
  [21, 21, 36, 0.634, 40, 9, 4],
  [41, 42, 46, 0.915, 81, 13, 5],
  [56, 52, 69, 1.067, 92, 16, 6],
  [64, 30, 28, 0.924, 51, 2, 7],
  [55, 48, 74, 1.236, 75, 26, 8],
  [76, 85, 113, 1.237, 114, 27, 9],
  [91, 81, 104, 1.041, 56, 40, 10],
  [84, 39, 60, 0.964, 25, 11, 11],
  [64, 51, 101, 0.862, 58, 23, 12],
  [70, 69, 120, 1.198, 65, 36, 13],
  [77, 105, 178, 2.549, 64, 16, 14],
  [109, 68, 87, 0.996, 74, 29, 15],
  [73, 68, 97, 0.905, 51, 34, 16],
  [54, 27, 47, 0.592, 53, 12, 17],
  [51, 61, 97, 0.811, 65, 19, 18],
  [91, 71, 121, 1.374, 43, 18, 19],
  [73, 102, 182, 2.787, 44, 19, 20],
  [73, 50, 76, 0.717, 31, 20, 21],
  [84, 94, 140, 2.238, 68, 18, 22],
  [93, 77, 104, 1.165, 53, 7, 23],
  [99, 130, 227, 3.97, 55, 15, 24],
  [146, 84, 139, 1.094, 40, 17, 25],
  [113, 108, 137, 1.481, 48, 15, 26],
  [81, 48, 62, 1.619, 26, 3, 27],
  [56, 48, 68, 1.336, 37, 9, 28],
  [82, 92, 174, 3.29, 0, 13, 29],
  [106, 116, 188, 3.628, 101, 16, 30],
  [118, 50, 0, 1.383, 76, 11, 31]
];

var autumn = [
  [91, 45, 125, 0.82, 34, 23, 1],
  [65, 27, 78, 0.86, 45, 29, 2],
  [83, 60, 84, 1.09, 73, 27, 3],
  [109, 81, 121, 1.28, 68, 51, 4],
  [106, 77, 114, 1.07, 55, 51, 5],
  [109, 81, 121, 1.28, 68, 51, 6],
  [106, 77, 114, 1.07, 55, 51, 7],
  [89, 65, 78, 0.86, 51, 26, 8],
  [53, 33, 47, 0.64, 50, 17, 9],
  [80, 55, 80, 1.01, 75, 24, 10],
  [117, 81, 124, 1.03, 45, 24, 11],
  [99, 71, 142, 1.1, 62, 42, 12],
  [95, 69, 130, 1.28, 74, 50, 13],
  [116, 87, 131, 1.47, 84, 40, 14],
  [108, 80, 121, 1.3, 85, 37, 15],
  [134, 83, 167, 1.16, 57, 43, 16],
  [79, 43, 107, 1.05, 59, 37, 17],
  [71, 46, 89, 0.86, 64, 25, 18],
  [97, 71, 113, 1.17, 88, 31, 19],
  [84, 57, 91, 0.85, 55, 31, 20],
  [87, 63, 101, 0.9, 56, 41, 21],
  [104, 77, 119, 1.09, 73, 48, 22],
  [87, 62, 100, 1, 72, 28, 23],
  [168, 128, 172, 1.49, 97, 56, 24],
  [65, 45, 51, 0.74, 39, 17, 25],
  [39, 24, 38, 0.61, 47, 17, 26],
  [39, 24, 39, 0.59, 50, 19, 27],
  [93, 68, 96, 1.05, 79, 29, 28],
  [188, 143, 197, 1.66, 99, 51, 29],
  [174, 131, 174, 1.55, 108, 50, 30],
  [187, 143, 201, 1.39, 89, 53, 31]
];

var winter = [
  [91, 45, 125, 0.82, 34, 23, 1],
  [65, 27, 78, 0.86, 45, 29, 2],
  [83, 60, 84, 1.09, 73, 27, 3],
  [106, 77, 114, 1.07, 55, 51, 5],
  [109, 81, 121, 1.28, 68, 51, 6],
  [109, 81, 121, 1.28, 68, 51, 4],
  [106, 77, 114, 1.07, 55, 51, 7],
  [53, 33, 47, 0.64, 50, 17, 9],
  [89, 65, 78, 0.86, 51, 26, 8],
  [99, 71, 142, 1.1, 62, 42, 12],
  [80, 55, 80, 1.01, 75, 24, 10],
  [95, 69, 130, 1.28, 74, 50, 13],
  [116, 87, 131, 1.47, 84, 40, 14],
  [117, 81, 124, 1.03, 45, 24, 11],
  [108, 80, 121, 1.3, 85, 37, 15],
  [134, 83, 167, 1.16, 57, 43, 16],
  [79, 43, 107, 1.05, 59, 37, 17],
  [71, 46, 89, 0.86, 64, 25, 18],
  [84, 57, 91, 0.85, 55, 31, 20],
  [97, 71, 113, 1.17, 88, 31, 19],
  [87, 62, 100, 1, 72, 28, 23],
  [87, 63, 101, 0.9, 56, 41, 21],
  [104, 77, 119, 1.09, 73, 48, 22],
  [188, 143, 197, 1.66, 99, 51, 29],
  [65, 45, 51, 0.74, 39, 17, 25],
  [39, 24, 38, 0.61, 47, 17, 26],
  [168, 128, 172, 1.49, 97, 56, 24],
  [93, 68, 96, 1.05, 79, 29, 28],
  [39, 24, 39, 0.59, 50, 19, 27],
  [187, 143, 201, 1.39, 89, 53, 31][(174, 131, 174, 1.55, 108, 50, 30)]
];
var lineStyle = {
  normal: {
    width: 1,
    opacity: 0.5
  }
};
export default {
  name: "echarts",
  components: {
    IEcharts,
    // Row,
    // Col,
  },
  data: () => ({
    line: {
      title: {
        text: "Top5销量曲线图"
      },
      tooltip: {
        trigger: "item",
        formatter: "{a} <br/>{b} : {c} "
      },
      xAxis: {
        data: ["蓝牙音响", "头戴式蓝牙耳机", "移动电源", "铁三角耳塞", "伸缩自拍杆", "小米智能电视"]
      },
      yAxis: {},
      series: [
        {
          name: "销量",
          type: "line",
          data: [335, 310, 234, 135, 548]
        }
      ]
    },
    bar: {
      title: {
        text: "Top5销量柱状图"
      },
      tooltip: {
        trigger: "item",
        formatter: "{a} <br/>{b} : {c}"
      },
      xAxis: {
        data: ["蓝牙音响", "头戴式蓝牙耳机", "移动电源", "铁三角耳塞", "伸缩自拍杆", "小米智能电视"]
      },
      yAxis: {},
      series: [
        {
          name: "销量",
          type: "bar",
          data: [335, 310, 234, 135, 548]
        }
      ]
    },
    pie: {
      title: {
        show: true,
        text: "Top5销量饼状图",
        x: "center"
      },
      tooltip: {
        trigger: "item",
        formatter: "{a} <br/>{b} : {c} ({d}%)"
      },
      legend: {
        orient: "vertical",
        left: "left",
        data: ["蓝牙音响", "头戴式蓝牙耳机", "移动电源", "铁三角耳塞", "伸缩自拍杆"]
      },
      series: [
        {
          name: "销量",
          type: "pie",
          radius: "55%",
          center: ["50%", "50%"],
          data: [
            {
              value: 335,
              name: "蓝牙音响"
            },
            {
              value: 310,
              name: "头戴式蓝牙耳机"
            },
            {
              value: 234,
              name: "移动电源"
            },
            {
              value: 135,
              name: "铁三角耳塞"
            },
            {
              value: 548,
              name: "伸缩自拍杆"
            }
          ],
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)"
            }
          }
        }
      ]
    },
    radar: {
      backgroundColor: "#2c3b41",
      title: {
        text: "Top5销量雷达图",
        left: "left",
        textStyle: {
          color: "#eee"
        }
      },
      legend: {
        bottom: 5,
        data: ["第一季度", "第二季度", "第三季度", "第四季度"],
        itemGap: 20,
        textStyle: {
          color: "#fff",
          fontSize: 12
        },
        selectedMode: "single"
      },
      tooltip: {
        trigger: "item",
        formatter: "{a} <br/>{c} "
      },
      // visualMap: {
      //     show: true,
      //     min: 0,
      //     max: 20,
      //     dimension: 6,
      //     inRange: {
      //         colorLightness: [0.5, 0.8]
      //     }
      // },
      radar: {
        indicator: [
          { name: "头戴式蓝牙耳机", value: 310 },
          { name: "蓝牙音响", value: 335 },
          { name: "移动电源", value: 234 },
          { name: "铁三角耳塞", value: 135 },
          { name: "伸缩自拍杆", value: 548 }
        ],
        shape: "circle",
        splitNumber: 5,
        name: {
          textStyle: {
            color: "rgb(238, 197, 102)"
          }
        },
        splitLine: {
          lineStyle: {
            color: [
              "rgba(238, 197, 102, 0.1)",
              "rgba(238, 197, 102, 0.2)",
              "rgba(238, 197, 102, 0.4)",
              "rgba(238, 197, 102, 0.6)",
              "rgba(238, 197, 102, 0.8)",
              "rgba(238, 197, 102, 1)"
            ].reverse()
          }
        },
        splitArea: {
          show: false
        },
        axisLine: {
          lineStyle: {
            color: "rgba(238, 197, 102, 0.5)"
          }
        }
      },
      series: [
        {
          name: "第一季度",
          type: "radar",
          lineStyle: lineStyle,
          data: spring,
          symbol: "none",
          itemStyle: {
            normal: {
              color: "#F9713C"
            }
          },
          areaStyle: {
            normal: {
              opacity: 0.1
            }
          }
        },
        {
          name: "第二季度",
          type: "radar",
          lineStyle: lineStyle,
          data: autumn,
          symbol: "none",
          itemStyle: {
            normal: {
              color: "#B3E4A1"
            }
          },
          areaStyle: {
            normal: {
              opacity: 0.05
            }
          }
        },
        {
          name: "第三季度",
          type: "radar",
          lineStyle: lineStyle,
          data: summer,
          symbol: "none",
          itemStyle: {
            normal: {
              color: "rgb(238, 197, 102)"
            }
          },
          areaStyle: {
            normal: {
              opacity: 0.05
            }
          }
        },
        {
          name: "第四季度",
          type: "radar",
          lineStyle: lineStyle,
          data: winter,
          symbol: "none",
          itemStyle: {
            normal: {
              color: "rgb(238, 197, 102)"
            }
          },
          areaStyle: {
            normal: {
              opacity: 0.05
            }
          }
        }
      ]
    }
    /* radar: {
            title: {
                text: 'Top5销量环形图',
                x: 'center'
            },
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                orient: 'vertical',
                left: 'left',
                data: ["蓝牙音响", "头戴式蓝牙耳机", "移动电源", "铁三角耳塞", "伸缩自拍杆"]
            },
            series: [{
                name: '销量',
                type: 'pie',
                radius: ['40%', '60%'],
                data: [{
                    value: 335,
                    name: '蓝牙音响'
                }, {
                    value: 310,
                    name: '头戴式蓝牙耳机'
                }, {
                    value: 234,
                    name: '移动电源'
                }, {
                    value: 135,
                    name: '铁三角耳塞'
                }, {
                    value: 548,
                    name: '伸缩自拍杆'
                }],
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }]
        } */
  })
};
</script>
