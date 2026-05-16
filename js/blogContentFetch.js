const POSTID = localStorage.getItem('selectedArticleId');
const PROXY = `https://blogger-content-proxy.amvbeautyskin.workers.dev?postId=${POSTID}`;


const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('ro-RO', options);
}

fetch(PROXY)
    .then(response => response.json())
    .then(data => {
        //SET SEO
        let subTitle = document.getElementById("subTitle");
        subTitle.innerHTML = data.title;

        let datePost = document.getElementById("bpdate");
        const formattedDate = formatDate(data.published);
        datePost.innerText = formattedDate;  
        let tagsContainer = document.getElementById("tags");
        data.labels?.forEach(tag => {
            let tagLink = document.createElement("a");
            tagLink.textContent = tag;
            tagLink.href = `https://amvbeautyskin.blogspot.com/search/label/${tag}`;
            tagsContainer.appendChild(tagLink);
            tagLink.target = "_blank";
            tagsContainer.appendChild(document.createElement("br"));
        });
        addBlockquoteClassAndWrapContent();
    })
    .catch(error => {
        let subTitle = document.getElementById("subTitle");
        subTitle.innerHTML = "<h1>Ceva nu a mers bine. Încearcă mai tarziu.</h1>";

        setTimeout(() => {
            window.location.href = '/blog.html';
        }, 3000);
      });

    function addBlockquoteClassAndWrapContent() {
        const blockquotes = document.querySelectorAll('blockquote');
        
        blockquotes.forEach(blockquote => {
            blockquote.classList.add('wp-block-quote');
            const p = document.createElement('p');
            p.innerHTML = blockquote.innerHTML;
            blockquote.innerHTML = '';
            blockquote.appendChild(p);
        });
    }