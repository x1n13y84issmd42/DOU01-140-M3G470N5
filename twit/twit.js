var Twit = require('twit');

var	io = require('socket.io').listen(process.env.PORT || 5051);

io.configure(function () { 
 	io.set("transports", ["xhr-polling"]); 
	io.set("polling duration", 10);
});
/*
var	T = new Twit({
		  consumer_key:         'AfSCr47qVaiTvjXSzmXA'
		, consumer_secret:      'qzLT8Yp7iTMhk3WvyKTIK4qrTdJgF87LVA2JpIWRyu0'
		, access_token:         '172371705-SXoHmG3PXJ5anxUto2FblfHyomROjdeaowP2pPfy'
		, access_token_secret:  'GDepkGRE3lctnI6ALx8MbKeCvWJ4QICLtVoWdw571U'
	});
*/
var	T = new Twit({
		  consumer_key:         'l5z7NIAbLNwqYNC6L3FZA'
		, consumer_secret:      'jxYxJNnj4VlShIyQ6xtyufhXU4YY3T7n3VsXY4U'
		, access_token:         '83815996-wdFgKPMmHuuwqcdv7kotExLRh7iYOINP6I2WdcVVs'
		, access_token_secret:  'T1PiQ2mddLfcoCGPyhPwJb1o3u5idenCBwBFPOEo'
	});

//debug for IO
//io.set('log level', 2);

Array.prototype.unique =
  function() {
    var a = [];
    var l = this.length;
    for(var i=0; i<l; i++) {
      for(var j=i+1; j<l; j++) {
        // If this[i] is found later in the array
        if (this[i] === this[j])
          j = ++i;
      }
      a.push(this[i]);
    }
    return a;
  };



var tweet;
var countriesTrack = "United States,USA,Brasil,United Kingdom,UK,Indonesia,Turkey,Spain,France,Mexico,Italy,Chile,Russia,China,Canada,Malaysia,Germany,Ireland,Ukraine,Japan,Sweden,Japan,tweetepicwar,tweetnuclearbomb,douwar";
var countries = countriesTrack.split(',');
var specialWordsPattern = "(tweetepicwar|tweetnuclearbomb|douwar)+";

io.sockets.on('connection', function (socket) {
	//создаем стрим связи с твиттером
var stream = T.stream('statuses/filter', { track: countriesTrack })

	stream.on('tweet', function (tweet){

		var from = null;
		var to = [];

		var stringToSearch = tweet.text;

		var rePat = '(' + countries.join('|') + ')+';
		var re = new RegExp(rePat, 'ig');

		var match;
		while( (match = re.exec(stringToSearch)) != null)
		{
			to.push( match[0].toLowerCase() );
		}

		to = to.unique();

		if(tweet.place != null)
		{
			from = tweet.place.country;

		}
		else if(tweet.user.location != null)
		{

			var location = tweet.user.location;
			var rePat = '(' + countries.join('|') + ')+';

			var re = new RegExp(rePat, 'ig');
			var country = null;
			var loc;
			var matches = []
			while((loc = re.exec(location)) != null )
			{
				country = loc[0].toLowerCase();
				break;
			}


			from = country;

		}
		else if(tweet.user.time_zone != null)
		{
			var time_zone = tweet.user.time_zone;

			
			var tzRE = new RegExp(rePat, 'ig');
			var loc;
			while((loc = tzRE.exec(time_zone)) != null )
			{
				from = loc[0].toLowerCase();
				break;
			}
		}
		if(from != null)
		{
			var tags = CheckSpecialTags(tweet.text);
			var response = {from: from, to: to, special:tags};
			console.log(response);
			socket.broadcast.emit('tweet', response);
			socket.emit('tweet', response);
		}
	});

});

function CheckSpecialTags(what)
{
	var matches = [];
	var match;
	var re = new RegExp(specialWordsPattern, 'ig');
	while((match = re.exec(what)) != null)
	{
		matches.push(match[0]);
	}
	return matches;

}