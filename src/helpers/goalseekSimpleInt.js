
class GoalSeekSimpleInt {
  seek(initialValue, cont, n, targetValue) {   // cont = contribution for that period; n = number of periods
    let rate = .1;  // initial guess for the interest

    // calculate the net present value of the investments at the initial guess for the rate of return
    let pvir = this.calcpvir(rate, cont, n, initialValue);

    // iterate until the net present value is close enough to the target value, or until the maximum number of iterations is reached
    const tolerance = 1e-9;  // tolerance for the error between the net present value and the target value
    const maxIterations = 1e+9;  // maximum number of iterations
    let iterations = 0;  // current number of iterations
    while (Math.abs((pvir - targetValue) / pvir) > tolerance && iterations < maxIterations) {
      // adjust the rate of return based on the error between the net present value and the target value
      rate = this.guess(1, -1);

      // recalculate the net present value at the new rate of return
      pvir = this.calcpvir(rate, cont, n, initialValue);

      iterations++;
    }

    if (iterations === maxIterations) {
      throw new Error('Could not find a solution within the maximum number of iterations');
    }
    return rate * 100;
  }


  calcpvir(rate, annPay, numYears, initialValue) {
    let pvir = Math.round(((1 + rate) * annPay * (((1 + rate) ** numYears) - 1) / rate) + initialValue * ((1 + rate / 1) ** numYears));
    return pvir;
  }

  // generate a random number within a range
  guess = function (hi, lo) {
    var guess = Math.random() * (hi - lo) + lo;
    return guess;
  }
}

export default GoalSeekSimpleInt;
