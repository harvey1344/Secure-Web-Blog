const assert = require('assert');
const steraliseInput = require('../backend/inputSterilisation');

describe('sanitise input', () => {
  it('should remove HTML tags from the input', () => {
    const input = '<p>Hello, <strong>world</strong>!</p>';
    const sanitizedInput = steraliseInput(input)
    assert.equal(sanitizedInput, 'Hello, world!');
  });

  it('should not modify the input string without HTML tags', () => {
    const input = 'This is a normal input without any HTML tags.';
    const sanitizedInput = steraliseInput(input)
    assert.equal(sanitizedInput, input);
  });

  it('Shout not change an empty input', () => {
    const input = '';
    const sanitizedInput = steraliseInput(input)
    assert.equal(sanitizedInput, input);
  });


})

describe('sanitise SQL injection', () => {
  describe('sqlEscapedInput', () => {
    it('should escape single quote in the input', () => {
      const input = "I'm escaping a single quote";
      const sqlEscapedInput = steraliseInput(input);
      assert.equal(sqlEscapedInput, "I\\'m escaping a single quote");
    });

    it('should escape double quote in the input', () => {
      const input = 'I am "escaping" double quotes';
      const sqlEscapedInput = steraliseInput(input);
      assert.equal(sqlEscapedInput, 'I am \\"escaping\\" double quotes');
    });

    it('should escape backslash in the input', () => {
      const input = 'I am escaping \\ backslash';
      const sqlEscapedInput = steraliseInput(input);
      assert.equal(sqlEscapedInput, 'I am escaping \\\\ backslash');
    });
  });
});

describe('sanitise XSS injection', () => {
  describe('xssSafeInput', () => {
    it('should replace less-than sign with HTML entity', () => {
      const input = '<script>alert("XSS")</script>';
      const xssSafeInput = steraliseInput(input);
      assert.equal(xssSafeInput, 'alert(\\"XSS\\")');
    });

    it('should replace greater-than sign with HTML entity', () => {
      const input = 'This is a dangerous > sign';
      const xssSafeInput = steraliseInput(input);
      assert.equal(xssSafeInput, 'This is a dangerous &gt; sign');
    });

    it('should replace ampersand with HTML entity', () => {
      const input = 'This contains & character';
      const xssSafeInput = steraliseInput(input);
      assert.equal(xssSafeInput, 'This contains &amp; character');
    });
  });
});
