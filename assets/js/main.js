var stage;
var fullScreenToggle;

// [B, I, N, G, O]
var lineColor = ["rgb(228,108,10)", "rgb(119,147,60)", "rgb(49,133,156)", "rgb(96,74,123)", "rgb(149,55,53)"];
var ballGradientLightColor = ["rgba(247, 182, 128,0.8)", "rgba(176, 204, 120,0.8)", "rgba(108, 201, 226,0.8)", "rgba(189, 158, 229,0.8)", "rgba(252, 131, 128,0.8)"];
var ballGradientDarkColor = ["rgba(228,108,10,0.8)", "rgba(135, 170, 63,0.8)", "rgba(84, 165, 188,0.8)", "rgba(151, 122, 186,0.8)", "rgba(216, 96, 93,0.8)"];
var ballTextColor = ["#7f3c06", "#4f6228", "#215968", "#403152", "#632523"];
var isFullScreen = false;

var themeColor = "#d1cc85";

function loadCSS() {		
	loadFonts({
		src: fonts,
		type: "fontcss"
	});
	return false;
}

function loadFonts(config) {
	var loader = new createjs.FontLoader(config, true);
	loader.addEventListener("complete", beginLoad);
	loader.load();
}

function init() {
	stage = new createjs.Stage("mainCanvas");
	createjs.Touch.enable(stage);
	allContainer = new createjs.Container();
	stage.addChild(allContainer);
	resize();
	window.addEventListener('resize', resize);
	stage.enableMouseOver();
	createjs.Ticker.addEventListener("tick", stage);
	loadCSS();
}

function beginLoad() {
		fullScreenToggle = new createjs.Container();
		changeFullScreenImg();
		var fullScreenUp=new createjs.Bitmap(fullScreenToggleImg1);
		fullScreenUp.scale = 0.6;
		fullScreenUp.x = 1225;
		fullScreenUp.y = 20;
		
		var fullScreenClicker = new createjs.Shape();
		fullScreenClicker.graphics.beginFill("rgba(191,191,191)");
		fullScreenClicker.graphics.drawRect(0,0,10,10);
		fullScreenClicker.alpha = 0;
		var fullScreenHit = new createjs.Shape();
		fullScreenHit.graphics.beginFill("#000").rect(0, 0, 30, 30);
		fullScreenClicker.hitArea = fullScreenHit;
		fullScreenClicker.x = 1225;
		fullScreenClicker.y = 20;
		fullScreenToggle.addChild(fullScreenUp,fullScreenClicker);
		fullScreenClicker.on("click", function(){goToFullScreen();changeFullScreenImg();});
		fullScreenClicker.on("mouseover", function(){fullScreenUp.image.src = fullScreenToggleImg2});
		fullScreenClicker.on("mouseout", function(){fullScreenUp.image.src = fullScreenToggleImg1});
		fullScreenClicker.cursor = "pointer";
		allContainer.addChild(fullScreenToggle);
		fullScreenToggle.alpha = 0;
	createjs.Tween.get(fullScreenToggle)
		.to({ alpha: 1}, 300, createjs.Ease.getPowInOut(2));
	
	var param = location.search;
	
	if (param == "?masterboard") {
		masterBoardSlider();	
	} else {
	titleSlider();
	}
}

function titleSlider() {

	if (typeof titleSlide === 'undefined') {

		titleSlide = new createjs.Container();
		allContainer.addChild(titleSlide);

		var rollerOverlay = new createjs.Bitmap("./assets/img/bingoRoller.svg");
		titleSlide.addChild(rollerOverlay);

		var titleBingo = titleSlide.addChild(new BaseText("B I N G O", "bold 135px 'Arya'", "#ce181e", "center"));
		var titleMasterBoard = titleSlide.addChild(new BaseText("Master Board", "italic 66px caladea", "#948a54", "center"));
		var titleCopyright = titleSlide.addChild(new BaseText("Version Web WIP 2018-05-07 ~ ©2011-2018 Tim's Slideshow Games", "13.5px Arial", "#000", "center"));
		
		titleCopyright.y = 694;	
		titleCopyright.createLink(function(){transitionOut(titleSlide);copyrightSlider();});
		titleBingo.y = 230;
		titleMasterBoard.y = 325;

		var titleSelection = new createjs.Container();
		titleSlide.addChild(titleSelection);

		var howToUse = titleSelection.addChild(new BaseText("How to Use", "50px Open Sans", "#376092"));
		var goToMasterBoard = titleSelection.addChild(new BaseText("Master Board", "50px Open Sans", "#376092"));
		goToMasterBoard.x = 350;
		howToUse.createLink(function(){transitionOut(titleSlide);howToUseSlider();},"#4297b7");
		goToMasterBoard.createLink(function(){transitionOut(titleSlide);masterBoardSlider();}, "#4297b7");

		titleSelection.y = 480;


		centerTextGroup(titleSelection);

		titleSlide.addChild(titleSelection);
		titleSlide.alpha = 0;
	}
	else {
		transitionIn(titleSlide);
	}

	titleSlide.alpha = 0;
	createjs.Tween.get(titleSlide)
		.to({ alpha: 1}, 300, createjs.Ease.getPowInOut(2));

}

function copyrightSlider() {

	if (typeof copyrightSlide === 'undefined') {
		var child = fullScreenToggle.clone(true);
		copyrightSlide = new createjs.Container();
		allContainer.addChild(copyrightSlide);
		var copyrightSlideHeader = copyrightSlide.addChild(new BaseText("About/Credits", "36px Open Sans", "#000", "center"));
		copyrightSlideHeader.y = 60;

		var tempCopyrightInfo = copyrightSlide.addChild(new BaseText("Creator: Timothy Hsu", "30px Open Sans", "#000", "center"));
		tempCopyrightInfo.y = 200;
		var tempCopyrightInfo2 = copyrightSlide.addChild(new BaseText("Made with CreateJS", "30px Open Sans", "#000", "center"));
		tempCopyrightInfo2.y = 250;
		var tempCopyrightInfo3 = copyrightSlide.addChild(new BaseText("More info will appear in future updates.", "30px Open Sans", "#000", "center"));
		tempCopyrightInfo3.y = 300;
		
		var mainMenu = copyrightSlide.addChild(new BaseText("Main Menu", "30px Open Sans", "#376092", "center"));
		mainMenu.y = 690;
		mainMenu.createLink(function(){transitionOut(copyrightSlide);titleSlider();}, "#4297b7");

		var lineDivider = new createjs.Shape();
		lineDivider.graphics.beginFill("#948a54").drawRect(0, 0, 1100,2);
		lineDivider.y = 140;
		lineDivider.x = 90;
		copyrightSlide.addChild(lineDivider);

	}
	else {
		transitionIn(copyrightSlide);
	}

	copyrightSlide.alpha = 0;		
	createjs.Tween.get(copyrightSlide)
  .to({ alpha: 1}, 300, createjs.Ease.getPowInOut(2))
}

function howToUseSlider() {

	if (typeof howToUseSlide === 'undefined') {
		howToUseSlide = new createjs.Container();
		allContainer.addChild(howToUseSlide);
		var copyrightSlideHeader = howToUseSlide.addChild(new BaseText("How to Use", "36px Open Sans", "#000", "center"));
		copyrightSlideHeader.y = 60;
		var tempCopyrightInfo = howToUseSlide.addChild(new BaseText("Bingo Master Board is under construction.", "30px Open Sans", "#000", "center"));
		tempCopyrightInfo.y = 200;
		var tempCopyrightInfo2 = howToUseSlide.addChild(new BaseText("How to use instructions are not yet available.", "30px Open Sans", "#000", "center"));
		tempCopyrightInfo2.y = 250;
		var mainMenu = howToUseSlide.addChild(new BaseText("Main Menu", "30px Open Sans", "#376092", "center"));
		mainMenu.y = 690;
		mainMenu.createLink(function(){transitionOut(howToUseSlide);titleSlider();}, "#4297b7");

		var lineDivider = new createjs.Shape();
		lineDivider.graphics.beginFill("#948a54").drawRect(0, 0, 1100,2);
		lineDivider.y = 140;
		lineDivider.x = 90;
		howToUseSlide.addChild(lineDivider);
	}
	else {
		transitionIn(howToUseSlide);
	}

	howToUseSlide.alpha = 0;		
	createjs.Tween.get(howToUseSlide)
  .to({ alpha: 1}, 300, createjs.Ease.getPowInOut(2))


}

function masterBoardSlider() {

	if (typeof masterBoardSlide === 'undefined') {
		masterBoardSlide = new createjs.Container();
		allContainer.addChild(masterBoardSlide);

	for (var i = 1; i < 6; i++) {
		var lineDivider = new createjs.Shape();
		lineDivider.graphics.beginFill("#948a54").drawRect(0, 0, 2,720);
		lineDivider.y = 0;
		lineDivider.x = 51.2+(1280*4/25)*i-1;
		lineDivider.name = "line"+i;
		masterBoardSlide.addChild(lineDivider);
	}

		var TheB = new createjs.Text("B", "bold 110px 'Arya'", "#ce181e");
		TheB.textBaseline = "alphabetic";
		TheB.x = 51.2+(1280*4/25)*1+.5*(1280*4/25)-(TheB.getBounds().width/2);
		TheB.y = 115;
		var TheI = new createjs.Text("I", "bold 110px 'Arya'", "#ce181e");
		TheI.textBaseline = "alphabetic";
		TheI.x = 51.2+(1280*4/25)*2+.5*(1280*4/25)-(TheI.getBounds().width/2);
		TheI.y = 115;
		var TheN = new createjs.Text("N", "bold 110px 'Arya'", "#ce181e");
		TheN.textBaseline = "alphabetic";
		TheN.x = 51.2+(1280*4/25)*3+.5*(1280*4/25)-(TheN.getBounds().width/2);
		TheN.y = 115;
		var TheG = new createjs.Text("G", "bold 110px 'Arya'", "#ce181e");
		TheG.textBaseline = "alphabetic";
		TheG.x = 51.2+(1280*4/25)*4+.5*(1280*4/25)-(TheG.getBounds().width/2);
		TheG.y = 115;
		var TheO = new createjs.Text("O", "bold 110px 'Arya'", "#ce181e");
		TheO.textBaseline = "alphabetic";
		TheO.x = 51.2+(1280*4/25)*5+.5*(1280*4/25)-(TheO.getBounds().width/2);
		TheO.y = 115;
		masterBoardSlide.addChild(TheB,TheI,TheN,TheG,TheO);

		var allBingos = new createjs.Container();
		allBingos.name = "allBingos";
		var bingoB = new createjs.Container();
		bingoB.name = "bingoB";
		var bingoI = new createjs.Container();
		bingoI.name = "bingoI";
		var bingoN = new createjs.Container();
		bingoN.name = "bingoN";
		var bingoG = new createjs.Container();
		bingoG.name = "bingoG";
		var bingoO = new createjs.Container();
		bingoO.name = "bingoO";
		allBingos.addChild(bingoB,bingoI,bingoN,bingoG,bingoO);

	for (var i = 1; i <= 75; i++) {

		var evenOddCycle;

		if (i>=1&&i<=15) {
			var bingoBoardBall = bingoB.addChild(new BingoBall(i));
			bingoBoardBall.y = 71*(Math.round(i/2)-1);
			evenOddCycle=0;	
		} else if (i>=16&&i<=30) {
			var bingoBoardBall = bingoI.addChild(new BingoBall(i));
			bingoBoardBall.y = 71*(Math.floor(i/2)-8);
			evenOddCycle=-1;
		} else if (i>=31&&i<=45) {
			var bingoBoardBall = bingoN.addChild(new BingoBall(i));
			bingoBoardBall.y = 71*(Math.round(i/2)-16);
			evenOddCycle=0;
		} else if (i>=46&&i<=60) {
			var bingoBoardBall = bingoG.addChild(new BingoBall(i));
			bingoBoardBall.y = 71*(Math.floor(i/2)-23);
			evenOddCycle=-1;
		} else if (i>=61&&i<=75) {
			var bingoBoardBall = bingoO.addChild(new BingoBall(i));
			bingoBoardBall.y = 71*(Math.round(i/2)-31);
			evenOddCycle=0;
		}
		
		bingoBoardBall.name = i;
		bingoBoardBall.id = "off";

		if (i%2+evenOddCycle==1 || -1&&i%15!=0) {
			bingoBoardBall.x = 30.5;
		}

		if (i%15==0) {
			bingoBoardBall.x = 30.5+45;
		}

		if (i%2+evenOddCycle == 0&&i%15!=0) {
			bingoBoardBall.x = 30.5+90;
		}

		bingoBoardBall.setBounds(0,0,60,60);
	}

		bingoB.x = 51.2+(1280*4/25)*1+.5*(1280*4/25)-(bingoB.getBounds().width/2);
		bingoB.y = 168;
		bingoI.x = 51.2+(1280*4/25)*2+.5*(1280*4/25)-(bingoI.getBounds().width/2);
		bingoI.y = 168;
		bingoN.x = 51.2+(1280*4/25)*3+.5*(1280*4/25)-(bingoN.getBounds().width/2);
		bingoN.y = 168;
		bingoG.x = 51.2+(1280*4/25)*4+.5*(1280*4/25)-(bingoG.getBounds().width/2);
		bingoG.y = 168;
		bingoO.x = 51.2+(1280*4/25)*5+.5*(1280*4/25)-(bingoO.getBounds().width/2);
		bingoO.y = 168;
		masterBoardSlide.addChild(allBingos);

		var bigBingoBall = new createjs.Container();
		bigBingoBall.name = "bigBingoBall";

		var bigBingoBallLetter = new createjs.Text("", "bold 62px Open Sans", "#a6a6a6");
		var bigBingoBallNumber = new createjs.Text("", "bold 95px Open Sans", "#a6a6a6");
		bigBingoBallLetter.textBaseline = "alphabetic";
		bigBingoBallLetter.textAlign = "center";
		bigBingoBallNumber.textBaseline = "alphabetic";
		bigBingoBallNumber.textAlign = "center";

	bigBingoBallLetter.y = -25;
	bigBingoBallNumber.y = 59;



		var bigBingoBallBackground= new createjs.Shape();
		bigBingoBallBackground.graphics.setStrokeStyle(2.5, 'round', 'round');
		bigBingoBallBackground.graphics.beginStroke("rgb(176,176,176)");
		bigBingoBallBackground.graphics.beginFill("rgba(191,191,191,0.6)");
		bigBingoBallBackground.graphics.drawCircle(0,0,93);


		bigBingoBall.addChild(bigBingoBallBackground, bigBingoBallLetter,bigBingoBallNumber);
		bigBingoBall.x = 128;
		bigBingoBall.y = 480;
		masterBoardSlide.addChild(bigBingoBall);
		
		
		var drawBall = new createjs.Container();
		var drawBallShape = new createjs.Shape();
		drawBallShape.graphics.setStrokeStyle(2, 'round', 'round');
		drawBallShape.graphics.beginStroke("rgb(94,87,52)");
		drawBallShape.graphics.beginLinearGradientFill(["rgba(164,152,92,0.8)","rgba(183,174,127,0.8)"], [0, 1], 0, 0, 155, 90)
		drawBallShape.graphics.moveTo(25, 0).lineTo(130, 0).lineTo(155, 45).lineTo(130,90).lineTo(25,90).lineTo(0,45).lineTo(25, 0);
		var drawBallText = new createjs.Text("DRAW BALL", "27px Open Sans", "#000");
		drawBallText.textBaseline = "alphabetic";
		drawBallText.textAlign = "center";
		drawBallText.lineWidth = 10;
		drawBallText.lineHeight = 32;
		drawBallText.x = 76;
		drawBallText.y = 39;
		drawBall.addChild(drawBallShape,drawBallText);
		masterBoardSlide.addChild(drawBall);
		
		drawBall.on("mouseover", function(){drawBallShape.graphics.clear().setStrokeStyle(2, 'round', 'round').beginStroke("rgb(94,87,52)").beginFill("rgba(155, 145, 90, 0.8)").moveTo(25, 0).lineTo(130, 0).lineTo(155, 45).lineTo(130,90).lineTo(25,90).lineTo(0,45).lineTo(25, 0);});
		drawBall.on("mouseout", function(){drawBallShape.graphics.clear().setStrokeStyle(2, 'round', 'round').beginStroke("rgb(94,87,52)").beginLinearGradientFill(["rgba(164,152,92,0.8)","rgba(183,174,127,0.8)"], [0, 1], 0, 0, 155, 90).moveTo(25, 0).lineTo(130, 0).lineTo(155, 45).lineTo(130,90).lineTo(25,90).lineTo(0,45).lineTo(25, 0);});
		drawBall.on("click", randomDraw);
		drawBall.cursor = "pointer";
		drawBall.name = "drawBall";
		drawBall.x = 50.5;
		drawBall.y = 255;
		
		
		var resetButton = masterBoardSlide.addChild(new MiniTextButton("Reset", "rgba(255,0,0,0.25)",resetBoard));
		var themesButton = masterBoardSlide.addChild(new MiniTextButton("Themes", "rgba(80,80,80,0.25)",function(){transitionOut(masterBoardSlide);themesSlider();}));
		
		resetButton.y = 12;
		resetButton.x = 28;
		themesButton.y = 12;
		themesButton.x = 95;

		fullScreenToggle.scale = 0.5;
		fullScreenToggle.x = 630;
		fullScreenToggle.y = 3;

	}
	else {
		transitionIn(masterBoardSlide);
	}


	document.getElementById("mainCanvas").style.background = themeColor;
	masterBoardSlide.alpha = 0;		
	createjs.Tween.get(masterBoardSlide)
  .to({ alpha: 1}, 300, createjs.Ease.getPowInOut(2))

	document.onkeydown = function(e) {
		if (e.keyCode == 32) {randomDraw();}
		if (e.keyCode == 82) {resetBoard();}
	}

}

function themesSlider() {

	if (typeof themesSlide === 'undefined') {
		themesSlide = new createjs.Container();
		allContainer.addChild(themesSlide);
		var themesSlideHeader = themesSlide.addChild(new BaseText("Themes", "36px Open Sans", "#000", "center"));
		themesSlideHeader.y = 60;
		
		
		var themesSelection1 = new createjs.Container();
		themesSlide.addChild(themesSelection1);

		var yellow = themesSelection1.addChild(new BaseText("Yellow", "bold 50px Open Sans", "rgb(148,138,84)"));
		var red = themesSelection1.addChild(new BaseText("Red", "bold 50px Open Sans", "rgb(255,0,0)"));
		var green = themesSelection1.addChild(new BaseText("Green", "bold 50px Open Sans", "rgb(0,128,0)"));
		red.x = 340;
		green.x = 630;
		yellow.createLink(function(){themeColor = "#d1cc85";transitionOut(themesSlide);masterBoardSlider();});
		red.createLink(function(){themeColor = "rgb(245,169,169)";transitionOut(themesSlide);masterBoardSlider();});
		green.createLink(function(){themeColor = "rgb(171,220,152)";transitionOut(themesSlide);masterBoardSlider();});

		themesSelection1.y = 280;

		var themesSelection2 = new createjs.Container();
		themesSlide.addChild(themesSelection2);

		var blue = themesSelection2.addChild(new BaseText("Blue", "bold 50px Open Sans", "rgb(51,102,255)"));
		var purple = themesSelection2.addChild(new BaseText("Purple", "bold 50px Open Sans", "rgb(164,70,153)"));
		blue.createLink(function(){themeColor = "rgb(144,207,250)";transitionOut(themesSlide);masterBoardSlider();});
		purple.x = 340;
		purple.createLink(function(){themeColor = "rgb(198,182,230)";transitionOut(themesSlide);masterBoardSlider();});
		themesSelection2.y = 430;
		centerTextGroup(themesSelection1,themesSelection2);

		themesSlide.addChild(themesSelection1,themesSelection2);
		
		var goBack = themesSlide.addChild(new BaseText("Go Back", "30px Open Sans", "#376092", "center"));
		goBack.y = 690;
		goBack.createLink(function(){transitionOut(themesSlide);masterBoardSlider();}, "#4297b7");
		

	}
	else {
		transitionIn(themesSlide);
	}

	document.getElementById("mainCanvas").style.background = "radial-gradient(#f7eaab, #bfbb73)";
	
	themesSlide.alpha = 0;		
	createjs.Tween.get(themesSlide)
  .to({ alpha: 1}, 300, createjs.Ease.getPowInOut(2))
	document.onkeydown = function(e) {}


}

function resetBoard() {
	for (var i = 1; i<=75; i++) {		
		if (i>=1&&i<=15) {
			var bingoBallId = masterBoardSlide.getChildByName("allBingos").getChildByName("bingoB").getChildByName(i);
			bingoBallId.getChildAt(1).font = "35px Open Sans";
			bingoBallId.getChildAt(1).color = "#a6a6a6";
			bingoBallId.getChildAt(0).graphics.clear().beginStroke("rgb(176,176,176)").beginFill("rgba(191, 191, 191,0.6)").drawCircle(0,0,30.5);
			bingoBallId.id = "off";
		} else if (i>=16&&i<=30) {
			var bingoBallId = masterBoardSlide.getChildByName("allBingos").getChildByName("bingoI").getChildByName(i);
			bingoBallId.getChildAt(1).font = "35px Open Sans";
			bingoBallId.getChildAt(1).color = "#a6a6a6";
			bingoBallId.getChildAt(0).graphics.clear().beginStroke("rgb(176,176,176)").beginFill("rgba(191, 191, 191,0.6)").drawCircle(0,0,30.5);;
			bingoBallId.id = "off";
		} else if (i>=31&&i<=45) {
			var bingoBallId = masterBoardSlide.getChildByName("allBingos").getChildByName("bingoN").getChildByName(i);
			bingoBallId.getChildAt(1).font = "35px Open Sans";
			bingoBallId.getChildAt(1).color = "#a6a6a6";
			bingoBallId.getChildAt(0).graphics.clear().beginStroke("rgb(176,176,176)").beginFill("rgba(191, 191, 191,0.6)").drawCircle(0,0,30.5);
			bingoBallId.id = "off";
		} else if (i>=46&&i<=60) {
			var bingoBallId = masterBoardSlide.getChildByName("allBingos").getChildByName("bingoG").getChildByName(i);
			bingoBallId.getChildAt(1).font = "35px Open Sans";
			bingoBallId.getChildAt(1).color = "#a6a6a6";
			bingoBallId.getChildAt(0).graphics.clear().beginStroke("rgb(176,176,176)").beginFill("rgba(191, 191, 191,0.6)").drawCircle(0,0,30.5);
			bingoBallId.id = "off";
		} else if (i>=61&&i<=75) {
			var bingoBallId = masterBoardSlide.getChildByName("allBingos").getChildByName("bingoO").getChildByName(i);
			bingoBallId.getChildAt(1).font = "35px Open Sans";
			bingoBallId.getChildAt(1).color = "#a6a6a6";
			bingoBallId.getChildAt(0).graphics.clear().beginStroke("rgb(176,176,176)").beginFill("rgba(191, 191, 191,0.6)").drawCircle(0,0,30.5);
			bingoBallId.id = "off";
		}
	}
	var bigBingoBall = masterBoardSlide.getChildByName("bigBingoBall");
	bigBingoBall.getChildAt(0).graphics.clear().setStrokeStyle(2.5, 'round', 'round').beginStroke("rgb(176,176,176)").beginFill("rgba(191,191,191,0.6)").drawCircle(0,0,93);
	bigBingoBall.getChildAt(1).text = "";
	bigBingoBall.getChildAt(2).text = "";
	
		masterBoardSlide.getChildByName("allBingos").alpha = 0;
		createjs.Tween.get(masterBoardSlide.getChildByName("allBingos"))
  .to({ alpha: 1}, 300, createjs.Ease.getPowInOut(2))
	
}

function randomDraw() {

	var numberOfSlots = 0;
	var numbersAvailable = [];
	
	for (var i = 1; i<=15;i++) {
		if (masterBoardSlide.getChildByName("allBingos").getChildByName("bingoB").getChildByName(i).id=="off") {
			numberOfSlots++;
			numbersAvailable.push(i);
		}
	}
	
	for (var i = 16; i<=30;i++) {
		if (masterBoardSlide.getChildByName("allBingos").getChildByName("bingoI").getChildByName(i).id=="off") {
			numberOfSlots++;
			numbersAvailable.push(i)
		}
	}
	
	for (var i = 31; i<=45;i++) {
		if (masterBoardSlide.getChildByName("allBingos").getChildByName("bingoN").getChildByName(i).id=="off") {
			numberOfSlots++;
			numbersAvailable.push(i)
		}
	}
	
	for (var i = 46; i<=60;i++) {
		if (masterBoardSlide.getChildByName("allBingos").getChildByName("bingoG").getChildByName(i).id=="off") {
			numberOfSlots++;
			numbersAvailable.push(i)
		}
	}
	
	for (var i = 61; i<=75;i++) {
		if (masterBoardSlide.getChildByName("allBingos").getChildByName("bingoO").getChildByName(i).id=="off") {
			numberOfSlots++;
			numbersAvailable.push(i)
		}
	}
	
	if (numberOfSlots == 0) {
		alert("That's all the Bingo balls!");
		return;
	}
	
	var theRandomNumber = numbersAvailable[Math.floor(Math.random()*numbersAvailable.length)];
	
	if (theRandomNumber >=1 && theRandomNumber <= 15) {
		masterBoardSlide.getChildByName("allBingos").getChildByName("bingoB").getChildByName(theRandomNumber).handleClick();
	}
	
	if (theRandomNumber >=16 && theRandomNumber <= 30) {
		masterBoardSlide.getChildByName("allBingos").getChildByName("bingoI").getChildByName(theRandomNumber).handleClick();
	}
	
	if (theRandomNumber >=31 && theRandomNumber <= 45) {
		masterBoardSlide.getChildByName("allBingos").getChildByName("bingoN").getChildByName(theRandomNumber).handleClick();
	}
	
	if (theRandomNumber >=46 && theRandomNumber <= 60) {
		masterBoardSlide.getChildByName("allBingos").getChildByName("bingoG").getChildByName(theRandomNumber).handleClick();
	}
	
	if (theRandomNumber >=61 && theRandomNumber <= 75) {
		masterBoardSlide.getChildByName("allBingos").getChildByName("bingoO").getChildByName(theRandomNumber).handleClick();
	}
	
		createjs.Tween.get(masterBoardSlide.getChildByName("drawBall"))
				.to({ scale: 0.9, x: 60, y:260,alpha:0.6}, 100, createjs.Ease.getPowInOut(2))
				.to({ scale: 1, x: 50.5, y:255,alpha:1}, 100, createjs.Ease.getPowInOut(2))
}

function goToFullScreen(event) {
	var canvas = document.body;
	if (isFullScreen == false) {
		if(canvas.requestFullScreen) {
			canvas.requestFullScreen();
		} else if(canvas.webkitRequestFullScreen) {
			canvas.webkitRequestFullScreen();
		} else if(canvas.mozRequestFullScreen) {
			canvas.mozRequestFullScreen();
		}
		isFullScreen = true;
	}
	else if (isFullScreen == true) {
		if(document.exitFullscreen) {
    		document.exitFullscreen();
  		} else if(document.mozCancelFullScreen) {
    		document.mozCancelFullScreen();
  		} else if(document.webkitExitFullscreen) {
    		document.webkitExitFullscreen();
  		}
		isFullScreen = false;
	}
}

function changeFullScreenImg() {
	if (isFullScreen == true) {
		fullScreenToggleImg1 = "./assets/img/fullscreenDown.svg";
		fullScreenToggleImg2 = "./assets/img/fullscreenDownHover.svg";
	} else {
		fullScreenToggleImg1 = "./assets/img/fullscreenUp.svg";
		fullScreenToggleImg2 = "./assets/img/fullscreenUpHover.svg";
	}
}

function transitionOut(containerName) {
	containerName.visible = false;
}

function transitionIn(containerName) {
	containerName.visible = true;
}

function centerTextGroup() {
	for (var i = 0; i < arguments.length; i++) {
		arguments[i].x = (1280/2) - (arguments[i].getBounds().width/2);
	}
}

function resize() {
	var windowWidth = window.innerWidth;
	var windowHeight = window.innerHeight;

	var heightReq = windowWidth/16*9;
	var scaler;

	if (windowHeight < heightReq) {
		document.getElementById("mainCanvas").width=windowHeight/9*16;
		document.getElementById("mainCanvas").height=windowHeight;
		scaler = windowHeight/720;
	}

	else {
		document.getElementById("mainCanvas").width=windowWidth;
		document.getElementById("mainCanvas").height=heightReq;
		scaler = windowWidth/1280;
	}

	allContainer.scaleX = scaler;
	allContainer.scaleY = scaler;

	// HiDPI/Retina for CreateJS http://www.unfocus.com/2014/03/03/hidpiretina-for-createjs-flash-pro-html5-canvas/
	if (window.devicePixelRatio) {
		var canvas = document.getElementById("mainCanvas");
		var height = canvas.getAttribute('height');
		var width = canvas.getAttribute('width');
		canvas.setAttribute('width', Math.round(width * window.devicePixelRatio));
		canvas.setAttribute('height', Math.round( height * window.devicePixelRatio));
		canvas.style.width = width+"px";
		canvas.style.height = height+"px";
		stage.scaleX = stage.scaleY = window.devicePixelRatio;
	}

	stage.update();
}