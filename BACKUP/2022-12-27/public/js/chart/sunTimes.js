var ctx = document.getElementById("mySunChart");
var sunTimes;
$.ajax({url: "weatherdata", success: function(result){
    //$("#div1").html(result);
    sunTimes = result[0].sunTimeData;
    console.log(result);
    console.log(sunTimes);
    
    var monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    var ldata = [];
    var ddata = [];
    for(count = 0; count < 13; count++){
        var st = "00:00:00"
        var et = sunTimes[0][count%12].monthData[0].length;
        var strt = moment(st, 'hh:mm:ss');
        var endt = moment(et, 'hh:mm:ss');
        var durt = moment.duration(endt.diff(strt)).add(5, 'h');

        ldata.push( monthNames[count%12].substring(0,3) + " 1st" );
        //ldata.push( new Date(2017, count, 21 ) );
        
        ddata.push( durt._milliseconds  );
    };

    console.log(ldata);
    console.log(ddata);
    
    // Add-on to draw vertical line
    var originalLineDraw = Chart.controllers.line.prototype.draw;
    Chart.helpers.extend(Chart.controllers.line.prototype, {
      draw: function() {
        originalLineDraw.apply(this, arguments);

        var chart = this.chart;
        var ctx = chart.chart.ctx;

        var index = chart.config.data.lineAtIndex;
        if (index) {
          var xaxis = chart.scales['x-axis-0'];
          var yaxis = chart.scales['y-axis-0'];

          ctx.save();
          ctx.beginPath();
          ctx.moveTo(xaxis.getPixelForValue(undefined, index), yaxis.top);
          ctx.strokeStyle = '#ff0000';
          ctx.lineTo(xaxis.getPixelForValue(undefined, index), yaxis.bottom);
          ctx.stroke();
          ctx.restore();
        }
      }
    });

    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ldata,
            datasets: [{
                label: 'Daylight hours',
                data: ddata,
                //backgroundColor: [
                //    'rgba(255, 99, 132, 0.2)',
                //    'rgba(54, 162, 235, 0.2)',
                //    'rgba(255, 206, 86, 0.2)',
                //    'rgba(75, 192, 192, 0.2)',
                //    'rgba(153, 102, 255, 0.2)',
                //    'rgba(255, 159, 64, 0.2)',
                //    'rgba(255, 109, 64, 0.2)'
                //],
                //borderColor: [
                //    'rgba(255,99,132,1)',
                //    'rgba(54, 162, 235, 1)',
                //    'rgba(255, 206, 86, 1)',
                //    'rgba(75, 192, 192, 1)',
                //    'rgba(153, 102, 255, 1)',
                //    'rgba(255, 159, 64, 1)',
                //    'rgba(255, 109, 64, 1)',
                //],
                borderWidth: 1
            }],
            //lineAtIndex: 3.5,
            lineAtIndex: daysFromToday()/30
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                xAxes: [{
                    ticks: {
                        autoSkip: false,
                        maxRotation: 90,
                        minRotation: 90
                    }
                }],

                //xAxes: [{
                //    ticks: {
                //        stepSize: 3000000000
                //    },
                //    type: 'time',
                //    position: 'bottom',
                //    time: {
                //        unit: 'day',
                //        tooltipFormat: 'MMM D',
                //        displayFormats: 
                //        {
                //            date: 'MMM D',
                //            day: 'MMM D'
                //        }
                //    }
                //}],
                yAxes: [{
                    ticks: {
                        userCallback: function(v) { return epoch_to_hh_mm_ss(v) },
                        stepSize: 30 * 60 * 1000
                    }
                }]
            },
            tooltips: {
                callbacks: {
                    label: function(tooltipItem, data) {
                        return data.datasets[tooltipItem.datasetIndex].label + ': ' + epoch_to_hh_mm_ss(tooltipItem.yLabel)
                    }
                }
            }
    }});

    function epoch_to_hh_mm_ss(epoch) {
        //return new Date(epoch).toISOString().substr(12, 7)
        return moment(epoch).format("H:mm");
    }
    function daysFromToday() {
        var then = new Date(2021, 00, 1);
        var now  = new Date();
        var rv = Math.round((now - then) / (1000 * 60 * 60 * 24)); 
        if(rv<0) rv = rv + 365;
        console.log(rv);
        return rv;
    }
    //}});


    
}});
