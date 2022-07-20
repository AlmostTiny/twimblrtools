let checkedFilters = new Set();

function setFilterRules(filter1, filter2) {
    Array.from(document.getElementsByClassName(filter1)).forEach((filter) => {
        const otherFilter = document.getElementsByClassName(filter2)[filter.name];
        if (filter.checked) {
            checkedFilters.add(filter);
            otherFilter.disabled = false;
            otherFilter.checked = false;
            checkedFilters.delete(otherFilter);
            otherFilter.disabled = true;
        }
        else {
            checkedFilters.delete(filter);
        }
        filter.addEventListener("change", function () {
            otherFilter.disabled = !otherFilter.disabled;
            if (checkedFilters.has(filter)) {
                checkedFilters.delete(filter);
            }
            else {
                checkedFilters.add(filter);
            }
        });
    });
}
setFilterRules("inc-filter", "exc-filter");
setFilterRules("exc-filter", "inc-filter");

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

const filters = [
    function (tweet) {return retweetFilter(tweet);},
    function (tweet) {return replyFilter(tweet);},
    function (tweet) {return threadFilter(tweet);},
    function (tweet) {return mediaFilter(tweet);},
    function (tweet) {return spotifyFilter(tweet);},
    function (tweet) {return youtubeFilter(tweet);},
];

function filterResult(tweet) {
    let filterOK = true;

    const checkedIncFilters = new Set(Array.from(checkedFilters).filter(function(filter) {
        return filter.className === "inc-filter";
    }));
    if (checkedIncFilters.size > 0) {
        const incFilters = Array.from(document.getElementsByClassName("inc-filter"));
        if (document.getElementById("inc-filter-and").checked) {
            filterOK = true;
            for (i = 0; i < filters.length && i < incFilters.length && filterOK && incFilters[i].checked; i++) {
                filterOK = filterOK && filters[i](tweet);
            }
        } else if (document.getElementById("inc-filter-or").checked) {
            filterOK = false;
            for (i = 0; i < filters.length && i < incFilters.length && !filterOK && incFilters[i].checked; i++) {
                filterOK = filterOK || filters[i](tweet);
            }
        }
    }
    
    const checkedExcFilters = new Set(Array.from(checkedFilters).filter(function(filter) {
        return filter.className === "exc-filter";
    }));
    if (filterOK && checkedExcFilters.size > 0) {
        const excFilters = Array.from(document.getElementsByClassName("exc-filter"));
        if (document.getElementById("exc-filter-and").checked) {
            filterOK = true;
            for (i = 0; i < filters.length && i < excFilters.length && filterOK && excFilters[i].checked; i++) {
                filterOK = filterOK && !filters[i](tweet);
            }
        } else if (document.getElementById("exc-filter-or").checked) {
            filterOK = false;
            for (i = 0; i < filters.length && i < excFilters.length && !filterOK && excFilters[i].checked; i++) {
                filterOK = filterOK || !filters[i](tweet);
            }
        }
    }
    
    return filterOK;
}