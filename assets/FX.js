// window.setInterval_old = window.setInterval;
// window.clearInterval_old = window.clearInterval;

// window.setInterval = function(callback, timeout)
// {
// 	var timer = setTimeout(function run() {
//     	timer = setTimeout(run, 2000);
//   	}, 2000);
// }

FX = {
	step: 0.1,
	hideFrom: 0.5,
	nubSteps: 20,
	timeouts: {
		attackTrace: 60,
		epicAttackTrace: 80,
		explosion: 100,
	},
	SetOptions: function(quality)
	{
		switch(quality)
		{
			case 1:
				FX.step = 0.2;
				FX.timeouts.attackTrace = 150;
				FX.nubSteps = 8;
				break;
			case 2:
				FX.step = 0.1;
				FX.timeouts.attackTrace = 60;
				FX.nubSteps = 16;
				break;
			case 3:
				FX.step = 0.05;
				FX.timeouts.attackTrace = 30;
				FX.nubSteps = 32;
				break;
		}
	}
};
/*
window.setInterval_old = window.setInterval;
window.clearInterval_old = window.clearInterval;

var handlers = {};
var gid = 0;

window.setInterval = function(handler, timeout)
{
	var id = gid;
	gid += FX.Random(0, 100);
	handlers[id] = handler;
	return id;
}

window.clearInterval = function(id)
{
	delete handlers[id]
	
//	handlers.splice(id, 1);
}

setInterval_old(function(){
	for(var hI in handlers)
		handlers[hI].call()
}, 100);*/

FX.AttackTrace = function(from, to, color, onDamage)
{
	var spline = new FX.Spline(from, to, color);
	 var spline2 = new FX.Spline(from, to, color);
	 var spline3 = new FX.Spline(from, to, color);

	 spline2.l.attr({stroke:"#FFF", "stroke-width":4, opacity:0.5});
	 //var rocket = new FX.Rocket('/images/1343538629_vegastrike.png', 30, 30);
	 //spline2.l.attr({stroke:"#FFF", "stroke-width":4, opacity:0.5});
	 var rocket = R.circle();
	 var rocket2 = R.circle();

	 var step = FX.step;
	    var t1 = 0;
	    var t2 = step;
	    var hideFrom = FX.hideFrom;

	    var s2t1 = step;

	    var onDamageCalled = false;

	    var interval = setInterval(function(){
     	if (t2 > hideFrom)
     	{
	      	t1 = t2 - hideFrom;
	    }

	    if(t2 >= 1)
	    {
	    	rocket.remove();
	    	rocket2.remove();
	    	FX.Explosion(to)//spline.endPoint);

	    	if(!onDamageCalled)
	    	{
	    		if(onDamage)
	    			onDamage();
	    		onDamageCalled = true;
	    	}
	    }

	    if (t1 > 1)
	    {
	    	spline.l.remove();
	      	spline2.l.remove();
	      	
	      	clearInterval(interval);
	      	return;
     	}

	    s2t1 = t2 / 4;

	    spline.Render(t1, t2 > 1 ? 1 : t2);
	    spline2.Render(s2t1, t2 > 1 ? 1 : t2);
		//var angle = Math.atan2((spline.prepEndPoint.y - spline.endPoint.y), (spline.prepEndPoint.x - spline.endPoint.x)) * 180 / Math.PI - 90;

		rocket.attr({
			'cx': spline.endPoint.x,
			'cy': spline.endPoint.y,
			'r':10,
			'fill':'#fff',
			'opacity':0.3,
			'stroke':'none'
		});

		rocket2.attr({
			'cx': spline.endPoint.x,
			'cy': spline.endPoint.y,
			'r':4,
			'fill':'#fff',
			'opacity':0.5,
			'stroke':'none'
		});

	    t2 += step;

    }, FX.timeouts.attackTrace);
};

FX.EpicAttackTrace = function(from, to, color, onDamage)
{
  var spline2 = new FX.Spline(from, to, color);
 var spline = new FX.Spline(from, to, color);
  var spline3 = new FX.Spline(from, to, color);

  spline.l.attr({stroke:"#fff", "stroke-width":2, opacity:0.75});
  spline2.l.attr({stroke:"#47F", "stroke-width":7, opacity:0.5});
  
  var rocket = R.circle();
  var rocket2 = R.circle();

  var step = FX.step;
 	var t1 = 0;
     var t2 = step;
     var hideFrom = FX.hideFrom;

     var s2t1 = step;

     var onDamageCalled = false;

     var interval = setInterval(function(){
      if (t2 > hideFrom)
      {
        t1 = t2 - hideFrom;
     }

     if(t2 >= 1)
     {
      rocket.remove();
      rocket2.remove();
      FX.Explosion(spline.endPoint);

      if(!onDamageCalled)
      {
       if(onDamage)
        onDamage();
       onDamageCalled = true;
      }
     }

     if (t1 >= 1)
     {
      spline.l.remove();
        spline2.l.remove();
        
        clearInterval(interval);
        return;
      }

     s2t1 = t2 / 4;

     spline2.Render(s2t1, t2 > 1 ? 1 : t2);
     spline.Render(t1, t2 > 1 ? 1 : t2);
	  var angle = Math.atan2((spline.prepEndPoint.y - spline.endPoint.y), (spline.prepEndPoint.x - spline.endPoint.x)) * 180 / Math.PI - 90;

	  rocket.attr({
	   'cx': spline.endPoint.x,
	   'cy': spline.endPoint.y,
	   'r':13,
	   'fill':'#47f',
	   'opacity':0.3,
	   'stroke':'none'
	  });

	  rocket2.attr({
	   'cx': spline.endPoint.x,
	   'cy': spline.endPoint.y,
	   'r':6,
	   'fill':'#fff',
	   'opacity':0.5,
	   'stroke':'none'
	  });

     t2 += step;

    }, FX.timeouts.epicAttackTrace);
};

FX.Explosion = function(where)
{
	var step = 1;
	var max = 5;
	var min = 1;
	var blurStrentgh = min;
	var blurs = null;
	var interval = setInterval(function(){
		var opacity = 0.5;
		var opacityStep = 0.9 / blurStrentgh;
		var widthStep = 3;
		var width = 3;
		var i = 0;

		if (blurs != null)
		{
			blurs.remove();
		}

		R.setStart();

		//for(var bI = blurStrentgh; bI > 0; bI--)
		{
			R.circle(where.x + FX.Random(-10, 10), where.y + FX.Random(-10, 10), FX.Random(3, 7)).attr({
				stroke: "#fff",
				"stroke-width": width,
				"stroke-opacity": opacity
			});

			opacity -= opacityStep;
			width += widthStep;
		}

		blurs = R.setFinish();

		blurStrentgh += step;

		if (blurStrentgh >= max)
		{
			step = -1;
		}
		if (blurStrentgh <= min)
		{
			//step = 1;
			blurs.remove();
			clearInterval(interval);
		}
	}, FX.timeouts.explosion);
};

FX.Spline = function(from, to, color)
{
	this.PrecomputePoints(from, to, FX.nubSteps);
	this.l = R.path();

	this.l.attr({
		stroke: color,
		"stroke-width": 1,
		"stroke-linecap":"round"
	});
}

FX.Spline.prototype.PrecomputePoints = function(from, to, numSteps)
{
	var angle = Math.atan((from.y - to.y) / (from.x - to.x)) * 180 / Math.PI - 90;
	var length = Math.sqrt(Math.pow(from.x - to.x, 2) + Math.pow(from.y - to.y, 2)) / 2;
	var sPoint = {
		x: from.x + (to.x - from.x) / 2 + length * Math.cos(angle * Math.PI / 180),
		y: from.y + (to.y - from.y) / 2 + length * Math.sin(angle * Math.PI / 180)
	};

	this.eps = 1 / numSteps;

	this.points = this.SplinePoints([from, sPoint, to], this.eps);
	this.startPoint = this.points[0];
	this.endPoint = this.points[0];
	this.prepEndPoint = this.points[0];
	this.path = this.GeneratePathData(this.points);
	this.length = Raphael.getTotalLength(this.path);
}

FX.Spline.prototype.Render = function(t1, t2)
{
	var path = Raphael.getSubpath(this.path, this.length * t1, this.length * t2);
	this.prepEndPoint = Raphael.getPointAtLength(this.path, this.length * (t2 - this.eps));
	this.endPoint = Raphael.getPointAtLength(this.path, this.length * t2);
	
	this.l.attr({
		path: path
	});
}

FX.Spline.prototype.GeneratePathData = function(points)
{
	var path = "M" + points[0].x + "," + points[0].y;

	for(var pI=1; pI<points.length; pI++)
		path += "L" + points[pI].x + ',' + points[pI].y;

	return path;
}

FX.Spline.prototype.SplinePoints = function(points, eps, maxT, minT)
{
	if (maxT == null)
	{
		maxT = 1;
	}

	if (minT == null)
	{
		minT = 0;
	}

	var ps = [];
	for (var t = minT; t <= maxT; t += eps)
	{
		ps.push(this.SplinePoint(points, t));
	}

	return ps;
}

FX.Spline.prototype.SplinePoint = function(points, t)
{
	while (points.length > 1)
	{
		points = this.SplineFunctionOo(points, t);
	}
	return points[0];
}

FX.Spline.prototype.SplineFunctionOo = function(points, t)
{
	var result = [];

	for (var i = 0; i < points.length - 1; i++)
	{
		result[i] = {
			x: (1 - t) * points[i].x + t * points[i + 1].x,
			y: (1 - t) * points[i].y + t * points[i + 1].y
		};
	}

	return result;
}

FX.Random = function(from, to)
{
	return Math.floor((Math.random() * to) + from);
};

FX.PickKeyByValue = function(array, value)
{
	for(var obj in array)
	{
		//console.log(typeof(array[obj]));
		if(typeof(array[obj]) == 'object')
		{
			for(var i = 0; i < array[obj].length; i++)
			{
				if(array[obj][i].toLowerCase() == value.toLowerCase())
				{
					return obj;
				}
			}
		}
		else
			if(array[obj].toLowerCase() == value.toLowerCase())
				return obj;
	}
};

Math.lerp = function(v1, v2, t)
{
	return (1 - t) * v1 + v2 * t;
}

Math.ptlerp = function(p1, p2, t)
{
	return {x:Math.lerp(p1.x, p2.x, t), y:Math.lerp(p1.y, p2.y, t)};
}