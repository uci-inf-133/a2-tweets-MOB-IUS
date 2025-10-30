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
	completed = 0;
	live = 0;
	achievement = 0;
	miscellaneous = 0;
	written = 0;
	for (let i = 0; i < tweet_array.length; i++) {
		// Update earliest and latest time
		if (tweet_array[i].time < earliest_date) {
			earliest_date = tweet_array[i].time;
		}
		if (tweet_array[i].time > latest_date) {
			latest_date = tweet_array[i].time;
		}

		// Get category information
		if (tweet_array[i].source == "completed") {
			completed += 1;
			// Get number of self written texts
			if (tweet_array[i].written == true) {
				written += 1;
			}
		}
		else if (tweet_array[i].source == "live") {
			live += 1;
		}
		else if (tweet_array[i].source == "achievement") {
			achievement += 1;
		}
		else if (tweet_array[i].source == "miscellaneous") {
			miscellaneous += 1;
		}
	}

	//Update all span information in html
	document.getElementById('firstDate').innerText = parseDate(earliest_date);		// Earliest and Latest dates
	document.getElementById('lastDate').innerText = parseDate(latest_date);

	document.getElementsByClassName('completedEvents')[0].innerText = completed;	// Numbers of tweets categories
	document.getElementsByClassName('completedEvents')[1].innerText = completed;
	document.getElementsByClassName('liveEvents')[0].innerText = live;
	document.getElementsByClassName('achievements')[0].innerText = achievement;
	document.getElementsByClassName('miscellaneous')[0].innerText = miscellaneous;

	document.getElementsByClassName('completedEventsPct')[0]						// Percentages of tweets categories
		.innerText = ((completed*100)/tweet_array.length).toFixed(2) + "%";
	document.getElementsByClassName('liveEventsPct')[0]
		.innerText = ((live*100)/tweet_array.length).toFixed(2) + "%";
	document.getElementsByClassName('achievementsPct')[0]
		.innerText = ((achievement*100)/tweet_array.length).toFixed(2) + "%";
	document.getElementsByClassName('miscellaneousPct')[0]
		.innerText = ((miscellaneous*100)/tweet_array.length).toFixed(2) + "%";
	
	document.getElementsByClassName('written')[0].innerText = written;				// Number and percentage for written texts
	document.getElementsByClassName('writtenPct')[0]
		.innerText = ((written*100)/completed).toFixed(2) + "%";
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});

// Turn Date type into mm dd, yyyy
month_strings = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
weekday_strings = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
function parseDate(date) {
	month = date.getMonth();
	day = date.getDate().toString();
	year = date.getFullYear().toString();

	return (weekday_strings[date.getDay()] + ", " + month_strings[month] + " " + day + ", " + year);
}