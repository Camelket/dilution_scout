

// const formatQueryResult = function(data) {
  // format to label: data_point dict
  // then return the dict with ready to use data for chart
// }
const createOutstandingSharesChartconfig = function(data1) {
  console.log(`data1: ${data1}`)
  const config = {
      type: "bar",
      data: {
          datasets: [{
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
          display: true
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

module.exports = createOutstandingSharesChartconfig



