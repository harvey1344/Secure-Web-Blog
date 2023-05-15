const assert = require('assert');
const steraliseInput = require('../backend/inputSterilisation');

describe('steraliseInput', () => {
  it('should return a string without HTML tags, escaped special characters, and HTML entities', () => {
    // Test input with HTML tags, special characters, and characters that should be replaced with HTML entities
    const input = `<script>alert('Hello!');</script>"'&`;

    const result = steraliseInput(input);

    // Expected output: "&lt;script&gt;alert('Hello!');&lt;/script&gt;&quot;&#39;&amp;"
    assert.strictEqual(result, "&lt;script&gt;alert('Hello!');&lt;/script&gt;&quot;&#39;&amp;");
  });

  it('should handle empty input', () => {
    const input = '';

    const result = steraliseInput(input);

    assert.strictEqual(result, '');
  });

  it('should handle input without HTML tags, special characters, and characters to replace', () => {
    const input = 'Hello, world!';

    const result = steraliseInput(input);

    assert.strictEqual(result, 'Hello, world!');
  });

  it('should handle input with special characters and characters to replace', () => {
    const input = `"';\\`;

    const result = steraliseInput(input);

    assert.strictEqual(result, '&quot;&#39;\\\\');
  });

  it('should handle input with only HTML tags', () => {
    const input = '<script></script><p></p>';

    const result = steraliseInput(input);

    assert.strictEqual(result, '&lt;script&gt;&lt;/script&gt;&lt;p&gt;&lt;/p&gt;');
  });

  it('should handle input with only special characters', () => {
    const input = `'"\\`;

    const result = steraliseInput(input);

    assert.strictEqual(result, '&quot;&#39;\\\\');
  });

  it('should handle input with only characters to replace', () => {
    const input = '<>&';

    const result = steraliseInput(input);

    assert.strictEqual(result, '&lt;&gt;&amp;');
  });
  
    it('should handle input with mixed HTML tags and special characters', () => {
      const input = `<script>alert("Hello!");</script>"'\\`;
  
      const result = steraliseInput(input);
  
      // Expected output: "&lt;script&gt;alert(&quot;Hello!&quot;);&lt;/script&gt;&quot;&#39;\\\\"
      assert.strictEqual(result, "&lt;script&gt;alert(&quot;Hello!&quot;);&lt;/script&gt;&quot;&#39;\\\\");
    });
  
    it('should handle input with multiple instances of HTML tags', () => {
      const input = '<p>Hello</p><div>World</div><p>!</p>';
  
      const result = steraliseInput(input);
  
      assert.strictEqual(result, '&lt;p&gt;Hello&lt;/p&gt;&lt;div&gt;World&lt;/div&gt;&lt;p&gt;!&lt;/p&gt;');
    });
  
    it('should handle input with complex combination of characters', () => {
      const input = `<script>alert('"Hello!"');</script>\\'&<>&`;
  
      const result = steraliseInput(input);
  
      // Expected output: "&lt;script&gt;alert(&quot;&quot;Hello!&quot;&quot;);&lt;/script&gt;\\\\&#39;&amp;&lt;&gt;"
      assert.strictEqual(result, "&lt;script&gt;alert(&quot;&quot;Hello!&quot;&quot;);&lt;/script&gt;\\\\&#39;&amp;&lt;&gt;");
    });
  
    it('should handle long input string', () => {
      const input = 'A'.repeat(10000); // A string with 10,000 characters
  
      const result = steraliseInput(input);
  
      assert.strictEqual(result, 'A'.repeat(10000));
    });
  });
  