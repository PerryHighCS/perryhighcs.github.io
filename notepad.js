function println(text) {
  var con = document.getElementById('Console');
  con.style.display = "block";
  var conTxt = con.textContent;
  conTxt += text + '\n';
  con.textContent = conTxt;
}

function readLine(promptTxt) {
  return prompt(promptTxt)
}

function readInt(promptTxt) {
  var text = promptTxt;
  while (true) {
    var rval = prompt(text);
    if (rval === null) {
      throw 'Exception: User Cancelled Input';
    }

    rval = parseInt(rval);
    if (isNaN(rval)) {
      text = promptTxt + "\nPlease enter an integer.";
    } else {
      return rval;
    }
  }
}

function readFloat(promptTxt) {
  var text = promptTxt;
  while (true) {
    var rval = prompt(text);
    if (rval === null) {
      throw 'Exception: User Cancelled Input';
    }

    rval = parseFloat(rval);
    if (isNaN(rval)) {
      text = promptTxt + "\nPlease enter a number.";
    } else {
      return rval;
    }
  }
}
