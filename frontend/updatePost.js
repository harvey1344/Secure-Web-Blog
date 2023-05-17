let params = new URLSearchParams(document.location.search);
const post_id = params.get('post_id');

console.log(post_id);

const updateRequest = () => {
  let title = document.getElementById('title').value;
  let body = document.getElementById('body').value;

  title = sanitizeInput(title);
  body = sanitizeInput(body);

  fetch('/csrf-token', {
    credentials: 'include' // Include cookies in the request
  })
    .then(response => response.json())
    .then(data => {
      const csrfToken = data.csrfToken;

      fetch('/blog/updatePost', {
        method: 'POST',
        body: JSON.stringify({
          title,
          body,
          post_id,
          _csrf: csrfToken // Include the CSRF token in the request body
        }),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
          "X-CSRF-Token": csrfToken,
        }
      })
        .then(res => {
          if (res.ok) {
            alert('Update successful');
            window.location.href = '/blog';
          } else {
            // Registration failed
            alert('Unable to update');
          }
        });
    });
};

