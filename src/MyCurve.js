/* jshint esversion: 8 */
import './MyCurve.css';
import React, { Component } from 'react';
import * as d3 from "d3";
import Finance from 'financejs';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

const finance = new Finance();

class MyCurve extends Component {
  constructor() {
    super();
    this.def = {
      bal: 0,
      principal: 0,
      contrib: 6000,
      yrs: 50,
      retire: 20,
      rate: 8,
      w_rate: 4,
      wdraw: 30,
      blackbox: false
    };
  }

  componentDidMount() {
    this.drawChart(this.def.principal, this.def.contrib, this.def.yrs, this.def.retire, this.def.rate, this.def.w_rate, this.def.blackbox);
  }

  drawChart(principal, contrib, yrs, retire, rate, w_rate, wdraw) {
    //compound curve 1
    //create a dataset
    // EOY contributions
    let dataSet = [];

    // LOOP to calculate curves1 and create datablocks for the Acc Curve
    for (var n = 0; n < yrs; n++) {
      let r = rate / 100; // convert percentage
      let _bal = this.def.bal + principal + contrib;
      principal = finance.CI(r, 1, _bal, n);

      // get the principal at time of retirement for the beginning of the widthdrawal curve
      var retPrincipal; if ( n === retire ) retPrincipal = principal;

      let dataBlock = {
        "Phase": "Accumulation",
        "year": n,
        "contrib": contrib,
        "years": yrs,
        "principal": finance.FV(r, principal, n),
        "retirement": retire,
        "balance": _bal,
        "withdrawal": wdraw,
      }
      dataSet.push(dataBlock);
    }
    // LOOP to calculate curves2 and create datablocks for the Wd Curve
    principal = retPrincipal; // set the starting pt for this curve
    for (n = retire; n < yrs; n++) {
      let _bal = principal;
      let r = rate / 100; // convert percentage & invert
      let amt = principal * r;
      _bal += amt;
      principal = finance.CI(r, 1, _bal, n);

      let wr = w_rate / 100 * -1; // convert percentage & invert
      let wAmt = principal * wr; // add amt of interest
      _bal += wAmt;
      principal = finance.CI(wr-r, 1, _bal, n);

      let dataBlock = {
        "Phase": "",
        "year": n,
        "contrib": wAmt,
        "years": yrs,
        "principal": finance.FV(r, principal, n),
        "retirement": retire,
        "balance": _bal,
        "withdrawal": wdraw,
      }
      dataSet.push(dataBlock);
    }
    //clear first
    d3.select("#Canvas").selectAll("path").remove();
    d3.select("#Canvas").selectAll("g").remove();
    d3.select("#Canvas").selectAll("rect").remove();
    d3.select("#Canvas").selectAll("text").remove();

    //then draw chart canvas
    var cv = d3.select("#Canvas"),
      WIDTH = 800,
      HEIGHT = 400,
      MARGINS = {
        top: 50,
        right: 20,
        bottom: 50,
        left: 60
      };
    /*const svg = d3.select("#Canvas")
      .attr("width", WIDTH)
      .attr("height", HEIGHT);*/

    var dataGroup = d3.nest()
      .key(function (d) { return d.Phase })
      .entries(dataSet);

    /*var dataGroup2 = d3.nest()
      .key(function (d) { return d.Phase })
      .entries(dataSet);*/

    //var lSpace = WIDTH / dataGroup.length; // length of each unit

    var xScale = d3.scaleLinear()
      .range([MARGINS.left, WIDTH - MARGINS.right])
      .domain([d3.min(dataSet, function (d) {
        return d.year;
      }), d3.max(dataSet, function (d) {
        return d.year;
      })]);

    var yScale = d3.scaleLinear()
      .range([HEIGHT - MARGINS.top, MARGINS.bottom])
      .domain([d3.min(dataSet, function (d) {
        return d.principal;
      }), d3.max(dataSet, function (d) {
        return d.principal;
      })]);


    var xAxis = d3.axisBottom(xScale),
        yAxis = d3.axisLeft(yScale);

    var lineGen = d3.line()
      .x(function (d) {
        //if ( d.year > retire+1 ) return;
        return xScale(d.year);
      })
      .y(function (d) {
        return yScale(d.principal);
      }).curve(d3.curveBasis);

    console.log("Retirement Year: " + retire)

    var Xwd = WIDTH - (MARGINS.right + MARGINS.left), // width of the chart area
      fudge = 5, // fudge about 5 px
      ltGreen = "#def7de",
      ghost = "rgba(255,255,255,0.8)",
      accWd = Xwd * (retire / yrs) + fudge, // width of the Accumulation
      wdWd = (Xwd - accWd) + yrs + fudge; // width of the Withdrawal

    cv.append('rect')
      .attr("x", MARGINS.left)
      .attr("y", MARGINS.bottom)
      .attr("width", accWd)
      .attr("height", HEIGHT - (MARGINS.top + MARGINS.bottom))
      .attr("fill", ltGreen);

    var c1 = [dataGroup[0]];
    c1.forEach(function (d, i) {
      cv.append('svg:path')
        .attr('d', lineGen(d.values))
        .attr('stroke', function (d, j) {
          return "hsl(207,80%,40%)"; //blue
        })
        .attr('stroke-width', 2)
        .attr('id', 'line_' + d.key)
        .attr('fill', 'none')
        .attr('width', retire);

      cv.append("text")
        .attr("x", (accWd / 2) - 20)
        .attr("y", HEIGHT)
        .style("fill", "black")
        .attr("id", "Legend")
        .text(d.key);
    });

    // cover the rest with another rect to gray the curve in bg
    cv.append('rect')
      .attr("x", MARGINS.left + accWd)
      .attr("y", MARGINS.bottom)
      .attr("width", Xwd - accWd)
      .attr("height", HEIGHT - (MARGINS.top + MARGINS.bottom))
      .attr("fill", ghost);

    // draw curve 2 widthdrawal
      var c2 = [dataGroup[1]];
      c2.forEach(function (d, i) {
        cv.append('svg:path')
          .attr('d', lineGen(d.values))
          .attr('stroke', function (d, j) {
            return "hsl(16, 66%, 44%)"; //red
          })
          .attr('stroke-width', 2)
          .attr('id', 'line_' + d.key)
          .attr('fill', 'none')
          .attr('width', retire);

        cv.append("text")
          .attr("x", (accWd + wdWd / 2) - 10)
          .attr("y", HEIGHT)
          .style("fill", "black")
          .attr("id", "Legend")
          .text(d.key);
      });
/*
    /* CHART AXIS */
    cv.append("svg:g")
      .attr("class", "axis")
      .attr("transform", "translate(0," + (HEIGHT - MARGINS.bottom) + ")")
      .call(xAxis);

    cv.append("svg:g")
      .attr("class", "axis")
      .attr("transform", "translate(" + (MARGINS.left) + ",0)")
      .call(yAxis);

  }

  calc(event) {
    var p = (document.getElementById('starting_amt').value === "") ? parseInt(this.def.principal) : parseInt(document.getElementById('starting_amt').value);
    var c = (document.getElementById('contributions').value === "") ? parseInt(this.def.contrib) : parseInt(document.getElementById('contributions').value);
    var y = (document.getElementById('years').value === "") ? parseInt(this.def.yrs) : parseInt(document.getElementById('years').value);
    var rt = (document.getElementById('retirement').value === "") ? parseInt(this.def.retire) : parseInt(document.getElementById('retirement').value);
    var r = (document.getElementById('rate').value === "") ? parseInt(this.def.rate) : parseInt(document.getElementById('rate').value);
    var w = (document.getElementById('withdrawal_rt').value === "") ? parseInt(this.def.w_rate) : parseInt(document.getElementById('withdrawal_rt').value);
    console.log((document.getElementById('blackbox_plan')));
    var bb = (document.getElementById('blackbox_plan').value);

    console.log("CHANGED: " + p, c, y, rt, r, w, bb);
    this.drawChart(p, c, y, rt, r, w, bb);
  }

  render() {
    console.log(this.def.principal, this.def.contrib, this.def.yrs, this.def.retire, this.def.rate, this.def.w_rate, this.def.blackbox);
    return (
      <Box
        sx={{ flexGrow: 1, bgcolor: 'background.paper', display: 'flex' }}
      >
        <div id="MyCurve" className="container">
          <div id="MyCurveDataEntry">
            <table className="mycurve-data">
              <tbody>
                <tr>
                  <td>
                    <label>Starting Amount</label>
                    <input type="number"
                      id="starting_amt"
                      placeholder={this.def.principal} />
                  </td>
                  <td>
                    <label>Number of Years Invested</label>
                    <input type="number"
                      id="years"
                      placeholder={this.def.yrs} />
                  </td>
                  <td>
                    <label>Annual Growth Rate (%)</label>
                    <input type="number"
                      id="rate"
                      placeholder={this.def.rate} />
                  </td>
                </tr>
                <tr>
                  <td>
                    <label>Annual Contributions</label>
                    <input type="number"
                      id="contributions"
                      placeholder={this.def.contrib} />
                  </td>
                  <td>
                    <label>Retirement Year</label>
                    <input type="number"
                      id="retirement"
                      placeholder={this.def.retire} />
                  </td>
                  <td>
                    <label>Annual Withdrawal Rate (%)</label>
                    <input type="number"
                      id="withdrawal_rt"
                      placeholder={this.def.w_rate} />
                  </td>
                </tr>
                <tr>
                  <td>
                    <label>Black Box?</label>
                    <input type="radio"
                      id="blackbox_plan"
                      value={false}/>
                  </td>
                </tr>
              </tbody>
            </table>
            {<Button className="mycurve-btn"
              variant="contained"
              size="large"
              onClick={(event) => this.calc(event)}
            >
              Calculate My Curve
            </Button>}
          </div>
          <svg id="Canvas"></svg>
        </div>
      </Box>
    )
  }

}

export default MyCurve;
