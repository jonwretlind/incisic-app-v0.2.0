// +++++++++++++++++++++++++ //
// Mathematical Calculations //
// +++++++++++++++++++++++++ //

class MathFuncts {
    constructor() {
        //
    }

    //calc management fee
    mngFee = function (pBOY, pannPay, pmngFee) {
        return (pBOY + pannPay) * pmngFee;
    }

    // End-of-Year Balance Calculation //
    balEOY = function (pBOY, pannPay, pmngFee, pEconData, tyrs) {
        if (tyrs < 1) { tyrs = 1 };
        // take out management fee at END of the year
        let myBalance = ((pBOY + pannPay) * Math.pow((1 + (pEconData / 1)), tyrs)) - ((pBOY + pannPay) * pmngFee);
        //console.log("myBalance is: " + myBalance + " | Year: " + tyrs);
        return myBalance;
    };

    averageYield = function ($, sumOfYields, numYears, theTable, annPay, BOYBalance) {
        let avgYield = sumOfYields / numYears;
        this.fantasyPVonIR(avgYield, annPay, numYears, BOYBalance[0]);
        return avgYield;
    };

    fantasyPVonIR = function (avgROR, annPay, numYears, pBOYBalance) {
        // calculate the value of the account,
        // IF Average ROR was true...
        avgROR = avgROR / 100;
        let fantasyPV = Math.round((1 + avgROR) * annPay * (Math.pow((1 + avgROR), numYears) - 1) / avgROR + pBOYBalance * Math.pow((1 + avgROR), numYears));
        return fantasyPV;
    };

    calcROR = function (initVal, endVal) {
        let ROR = Math.abs((initVal - endVal) / initVal);
        return ROR;
    };

    calcPVonIR = function (IR, annPay, numYears, pBOYBalance) {
        let myCalcPVonIR = Math.round((1 + IR) * annPay * ((Math.pow((1 + IR), numYears) - 1) / IR) + pBOYBalance * Math.pow((1 + IR / 1), numYears));
        return myCalcPVonIR;
    };

    calcSimpleFV = function (IR, annPay, numYears, pBOYBalance) {
        let mySimpleFV = Math.round(pBOYBalance * Math.pow((1 + IR), numYears)) + (annPay * numYears);
        return mySimpleFV;
    };

    calcSimpleFVBOY = function (IR, annPay, numYears, pBOYBalance, i) {
        if (i == 0) { pBOYBalance += annPay; numYears--; };
        let mySimpleFVBOY = (annPay) + Math.round(pBOYBalance * ((1 + IR) ** numYears));
        return mySimpleFVBOY;
    };

    // generate a random number within a range
    randomGen = function (hi, lo) {
        let guess = Math.random() * (hi - lo) + lo;
        return guess;
    };

}

export default MathFuncts;