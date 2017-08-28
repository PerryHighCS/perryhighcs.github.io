require(["/lib/libEditorUtils.js", "/lib/graphics/graphics.js"]);

// Display text in a textArea console
function print(text) {
  // Get a reference to the console
  var con = document.getElementById('Console');

  // Get the current console text
  var conTxt = con.textContent;

  // Append the new text
  conTxt += text;

  // Set the console text
  con.textContent = conTxt;

  // Make sure the console is visible
  con.style.display = "block";
}

// Display text in a textArea console, followed by a newline
function println(text) {
  print(text + '\n');
}

// Read a line of user input
function readLine(promptTxt) {
  // Prompt the user for input
  rval = prompt(promptTxt);

  // If the user clicks Cancel, throw an exception
  if (rval === null) {
    throw 'Exception: User Cancelled Input';
  }

  // Otherwise, return the input
  return rval;
}

// Ask the user for a number
function readInt(promptTxt) {
  // Store the user prompt
  var text = promptTxt;

  // Loop until we get our input
  while (true) {
    // Ask the user for the number
    var rval = prompt(text);

    // If the user clicks cancel, throw an exception
    if (rval === null) {
      throw 'Exception: User Cancelled Input';
    }

    // Parse out the number the user entered
    rval = parseInt(rval);

    // If the user didn't enter a number, ask again
    if (isNaN(rval)) {
      text = promptTxt + "\nPlease enter an integer.";
    } else {
      // If they did enter a number, return it
      return rval;
    }
  }
}

// Ask the user for a number
function readFloat(promptTxt) {
  // Store the user prompt
  var text = promptTxt;

  // Loop until we get our input
  while (true) {
    // Ask the user for the number
    var rval = prompt(text);

    // If the user clicks cancel, throw an exception
    if (rval === null) {
      throw 'Exception: User Cancelled Input';
    }

    // Parse out the number the user entered
    rval = parseFloat(rval);

    // If the user didn't enter a number, ask again
    if (isNaN(rval)) {
      text = promptTxt + "\nPlease enter a number.";
    } else {
      // If they did enter a number, return it
      return rval;
    }
  }
}

// Ask the user for a boolean
function readBoolean(promptTxt) {
  // Store the user prompt
  var text = promptTxt;

  // Loop until we get our input
  while (true) {
    // Ask the user for the boolean
    var rval = prompt(text).toLowerCase();

    // If the user clicks cancel, throw an exception
    if (rval === null) {
      throw 'Exception: User Cancelled Input';
    } else if (rval == 'true' || rval == 'yes') {
      return true;
    } else if (rval == 'false' || rval == 'no') {
      return false;
    } else {
      // If they did not enter a boolean, loop
      text = promptTxt + "\nPlease enter true or false.";
    }
  }
}

