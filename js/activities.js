function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}
	
	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});

	// Get activity summary information
	let activity_map = new Map();
	let distance_map = new Map();
	for (let i = 0; i < tweet_array.length; i++) {
		// Get commonality of activities
		if (activity_map.has(tweet_array[i].activityType)) {
			activity_map.set(tweet_array[i].activityType,
				activity_map.get(tweet_array[i].activityType)+1);
		}
		else {
			activity_map.set(tweet_array[i].activityType, 1);
		}

		// Get distance summation for activities
		if (distance_map.has(tweet_array[i].activityType)) {
			distance_map.set(tweet_array[i].activityType,
				distance_map.get(tweet_array[i].activityType) + tweet_array[i].distance);
		}
		else {
			distance_map.set(tweet_array[i].activityType, tweet_array[i].distance);
		}
	}

	// Get top 3 common activities and their distances
	let top_activity = [];
	let iterator = activity_map.keys();
	for (let i = 0; i < 3; i++) {
		top_activity.push(iterator.next().value);
	}
	for (let i = 3; i < activity_map.size; i++) {
		let new_key = iterator.next().value;
		// Compare to update top 3
		if (activity_map.get(new_key) > activity_map.get(top_activity[0])) {
			top_activity[0] = new_key;
		}
		else if (activity_map.get(new_key) > activity_map.get(top_activity[1])) {
			top_activity[1] = new_key;
		}
		else if (activity_map.get(new_key) > activity_map.get(top_activity[2])) {
			top_activity[2] = new_key;
		}
	}

	let longest_avg_dist_activity = top_activity[0];
	let shortest_avg_dist_activity = top_activity[0];
	for (let i = 1; i < 3; i++) {
		if ((distance_map.get(top_activity[i]) / activity_map.get(top_activity[i]))
			> (distance_map.get(longest_avg_dist_activity) / activity_map.get(longest_avg_dist_activity))) {
				longest_avg_dist_activity = top_activity[i];
		}
		if ((distance_map.get(top_activity[i]) / activity_map.get(top_activity[i]))
			< (distance_map.get(shortest_avg_dist_activity) / activity_map.get(shortest_avg_dist_activity))) {
				shortest_avg_dist_activity = top_activity[i];
		}
	}

	// Get whether the longest activity is on weekdays or weekends
	let weekday_dist = 0; let weekday_count = 0;
	let weekend_dist = 0; let weekend_count = 0;
	for (let i = 0; i < tweet_array.length; i++) {
		if (tweet_array[i].activityType == longest_avg_dist_activity) {
			if (tweet_array[i].time.getDay() <= 4) {
				weekday_count += 1;
				weekday_dist += tweet_array[i].distance;
			}
			else {
				weekend_count += 1;
				weekend_dist += tweet_array[i].distance;
			}
		}
	}

	let tendency_period = ((weekday_dist / weekday_count > weekend_dist / weekend_count) 
		? "weekdays" : "weekends");

	// Update all span information in html
	document.getElementById('numberActivities').innerText = activity_map.size;
	document.getElementById('firstMost').innerText = top_activity[0];
	document.getElementById('secondMost').innerText = top_activity[1];
	document.getElementById('thirdMost').innerText = top_activity[2];

	document.getElementById('longestActivityType').innerText = longest_avg_dist_activity;
	document.getElementById('shortestActivityType').innerText = shortest_avg_dist_activity;
	document.getElementById('weekdayOrWeekendLonger').innerText = tendency_period;

	// Activity visualization graph
	let activity_vis_data = [];
	for (let i = 0; i < tweet_array.length; i++) {
		activity_vis_data.push({"type": tweet_array[i].activityType});
	}
	
	activity_vis_spec = {
 		"$schema": "https://vega.github.io/schema/vega-lite/v5.json",
  		"description": "A simple bar chart with embedded data.",
  		"data": {
    		"values": activity_vis_data,
  		},
  		"mark": "bar",
  		"encoding": {
    		"x": {
				"field": "type",
				"type": "nominal",
				"axis": {'title': "Activities"}
			},
    		"y": {
				"aggregate": "count",
				"axis": {'title': "Count"}
			}
  		}	
	};
	vegaEmbed('#activityVis', activity_vis_spec, {actions:false});

	// Dot plots of tweet activities distance by days of week and colored by activity types
	let week_days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
	let activity_dist_data = [];
	for (let i = 0; i < tweet_array.length; i++) {
		if (tweet_array[i].activityType == top_activity[0] || 
			tweet_array[i].activityType == top_activity[1] ||
			tweet_array[i].activityType == top_activity[2]
		) {
				activity_dist_data.push({
					"day": week_days[tweet_array[i].time.getDay()],
					"dist": tweet_array[i].distance,
					"type": tweet_array[i].activityType
				});
		}
	}

	activity_dist_spec = {
		"$schema": "https://vega.github.io/schema/vega-lite/v5.json",
  		"description": "A simple dot graph about activity distance.",
  		"data": {
    		"values": activity_dist_data,
  		},
		"mark": "point",
		"width": 200,
		"encoding": {
			"x": {
				"field": "day",
				"type": "nominal",
				"sort": ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
				"axis": {'title': "Days of Week"}
			},
   	 		"y": {
				"field": "dist",
				"type": "quantitative",
				"axis": {'title': "Distance"}
			},
    		"color": {
				"field": "type"
			}
		}
	};
	vegaEmbed('#distanceVis', activity_dist_spec, {actions:false});
	vegaEmbed('#distanceVisAggregated', activity_vis_spec, {actions:false});

}

// Set up switch graph button
function setUpButton() {
	// Graph switching button
	let message_num = 0;
	let button_message = ["Show means", "Show all activities"];

	let switch_button = document.getElementById('aggregate');
	switch_button.onclick = () => {
		message_num = 1 - message_num;
		switch_button.innerText = button_message[message_num];
	}
}


//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets).then(setUpButton);
});