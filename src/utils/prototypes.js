String.prototype.toTitleCase = function () {
    let str = this.toLowerCase().split(' ');
  
    let final = [ ];
  
    for(let word of str){
      final.push(`${word.charAt(0).toUpperCase()}${word.slice(1)}`);
    }
    return final.join(' ')
  }