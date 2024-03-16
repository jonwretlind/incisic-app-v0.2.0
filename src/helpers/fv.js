/*
  Javascript function to calulate future value
  of an annuity
*/

function FVAnnuity(amount, rate, numPeriods) {
  return amount * ((Math.pow(1 + rate, numPeriods) - 1) / rate);
}

export default FVAnnuity;