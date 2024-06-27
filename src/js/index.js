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
            <div class="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                <a href="#">
                    <img class="rounded-t-lg" src="/docs/images/blog/image-1.jpg" alt="" />
                </a>
                <div class="p-5">
                    <a href="#">
                        <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">${row.title}</h5>
                    </a>
                    <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">
                        Here are the biggest enterprise technology acquisitions of 2021 so far, in reverse chronological order.
                    </p>
                    <a href="#" class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                        Read more
                        <svg class="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
                        </svg>
                    </a>
                </div>
            </div>`;
            
          })
          .join("");
      
        list.innerHTML = slicedData;
    }

    mapData();

    prevButton.addEventListener("click", () => {
        if (endIndex < 20) {
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


    pageNumberValue.addEventListener("change",(e) => {
        let currentPageNumber = Number.parseInt(e.target.value)
        let maxPageNumber = Math.floor(data.length/10)
        if(currentPageNumber > maxPageNumber){
        currentPageNumber = maxPageNumber;
            e.target.value = value
        }
        else if(currentPageNumber < 0){
            currentPageNumber = 0;
            e.target.value = value
        }
        startIndex = currentPageNumber * 10;
        endIndex = startIndex + 10
        pageNumber = currentPageNumber
        mapData();
    })
}
