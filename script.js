function loadLandingImage() {
    const images = [
        "images/landing/image1.jpg",
        "images/landing/image2.jpg",
        "images/landing/image3.jpg",
        "images/landing/image4.jpg",
        "images/landing/image5.jpg",
        "images/landing/image6.jpg",
        "images/landing/image7.jpg",
        "images/landing/image8.jpg"
    ];
    const randomIndex = Math.floor(Math.random() * images.length);
    document.getElementById("landing-image").src = images[randomIndex];
}

function loadProjects() {
    const projectList = document.getElementById("project-list");
    const projectImageDisplay = document.querySelector(".project-image-display");
    const projectSection = document.querySelector(".project-section");

    fetch("data.json")
        .then(response => response.json())
        .then(data => {
            data.projects.forEach((project, index) => {
                const listItem = document.createElement("li");
                listItem.textContent = project.title;
                listItem.dataset.index = index;
                projectList.appendChild(listItem);
            });

            let currentProjectIndex = -1;

            function updateProjectDisplay(index) {
                if (index < 0 || index >= data.projects.length) return;

                projectImageDisplay.innerHTML = '';
                const project = data.projects[index];

                if (project.image) {
                    const img = document.createElement('img');
                    img.id = 'project-image';
                    img.src = project.image;
                    img.alt = 'Project Image';
                    projectImageDisplay.appendChild(img);

                    if (project.caption) {
                        const caption = document.createElement('p');
                        caption.textContent = project.caption;
                        projectImageDisplay.appendChild(caption);
                    }
                }

                const listItems = projectList.querySelectorAll('li');
                listItems.forEach((item, idx) => {
                    item.classList.toggle('active', idx === index);
                });
            }

            function extendPageForLastItem() {
                const lastItem = projectList.querySelector('li:last-child');
                if (lastItem) {
                    const lastItemOffset = lastItem.getBoundingClientRect().top + window.scrollY;
                    const extraSpace = window.innerHeight - lastItem.offsetHeight;
                    document.body.style.minHeight = `${lastItemOffset + extraSpace + 20}px`;
                }
            }

            function handleScroll() {
                const rect = projectSection.getBoundingClientRect();
                const listItems = projectList.querySelectorAll("li");
                let bestMatchIndex = currentProjectIndex;
                let bestVisibility = 0;

                if (rect.top <= 0 && rect.bottom > 0) {
                    listItems.forEach((item, index) => {
                        const itemRect = item.getBoundingClientRect();
                        const itemHeight = itemRect.bottom - itemRect.top;
                        const visibleHeight = Math.max(0, Math.min(itemRect.bottom, window.innerHeight) - Math.max(itemRect.top, 0));
                        const visibilityPercentage = (visibleHeight / itemHeight) * 100;

                        if (visibilityPercentage > 90 && visibilityPercentage > bestVisibility) {
                            bestVisibility = visibilityPercentage;
                            bestMatchIndex = index;
                        }
                    });
                } else if (rect.top > 0) {
                    bestMatchIndex = -1; // Unselect the first item if scrolling past project-section upwards
                }

                if (bestMatchIndex !== currentProjectIndex) {
                    currentProjectIndex = bestMatchIndex;
                    updateProjectDisplay(currentProjectIndex);
                }
            }

            extendPageForLastItem();
            window.addEventListener("scroll", handleScroll);
        });
}

if (window.location.pathname.endsWith("index.html")) {
    window.addEventListener("wheel", function(event) {
        if (event.deltaY > 0) {
            history.pushState({}, "", "content.html");
            window.location.href = "content.html";
        }
    });
}
