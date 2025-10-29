function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});
	
	//This line modifies the DOM, searching for the tag with the numberTweets ID and updating the text.
	//It works correctly, your task is to update the text of the other tags in the HTML file!
	document.getElementById('numberTweets').innerText = tweet_array.length;

	// Get all information for span parts
	earliest_date = tweet_array[0].time;
	latest_date = tweet_array[0].time;
	for (let i = 0; i < tweet_array.length; i++) {
		// Update earliest and latest time
		if (tweet_array[i].time < earliest_date) {
			earliest_date = tweet_array[i].time;
		}
		if (tweet_array[i].time > latest_date) {
			latest_date = tweet_array[i].time;
		}
	}

	//Update the all span information
	document.getElementById('firstDate').innerText = parseDate(earliest_date);
	document.getElementById('lastDate').innerText = parseDate(latest_date);
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});

// Turn Date type into mm dd, yyyy
function parseDate(date) {
	month_number = date.getMonth() + 1;
	month = (month_number >= 10) ? month_number.toString() : "0" + month_number.toString();
	day = date.getDate().toString();
	year = date.getFullYear().toString();

	return (month + "/" + day + "/" + year)
}