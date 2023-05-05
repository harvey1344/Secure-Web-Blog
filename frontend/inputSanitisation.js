function sanitizeInput(input) {
    // Remove any HTML tags from the input
    const sanitizedInput = input.replace(/<[^>]*>?/gm, '');
  
    // Prevent SQL injection attacks by escaping special characters
    const sqlEscapedInput = sanitizedInput.replace(/['";\\]/g, '\\$&');
  
    // Prevent XSS attacks by replacing characters that could be interpreted as
    // HTML or JavaScript code with their corresponding HTML entities
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