var skanaar = skanaar || {}

skanaar.Svg = function(svg, callbacks){
	//var config = getConfig()
	//this.config = null;
	var mousePos = { x: 0, y: 0 }
	var twopi = 2*3.1416
	var svg =parent.SVG("svg").size("100%","100%");

	var ctx = {
		config: null,
		dash: [],
		fillStyle: null,
		textAlign: "center",
		lineWidth: 1,


		measureText: function(s){
			var height= this.config.fontSize
			var ttext = svg.text(s).attr({ "text-anchor":ctx.textAlign, "font-family": ctx.config.font,"font-size":ctx.config.fontSize})
			var width = ttext.length()
			ttext.remove()
			return {width: width, height: height}
		},
		save: function(){

		},
		scale: function(sx, sy){
			//svg.transform({scaleX:sx,scaleY:sy})
			//ctx.s = {x:sx,y:sy}
			svg.each(function(i, children) {
				this.transform({scaleX:sx,scaleY:sy})
			})
		},
		translate: function(dx, dy){
			//svg.dmove(dx,dy)
			//ctx.i = {x:dx,y:dy}
			//svg.each(function(i, children) {this.dmove(dx,dy)})
			svg.each(function(i, children) {
				this.transform({x:dx,y:dy})
			})
		},
		fillText: function(text, x, y){
			console.info("text: "+text)
			var out = svg.text(text).move(x,y).attr({ "text-anchor":ctx.textAlign, "font-family": ctx.config.font,"font-size":ctx.config.fontSize})
			

		},
		setLineDash: function(array){
			this.dash = array.join(",");
			//console.info(array)
		},
		fillRect: function(x, y, width, height){
			svg.rect(width,height).move(x,y).attr({fill:ctx.fillStyle,stroke:ctx.config.stroke,"stroke-width":ctx.lineWidth})
		},
		strokeRect: function(x, y, width, height){
			svg.rect(width,height).move(x,y).attr({stroke:"#000",fill:"none"})
		},
		restore: function(){

		}
		,
		stroke: function(el){
			el.attr({stroke:ctx.config.stroke,"stroke-width":ctx.lineWidth})
			return el
		},
		fill: function (el){
			el.attr({fill:ctx.fillStyle})
			return el
		}

		

	}

	var clear = function(){
		svg.clear()
	}

	var tracePath =  function(path, offset, s, close){ //[{x:x, y:yDivider}, {x:x+node.width, y:yDivider}]
			s = s === undefined ? 1 : s
			offset = offset || {x:0, y:0}
			//ctx.beginPath()
			var path1 = "M"+offset.x + s*path[0].x+","+offset.y + s*path[0].y
			//ctx.moveTo(offset.x + s*path[0].x, offset.y + s*path[0].y)
			for(var i=1, len=path.length; i<len; i++)
				path1 = path1 +"L"+offset.x + s*path[i].x+","+ offset.y + s*path[i].y
			if (close) path1 = path1 +"z"
			console.info("path: "+path1)
			return svg.path(path1).attr({fill:"none"})
		}

	return {
		ctx: ctx,
		config: null,
		svg: svg,
		clear: function(){
			svg.clear()
		},
		circuit: function(path, offset, s){
			return tracePath(path, offset, s, true);
		},
		
		path:tracePath,
		circle: function (x, y, r){
			if (arguments.length === 2)
				return svg.circle(2*r).move(x.x-r,x.y-r).attr({fill:ctx.fillStyle,stroke:ctx.config.stroke,"stroke-width":ctx.lineWidth})
			else	
				return svg.circle(2*r).move(x-r, y-r).attr({fill:ctx.fillStyle,stroke:ctx.config.stroke,"stroke-width":ctx.lineWidth})
		},
		ellipse: function (center, rx, ry, start, stop){
			if (start === undefined) start = 0
			if (stop === undefined) stop = twopi
			ctx.translate(center.x, center.y)
			return svg.ellipse(rx,ry).move(center)
		},
		polarToCartesian: function(centerX, centerY, radius, angleInDegrees) {
		  var angleInRadians = (angleInDegrees-90) * Math.PI / 180.0;
		  return {
		    x: centerX + (radius * Math.cos(angleInRadians)),
		    y: centerY + (radius * Math.sin(angleInRadians))
		  };
		},
		arc: function (x, y, radius, startAngle, endAngle){
			var start = this.polarToCartesian(x, y, radius, startAngle);
		    var end = this.polarToCartesian(x, y, radius, endAngle);
		    var arcSweep = endAngle - startAngle <= 180 ? "1" : "0";
		    var d = [
		        "M", start.x, start.y, 
		        "A", radius, radius, 0, arcSweep, 0, end.x, end.y
		    ].join(" ");
			return svg.path(d)
		},
		roundRect: function(x, y, w, h, r){
			return svg.rect(w,h).attr({rx:r,ry:r}).move(x,y)
		}
	}

}

/*
skanaar.Svg = function (svg, callbacks){
	var ctx = svg.getContext('2d');
	var mousePos = { x: 0, y: 0 }
	var twopi = 2*3.1416

	function mouseEventToPos(event){
		var e = svg
		return {
			x: event.clientX - e.getBoundingClientRect().left - e.clientLeft + e.scrollLeft,
			y: event.clientY - e.getBoundingClientRect().top - e.clientTop + e.scrollTop
		}
	}
	
	svg.addEventListener("mousedown", function (event){
		if (callbacks.mousedown) callbacks.mousedown(mouseEventToPos(event))
	})
	
	svg.addEventListener("mouseup", function (event){
		if (callbacks.mouseup) callbacks.mouseup(mouseEventToPos(event))
	})

	svg.addEventListener("mousemove", function (event){
		mousePos = mouseEventToPos(event)
		if (callbacks.mousemove) callbacks.mousemove(mouseEventToPos(event))
	})

	var chainable = {
		stroke: function (){
			ctx.stroke()
			return chainable
		},
		fill: function (){
			ctx.fill()
			return chainable
		}
	}

	function color255(r, g, b, a){
		var optionalAlpha = a === undefined ? 1 : a
		var comps = [Math.floor(r), Math.floor(g), Math.floor(b), optionalAlpha]
		return 'rgba('+ comps.join() +')'
	}

	function tracePath(path, offset, s){
		s = s === undefined ? 1 : s
		offset = offset || {x:0, y:0}
		ctx.beginPath()
		ctx.moveTo(offset.x + s*path[0].x, offset.y + s*path[0].y)
		for(var i=1, len=path.length; i<len; i++)
			ctx.lineTo(offset.x + s*path[i].x, offset.y + s*path[i].y)
		return chainable
	}

	return {
		mousePos: function (){ return mousePos },
		width: function (){ return svg.width },
		height: function (){ return svg.height },
		ctx: ctx,
		background: function (r, g, b){
			ctx.fillStyle = color255(r, g, b)
			ctx.fillRect (0, 0, svg.width, svg.height)
		},
		clear: function (){
			ctx.clearRect(0, 0, svg.width, svg.height)
		},
		circle: function (x, y, r){
			ctx.beginPath()
			if (arguments.length === 2)
				ctx.arc(x.x, x.y, y, 0, twopi)
			else	
				ctx.arc(x, y, r, 0, twopi)
			return chainable
		},
		ellipse: function (center, rx, ry, start, stop){
			if (start === undefined) start = 0
			if (stop === undefined) stop = twopi
			ctx.beginPath()
			ctx.save()
			ctx.translate(center.x, center.y)
			ctx.scale(1, ry/rx)
			ctx.arc(0, 0, rx/2, start, stop)
			ctx.restore()
			return chainable
		},
		arc: function (x, y, r, start, stop){
			ctx.beginPath()
			ctx.moveTo(x,y)
			ctx.arc(x, y, r, start, stop)
			return chainable
		},
		roundRect: function (x, y, w, h, r){
			ctx.beginPath()
			ctx.moveTo(x+r, y)
			ctx.arcTo(x+w, y, x+w, y+r, r)
			ctx.lineTo(x+w, y+h-r)
			ctx.arcTo(x+w, y+h, x+w-r, y+h, r)
			ctx.lineTo(x+r, y+h)
			ctx.arcTo(x, y+h, x, y+h-r, r)
			ctx.lineTo(x, y+r)
			ctx.arcTo(x, y, x+r, y, r)
			ctx.closePath()
			return chainable
		},
		path: tracePath,
		circuit: function (path, offset, s){
			tracePath(path, offset, s)
			ctx.closePath()
			return chainable
		},
		colorNorm: function (r, g, b, a){
			return color255(255*r, 255*g, 255*b, a)
		},
		color255: color255,
		colorObjHSL: function (hue, sat, lit){
			function component(v){
				var x = Math.cos(6.283*v)/2 + 0.5
				return lit*(1-sat + sat*x*x)
			}
			return {
				r: component(hue),
				g: component(hue-1/3),
				b: component(hue+1/3)
			}
		},
		radialGradient: function (x, y, r1, r2, colors){
			var grad = ctx.createRadialGradient(x, y, r1, x, y, r2)
			for(var key in colors)
				if (colors.hasOwnProperty(key))
					grad.addColorStop(key, colors[key])
			return grad
		}
	}
}

*/