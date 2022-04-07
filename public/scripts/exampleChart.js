

// const formatQueryResult = function(data) {
  // format to label: data_point dict
  // then return the dict with ready to use data for chart
// }
const createOSChartconfig = function(data1) {
  // console.log(`data1: ${data1}`)
  const config = {
      type: "bar",
      data: {
          datasets: [{
          xAxisID: "x",
          yAxisID: "y",
          backgroundColor: "grey",
          hoverBackgroundColor: "red",
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
        x: {
          display: true
        },
        y:{
          display: true
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
      tooltips: {
        mode: "label"
        },
      hover: {
        mode: 'nearest',
        intersect: true
        },
      scales: {
        x: {
          display: true
          // type: "time"
        },
        y: {
          display: true
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

module.exports = {createOSChartconfig, createCPChartconfig}



