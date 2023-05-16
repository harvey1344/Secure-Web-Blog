let params = new URLSearchParams(document.location.search);
const post_id = params.get("post_id");

console.log(post_id);

const updateRequest = () => {
  let title = document.getElementById('title').value;
  let body = document.getElementById('body').value;

  title = sanitizeInput(title);
  body = sanitizeInput(body);

  fetch('/blog/csrf-token', {
    credentials: 'include' // Include cookies in the request
  })
    .then(response => {
      const csrfToken = response.headers.get('X-CSRF-Token');
      if (!csrfToken) {
        throw new Error('CSRF token not found in response headers');
      }
      return csrfToken;
    })
    .then(csrfToken => {
      return fetch('/blog/updateRequest', {
        method: 'POST',
        body: JSON.stringify({
          title,
          body,
          post_id
        }),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
          'X-CSRF-Token': csrfToken,
        },
        credentials: 'include' // Include cookies in the request
      });
    })
    .then(res => {
      if (res.redirected) {
        console.log('Redirecting to post update');
        window.location.href = res.url;
      } else {
        // Registration failed
        alert('Unable to update');
      }
    })
    .catch(error => {
      console.error(error);
      alert('An error occurred. Please try again later.');
    });
};