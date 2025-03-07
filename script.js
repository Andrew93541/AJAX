let allUsers = [];
let displayedUsers = 0;
const usersPerPage = 5;

document.getElementById("fetchData").addEventListener("click", function() {
    let displayDiv = document.getElementById("dataDisplay");
    let loader = document.getElementById("loader");
    let loadMoreBtn = document.getElementById("loadMore");

    loader.classList.remove("hidden");
    displayDiv.innerHTML = "";
    loadMoreBtn.classList.add("hidden");

    fetch("https://api.github.com/users?per_page=10")
        .then(response => response.json())
        .then(userData => {
            loader.classList.add("hidden");

            allUsers = userData.map(user => ({
                username: user.login,
                avatar: user.avatar_url,
                profileUrl: user.html_url,
                apiUrl: user.url
            }));

            displayedUsers = 0;
            displayUsers();

            if (allUsers.length > usersPerPage) {
                loadMoreBtn.classList.remove("hidden");
            }
        })
        .catch(error => {
            loader.classList.add("hidden");
            displayDiv.innerHTML = "<p style='color: red;'>Error loading data. Please try again.</p>";
        });
});

function displayUsers() {
    let displayDiv = document.getElementById("dataDisplay");
    let loadMoreBtn = document.getElementById("loadMore");

    let usersToShow = allUsers.slice(displayedUsers, displayedUsers + usersPerPage);
    usersToShow.forEach(user => {
        displayDiv.innerHTML += `
            <div class="user-card" onclick="openModal('${user.apiUrl}', '${user.avatar}', '${user.profileUrl}')">
                <img src="${user.avatar}" alt="Profile">
                <div class="user-info">
                    <h4>${user.username}</h4>
                </div>
            </div>
        `;
    });

    displayedUsers += usersPerPage;

    if (displayedUsers >= allUsers.length) {
        loadMoreBtn.classList.add("hidden");
    }
}

document.getElementById("loadMore").addEventListener("click", function() {
    displayUsers();
});

// Open Modal with More User Details
function openModal(apiUrl, avatar, profileUrl) {
    fetch(apiUrl)
        .then(response => response.json())
        .then(userData => {
            document.getElementById("modalAvatar").src = avatar;
            document.getElementById("modalName").textContent = userData.name || "No Name";
            document.getElementById("modalUsername").textContent = "@" + userData.login;
            document.getElementById("modalBio").textContent = userData.bio || "No bio available.";
            document.getElementById("modalProfile").href = profileUrl;
            document.getElementById("userModal").style.display = "flex";
        });
}

// Close Modal
document.querySelector(".close").addEventListener("click", function() {
    document.getElementById("userModal").style.display = "none";
});

// Dark Mode Toggle
document.getElementById("toggleTheme").addEventListener("click", function() {
    document.body.classList.toggle("dark-mode");
});
