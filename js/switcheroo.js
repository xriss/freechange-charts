

var switcheroo=exports;



let jquery=require("jquery")
let $=jquery

let dflat=require("d-portal/dflat/js/dflat.js")


switcheroo.got_files = false;

switcheroo.act_count=0
switcheroo.org_count=0

switcheroo.data      = false;
switcheroo.data_json = false;
switcheroo.data_xml  = false;
switcheroo.data_csv  = false;
switcheroo.data_html = false;


// call at page load
switcheroo.start = function()
{
	// make sure the page has finished loading
	$(function(){
		
		console.log("Starting IATIswitcheroo v0.2")

		switcheroo.fixup()

	})
}



// get the file data
switcheroo.load=function()
{
	if( switcheroo.got_files )
	{
		let f = switcheroo.got_files[0];
		var reader = new FileReader();
		reader.onload = (function(theFile) {
			return function(e) {

				switcheroo.parse( e.target.result )

			};
		})(f);
		reader.readAsText(f);
	}
	switcheroo.got_files=false
}

// get the file data
switcheroo.parse=function(data)
{
	let json=false

	// json
	try{
		json=JSON.parse(data)
	}catch(e){}
	
	// xml
	if(!json)
	{
		try{
			json=dflat.xml_to_xson(data)
		}catch(e){}
	}

	// csv
	if(!json)
	{
		try{
			json=dflat.xsv_to_xson(data)
		}catch(e){}
	}
	
	switcheroo.data=json || {}
	
	switcheroo.convert()
	
	switcheroo.fixup_download()

}

// convert the global data
switcheroo.convert=function()
{
	let x=switcheroo.data
	
	if( x && x["/iati-activities/iati-activity"] )
	{
		switcheroo.act_count=x["/iati-activities/iati-activity"].length
	}
	else
	{
		switcheroo.act_count=0
	}

	if( x && x["/iati-organisations/iati-organisation"] )
	{
		switcheroo.org_count=x["/iati-organisations/iati-organisation"].length
	}
	else
	{
		switcheroo.org_count=0
	}
	
	console.log("acts : "+switcheroo.act_count)
	console.log("orgs : "+switcheroo.org_count)
	
	if( switcheroo.act_count + switcheroo.org_count > 0 ) // we have some data so convert it
	{ 
		dflat.clean(x) // clean up the data
		switcheroo.data_json=dflat.xson_to_string(x)
		switcheroo.data_xml=dflat.xson_to_xml(x)
		switcheroo.data_csv=dflat.xson_to_xsv(x)
		switcheroo.data_html=dflat.xson_to_html(x)
	}
	else
	{
		switcheroo.data = false;
		switcheroo.data_json = false;
		switcheroo.data_xml  = false;
		switcheroo.data_csv  = false;
		switcheroo.data_html = false;
	}

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
		switcheroo.got_files = e.originalEvent.dataTransfer.files;
		switcheroo.load()
	});

	$("#switcheroo_file").on('change', function(e)
	{
		switcheroo.got_files = e.target.files;
		switcheroo.load()
	})

	switcheroo.fixup_download()
}

switcheroo.fixup_download=function()
{

	if(switcheroo.data)
	{
		$("#switcheroo_html").show()
		$("#switcheroo_html").attr('href', 'data:text/html;charset=utf-8,' + encodeURIComponent(switcheroo.data_html) )
		$("#switcheroo_html").attr('download', "switcheroo.html")

		$("#switcheroo_xml").show()
		$("#switcheroo_xml").attr('href', 'data:text/xml;charset=utf-8,' + encodeURIComponent(switcheroo.data_xml))
		$("#switcheroo_xml").attr('download', "switcheroo.xml")

		$("#switcheroo_json").show()
		$("#switcheroo_json").attr('href', 'data:application/json;charset=utf-8,' + encodeURIComponent(switcheroo.data_json))
		$("#switcheroo_json").attr('download', "switcheroo.json")

		$("#switcheroo_csv").show()
		$("#switcheroo_csv").attr('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent( switcheroo.data_csv ))
		$("#switcheroo_csv").attr('download', "switcheroo.csv")

	}
	else
	{
		$("#switcheroo_html").hide()
		$("#switcheroo_xml").hide()
		$("#switcheroo_json").hide()
		$("#switcheroo_csv").hide()
	}

}

