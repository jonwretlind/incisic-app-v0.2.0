// traverse data object and check to see if there are second
// level objects and convert to array of values
class Traverse {
  constructor() {
    this.result = [];
    this.$result = ""; //string
  }

  run(data) {
    this.loop(data);
    console.log(this.$result);
    return this.$result;
  }

  loop(data) {
      var len = Object.keys(data).length;
      for (var i = 0; i < len; i++) {
       var key = Object.keys(data)[i];
       var val = Object.values(data)[i];
       this.result.push(val);
       if (typeof val === 'object') {
         var val2 = Object.values(data[key]);
         this.result.push(val2);
         if (! val2 === "undefined") this.loop(val2); //recursive
       };
      }

      for (var n = 0; n < this.result.length; n++) {
        if ( n < this.result.length -1 ) {
          this.$result += this.result[n] + ", ";
        } else {
          this.$result += this.result[n]; // don't add comma on last item
        }
      }
    }//loop

} //Traverse
export default Traverse;
