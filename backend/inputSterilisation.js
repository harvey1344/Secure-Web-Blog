const steraliseInput = (input) => {

  if (input === null || input === undefined) {
    return '';
  }


  //explicit converstion to a string
  input = input.toString()

    // Remove any HTML tags from the input this is done removing
    // opening and closing angle brakets
    const sanitizedInput = input.replace(/<[^>]*>?/gm, '');
  
    // Prevent SQL injection attacks by escaping special characters
    // this is done by escaping the charicters [ ' " ; \] 
    const sqlEscapedInput = sanitizedInput.replace(/['";\\]/g, '\\$&');
  
    // Prevent XSS attacks by replacing characters that could be interpreted as
    // HTML or JavaScript code with their corresponding HTML entities stopping them
    // from being interprated as code by the browser.
    const xssSafeInput = sqlEscapedInput.replace(/[<>&]/g, (char) => {
      switch (char) {
        case '<':
          return '&lt;';
        case '>':
          return '&gt;';
        case '&':
          return '&amp;';
        default:
          return char;
      }
    });
  
    return xssSafeInput;
  }

module.exports = steraliseInput;
