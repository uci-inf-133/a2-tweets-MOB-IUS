class Tweet {
	private text:string;
	time:Date;

	constructor(tweet_text:string, tweet_time:string) {
        this.text = tweet_text;
		this.time = new Date(tweet_time);//, "ddd MMM D HH:mm:ss Z YYYY"
	}

	//returns either 'live_event', 'achievement', 'completed_event', or 'miscellaneous'
    get source():string {
        if (this.text.startsWith("Just completed") || 
            this.text.startsWith("Just posted")) {
                return "completed";
        }
        else if (this.text.startsWith("Watch my")) {
            return "live";
        }
        else if (this.text.startsWith("Achieved") &&
            this.text.includes("record")) {
                return "achievement";
        }
        else {
            return "miscellaneous";
        }
    }

    //filter parts of any content written by the person tweeting.
    get writtenText():string {
        let personText:string = this.text;
        let indexOfLink:number = personText.indexOf("https");
        personText = personText.substring(0, indexOfLink);

        let indexOfPersonText:number;
        indexOfPersonText = personText.indexOf("-");

        if (indexOfPersonText != -1) {
            indexOfPersonText += 2;
            return personText.substring(indexOfPersonText);
        }
        else {
            return "";
        }
    }

    get written():boolean {
        if (this.writtenText.length == 0) {
            return false;
        }
        else {
            return true;
        }
    }

    get activityType():string {
        if (this.source != 'completed_event') {
            return "unknown";
        }
        //TODO: parse the activity type from the text of the tweet
        return "";
    }

    get distance():number {
        if(this.source != 'completed_event') {
            return 0;
        }
        //TODO: prase the distance from the text of the tweet
        return 0;
    }

    getHTMLTableRow(rowNumber:number):string {
        //TODO: return a table row which summarizes the tweet with a clickable link to the RunKeeper activity
        return "<tr></tr>";
    }
}