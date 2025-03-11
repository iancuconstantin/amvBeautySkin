const API_KEY = "AIzaSyBf0M-4i1jS-BBu5D2lG4yQAHenSmawlVA";
const POSTID = localStorage.getItem('selectedArticleId');
const URL = `https://www.googleapis.com/blogger/v3/blogs/6407374995812932765/posts/${POSTID}?key=${API_KEY}`;
const PROXY = "https://api.allorigins.win/get?url=" + encodeURIComponent(URL);


const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('ro-RO', options);
}

fetch(PROXY)
    .then(response => response.json())
    .then(data => {
        const parsedData = JSON.parse(data.contents);
        console.log(parsedData)
        
        const pageTitle = document.getElementById("banner-title")
        pageTitle.innerHTML = `${parsedData.title}`;

        let subTitle = document.getElementById("subTitle");
        subTitle.innerHTML = parsedData.title;

        
        let datePost = document.getElementById("bpdate");
        const formattedDate = formatDate(parsedData.published);
        datePost.innerText = formattedDate;
        

        let blogContent = document.getElementsByClassName("sic_the_content")[0];
        blogContent.innerHTML = `${parsedData.content}`;

        
        let tagsContainer = document.getElementById("tags");
        parsedData.labels.forEach(tag => {
            let tagLink = document.createElement("a");
            tagLink.textContent = tag;
            tagLink.href = `https://amvbeautyskin.blogspot.com/search/label/${tag}`;
            tagsContainer.appendChild(tagLink);
            tagLink.target = "_blank";
            tagsContainer.appendChild(document.createElement("br"));
        });
        
        

        
    })
    .catch(error => console.error("Eroare preluare date", error));