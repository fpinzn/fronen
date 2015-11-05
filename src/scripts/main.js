var Vivus = require('vivus')
var d3 = require('d3')
var textures = require('textures')
var inlineSVG = require('inline-svg')


/*
* Background texture
*/

var svg = d3.select("#texture").insert("svg").attr('id', 'body-svg')



var ticks = 0
d3.timer(function(){
  ticks = ticks > 10 ? 0 : ticks + 1
})

var t = textures.paths().d("waves").size(25).strokeWidth(10)

svg.call(t)

svg.append("rect")
  .style("fill", t.url())
  .attr( { 'x': 0, 'y': 0, 'width': '100%', height:'100%' } )

/*
* SVG line animation.
*/
inlineSVG.init({
	svgSelector: 'img',
	initClass: 'js-inlinesvg', // class added to <html>
}, function(selector){
  console.log('inlined', selector)
   new Vivus('microscope', {duration: 200, type: 'oneByOne'}, function(){
     console.log('dones')
   })
});
