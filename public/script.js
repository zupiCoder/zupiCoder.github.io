document.addEventListener("DOMContentLoaded", async function () {
    try {
        console.log("Fetching GitHub profile...");
        const profileResponse = await fetch("/api/github-profile");
        
        if (!profileResponse.ok) {
            throw new Error(`Profile API request failed: ${profileResponse.status}`);
        }

        const profileData = await profileResponse.json();
        console.log("✅ Profile data:", profileData);

        document.getElementById("avatar").src = profileData.avatar_url;
        document.getElementById("username").textContent = profileData.login;
        document.getElementById("bio").textContent = profileData.bio || "No bio available";
        document.getElementById("followers").textContent = profileData.followers;
        document.getElementById("repo-count").textContent = profileData.public_repos;
        document.getElementById("profile-link").href = profileData.html_url;

        console.log("Fetching repositories...");
        const repoResponse = await fetch("/api/github-repos");

        if (!repoResponse.ok) {
            throw new Error(`Repositories API request failed: ${repoResponse.status}`);
        }

        const repos = await repoResponse.json();
        console.log("✅ Repositories data:", repos);

        const repoContainer = document.getElementById("repos");
        repoContainer.innerHTML = ""; // Clear loading text

        repos.forEach(repo => {
            const repoElement = document.createElement("div");
            repoElement.classList.add("repo");
            repoElement.innerHTML = `
                <a href="${repo.html_url}" target="_blank">${repo.name}</a>
                <p>${repo.description || "No description available"}</p>
                <p>⭐ Stars: ${repo.stargazers_count} | 🍴 Forks: ${repo.forks_count}</p>
            `;
            repoContainer.appendChild(repoElement);
        });

    } catch (error) {
        console.error("❌ Error fetching GitHub data:", error);
        document.getElementById("repos").innerHTML = "Error loading repositories.";
    }
});
