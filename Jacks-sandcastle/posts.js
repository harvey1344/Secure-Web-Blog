


const postsContainer = document.getElementById("posts-container")
const postData = []
postData.push({id:1,name: "Rachel", title: "Exploring the World of Sushi", body: "There's nothing quite like the taste of fresh sushi - I love trying new rolls and discovering new flavors!"})
postData.push({id:2,name: "John", title: "The Joy of Running", body: "Running is more than just exercise for me - it's a way to clear my mind, challenge myself, and feel a sense of accomplishment."})
postData.push({id:3,name: "Samantha", title: "Discovering the Magic of Meditation", body: "Meditation has changed my life in so many ways - it's helped me reduce stress, increase focus, and find a sense of inner peace."})
postData.push({id:4,name: "Alex", title: "Why Coffee is My Lifeline", body: "I don't know where I'd be without my daily cup (or cups) of coffee - it's the fuel that keeps me going all day long."})
postData.push({id:5,name: "Emily", title: "The Power of Positive Thinking", body: "I've learned that our thoughts have a tremendous impact on our lives - by staying positive and focusing on what's good, we can create a happier and more fulfilling life."})

console.log(postData)


for(let x = 0; x<postData.length;x++){

    const post = document.createElement("div")
    post.id = postData[x].id
    post.className = "post"

    const postTitle = document.createElement("h2")
    postTitle.appendChild(document.createTextNode(postData[x].title))
    post.appendChild(postTitle)

    const userName = document.createElement("h3")
    userName.appendChild(document.createTextNode(postData[x].name))
    post.appendChild(userName)

    const body = document.createElement("p")
    body.appendChild(document.createTextNode(postData[x].body))
    post.appendChild(body)

    postsContainer.appendChild(post)
}

