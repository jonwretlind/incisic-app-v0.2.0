const PVonIR = (IR, annPay, numYears, pBOYBalance) => {
    let myCalcPVonIR = Math.round((1 + IR) * annPay * ((Math.pow((1 + IR), numYears) - 1) / IR) + pBOYBalance * Math.pow((1 + IR / 1), numYears));
    //alert(Number(this.myCalcPVonIR));
    return myCalcPVonIR;
};

export default PVonIR