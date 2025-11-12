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
        const pageTitle = document.getElementById("banner-title")
        pageTitle.innerHTML = `${data.title}`;

        let subTitle = document.getElementById("subTitle");
        subTitle.innerHTML = data.title;

        let datePost = document.getElementById("bpdate");
        const formattedDate = formatDate(data.published);
        datePost.innerText = formattedDate;

        let blogContent = document.getElementsByClassName("sic_the_content")[0];
        blogContent.innerHTML = `${data.content}`;
        
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
        updateMetaTags(data);
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

    function updateMetaTags(data) {
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.setAttribute("content", data.title);
        }

        const ogTitle = document.querySelector('meta[property="og:title"]');
        const ogDescription = document.querySelector('meta[property="og:description"]');
        const ogUrl = document.querySelector('meta[property="og:url"]');
        const articlePublishedTime = document.querySelector('meta[property="article:published_time"]');
        const articleModifiedTime = document.querySelector('meta[property="article:modified_time"]');
        const articleAuthor = document.querySelector('meta[property="article:author"]');
    
        if (ogTitle) {
            ogTitle.setAttribute("content", data.title);
        }
        if (ogDescription) {
            ogDescription.setAttribute("content", data.title);
        }
        if (ogUrl) {
            ogUrl.setAttribute("content", window.location.href);
        }
        if (articlePublishedTime) {
            articlePublishedTime.setAttribute("content", formatDate(data.published));
        }
        if (articleModifiedTime && data.updated) {
            articleModifiedTime.setAttribute("content", formatDate(data.updated));
        }
        if (articleAuthor && data.author) {
            articleAuthor.setAttribute("content", data.author.displayName);
        }
    }