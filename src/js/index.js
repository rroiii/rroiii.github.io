document.addEventListener("DOMContentLoaded", () => {
    showComponent('aboutme');
});

async function showComponent(componentId) {
    const componentMap = {
        'writeup': 'components/writeup.html',
        'blog': 'components/blog.html',
        'aboutme': 'components/about.html'
    };

    const response = await fetch(componentMap[componentId]);
    const content = await response.text();

    if (componentId === 'blog') {
        loadBlogPosts();
    }
    if (componentId === 'writeup') {
        loadWriteupPosts();
    }

    document.getElementById('content').innerHTML = content;
}

async function showWBlog(blogId) {
    const response = await fetch(`posts/${blogId}.html`);
    const content = await response.text();
    document.getElementById('content').innerHTML = content;
}

async function loadWriteupPosts() {
    const response = await fetch('writeups.json');
    const writeups = await response.json();

    if(writeups.length > 0) {
        loadData(writeups);
    }else{
        document.querySelector("#data-lists").innerHTML = 'Coming soon...';
        document.querySelector("#prev").style.display = 'none';
        document.querySelector("#next").style.display = 'none';
        document.querySelector("#page-number").style.display = 'none';
    }
}

async function loadBlogPosts() {
    const response = await fetch('posts.json');
    
    const blogs = await response.json();

    if(blogs.length > 0) {
        loadData(blogs);
    }else{
        document.querySelector("#data-lists").innerHTML = 'Coming soon...';
        document.querySelector("#prev").style.display = 'none';
        document.querySelector("#next").style.display = 'none';
        document.querySelector("#page-number").style.display = 'none';
    }
}

// Thanks to Shubham Tiwari https://dev.to/shubhamtiwari909/pagination-with-javascript-2a0

async function loadData(data) {    
    const list = document.querySelector("#data-lists");
    const prevButton = document.querySelector("#prev");
    const nextButton = document.querySelector("#next");
    const pageNumberValue = document.querySelector("#page-number")
    
    let startIndex = 0;
    let endIndex = 10;
    let pageNumber = 0;
    
    pageNumberValue.value = pageNumber + 1

    const mapData = () => {
        const slicedData = data
          .slice(startIndex, endIndex)
          .map((row) => {
            return `     
            <button onclick="showWBlog('${row.id}')" class="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
            <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">${row.title}</h5>
            <p class="font-normal text-gray-700 dark:text-gray-400">Here are the biggest enterprise technology acquisitions of 2021 so far, in reverse chronological order.</p>
            </button>
            `;
            
          })
          .join("");
      
        list.innerHTML = slicedData;
    }

    mapData();

    prevButton.addEventListener("click", () => {
        if (startIndex <= 0) {
            startIndex = 0;
            endIndex = 10;
        } else {
            startIndex -= 10;
            endIndex -= 10;
            pageNumber -= 1;
        }
        pageNumberValue.value = pageNumber + 1;
        mapData();
    });
    
    nextButton.addEventListener("click", () => {
        if (endIndex < data.length) {
            startIndex += 10;
            endIndex += 10;
            pageNumber += 1;
        }
        pageNumberValue.value = pageNumber + 1;
        mapData();
    });
    
    pageNumberValue.addEventListener("change", (e) => {
        let currentPageNumber = Number.parseInt(e.target.value);
        let maxPageNumber = Math.ceil(data.length / 10);
    
        if (currentPageNumber > maxPageNumber) {
            currentPageNumber = maxPageNumber;
            e.target.value = maxPageNumber;
        } else if (currentPageNumber < 1) {
            currentPageNumber = 1;
            e.target.value = 1;
        }
    
        startIndex = (currentPageNumber - 1) * 10;
        endIndex = startIndex + 10;
        pageNumber = currentPageNumber - 1;
        mapData();
    });
    
}
