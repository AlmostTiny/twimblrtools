let checkedFilters = {
    allFilters: new Set(),
    incFilters: new Set(),
    excFilters: new Set()
};

function setFilterRules(filter1, filter2) {
    Array.from(document.getElementsByClassName(filter1)).forEach((filter) => {
        const otherFilter = document.getElementsByClassName(filter2)[filter.name];
        if (filter.checked) {
            if (filter.className === "inc-filter") {
                checkedFilters.incFilters.add(filter);
                checkedFilters.excFilters.delete(otherFilter);
            }
            else if (filter.className === "exc-filter") {
                checkedFilters.excFilters.add(filter);
                checkedFilters.incFilters.delete(otherFilter);
            }
            checkedFilters.allFilters.add(filter);
            otherFilter.disabled = false;
            otherFilter.checked = false;
            checkedFilters.allFilters.delete(otherFilter);
            otherFilter.disabled = true;
        }
        else {
            checkedFilters.allFilters.delete(filter);
            if (filter.className === "inc-filter") {
                checkedFilters.incFilters.delete(filter);
            }
            else if (filter.className === "exc-filter") {
                checkedFilters.excFilters.delete(filter);
            }
        }
        filter.addEventListener("change", function () {
            otherFilter.disabled = !otherFilter.disabled;
            if (filter.className === "inc-filter") {
                if (checkedFilters.incFilters.has(filter)) {
                    checkedFilters.incFilters.delete(filter);
                    checkedFilters.allFilters.delete(filter);
                }
                else {
                    checkedFilters.incFilters.add(filter);
                    checkedFilters.allFilters.add(filter);
                }
            }
            else if (filter.className === "exc-filter") {
                if (checkedFilters.excFilters.has(filter)) {
                    checkedFilters.excFilters.delete(filter);
                    checkedFilters.allFilters.delete(filter);
                }
                else {
                    checkedFilters.excFilters.add(filter);
                    checkedFilters.allFilters.add(filter);
                }
            }
        });
    });
}

setFilterRules("inc-filter", "exc-filter");
setFilterRules("exc-filter", "inc-filter");

console.log("ALL FILTERS:");
checkedFilters.allFilters.forEach(filter => {
    console.log(filter);
});
console.log("INC FILTERS:");
checkedFilters.incFilters.forEach(filter => {
    console.log(filter);
});
console.log("EXC FILTERS:");
checkedFilters.excFilters.forEach(filter => {
    console.log(filter);
});

function retweetFilter(tweet) {
    if (tweet.tweet.full_text.startsWith("RT @") && tweet.tweet.entities.user_mentions.length === 1) {
        let screenName = tweet.tweet.full_text.substring(4).split(": ")[0];
        for (let index = 0; index < tweet.tweet.entities.user_mentions.length; index++) {
            if (tweet.tweet.entities.user_mentions[index].screen_name === screenName) {
                return true;
            }
        }
    }
    return false;
}

function replyFilter(tweet) {
    return typeof tweet.tweet.in_reply_to_status_id_str !== "undefined";
}

function threadFilter(tweet) {
    const searchOption = document.getElementById("search-option").value;
    if (tweet.tweet.in_reply_to_user_id_str === searchOption.substring(0, searchOption.length - 6)) {
        return true;
    }
    return false;
}

function mediaFilter(tweet) {
    return typeof tweet.tweet.entities.media !== "undefined";
}

function spotifyFilter(tweet) {
    for (let index = 0; index < tweet.tweet.entities.urls.length; index++) {
        if (tweet.tweet.entities.urls[index].expanded_url.startsWith("https://open.spotify.com")) {
            return true;
        }
    }
    return false;
}

function youtubeFilter(tweet) {
    for (let index = 0; index < tweet.tweet.entities.urls.length; index++) {
        if (tweet.tweet.entities.urls[index].expanded_url.startsWith("https://www.youtube.com")) {
            return true;
        }
    }
    return false;
}

const filters = {
    retweet: function(tweet) {
        return retweetFilter(tweet);
    },
    reply: function(tweet) {
        return replyFilter(tweet);
    },
    thread: function(tweet) {
        return threadFilter(tweet);
    },
    media: function(tweet) {
        return mediaFilter(tweet);
    },
    spotify: function(tweet) {
        return spotifyFilter(tweet);
    },
    youtube: function(tweet) {
        return youtubeFilter(tweet);
    }
};

function filterResult(tweet) {
    let filterOK = false;

    if (checkedFilters.incFilters.size > 0) {
        if (document.getElementById("inc-filter-and").checked) {
            filterOK = true;
            checkedFilters.incFilters.forEach(filter => {
                filterOK = filterOK && filters[filter.name](tweet);
            });
        }
        else if (document.getElementById("inc-filter-or").checked) {
            filterOK = false;
            checkedFilters.incFilters.forEach(filter => {
                filterOK = filterOK || filters[filter.name](tweet);
            });
        }
    }
    else {
        filterOK = true;
    }
    
    if (filterOK && checkedFilters.excFilters.size > 0) {
        if (document.getElementById("exc-filter-and").checked) {
            filterOK = true;
            checkedFilters.excFilters.forEach(filter => {
                filterOK = filterOK && !filters[filter.name](tweet);
            });
        }
        else if (document.getElementById("exc-filter-or").checked) {
            filterOK = false;
            checkedFilters.excFilters.forEach(filter => {
                filterOK = filterOK || !filters[filter.name](tweet);
            });
        }
    }
    
    return filterOK;
}