var R;
var myCountry = 'UA';
var xCities = {};
var xCountries = [];
Raphael('world', function () {
	var r = this;
	R = this;
	var hue = 66;

	x = 310, y = 180, radii = 150;

	r.rect(0, 0, 1000, 400, 10).attr({
				stroke: "none",
				fill: "90-#000-#330000"
			});

	for (var country in worldmap.shapes)
	{



		var opacity = 0.5;
		var blurStrentgh = 3;
		var opacityStep = 0.5 / blurStrentgh;
		var widthStep = 4;
		var width = 2

		for(var bI=blurStrentgh; bI > 0; bI--)
		{
			r.path(worldmap.shapes[country]).attr({
			stroke: "#fff",
			"stroke-width":width,
//				fill: "#220000",
			"stroke-opacity": opacity});

			opacity -= opacityStep;
			width += widthStep;
		}
	}

	R.setStart();

	for (var country in worldmap.shapes) {
		//xCountries.push(worldmap.names[country]);
		var xCountry = new World.Country(worldmap.names[country], worldmap.shapes[country]);
		xCountry.shortName = country;
		xCountry.popInitial = FX.Random(10000000, 200000000);
		xCountry.pop = xCountry.popInitial;

		xCountry.shape = r.path(worldmap.shapes[country]).attr({
			stroke: "#fff",
			"stroke-width":1,
			fill: "#440000",
			"stroke-opacity": 0.75,
			"stroke-miterlimit": 2,
			"stroke-dasharray":"."
		}).data('GeoData', xCountry);

		for(var xcI in World.tmp.cities[country])
		{
			var city = World.tmp.cities[country][xcI];
		//	console.log(city);
		//	R.circle(city.x, city.y, 1.5).attr({fill:"#ff0", stroke:"none"});
			var w = 6;
			R.rect(city.x - w / 2, city.y - w / 2, w, w)
			.transform('r45,'+city.x+','+city.y+'s1,1,'+city,x+'')
			.attr({fill:"#FF0", opacity:0.3});

			R.circle(city.x, city.y, 1).attr({fill:"#ff0", stroke:"none"});
		}

		World.countries[country] = xCountry;
	}

	World.map = R.setFinish();

	World.map.click(function(e){
		var data = this.data('GeoData');

		var from = World.tmp.cities[myCountry];
		var to = World.tmp.cities[data.shortName];

		if (myCountry == data.shortName)
		{
			from = from[FX.Random(0, from.length)];
			var healed = World.countries[myCountry].HealPercent(FX.Random(5, 10) / 100);
			var text = R.text(from.x, from.y - 40, healed + ' RESURRECTED').attr({
				"font-family":"Orbitron",
				"font-size":12,
				"font-weight":900,
			//	"stroke":"#fff",
				"fill":"#0f0"
			}).animate({opacity:0, "font-size":32}, 2000);

			setTimeout(function(){text.remove()}, 2000);
			return;
		}

		var country = World.countries[data.shortName];
	//	color = FX.Random(0, 255) + ',' + FX.Random(0, 255) + ',' + FX.Random(0, 255);
		color = "255, 255, 100";

		var xto = to[FX.Random(0, to.length)];

		FX.EpicAttackTrace(from[FX.Random(0, from.length)], xto, 'rgb(' + color + ')', function(){
			var died = country.DamagePercent(FX.Random(30, 60) / 100);

			var text = R.text(xto.x, xto.y - 40, died + ' KILLED').attr({
				"font-family":"Orbitron",
				"font-size":16,
				"font-weight":900,
			//	"stroke":"#fff",
				"fill":"#fff"
			}).animate({opacity:0, "font-size":24}, 2000);

			setTimeout(function(){text.remove()}, 2000);
		});

		// console.log(e);

		// if(!xCities.hasOwnProperty(data.shortName
		// 	xCities[data.shortName] = [];

		// xCities[data.shortName].push(new World.City(e.offsetX, e.offsetY));

		// R.circle(e.offsetX, e.offsetY, 3).attr({fill:"#ff0", stroke:"none"});
	});
/*
	setInterval(function(){

	}, 100);*/
});
//socketIO connection
$(document).ready(function(){
	socket = io.connect('http://140.demo:5051');
	socket.on('connect', function (data) {
		//$("#status").append("<p>Connected</p>");
	});

	// tweet = { from: <countryName>, to: [<array Countries>]}
	socket.on('tweet', function(tweet){
	//	color = FX.Random(0, 255) + ',' + FX.Random(0, 255) + ',' + FX.Random(0, 255);
		color = "255, 255, 100";
		var fromCountry = World.tmp.cities[FX.PickKeyByValue(worldmap.names, tweet.from)];
		for(var i = 0; i < tweet.to.length; i++)
		{
			if(!tweet.to || tweet.to.length == 0)
				return;
			var countryAbbr = FX.PickKeyByValue(worldmap.names, tweet.to[i]);
			var toCountry = World.tmp.cities[countryAbbr];

			var toCountryEpicObject = World.countries[countryAbbr];

			if(fromCountry != undefined && fromCountry != null && toCountry != undefined && toCountry != null)
			{
				var fromCoords = fromCountry[FX.Random(0, fromCountry.length)];
				var toCoords = toCountry[FX.Random(0, toCountry.length)];

				if(fromCoords.x == toCoords.x && fromCoords.y == toCoords.y)
				{// ХИЛ СЕЛФ
					var healed = toCountryEpicObject.HealPercent(FX.Random(5, 10) / 100);
					var text = R.text(toCoords.x, toCoords.y - 40, healed + ' RESURRECTED').attr({
						"font-family":"Orbitron",
						"font-size":14,
						"font-weight":900,
					//	"stroke":"#fff",
						"fill":"#f90"
					}).animate({opacity:0, "font-size":24}, 2000);

					setTimeout(function(){text.remove()}, 2000);
					continue;
				}

				var specials = tweet.special;
				if(specials.length > 0)
				{
					console.log('spec');
					console.log(specials);//FOR SPECIAL TAGS
					for(var sI in specials)
					{
						FX.EpicAttackTrace(
							fromCoords, toCoords,
							'rgb(' + color + ')',
							function(){
							//	toCountryEpicObject.Damage(FX.Random(100000, 500000))
								var died = toCountryEpicObject.DamagePercent(FX.Random(30, 60) / 100)

								var text = R.text(toCoords.x, toCoords.y - 40, died + ' KILLED').attr({
									"font-family":"Orbitron",
									"font-size":14,
									"font-weight":900,
								//	"stroke":"#fff",
									"fill":"#fff"
								}).animate({opacity:0, "font-size":24}, 2000);

								setTimeout(function(){text.remove()}, 2000);
							}
						);
					}
				}
				//console.log('toCountry');
				//console.log(toCountry);
				

			//	console.log('ATTACK:-- ' + 'from:['+tweet.from+']['+fromCoords.x + ';' + fromCoords.y + '] to:['+toCountryEpicObject.name+']['+toCoords.x+';'+toCoords.y+']');

				FX.AttackTrace(
					fromCoords, toCoords,
					'rgb(' + color + ')',
					function(){
					//	toCountryEpicObject.Damage(FX.Random(100000, 500000))
						var died = toCountryEpicObject.DamagePercent(FX.Random(5, 10) / 100)

						var text = R.text(toCoords.x, toCoords.y - 40, died + ' KILLED').attr({
							"font-family":"Orbitron",
							"font-size":14,
							"font-weight":900,
						//	"stroke":"#fff",
							"fill":"#fff"
						}).animate({opacity:0, "font-size":24}, 2000);

						setTimeout(function(){text.remove()}, 2000);
					}
				);
			}


		}
	});
});