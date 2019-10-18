
//page load
$(function(){
	//display menu slection
	memory.modal();

	$('#menuOption').on("click", function() {
		clearInterval(memory.interval);
		$("#game-message").hide();
		$("#score-message").hide();
		$("#timer").hide();
		memory.correctGuess = 0;
		$("#correct-guess").html(memory.correctGuess);
		memory.clickCounter = 0;
		$("#no-of-clicks").html(memory.clickCounter);
		memory.modal();

	$('.btnRestart').on("click", function() {
		$("#game-message").hide();
		$("#score-message").hide();
		$("#timer").hide();
		memory.correctGuess = 0;
		$("#correct-guess").html(memory.correctGuess);
		memory.clickCounter = 0;
		$("#no-of-clicks").html(memory.clickCounter);
		memory.modal();
	});
	
});


//game object
memory = {

	//variables
	timeOutRestore:  1000,
	gameTime: 0,
	firstClick: true,
	noOfBoxGame: 0,
	boxIndexes: [],
	noOfClick: 0,
	clickCounter: 0,
	correctGuess:  0,
	clickImages:  [],
	interval: 0,
	highScore: 0,

	// create modal 
	modal: function() {
		$("#modal-message").addClass('animated bounceInDown').show();
		// 4 by 4
		$("#4by4").on("click", function(){
			memory.noOfBoxGame = 16;
			memory.gameTime = 60 * 1;
			memory.renderGameLayout();
			$("#modal-message").hide();
			$("#canvas-game").css({"width" : "50%"});
		});

		// 6 by 6
		$("#6by6").on("click", function(){
			memory.noOfBoxGame = 36;
			memory.gameTime = 60 * 2.5;
			memory.renderGameLayout();
			$("#modal-message").hide();
			$("#canvas-game").css({"width" : "70%"});
		});

		// 8 by 8
		$("#8by8").on("click", function(){
			memory.noOfBoxGame = 64;
			memory.gameTime = 60 * 3;
			memory.renderGameLayout();
			$("#modal-message").hide();
			$("#canvas-game").css({"width" : "100%"});
		});
	},
	
	//This will load the default game array and perform a shuffle
	initData: function(){
        //Create 2 sets of matching indices for boxIndexes array
		memory.boxIndexes = [];
        //Loop twice
        for(var x=0; x <=1;x++){
            //loop from 0 - number of game cards / 2 minus 1
            for(var i=0; i<= (memory.noOfBoxGame/2)-1;i++){
                memory.boxIndexes.push(i);
            }            
        } 
        this.shuffleArray(memory.boxIndexes);
	},
	
	//function to shuffle array
	shuffleArray: function(array){
		for (var i = array.length - 1; i > 0; i--) {
			var j = Math.floor(Math.random() * (i + 1));
			var temp = array[i];
			array[i] = array[j];
			array[j] = temp;
		}
	},

	//timer functions
	timer: function(duration){
		var timer = duration;
		memory.interval = setInterval(function () {
			minutes = parseInt(timer / 60, 10);
			seconds = parseInt(timer % 60, 10);

			minutes = minutes < 10 ? "0" + minutes : minutes;
			seconds = seconds < 10 ? "0" + seconds : seconds;

			finalMinute = (Math.floor((memory.gameTime - seconds) / 60));
			finalSecond = Math.floor((memory.gameTime - seconds) % 60);

			$("#timer").html(minutes + ":" + seconds);
			$("#time-score").html(finalMinute + ":" + (finalSecond < 10 ? ("0" + finalSecond) : finalSecond) + "s");
			$("#timer").show();

			if (--timer <= 0) {
				clearInterval(memory.interval);
				memory.endGame();
			}
		}, 1000);		
	},
	
	buildGameBox: function(){
		var cards = "";
		var cardCover = "";
		var startTimer = memory.gameTime;

		//load the images and image cover
		for(var i = 1; i <= memory.noOfBoxGame; i++){
        	cards += "<div id='box-" + i + "' class='box-picture'><img src='game-images/" + (parseInt(memory.boxIndexes[i-1])) + ".png'/></div>";
			cardCover += "<div id='box-cover-" + i + "' class='box-cover' data-id='" + (parseInt(memory.boxIndexes[i-1])) + "'></div>";
        }
		
		cards = "<div class='box-image-wrapper_" + memory.noOfBoxGame + "'>"+ cards +"</div>"
		cardCover = "<div class='box-cover-wrapper_" + memory.noOfBoxGame + "'>" + cardCover + "</div>";
		$("#game-content").html(cards + cardCover);
		$(".box-picture").show();
        
        //add event to click the box cover image
		$(".box-cover").off("click");
		$(".box-cover").on("click", function(){

			// On first click ~ start timer, add restart btn
			if(memory.firstClick){
				memory.timer(startTimer);
				$(".play").show();	
			}

			if(memory.noOfClick <= 1){
				memory.firstClick = false;
				memory.clickCounter++;
				$("#no-of-clicks").html(memory.clickCounter);
				
				memory.noOfClick++;
				$(this).addClass('animated flipOutX'); 
				
				var clickCover = {
					ImageID: $(this).attr("data-id"),
					CoverID: $(this).attr("id").replace("box-cover-","")
				}
				memory.clickImages.push(clickCover);
				
				if(memory.noOfClick >= 2){
					//check if the revealed images are correct
					if(memory.clickImages[0].ImageID == memory.clickImages[1].ImageID && memory.clickImages[0].CoverID !== memory.clickImages[1].CoverID){
						memory.correctGuess++;
						$("#correct-guess").html(memory.correctGuess);
						
						//reset the variables
						memory.noOfClick = 0;
						memory.clickImages = [];
						
						//if the game is completed then perform a reset
						if(memory.correctGuess >= (memory.noOfBoxGame/2)){
							clearInterval(memory.interval);
							$('#timer').hide();
							$("#canvas-game, #game-statistic").fadeOut(1000); 
							$("#game-message").addClass('animated bounceInDown').css('animation-delay', '1s').show(); 
							$("#no-of-clicks-score").html(memory.clickCounter);
							//$("#time-score").html(memory.clickCounter);
							memory.clearVariables();
							memory.correctGuess = 0;
							$("#correct-guess").html(memory.correctGuess);
							memory.clickCounter = 0;
							$("#no-of-clicks").html(memory.clickCounter);
							memory.score();
						}
					}else{
						//if not the same then close the image cover again.
						setTimeout(function(){
							memory.clickImages.forEach(function(item, index){
								$("#box-cover-" + item.CoverID).removeClass("flipOutX").addClass('animated flipInX'); 
							});
							//reset
							memory.noOfClick = 0;
							memory.clickImages = [];
						}, memory.timeOutRestore);
					}
					
					
				}
				$("#correct-guess-end").html(memory.correctGuess + " out of " + (memory.noOfBoxGame/2));
				$("#no-of-clicks-end").html(memory.clickCounter);
			}
		});
	},

	score: function(){ 
		var tempScore = memory.highScore;
		// 1 point per correct card for easy 
		// 3 point per correct card for medium 
		// 5 points per correct card for hard
		if(memory.noOfBoxGame == 16){
			tempScore += (memory.correctGuess * 1);
		} else if(memory.noOfBoxGame == 24){
			tempScore += (memory.correctGuess * 3);
		} else if(memory.noOfBoxGame == 36) {
			tempScore += (memory.correctGuess * 5);
		}

		// 10 points for clicking less than half of cards
		if(memory.clickCounter < memory.noOfBoxGame){
			tempScore += 10;
		} 

		// 50 points for finishing
		if(memory.correctGuess === (memory.noOfBoxGame/2)) {
			tempScore += 50;
		}
		
		$('.score').html(tempScore);
	},

	endGame: function(){
		$("#timer").html("Petrificus Totalus!").css({"float" : "none", "padding-left" : "60px"});
		$("#canvas-game, #game-statistic").fadeOut(1000); 
		$("#score-message").addClass('animated bounceInDown').css('animation-delay', '1s').show();
		memory.score();
		memory.clearVariables();
	},

	clearVariables: function() {
		//variables
		memory.firstClick = true;
		memory.noOfBoxGame = 0;
		memory.boxIndexes = [];
		memory.noOfClick = 0;
		memory.clickCounter = 0;
		memory.correctGuess = 0;
		memory.clickImages = [];
		memory.timeOutRestore = 1000;
		memory.gameTime = 60 * 1;	
	},

	//function to call main functions to render the game
	renderGameLayout: function(){
		$("#game-message").hide();
		$("#canvas-game, #game-statistic").show();
		this.initData();
		this.buildGameBox();
    }
    
}