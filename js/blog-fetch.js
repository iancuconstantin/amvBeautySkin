const API_KEY = "AIzaSyBf0M-4i1jS-BBu5D2lG4yQAHenSmawlVA";
const URL = `https://www.googleapis.com/blogger/v3/blogs/6407374995812932765/posts?key=${API_KEY}`;
const PROXY = "https://api.allorigins.win/get?url=" + encodeURIComponent(URL);


fetch(PROXY)
  .then(response => response.json())
  .then(data => {
    const parsedData = JSON.parse(data.contents);
    if (parsedData.items) {
        parsedData.items.forEach((item) => {
            
            const formattedDate = formatDate(item.published);
            const articleDiv = document.createElement('div');
            articleDiv.classList.add('col-lg-4', 'col-md-6');

            articleDiv.innerHTML = `
                <div class="blog_item_03" id=${item.id};>
                    <img src="${extractFirstImage(item.content)}" alt="imagine generica"/>
                    <div class="bp_content">
                        <span>${formattedDate}</span>
                        <h3><a href="single-blog.html" onclick="setArticleId(event, '${item.id}')">${item.title}</a></h3>
                        <a class="lr_more" href="single-blog.html" onclick="setArticleId(event, '${item.id}')">
                            Citeste articol
                            <svg width="300%" height="100%" viewBox="0 0 1200 60" preserveAspectRatio="none">
                                <path d="M0,56.5c0,0,298.666,0,399.333,0C448.336,56.5,513.994,46,597,46c77.327,0,135,10.5,200.999,10.5c95.996,0,402.001,0,402.001,0"></path>
                            </svg>
                        </a>
                    </div>
                </div>
            `;

            const container = document.getElementById('postsList');

            container.appendChild(articleDiv);
        });
    } else {
        console.log("Nu s-au găsit postări.");
        const articleDiv = document.createElement('div');
        articleDiv.classList.add('col-lg-12', 'col-md-6');
    }
  })
  .catch(error => console.error("Eroare la fetch:", error));


const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('ro-RO', options);
}


const setArticleId = (event,articleId) => {
    event.preventDefault();
    localStorage.setItem('selectedArticleId', articleId);
    window.location.href = 'single-blog.html';

}

function extractFirstImage(content) {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = content;
    const img = tempDiv.querySelector("img");
    return img ? img.src : "images/blog/default.jpg";
}