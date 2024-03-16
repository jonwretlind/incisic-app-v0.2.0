import './SimpleInterestCalc.css';
import GoalSeekSimpleInt from './helpers/goalseekSimpleInt'
import ToolTip from './snippets/tooltip.js';
import React from 'react';
import { Component } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

const GS = new GoalSeekSimpleInt();
var _this;

class SimpleInterestCalc extends Component {
  constructor() {
    super();
    this.def = {
      presVal: 0,
      futureVal: 1000000,
      annualContributions: 1200,
      numYears: 40,
      rate: 0,
    };
    _this = this;
  }

  changed(event) {
    _this.def.presVal = (document.getElementById('presVal').value === "") ? _this.def.presVal : Number(document.getElementById('presVal').value);
    _this.def.futureVal = (document.getElementById('futureVal').value === "") ? _this.def.futureVal : Number(document.getElementById('futureVal').value);
    _this.def.annualContributions = (document.getElementById('annualContributions').value === "") ? _this.def.annualContributions : Number(document.getElementById('annualContributions').value);
    _this.def.numYears = (document.getElementById('numYears').value === "") ? _this.def.numYears : Number(document.getElementById('numYears').value);
  }


  calculate() {
    // * @usage RATE($periods, $payment, $present, $future, $type, $guess)
    console.log(_this.def.numYears, _this.def.annualContributions, _this.def.presVal, _this.def.futureVal);
    var per = _this.def.numYears,
      cont = _this.def.annualContributions,
      pv = _this.def.presVal,
      fv = _this.def.futureVal,
      rate = GS.seek(pv, cont, per, fv);

    //var rate = Math.pow((fv/pv),(1/per))-1;
    var calcResult = document.getElementById("CalcResult");
    var calcLabel = document.getElementById("CalcLabel");
    calcLabel.innerHTML = "The Interest Rate is"
    calcResult.innerHTML = rate.toFixed(2) + "%";
  }

  render() {
    return (
      <Box
        sx={{ flexGrow: 1, bgcolor: 'background.paper', display: 'flex' }}
      >
        <div className="container">
          <div id="CalcDataEntry">
            <table className="mycurve-data">
              <tbody>
                <tr>
                  <td>
                    <label>Present Value <ToolTip /></label>
                    <input type="number"
                      id="presVal"
                      placeholder={this.def.presVal}
                      onChange={(event) => this.changed(event)} />
                  </td>
                  <td>
                    <label>Future Value <ToolTip /></label>
                    <input type="number"
                      id="futureVal"
                      placeholder={this.def.futureVal}
                      onChange={(event) => this.changed(event)} />
                  </td>
                </tr>
                <tr>
                  <td>
                    <label>Annual Contributions <ToolTip /></label>
                    <input type="number"
                      id="annualContributions"
                      placeholder={this.def.annualContributions}
                      onChange={(event) => this.changed(event)} />
                  </td>
                  <td>
                    <label>Number of Years <ToolTip /></label>
                    <input type="number"
                      id="numYears"
                      placeholder={this.def.numYears}
                      onChange={(event) => this.changed(event)} />
                  </td>
                </tr>
              </tbody>
            </table>
            <Button className="calc-btn"
              variant="contained"
              size="large"
              onClick={this.calculate}
            >
              Calculate
            </Button>
          </div>
          <div>
            <div id="CalcLabel"></div>
            <div id="CalcResult"></div>
          </div>
        </div>
      </Box>
    )
  }

}


export default SimpleInterestCalc;
