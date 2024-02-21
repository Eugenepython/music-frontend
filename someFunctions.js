async function getTopSongsBySum(scoresArray) {
    // Check if 'sum' property exists in every item
    while (!scoresArray.every(item => 'sum' in item)) {
        console.warn("Waiting for 'sum' property to be available in all items...");
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for 1 second before checking again
    }

    // Sort the scoresArray by 'sum' in descending order
    scoresArray.sort((a, b) => b.sum - a.sum);

    // Find the unique sums in the array
    const uniqueSums = [...new Set(scoresArray.map(item => item.sum))];

    // Initialize arrays to store songs for each category
    const topSongs = [];
    const secondTopSongs = [];
    const thirdTopSongs = [];
    const lowestSongs = [];

    // Iterate through unique sums and populate corresponding arrays
    uniqueSums.forEach((sum, index) => {
        const songsWithSameSum = scoresArray.filter(item => item.sum === sum);

        switch (index) {
            case 0:
                topSongs.push(...songsWithSameSum);
                break;
            case 1:
                secondTopSongs.push(...songsWithSameSum);
                break;
            case 2:
                thirdTopSongs.push(...songsWithSameSum);
                break;
            default:
                break;
        }
    });

    // Populate lowestSongs array
    lowestSongs.push(...scoresArray.filter(item => item.sum === uniqueSums[uniqueSums.length - 1]));

    return {
        topSongs,
        secondTopSongs,
        thirdTopSongs,
        lowestSongs,
    };
}




export { getTopSongsBySum };


