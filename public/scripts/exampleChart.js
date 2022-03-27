

// const formatQueryResult = function(data) {
  // format to label: data_point dict
  // then return the dict with ready to use data for chart
// }
const createOSChartconfig = function(data1) {
  console.log(`data1: ${data1}`)
  const config = {
      type: "bar",
      data: {
          datasets: [{
          backgroundColor: "red",
          hoverBackgroundColor: "grey",
          label: "Outstanding Shares",
          data: data1,
          fill: false
      }]
    },
    options: {
      responsive: true,
      tooltips: {
        mode: "label"
        },
      hover: {
        mode: 'nearest',
        intersect: true
        },
      scales: {
        xAxis: [{
          display: true,
          type: "time"
        }],
        yAxis: [{
          display: true
        }]
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
  console.log(`data1: ${data1}`)
  const config = {
      type: "bar",
      data: {
          datasets: [{
          backgroundColor: "blue",
          hoverBackgroundColor: "grey",
          label: "Cash and Equivalents",
          data: data1,
          fill: false
      }]
    },
    options: {
      responsive: true,
      tooltips: {
        mode: "label"
        },
      hover: {
        mode: 'nearest',
        intersect: true
        },
      scales: {
        xAxis: [{
          display: true,
          type: "time"
        }],
        yAxis: [{
          display: true
        }]
      },
      parsing: {
        xAxisKey: 'instant',
        yAxisKey: 'amount'
    }
    }
  }
  return config
};

module.exports = {createOSChartconfig, createCPChartconfig}



