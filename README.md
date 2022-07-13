# Installation Instructions
## Twitter Data
* Create a new folder in `twtdata` and set the name to be the same as your twitter username.
* Get your twitter archive from https://twitter.com/settings/download_your_data. The archive is ready to download after 24 hours.
* Extract `tweet.js` and `like.js` from the archive zip file into `twtdata\`__*`username`*__.
* Rename `window.YTD.tweet.part0` in `twtdata\`__*`username`*__`\tweet.js` to __*`username`*__`_tweet`.
* Rename `window.YTD.like.part0` in `twtdata\`__*`username`*__`\like.js` to __*`username`*__`_like`.
* Import `tweet.js` and `like.js` to `index.html` after `<div id="results-container"></div>` as:  
`<script src="/twtdata/`__*`username`*__`/like.js"></script>`  
`<script src="/twtdata/`__*`username`*__`/tweet.js"></script>`
* Get your account I.D. at https://tweeterid.com/.
* Fill in `const archives = {}` in `script.js` in the following format:  
`"`__*`I.D.`*__`-tweet": `__*`username`*__`_tweet`  
`"`__*`I.D.`*__`-like": `__*`username`*__`_like`
* Fill in `<select name="search-option" id="search-option"></select>` in `index.html` in the following format:  
`<option value="`__*`I.D.`*__`-tweet">`__*`username`*__`'s tweets</option>`  
`<option value="`__*`I.D.`*__`-like">`__*`username`*__`'s likes</option>`

## Node
* You will need to have Node installed to start this environment. If you are not sure if you have Node installed run `node -v` in your terminal. If you do not see a version number output, install Node before moving on.
* Install light-server locally and save it to your development environment by running `npm install lite-server --save-dev` in your terminal.
* Run `npm run start` in your terminal to start the server.
* Your browser will open at `localhost:3000`.