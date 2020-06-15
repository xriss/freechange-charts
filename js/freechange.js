

var freechange=exports;

let path=require("path")

let jquery=require("jquery")
let $=jquery

let freechange_module=require("freechange")



// call at page load
freechange.start = function()
{
	// make sure the page has finished loading
	$(function(){
		
		console.log("Starting freechange v0.3")

	})
}

