/*
	Author: Nemets Yury
	Site: www.sitehere.ru
*/

$(function() {
		var stage = $("#stage"),
			text = $("#text"),
			tx = $(".tx"),
			txOver = $(".txOver"),
			txOverContent = $(".txOver span"),
			star1 = $(".star1"),
			star2 = $(".star2"),
			star3 = $(".star3"),
			star4 = $(".star4"),
			handF1 = $(".handF1"),
			handF2 = $(".handF2"),
			handF3 = $(".handF3"),
			handF4 = $(".handF4"),
			handF5 = $(".handF5"),
			handF6 = $(".handF6"),
			handF7 = $(".handF7"),
			handF8 = $(".handF8");
			

		var tl = new TimelineMax();

		tl.from(stage, 1, {scale:"0"})
			.from(text, 1, {scaleX:"0",opacity:"0"})
			.from(tx, 1, {opacity:"0",ease:Back.easeOut})
			.from(star1, 1, {rotation:"-45deg", scale:"2", opacity:"0", top:"-=80%", left:"+=10%"}, 'starBottomTop')
			.from(star4, 1, {rotation:"45deg", scale:"2", opacity:"0", top:"+=80%", left:"-=10%"}, 'starBottomTop')
			.from(star2, 1, {opacity:"0", left:"-=10%"}, 'starLeftRight')
			.from(star3, 1, {opacity:"0", left:"+=10%"}, 'starLeftRight')
			.to(txOver, 0.6, {scaleY:"1",  ease:Back. easeOut.config( 1.7)})
			.to(txOver, 1.5, {top:"0",borderColor:"#515451",height:"100%", ease:Elastic. easeOut.config( 1, 0.3)})
			.from(handF1, 0.7, {scale:"0"})
			.from(handF2, 0.7, {scale:"0", delay:-0.2},'hands')
			.from(handF3, 0.7, {scale:"0", delay:-0.6})
			.from(handF4, 0.7, {scale:"0", delay:-0.2})
			.from(handF5, 0.7, {scale:"0", delay:-0.3},'hands')
			.from(handF6, 0.7, {scale:"0", delay:-0.5})
			.from(handF7, 0.7, {scale:"0", delay:-0.3},'hands')
			.from(handF8, 0.7, {scale:"0", delay:-0.5});
	});