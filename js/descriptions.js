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
	// Update search reminder texts upon page first loaded
	document.getElementById('searchCount').innerText = "0";
	document.getElementById('searchText').innerText = "";

	// Get search result
	let text_input = document.getElementById('textFilter');
	let table_content = document.getElementById('tweetTable');
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
		table_content.innerHTML = "";
		if (text_input.value != "") {
			let next_index = 0;
			for (let i = 0; i < tweets_to_show.length; i++) {
				// Create new row
				let row = table_content.insertRow(next_index);
				let cell_row_number = row.insertCell(0);
				let cell_activity_type = row.insertCell(1);
				let cell_tweet = row.insertCell(2);

				cell_row_number.innerHTML = next_index + 1;
				cell_activity_type.innerHTML = tweets_to_show[i].activityType;
				cell_tweet.innerHTML = tweets_to_show[i].text;

				// Update index counter
				next_index += 1;
			}
		}
	});
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	addEventHandlerForSearch();
	loadSavedRunkeeperTweets().then(parseTweets);
});