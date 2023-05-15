const steraliseInput = (input) => {
  if (input === null || input === undefined) {
    return '';
  }

  input = input.toString();

  const sanitizedInput = input.replace(/<[^>]*>?/gm, '');
  const sqlEscapedInput = sanitizedInput.replace(/['";\\]/g, '\\$&');
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
};

module.exports = steraliseInput;
