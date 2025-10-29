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
        // Edge Case
        if (this.source != 'completed') {
            return "unknown";
        }

        // Get activity type
        let indexOfDistUnit:number = this.text.indexOf("km");
        if (indexOfDistUnit == -1) {
            indexOfDistUnit = this.text.indexOf("mi");
        }

        if (indexOfDistUnit == -1) {
            return "unknown";
        }
        else {
            let activityStr:string = this.text.substring(indexOfDistUnit+3);
            activityStr = activityStr.substring(0, activityStr.indexOf(" "));
            return activityStr;
        }
    }

    get distance():number {
        // Edge Case
        if(this.source != 'completed') {
            return 0;
        }
        
        // Get activity distance
        let isInKm:boolean = false;
        let indexOfDistUnit:number = this.text.indexOf("km");
        if (indexOfDistUnit == -1) {
            indexOfDistUnit = this.text.indexOf("mi");
        }
        else {
            isInKm = true;
        }

        if (indexOfDistUnit == -1) {
            return 0;
        }
        else {
            let activityDistStr:string = this.text.substring(0, indexOfDistUnit-1);
            activityDistStr = activityDistStr.substring(activityDistStr.indexOf("a")+1);

            return (isInKm ? Number(activityDistStr)*0.621371 : Number(activityDistStr));
        }
    }

    getHTMLTableRow(rowNumber:number):string {
        //TODO: return a table row which summarizes the tweet with a clickable link to the RunKeeper activity
        return "<tr></tr>";
    }
}