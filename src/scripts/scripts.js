/* global Chart, moment */

helpers.ready(function() {
  helpers.loadData(
    {
      url: "/data/data.json",
      type: "json"
    },
    function(err, data) {
      data = JSON.parse(data);
      
      const colorPalette = [
        /* from colorbrewer2.org */
        "rgb(179,0,0)",
        "rgb(227,74,51)",
        "rgb(252,141,89)",
        "rgb(253,204,138)",
        "rgb(254,240,217)"
      ];

      if (data && data.data) {
        var that = this,
            mobileOptimized = ( window.innerWidth < 900 ? true : false );
        
        document.getElementById( 'data-last-update-value' ).innerHTML = moment( data.last_update ).fromNow();
        document.getElementById( 'data-last-update' ).classList.remove( 'd-none' );
        
        data = data.data
          .sort( helpers.sortByFollowersCount )
          .reverse()
          .slice( 0, 30 );

        // console.log( data );
        
        var dataTopFive = data.slice( 0, 5 );
        
        if ( mobileOptimized ){
          data = dataTopFive;
          document.getElementById( 'mobile-optimized-note' ).classList.remove( 'd-none' )
        }

        const botsByFollowers = document
          .getElementById( 'bots-by-followers' )
          .getContext( '2d' );

        const botsByFollowersChart = new Chart(botsByFollowers, {
          type: 'bar',
          data: {
            labels: data.map(function(bot) {
              return '@' + bot.screen_name;
            }),
            datasets: [
              {
                yAxisID: 'followers_count',
                label: 'Number of followers',
                data: data.map(function(bot) {
                  return bot.followers_count;
                }),
                backgroundColor: helpers.colorOpacity(colorPalette[1]),
                borderColor: colorPalette[1],
                borderWidth: 1
              },
              {
                yAxisID: 'statuses_count',
                label: 'Number of tweets',
                data: data.map(function(bot) {
                  return bot.statuses_count;
                }),
                backgroundColor: helpers.colorOpacity(colorPalette[2]),
                borderColor: colorPalette[2],
                borderWidth: 1
              },
              {
                yAxisID: 'statuses_frequency',
                label: 'Tweets per day',
                data: data.map(function(bot) {
                  let lastTweetDate = bot.last_tweet_date || Date.now();
                  var duration = moment.duration(
                    moment(lastTweetDate).diff(moment(bot.created_at))
                  );
                  var tweetsPerDay = bot.statuses_count / duration.asDays();
                  return Math.round(tweetsPerDay);
                }),
                hidden: true,
                backgroundColor: helpers.colorOpacity(colorPalette[3]),
                borderColor: colorPalette[3],
                borderWidth: 1
              }
            ]
          },
          options: {
            onClick: function(ev, data) {
              // console.log( 'chart click', ev, data );
              if (data && data[0] && data[0]._view && data[0]._view.label) {
                // console.log( data[0]._view.label );
                window.open(
                  "https://twitter.com/" + data[0]._view.label,
                  "_blank"
                );
              }
            },
            legend: {
              onClick: function(ev, legendItem) {
                var index = legendItem.datasetIndex;
                var ci = this.chart;

                if (index === 0) {
                  ev.stopPropagation();
                } else {
                  if (index === 1) {
                    ci.getDatasetMeta(1).hidden = false;
                    ci.getDatasetMeta(2).hidden = true;
                    ci.options.scales.yAxes[1].display = true;
                    ci.options.scales.yAxes[2].display = false;
                  } else if (index === 2) {
                    ci.getDatasetMeta(1).hidden = true;
                    ci.getDatasetMeta(2).hidden = false;
                    ci.options.scales.yAxes[1].display = false;
                    ci.options.scales.yAxes[2].display = true;
                  }

                  ci.update();
                }
              }
            },
            scales: {
              xAxes: [
                {
                  type: 'category',
                  ticks: {
                    autoSkip: false
                  }
                }
              ],
              yAxes: [
                {
                  id: 'followers_count',
                  type: 'linear',
                  position: 'left',
                  scaleLabel: {
                    display: ( mobileOptimized ? false : true ),
                    labelString: 'Number of followers'
                  },                  
                  ticks: {
                    beginAtZero: true,
                    userCallback: function( value, index, values)  {
                      value = value.toString();
                      value = value.split( /(?=(?:...)*$)/ );
                      value = value.join( ',' );
                      return value;
                    }
                  }
                },
                {
                  id: 'statuses_count',
                  type: 'linear',
                  position: 'right',
                  scaleLabel: {
                    display: ( mobileOptimized ? false : true ),
                    labelString: 'Total number of tweets'
                  },
                  ticks: {
                    beginAtZero: true,
                    userCallback: function( value, index, values ) {
                      value = value.toString();
                      value = value.split( /(?=(?:...)*$)/ );
                      value = value.join(",");
                      return value;
                    }
                  }
                },
                {
                  id: 'statuses_frequency',
                  type: 'linear',
                  position: 'right',
                  scaleLabel: {
                    display: true,
                    labelString: 'Tweets posted per day'
                  },                                                      
                  display: false,
                  ticks: {
                    beginAtZero: true,
                    userCallback: function( value, index, values ) {
                      value = value.toString();
                      value = value.split( /(?=(?:...)*$)/) ;
                      value = value.join( ',' );
                      return value;
                    }
                  }
                }
              ]
            },
            tooltips: {
              enabled: false,
              custom: function( tooltipModel ) {
                var dataPoint = null;

                if (tooltipModel.dataPoints) {
                  dataPoint = data[tooltipModel.dataPoints[0].index];
                  // console.log( dataPoint );
                }

                var tooltipEl = document.getElementById( 'chartjs-tooltip' );

                if (!tooltipEl) {
                  tooltipEl = document.createElement( 'div' );
                  tooltipEl.id = 'chartjs-tooltip';
                  tooltipEl.innerHTML =
                    '<table style="background:#fff; border: 1px solid gray;"></table>';
                  document.body.appendChild(tooltipEl);
                }
                if (tooltipModel.opacity === 0) {
                  tooltipEl.style.opacity = 0;
                  return;
                }

                tooltipEl.classList.remove( 'above', 'below', 'no-transform' );
                if (tooltipModel.yAlign) {
                  tooltipEl.classList.add(tooltipModel.yAlign);
                } else {
                  tooltipEl.classList.add( 'no-transform' );
                }

                function getBody(bodyItem) {
                  return bodyItem.lines;
                }

                if (tooltipModel.body) {
                  var titleLines = tooltipModel.title || [];
                  var bodyLines = tooltipModel.body.map(getBody);
                  var tableCellStyle = 'style="padding: 2px 5px;"';

                  var innerHtml = '<thead>';

                  innerHtml += '<tr><th ' + tableCellStyle + '>';

                  if (dataPoint) {
                    innerHtml +=
                      '<img src="' +
                      dataPoint.profile_image_url_https +
                      '"><br/>' +
                      "@" +
                      dataPoint.screen_name;
                  }

                  innerHtml += '</th></tr></thead><tbody>';

                  if (dataPoint) {
                    var duration = moment.duration(
                      moment().diff( moment( dataPoint.created_at ) )
                    );
                    var tweetsPerDay = Math.round(
                      dataPoint.statuses_count / duration.asDays()
                    );

                    innerHtml +=
                      '<tr><td ' +
                      tableCellStyle +
                      '>' +
                      '<em>' +
                      dataPoint.description +
                      '</em>' +
                      '</em></td></tr>' +
                      '<tr><td ' +
                      tableCellStyle +
                      '>' +
                      'Posted ' +
                      helpers.numberWithCommas(dataPoint.statuses_count) +
                      ' tweets since ' +
                      moment( dataPoint.created_at ).format( 'MMMM Do, YYYY' ) +
                      ' at a rate of  ' +
                      tweetsPerDay +
                      ' tweets per day, and has ' +
                      helpers.numberWithCommas( dataPoint.followers_count ) +
                      ' followers.</td></tr>';
                  }

                  innerHtml += '</tbody>';

                  var tableRoot = tooltipEl.querySelector( 'table' );
                  tableRoot.innerHTML = innerHtml;
                }

                var position = this._chart.canvas.getBoundingClientRect();
                tooltipEl.style.opacity = 1;
                tooltipEl.style.position = 'absolute';
                tooltipEl.style.left =
                  position.left +
                  window.pageXOffset +
                  tooltipModel.caretX +
                  'px';
                tooltipEl.style.top =
                  position.top +
                  window.pageYOffset +
                  tooltipModel.caretY +
                  'px';
                tooltipEl.style.fontFamily = tooltipModel._bodyFontFamily;
                tooltipEl.style.fontSize = tooltipModel.bodyFontSize + 'px';
                tooltipEl.style.fontStyle = tooltipModel._bodyFontStyle;
                tooltipEl.style.padding =
                  tooltipModel.yPadding + 'px ' + tooltipModel.xPadding + 'px';
                tooltipEl.style.pointerEvents = 'none';
              }
            }
            // tooltips: {
            //   callbacks: {
            //     label: function(tooltipItem, d) {
            //       var value = data.map(function(bot) {
            //         console.log( bot );
            //         return bot.followers_count;
            //       })[tooltipItem.index];
            //       value = value.toString();
            //       value = value.split(/(?=(?:...)*$)/);
            //       value = value.join(",");
            //       return value + " followers";
            //     }
            //   }
            // }
          }
        });
      }
    }
  );
});
