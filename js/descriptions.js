// Store all tweets with user written texts
var written_tweets = [];
var tweets_to_show = [];

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
	// Update search reminder texts upon page first loaded
	document.getElementById('searchCount').innerText = "0";
	document.getElementById('searchText').innerText = "";

	let text_input = document.getElementById('textFilter');
	text_input.addEventListener('keyup', () => {
		console.log(text_input.value);
		tweets_to_show = written_tweets.filter((tweet) => {
			return (tweet.writtenText.includes(text_input.value));
		});

		// Update text reminders
		if (text_input.value == "") {
			document.getElementById('searchCount').innerText = "0";
		}
		else {
			document.getElementById('searchCount').innerText = tweets_to_show.length;
		}
		
		document.getElementById('searchText').innerText = text_input.value;

		// Update table
	});
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	addEventHandlerForSearch();
	loadSavedRunkeeperTweets().then(parseTweets);
});