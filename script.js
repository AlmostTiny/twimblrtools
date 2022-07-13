const resultsContainer = document.getElementById("results-container");
const archives = {
    "737208617401749504-tweet": peertheonion_tweet,
    "4097352520-like": sophietheapple_like,
    "4097352520-tweet": sophietheapple_tweet,
};

document.getElementById("search-option").addEventListener("change", function () {
    const searchOption = document.getElementById("search-option").value;
    
    if (searchOption.endsWith("like")) {
        Array.from(document.getElementsByClassName("filters")).forEach((element) => {
            element.style.display = "none";
        });
    } else if (searchOption.endsWith("tweet")) {
        Array.from(document.getElementsByClassName("filters")).forEach((element) => {
            element.style.display = "initial";
        });
    }
});

document.getElementById("search-button").addEventListener("click", function () {
    const searchOption = document.getElementById("search-option").value;
    const searchText = document.getElementById("search-text").value;
    let searchResults = document.createElement("p");

    if (searchText !== "") {
        if (resultsContainer.hasChildNodes()) {
            resultsContainer.removeChild(resultsContainer.firstChild);
        }

        function getFullText(archiveItem) {
            let fullText = "";
            if (searchOption.endsWith("tweet")) {
                fullText = archiveItem.tweet.full_text;
            } else if (searchOption.endsWith("like")) {
                fullText = archiveItem.like.fullText;
            }
            return fullText;
        }

        function getTimeStamp(archiveItem) {
            let timeStamp = "";
            if (searchOption.endsWith("tweet")) {
                timeStamp = archiveItem.tweet.created_at;
            }
            return timeStamp;
        }

        const tweetResults = archives[searchOption].filter(function(tweet) {
            let filterOK = getFullText(tweet).includes(searchText);
            if (filterOK && searchOption.endsWith("tweet")) {
                console.log("LOL");
                filterOK = filterOK && filterResult(tweet);
            }
            return filterOK;
        });

        if (tweetResults.length > 0) {
            searchResults = document.createElement("ul");
            resultsContainer.appendChild(searchResults);

            if (searchOption.endsWith("tweet")) {
                tweetResults.sort(function (tweet1, tweet2) {
                    return (new Date(tweet1.tweet.created_at).getTime() > new Date(tweet2.tweet.created_at).getTime());
                });
            }

            tweetResults.forEach((tweet) => {
                const tweetResult = document.createElement("li");
                tweetResult.appendChild(document.createTextNode(`${getTimeStamp(tweet)} ${getFullText(tweet)}`));
                searchResults.appendChild(tweetResult);
            });
        } else {
            searchResults.appendChild(document.createTextNode(`\"${searchText}\" is nowhere to be found :(`));
            resultsContainer.appendChild(searchResults);
        }
    }
});
