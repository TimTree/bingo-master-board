(function() {

	function BaseText(label, font, textColor, textAlign) {
		this.Container_constructor();
		this.textColor = textColor;
		this.label = label;
		this.font = font;
		this.textAlign = textAlign;
		this.setup();
	}
	var p = createjs.extend(BaseText, createjs.Container);

	p.setup = function() {
		var text = new createjs.Text(this.label, this.font, this.textColor);
		if (this.textAlign == "center") {
			text.x = (1280/2) - (text.getBounds().width/2);
		}
		text.textBaseline = "alphabetic";
		this.addChild(text); 
	} ;

	p.createLink = function(theFunction,hoverColor) {
		var text = this.getChildAt(0);
		var origColor = text.color;
		var hit = new createjs.Shape();
		hit.graphics.beginFill("#000").drawRect(0, 0-0.75*text.getMeasuredHeight(), text.getMeasuredWidth(), 0.75*text.getMeasuredHeight());
		text.hitArea = hit;	
		text.on("click", theFunction);
		text.cursor = "pointer";
		if (hoverColor) {
			text.on("mouseout", function(){text.color=origColor;});
			text.on("mouseover", function(){text.color=hoverColor;});
		}
	} ;
	
	window.BaseText = createjs.promote(BaseText, "Container");
}());



(function() {

	function BingoBall(label) {
		this.Container_constructor();


		this.label = label;

		this.setup();
	}
	var p = createjs.extend(BingoBall, createjs.Container);


	p.setup = function() {
		var text = new createjs.Text(this.label, "35px Open Sans", "#a6a6a6");
		text.textBaseline = "alphabetic";
		text.textAlign = "center";
		text.y = 14.5;
		var background= new createjs.Shape();
		background.graphics.setStrokeStyle(1.5, 'round', 'round');
		background.graphics.beginStroke("rgb(176,176,176)");
		background.graphics.beginFill("rgba(191,191,191,0.6)");
		background.graphics.drawCircle(0,0,30.5);


		this.addChild(background, text); 
		this.on("click", this.handleClick);
		this.on("rollover", this.handleRollOver);
		this.on("rollout", this.handleRollOut);
		this.cursor = "pointer";

		this.mouseChildren = false;

	} ;

	p.handleClick = function (event) {
		var bigBingoBall = masterBoardSlide.getChildByName("bigBingoBall");
		if (this.id == "off") {
			this.getChildAt(1).font = "Bold 35px Open Sans";
			var theLetter;
			if (this.name >= 1 && this.name <= 15) {
				theLetter = 0;
				bigBingoBall.getChildAt(1).text = "B";
			}
			else if (this.name >= 16 && this.name <= 30) {
				theLetter = 1;
				bigBingoBall.getChildAt(1).text = "I";
			}
			else if (this.name >= 31 && this.name <= 45) {
				theLetter = 2;
				bigBingoBall.getChildAt(1).text = "N";
			}
			else if (this.name >= 46 && this.name <= 60) {
				theLetter = 3;
				bigBingoBall.getChildAt(1).text = "G";
			}
			else if (this.name >= 61 && this.name <= 75) {
				theLetter = 4;
				bigBingoBall.getChildAt(1).text = "O";
			}
			
			this.getChildAt(1).color = ballTextColor[theLetter];
			this.getChildAt(0).graphics.clear().beginStroke(lineColor[theLetter]).beginRadialGradientFill([ballGradientLightColor[theLetter],ballGradientDarkColor[theLetter]], [0, 1], 0, -20, 1, 0, 0, 40).drawCircle(0,0,30.5);
			bigBingoBall.getChildAt(0).graphics.clear().setStrokeStyle(2.5, 'round', 'round').beginStroke(lineColor[theLetter]).beginRadialGradientFill([ballGradientLightColor[theLetter],ballGradientDarkColor[theLetter]], [0, 1], 0, -61, 1, 0, 0, 122).drawCircle(0,0,93);
			bigBingoBall.getChildAt(1).color = ballTextColor[theLetter];
			bigBingoBall.getChildAt(2).color = ballTextColor[theLetter];
			createjs.Tween.get(bigBingoBall.getChildAt(2))
				.to({ scale: 1.1}, 100, createjs.Ease.getPowInOut(2))
				.to({ scale: 1}, 100, createjs.Ease.getPowInOut(2))
			
			bigBingoBall.getChildAt(2).text = this.name;
			this.id = "on";
			
		} else {
			this.getChildAt(1).font = "35px Open Sans";
			this.getChildAt(1).color = "#a6a6a6";
			this.getChildAt(0).graphics.clear().beginStroke("rgb(176,176,176)").beginFill("rgba(191, 191, 191,0.6)").drawCircle(0,0,30.5);
			bigBingoBall.getChildAt(0).graphics.clear().setStrokeStyle(2.5, 'round', 'round').beginStroke("rgb(176,176,176)").beginFill("rgba(191,191,191,0.6)").drawCircle(0,0,93);
			bigBingoBall.getChildAt(1).text = "";
			bigBingoBall.getChildAt(2).text = "";
			this.id = "off";
		}
	} ;

	p.handleRollOver = function(event) {
		if (this.id =="off") {
		this.getChildAt(0).graphics.clear().beginStroke("rgb(176,176,176)").beginFill("rgba(191, 191, 191,1)").drawCircle(0,0,30.5);
		}
	};
	
	p.handleRollOut = function(event) {
		if (this.id =="off") {
		this.getChildAt(0).graphics.clear().beginStroke("rgb(176,176,176)").beginFill("rgba(191, 191, 191,0.6)").drawCircle(0,0,30.5);
		}
	};

	window.BingoBall = createjs.promote(BingoBall, "Container");
}());



(function() {

	function MiniTextButton(label, buttonColor,theFunction) {
		this.Container_constructor();
		this.buttonColor = buttonColor;
		this.label = label;
		this.theFunction = theFunction;
		this.setup();
	}
	var p = createjs.extend(MiniTextButton, createjs.Container);

	p.setup = function() {
		var text = new createjs.Text(this.label, "13px Arial", "#000");
		text.textBaseline = "alphabetic";
		text.y = 14.5;
		
		var background= new createjs.Shape();
		background.graphics.beginFill(this.buttonColor);
		background.graphics.drawRoundRect(0,0,text.getBounds().width+12, 20, 6);
		text.x = 6;
		var hit = new createjs.Shape();
		hit.graphics.beginFill("#000").drawRoundRect(0,0,text.getBounds().width+12, 20, 6);
		background.hitArea = hit;	
		background.alpha = 0;
		this.addChild(background,text); 
		
		this.on("mouseover", function(){background.alpha = 1;});
		this.on("mouseout", function(){background.alpha = 0;});
		this.on("click", this.theFunction);
		this.cursor = "pointer";

		this.mouseChildren = false;		
		
	} ;

	
	window.MiniTextButton = createjs.promote(MiniTextButton, "Container");
}());