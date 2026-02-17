let currentUser = JSON.parse(localStorage.getItem("currentUser")) || { username: "Guest", password: "", points: 0 };

// Handle login form submission
document.getElementById("loginForm").addEventListener("submit", function (e) {
    e.preventDefault(); // Prevent page reload on form submission
    
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    // For this example, we check if the username is "test" and the password is "password"
    // You can replace this with actual authentication logic (e.g., fetching from a database)
    if (username === "test" && password === "password") {
        currentUser = { username: username, password: password, points: 100 }; // Example: Logged in user with 100 points
        localStorage.setItem("currentUser", JSON.stringify(currentUser)); // Save user to localStorage
        alert("Login successful!");
        displayUserInfo(); // Update UI with user information
        showSection("matches"); // Redirect to matches section after successful login
    } else {
        alert("Invalid username or password. Please try again.");
    }
});

// Handle register form submission
document.getElementById("registerForm").addEventListener("submit", function(e) {
    e.preventDefault();
    const username = document.getElementById("newUsername").value;
    const password = document.getElementById("newPassword").value;

    // Register the user (for now, just create a user and assign points)
    currentUser = { username: username, password: password, points: 50 }; // New user with 50 points
    localStorage.setItem("currentUser", JSON.stringify(currentUser)); // Save user to localStorage
    alert("Account created successfully!");
    showLogin(); // Show the login section after successful registration
});

// Update the navbar with user info
function displayUserInfo() {
    document.getElementById("usernameDisplay").textContent = currentUser.username !== "Guest" ? `Welcome back, ${currentUser.username}` : "";
    document.getElementById("signOutBtn").style.display = currentUser.username !== "Guest" ? "inline" : "none";
    document.getElementById("loginLink").style.display = currentUser.username === "Guest" ? "inline" : "none";
    document.getElementById("userPoints").textContent = `Points: ${currentUser.points}`;

    // Show the appropriate section based on the login status
    showSection(currentUser.username === "Guest" ? "home" : "matches");
}

// Sign out functionality
function signOut() {
    localStorage.removeItem("currentUser");
    currentUser = { username: "Guest", password: "", points: 0 };
    displayUserInfo();
}

// Show login section
function showLogin() {
    document.getElementById("login").style.display = "block";
    document.getElementById("register").style.display = "none";
}

// Show register section
function showRegister() {
    document.getElementById("login").style.display = "none";
    document.getElementById("register").style.display = "block";
}

// Show the appropriate section (home, matches, etc.)
function showSection(sectionId) {
    document.querySelectorAll(".section").forEach(section => section.style.display = "none");
    document.getElementById(sectionId).style.display = "block";
}

// Load matches
function loadMatches() {
    const matches = [
        { id: 1, match: "Arsenal vs Man City", date: "Jan 18, 2025" },
        { id: 2, match: "Real Madrid vs Barcelona", date: "Jan 19, 2025" },
        { id: 3, match: "Liverpool vs Chelsea", date: "Jan 20, 2025" },
        { id: 4, match: "Bayern Munich vs PSG", date: "Jan 22, 2025" },
        { id: 5, match: "Juventus vs AC Milan", date: "Jan 25, 2025" }
    ];
    const matchListElement = document.getElementById("matchList");
    matchListElement.innerHTML = matches.map(
        match => `<div class='match-item'>
                    ${match.match} - ${match.date}
                    <a href="javascript:void(0);" onclick="showBettingOptions(${match.id})">Place a Bet</a>
                  </div>`
    ).join("");
}

// Load and display coupons
const coupons = [
    {
        name: "Nike Shoes",
        points: 100,
        code: "NIKESH123"
    },
    {
        name: "Adidas T-Shirt",
        points: 50,
        code: "ADIDAS456"
    },
    {
        name: "Apple Watch",
        points: 150,
        code: "APPLE789"
    }
];

function loadCoupons() {
    const couponsList = document.getElementById("couponsList");
    couponsList.innerHTML = coupons.map(coupon => {
        // Check if the coupon is already redeemed
        const redeemedCoupons = JSON.parse(localStorage.getItem("redeemedCoupons")) || [];
        const isRedeemed = redeemedCoupons.includes(coupon.code);

        return `
            <div class='coupon-item'>
                <p>${coupon.name} - ${coupon.points} Points</p>
                <button onclick="redeemCoupon(${coupon.points}, '${coupon.code}')" ${isRedeemed ? 'disabled' : ''}>
                    ${isRedeemed ? 'Redeemed' : 'Redeem'}
                </button>
            </div>
        `;
    }).join("");
}

// Redeem coupon
function redeemCoupon(requiredPoints, code) {
    if (currentUser.points < requiredPoints) {
        alert("Not enough points to redeem this coupon.");
        return;
    }

    // Check if the user has already redeemed this coupon
    const redeemedCoupons = JSON.parse(localStorage.getItem("redeemedCoupons")) || [];

    if (redeemedCoupons.includes(code)) {
        alert("You have already redeemed this coupon.");
        return;
    }

    // Deduct points for the coupon redemption
    currentUser.points -= requiredPoints;
    localStorage.setItem("currentUser", JSON.stringify(currentUser));

    // Mark this coupon as redeemed by adding to the redeemedCoupons list
    redeemedCoupons.push(code);
    localStorage.setItem("redeemedCoupons", JSON.stringify(redeemedCoupons));

    alert(`Coupon redeemed! Your code: ${code}`);

    // Update the UI to reflect the new points and redemption status
    displayUserInfo();
    loadCoupons(); // Reload the coupons list to update the redemption status
}

// Show betting options for a match
function showBettingOptions(matchId) {
    const bettingOptions = `
        <h3>Betting Options for Match ${matchId}</h3>
        <label><input type="radio" name="offside${matchId}" /> Offside</label>
        <label><input type="radio" name="offside${matchId}" /> No Offside</label><br>
        <label><input type="radio" name="redCard${matchId}" /> Red Card</label>
        <label><input type="radio" name="redCard${matchId}" /> No Red Card</label><br>
        <label><input type="radio" name="goal${matchId}" /> Goal</label>
        <label><input type="radio" name="goal${matchId}" /> No Goal</label><br>
        <label><input type="radio" name="penalty${matchId}" /> Penalty</label>
        <label><input type="radio" name="penalty${matchId}" /> No Penalty</label><br>
        <button onclick="placeBet(${matchId})">Place Bet</button>
        <button onclick="showSection('matches')">Back to Matches</button>
    `;
    document.getElementById("bettingOptionsContent").innerHTML = bettingOptions;
    showSection('bettingOptions');
}

// Place a bet and update the user's points
function placeBet(matchId) {
    if (currentUser.username === "Guest") {
        alert("Please log in to place a bet.");
        return;
    }

    // Simulate the outcome of the bet for each option (random win or lose)
    const betOutcomes = {
        offside: Math.random() > 0.5, // Randomly simulate offside outcome
        redCard: Math.random() > 0.5, // Randomly simulate red card outcome
        goal: Math.random() > 0.5,    // Randomly simulate goal outcome
        penalty: Math.random() > 0.5  // Randomly simulate penalty outcome
    };

    let betDetails = `Bet on Match ${matchId} with selected options: `;
    let pointsAwarded = 0;

    // Loop through each betting option and check if it's selected
    ["offside", "redCard", "goal", "penalty"].forEach(option => {
        const selected = document.querySelector(`input[name="${option}${matchId}"]:checked`);
        if (selected) {
            betDetails += `${option}: ${selected.nextSibling.textContent}; `;
            // Check if the bet matches the simulated outcome
            if (betOutcomes[option]) {
                pointsAwarded += 30; // Award 30 points for each correct selection
            }
        }
    });

    // Show results based on the bet outcomes
    if (pointsAwarded > 0) {
        alert(`${betDetails} You won your bet! You earned ${pointsAwarded} points.`);
    } else {
        alert(`${betDetails} You lost your bet. Better luck next time!`);
    }

    // Update points and save to localStorage
    currentUser.points += pointsAwarded;
    localStorage.setItem("currentUser", JSON.stringify(currentUser));

    // Update the points display
    displayUserInfo();
}

// Initial load of user info, matches, and coupons
window.onload = function () {
    displayUserInfo(); // Display username and points when the page loads
    loadMatches(); // Load dummy matches
    loadCoupons(); // Load dummy coupons
};
