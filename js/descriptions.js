// Store all tweets with user written texts
var written_tweets = [];

function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});

	// Filter out all the tweets with user written texts
	// and store them into written_tweets as global variable
	written_tweets = tweet_array.filter((tweet) => {
		return (tweet.written == true);
	});
}

function addEventHandlerForSearch() {
	//TODO: Search the written tweets as text is entered into the search box, and add them to the table
	let text_input = document.getElementById('textFilter');
	text_input.addEventListener('keyup', () => {
		console.log(text_input.value);
	});
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	addEventHandlerForSearch();
	loadSavedRunkeeperTweets().then(parseTweets);
});