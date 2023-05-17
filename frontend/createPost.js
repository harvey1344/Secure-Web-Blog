const createPost = () => {
    let title = document.getElementById("title").value;
    let body = document.getElementById("body").value;

    // sanititing user input
    title = sanitiseInput(title);
    body = sanitiseInput(body);

    // sending request to edit post
    fetch("/blog/createPost", {
        method: "POST",
        body: JSON.stringify({
            title,
            body,
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8",
        },
    }).then((res) => {
        if (res.redirected) {
            window.location.href = res.url;
        } else {
            alert("unable to create post");
        }
    });
};
