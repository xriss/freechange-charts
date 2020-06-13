

var switcheroo=exports;



let jquery=require("jquery")
let $=jquery

let dflat=require("d-portal/dflat/js/dflat.js")


switcheroo.got_files = false;


// call at page load
switcheroo.start = function()
{
	// make sure the page has finished loading
	$(function(){
		
		console.log("Starting IATIswitcheroo")

		switcheroo.fixup()

	})
}



// get the file data
switcheroo.process=function()
{
	if( switcheroo.got_files )
	{
		let f = switcheroo.got_files[0];
		var reader = new FileReader();
		reader.onload = (function(theFile) {
			return function(e) {

				console.log( e.target.result )

			};
		})(f);
		reader.readAsText(f);
	}
	switcheroo.got_files=false
}


// inject our code into the html
switcheroo.fixup=function()
{

	let $box=$("#switcheroo_box")
	
	$box.on('drag dragstart dragend dragover dragenter dragleave drop', function(e) {
		e.preventDefault();
		e.stopPropagation();
	})
	.on('dragover dragenter', function() {
		$box.addClass('is-dragover');
	})
	.on('dragleave dragend drop', function() {
		$box.removeClass('is-dragover');
	})
	.on('drop', function(e) {
		console.log(e)
		switcheroo.got_files = e.originalEvent.dataTransfer.files;
		switcheroo.process()
	});

	$("#switcheroo_file").on('change', function(e)
	{
		switcheroo.got_files = e.target.files;
		switcheroo.process()
	})

}
