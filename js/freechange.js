

var freechange=exports;

let path=require("path")

let jquery=require("jquery")
let $=jquery


let Chartist=require("chartist")

let freechange_module=require("freechange")

let freechange_day=require("freechange/json/usd_to_xxx_by_day.json")
let freechange_month=require("freechange/json/usd_to_xxx_by_month.json")
let freechange_year=require("freechange/json/usd_to_xxx_by_year.json")

let currencies={}

for( let year in freechange_year )
{
	for( let currency in freechange_year[year] )
	{
		currencies[currency]=true
	}
}
let currency_list=[]
for( let currency in currencies )
{
	currency_list.push(currency)
}
currency_list.sort()

//console.log(currency_list)

// call at page load
freechange.start = function()
{
	// make sure the page has finished loading
	$(function(){
		
		console.log("Starting freechange v0.1")
		
		freechange.fixup()

	})
}


freechange.fixup=function(){
	
	$("#freechange-currency-from,#freechange-currency-into").empty().each(function(idx)
	{
		for(let currency of currency_list)
		{
			$(this).append($('<option value="'+currency+'">'+currency+'</option>'))
		}
	})

	$("#freechange-currency-from").val('GBP');
	$("#freechange-currency-into").val('USD');
	
	freechange.draw_graphs()

}


freechange.draw_graphs=function(){
	
	let chart_options={
		fullWidth: true,
		chartPadding: {
			right: 10
		},
		lineSmooth: Chartist.Interpolation.cardinal({
			fillHoles: true,
		}),
		low: 0
	}

	let day_series=[]
	let month_series=[]
	let year_series=[]

	let currency_from = $("#freechange-currency-from").val();
	let currency_into = $("#freechange-currency-into").val();

	
	let vs=undefined
	
	vs=[]
	day_series.push(vs)
	for( let date in freechange_day )
	{
		let tab=freechange_day[date]
		if( tab[currency_from] && tab[currency_into] ) // must exist and not be 0
		{
			let value= tab[currency_into] / tab[currency_from]
			let time= (new Date( date+"T00:00:00.000Z" )).getTime() / 1000
			vs.push({x:time,y:value})
		}
	}
	vs.sort(function(a,b){return a.x-b.x})

	vs=[]
	month_series.push(vs)
	for( let date in freechange_month )
	{
		let tab=freechange_month[date]
		if( tab[currency_from] && tab[currency_into] ) // must exist and not be 0
		{
			let value= tab[currency_into] / tab[currency_from]
			let time= (new Date( date+"-01"+"T00:00:00.000Z" )).getTime() / 1000
			vs.push({x:time,y:value})
		}
	}
	vs.sort(function(a,b){return a.x-b.x})


	vs=[]
	year_series.push(vs)
	for( let date in freechange_year )
	{
		let tab=freechange_year[date]
		if( tab[currency_from] && tab[currency_into] ) // must exist and not be 0
		{
			let value= tab[currency_into] / tab[currency_from]
			let time= (new Date( date+"-01-01"+"T00:00:00.000Z" )).getTime() / 1000
			vs.push({x:time,y:value})
		}
	}
	vs.sort(function(a,b){return a.x-b.x})


	$("#freechange-chart-day").empty().each(function(idx)
	{
		var chart = new Chartist.Line( this, {
		  series: day_series,
		}, chart_options );

	})

	$("#freechange-chart-month").empty().each(function(idx)
	{
		var chart = new Chartist.Line( this, {
		  series: month_series,
		}, chart_options );

	})

	$("#freechange-chart-year").empty().each(function(idx)
	{
		var chart = new Chartist.Line( this, {
		  series: year_series,
		}, chart_options );

	})
}
