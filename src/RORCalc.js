import './RORCalc.css';
import GoalSeek from './helpers/goalseek.js';
import Finance from 'financejs';
import ToolTip from './snippets/tooltip.js';
import React, { Component } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

const finance = new Finance();
var _this;

class RORCalc extends Component {
  constructor() {
    super();
    this.def = {
      BOY: 0,
      annPay: 1500,
      mngFee: 1.10,
      startYear: 1963,
      numYears: 5,
      percentStocks: 100,
      percentBonds: 0,
      percentTreas: 0,
      api: "http://localhost:4000/api/schiller_data/all",
      econData: null,
      items: null,
      histData: [],
      dataTable: [],
    };

    //this.RATE = new RATE();
    this.gs = new GoalSeek();
    this.avgRor = 0;
    this.actRor = 0;
    this.yearIndex = 0;
    _this = this; //use _this to reference the variables when globals are needed
  }

  componentDidMount() {
    fetch(this.def.api)
      .then(result => {
        return result.json()
      })
      .then(data => {
        this.def.histData = data; // put the data into global histData array
        for (var i = 0; i <= this.def.histData.length; i++) {
          if (this.def.histData[i].Year === this.def.startYear) {
            this.yearIndex = i;
            break;
          }
        }
        this.runCalculation(this.yearIndex);
      }).catch((error) => {
        console.log(error);
      })
  };

  runCalculation(yearIndex) {
    var balEOY = 0;
    var hData = _this.def.histData,
      balBOY = _this.def.BOY,
      annPay = _this.def.annPay,
      idx = 0;

    for (var j = yearIndex; j < (yearIndex + _this.def.numYears); j++) {
      var rate = hData[j].SandP * 100,
        year = hData[j].Year,
        intRate = +(hData[j].SandP * 100).toFixed(2),
        fv = Math.round(finance.FV(rate, balBOY + annPay, 1)),
        mngFee = Math.round((_this.def.mngFee / 100) * (balBOY + annPay));

      if (j > yearIndex) {
        balBOY = balEOY;
        fv = Math.round(finance.FV(rate, balBOY + annPay, 1));
        mngFee = Math.round((_this.def.mngFee / 100) * (balBOY + annPay));
        balEOY = fv - mngFee;
      } else {
        balEOY = fv - mngFee;
      };
      idx++;
      _this.def.dataTable.push({
        idx: idx,
        index: j,
        year: year,
        balBOY: balBOY,
        intRate: intRate,
        annPay: annPay,
        mngFee: mngFee,
        balEOY: balEOY,
      });

      _this.renderTable(year, balBOY, intRate, annPay, mngFee, balEOY, idx);
      //console.log(_this.def.dataTable);
    }

    let initialValue = _this.def.dataTable[0].balBOY;
    let targetValue = balEOY;
    //run the actual calculations
    _this.actRor = _this.gs.seek(initialValue, _this.def.dataTable, targetValue);
    _this.avgRor = _this.gs.calcavg(_this.def.dataTable);
    console.log(_this);
    console.log("avgROR=", _this.avgRor.toFixed(2) + "%");
    console.log("actROR=", _this.actRor.toFixed(2) + "%");
  };

  renderTable(year, balBOY, intRate, annPay, mngFee, balEOY, idx) {
    //render the table of values for each year
    // Years from Start	| Year	| Balance BOY	| Interest Rate	| Annual Payment	| Management Fee	| Balance EOY
    console.log(year, balBOY, intRate, annPay, mngFee, balEOY);
    let table = document.getElementById('CalcTable');
    let tableRow = `<div class='row'><div class='year'>${year}</div><div class='balBOY'>$${balBOY.toLocaleString()}</div><div class='intRate'>${intRate}%</div><div class='annPay'>$<input id='contrib-${idx}' value='${annPay.toLocaleString()}' onchange='var val = Number(this.value.replace(/,/g,"")); console.log(this.id, val, typeof val, ${this.def.dataTable[idx-1].annPay});'/></div><div class='mngFee'>$${mngFee.toLocaleString()}</div><div class='balEOY'>$${balEOY.toLocaleString()}</div></div>`;
    table.innerHTML += tableRow;
  }

  changed(event) {
    _this.def.BOY = (document.getElementById('BOY').value === "") ? _this.def.BOY : +(document.getElementById('BOY').value);
    _this.def.annPay = (document.getElementById('annPay').value === "") ? _this.def.annPay : +(document.getElementById('annPay').value);
    _this.def.mngFee = (document.getElementById('mngFee').value === "") ? _this.def.mngFee : +(document.getElementById('mngFee').value);
    _this.def.startYear = (document.getElementById('startYear').value === "") ? _this.def.startYear : +(document.getElementById('startYear').value);
    _this.def.numYears = (document.getElementById('numYears').value === "") ? _this.def.numYears : +(document.getElementById('numYears').value);
  }

  updateTable(event) {
    console.log("foo");
  }

  calculate() {
    //reset the dataTable and yearIndex first
    _this.def.dataTable = [];
    for (var i = 0; i <= _this.def.histData.length; i++) {
      if (_this.def.histData[i].Year === _this.def.startYear) {
        _this.yearIndex = i;
        break;
      }
    }
    //clear the table data on screen
    let table = document.getElementById('CalcTable');
    table.innerHTML = "";
    //run calculation again
    _this.runCalculation(_this.yearIndex);
    //display results
    var calcResultAVG = document.getElementById("CalcResultAVG"),
      calcLabelAVG = document.getElementById("CalcLabelAVG"),
      calcResultACT = document.getElementById("CalcResultACT"),
      calcLabelACT = document.getElementById("CalcLabelACT");
    calcLabelAVG.innerHTML = "Average Rate of Return";
    calcLabelACT.innerHTML = "Actual Rate of Return";
    calcResultAVG.innerHTML = _this.avgRor.toFixed(2) + "%";
    calcResultACT.innerHTML = _this.actRor.toFixed(2) + "%";
  }


  render() {
    return (
      <Box
        sx={{ flexGrow: 1, bgcolor: 'background.paper', display: 'flex' }}
      >
        <div className="container">
          <div id="RORCalcWrapper">
            <div className="ror-data columns">
              <div className="col1">
                <div id="input1">
                  <label>Present Value <ToolTip /></label>
                  <input type="number"
                    id="BOY"
                    placeholder={this.def.BOY}
                    onChange={(event) => this.changed(event)} />
                </div>
                <div id="input2">
                  <label>Annual Payment <ToolTip /></label>
                  <input type="number"
                    id="annPay"
                    placeholder={this.def.annPay}
                    onChange={(event) => this.changed(event)} />
                </div>
                <div id="input3">
                  <label>Management Fee <ToolTip /></label>
                  <input type="number"
                    id="mngFee"
                    placeholder={this.def.mngFee}
                    onChange={(event) => this.changed(event)} />
                </div>
                <div id="input4">
                  <label>Starting Year <ToolTip /></label>
                  <input type="number"
                    id="startYear"
                    placeholder={this.def.startYear}
                    onChange={(event) => this.changed(event)} />
                </div>
                <div id="input5">
                  <label>Number of Years <ToolTip /></label>
                  <input type="number"
                    id="numYears"
                    placeholder={this.def.numYears}
                    onChange={(event) => this.changed(event)} />
                </div>
              </div>
              <div className="col2">
                <div className="group">
                  <h5>PORTFOLIO ALLOCATION</h5>
                  <div>
                    <label>Stock Market (S&amp;P 500) <ToolTip /></label>
                    <input type="number"
                      id="stocksPortfolio"
                      placeholder={this.def.percentStocks}
                      onChange={(event) => this.changed(event)} />
                  </div>
                  <div>
                    <label>Corporate Bonds <ToolTip /></label>
                    <input type="number"
                      id="bondsPortfolio"
                      placeholder={this.def.percentBonds}
                      onChange={(event) => this.changed(event)} />
                  </div>
                  <div>
                    <label>Government Treasuries  <ToolTip /></label>
                    <input type="number"
                      id="treasPortfolio"
                      placeholder={this.def.percentTreas}
                      onChange={(event) => this.changed(event)} />
                  </div>
                </div>
              </div>
            </div>
            <Button className="calc-btn"
              variant="contained"
              size="large"
              onClick={this.calculate}
            >
              Calculate
            </Button>
          </div>
          <div>
          <div id="Labels">
            <div id="Label1">YEAR</div>
            <div id="Label2">BOY BALANCE</div>
            <div id="Label3">RATE</div>
            <div id="Label4">CONTRIBUTION</div>
            <div id="Label5">MGMT FEE</div>
            <div id="Label6">EOY BALANCE</div>
          </div>
            <div id="CalcTable"></div>
            <div id="CalcResults">
              <div id="CalcLabelAVG"></div>
              <div id="CalcResultAVG"></div>
              <div id="CalcLabelACT"></div>
              <div id="CalcResultACT"></div>
            </div>
          </div>
        </div>
      </Box>
    )
  }

}


export default RORCalc;
