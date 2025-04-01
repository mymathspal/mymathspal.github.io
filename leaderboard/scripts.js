document.addEventListener('DOMContentLoaded', function() {
    const leaderboardData = [
        { name: 'Alice', xp: 950, school: 'Greenwood High' },
        { name: 'Bob', xp: 870, school: 'Sunset Academy' },
        { name: 'Charlie', xp: 800, school: 'Riverdale School' },
        { name: 'David', xp: 700, school: 'Mountain View Academy' },
        { name: 'David', xp: 700, school: 'Mountain View Academy' },
        { name: 'David', xp: 700, school: 'Mountain View Academy' },
        { name: 'David', xp: 700, school: 'Mountain View Academy' },
        { name: 'David', xp: 700, school: 'Mountain View Academy' },
        { name: 'David', xp: 700, school: 'Mountain View Academy' },
        { name: 'David', xp: 700, school: 'Mountain View Academy' },
        { name: 'David', xp: 700, school: 'Mountain View Academy' },
        { name: 'David', xp: 700, school: 'Mountain View Academy' },
        { name: 'David', xp: 700, school: 'Mountain View Academy' },
        { name: 'David', xp: 700, school: 'Mountain View Academy' },
        { name: 'Eva', xp: 600, school: 'Oakwood High' }
    ];

    // Function to sort leaderboard by XP
    leaderboardData.sort(function(a, b) {
        return b.xp - a.xp;
    });

    // Function to generate the leaderboard rows dynamically
    function generateLeaderboard() {
        const tbody = document.querySelector('#leaderboard tbody');
        tbody.innerHTML = '';  // Clear any existing rows

        leaderboardData.forEach(function(player, index) {
            const row = document.createElement('tr');
            let rank = index + 1;  // Rank starts from 1
            let medalOrStar = '';  // Initialize medal or star as empty

            // Assign different medals to the top three players
            if (index === 0) {
                medalOrStar = '<span class="medal medal-gold">🥇</span>';  // Gold medal for first
            } else if (index === 1) {
                medalOrStar = '<span class="medal medal-silver">🥈</span>';  // Silver medal for second
            } else if (index === 2) {
                medalOrStar = '<span class="medal medal-bronze">🥉</span>';  // Bronze medal for third
            } else {
                medalOrStar = '<span class="star">⭐</span>';  // Empty star for others
            }

            // Generate the row with rank + medal/star, name, XP, and school
            row.innerHTML = `
                <td>${rank}${medalOrStar}</td>
                <td>${player.name}</td>
                <td>${player.xp}</td>
                <td>${player.school}</td>
            `;

            tbody.appendChild(row);
        });
    }

    // Initial call to populate the leaderboard
    generateLeaderboard();
});
