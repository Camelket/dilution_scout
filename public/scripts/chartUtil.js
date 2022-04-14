

// const formatQueryResult = function(data) {
  // format to label: data_point dict
  // then return the dict with ready to use data for chart
// }

function formatNumberY(num) {
    if (num == "0"){return num}
    if (num.length == 13){return num.slice(0, 4) + " M"}
    if (num.length == 11){return num.slice(0, 3) + " M"}
    if (num.length == 10){return num.slice(0, 2) + " M"}
    if (num.length == 9) {return num.slice(0, 1) + " M"}
    if (num.length == 8) {return num.slice(0, 3) + " K"}
    if (num.length == 7) {return num.slice(0, 2) + " K"}
    if (num.length == 6) {return num.slice(0, 1) + " K"}}

function formatStringToOnlyDate(value){
  unix = Date.parse(value)
  d = new Date(unix)
  return d.getFullYear() +"-"+ ("0" + d.getMonth()).slice(-2) +"-"+ ("0" + d.getDate()).slice(-2)
}
 
const resizeChart = function (chart, newSize) {
  if (newSize["width"] < 600) {
    chart.config.options["aspectRatio"] = 0.8
    chart.update()
    return
  }
  if (700 < newSize["width"] < 850 ) {
    chart.config.options["aspectRatio"] = 1.4
    chart.update()
    return
  }
  if (850 < newSize["width"] < 1000) {
    chart.config.options["aspectRatio"] = 1.8
    chart.update()
    return
  }
  if (1000 < newSize["width"] < 1600) {
    chart.config.options["aspectRatio"] = 2.1
    chart.update()
    return
  }
}



const createOSChartconfig = function(data1) {
  // console.log(`data1: ${data1}`)
  const config = {
      type: "bar",
      data: {
          datasets: [{
          xAxisID: "x",
          yAxisID: "y",
          backgroundColor: "grey",
          hoverBackgroundColor: "blue",
          label: "Outstanding Shares",
          data: data1,
          fill: false
      }]
    },
    options: {
      onResize:  resizeChart,
      tooltips: {
        mode: "label"
        },
      hover: {
        mode: 'nearest',
        intersect: true
        },
      plugins:{
        legend:{
          display: false
        }
      },
      scales: {
        x: {
          display: true,
          ticks: {
            callback: function(value, index, ticks) {
              label = this.getLabelForValue(value)
              return formatStringToOnlyDate(label)}
          }
        },
        y:{
          display: true,
          ticks: {
          callback: function(value, index, ticks) {
            label = this.getLabelForValue(value)
            num = formatNumberY(label)
            return num}
        }
        }
      },
      parsing: {
        xAxisKey: 'instant',
        yAxisKey: 'amount'
    }
    }
  }
  return config
};


const createCPChartconfig = function(data1) {
  // console.log(`data1: ${data1}`)
  const config = {
      type: "bar",
      data: {
          datasets: [{
          xAxisID: "x",
          yAxisID: "y",
          backgroundColor: "grey",
          hoverBackgroundColor: "blue",
          label: "Cash and Equivalents",
          data: data1,
          fill: false
      }]
    },
    options: {
      responsive: true,
      onResize: resizeChart,
      tooltips: {
        mode: "label"
        },
      hover: {
        mode: 'nearest',
        intersect: true
        },
      plugins:{
          legend:{
            display: false
          }
        },
      scales: {
        x: {
          display: true
          ,
          ticks: {
            callback: function(value, index, ticks) {
              label = this.getLabelForValue(value)
              return formatStringToOnlyDate(label)}
          }
          // type: "time"
        },
        y: {
          display: true,
          ticks: {
            callback: function(value, index, ticks) {
              label = this.getLabelForValue(value)
              num = formatNumberY(label)
              return num}
          }
          // type: "logarithmic"
        }
      }
      ,
      parsing: {
        xAxisKey: 'instant',
        yAxisKey: 'amount'
    }
    }
  }
  return config
};





