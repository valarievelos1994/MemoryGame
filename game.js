//variables
var firstClick = true;
var noOfBoxGame = 0;
var boxIndexes = [];
var noOfClick = 0;
var clickCounter = 0;
var correctGuess = 0;
var clickImages = [];
var timeOutRestore = 1000;

//page load
$(function(){

	//display menu slection
	memory.modal();
	
	$("#btnRestart").on("click", function(){
		memory.renderGameLayout();
    });
    
    $("#restart_btn").on("click", function(){
		memory.renderGameLayout();
    });
    
});


//game class
memory = {

	// create modal 
	modal: function() {
		$("#modal-message").addClass('animated bounceInDown').show();
		// 4 by 4
		$("#4by4").on("click", function(){
			noOfBoxGame = 16;
			memory.renderGameLayout();
			$("#modal-message").hide();
		});

		// 6 by 6
		$("#6by6").on("click", function(){
			noOfBoxGame = 36;
			memory.renderGameLayout();
			$("#modal-message").hide();
		});

		// 8 by 8
		$("#8by8").on("click", function(){
			noOfBoxGame = 64;
			memory.renderGameLayout();
			$("#modal-message").hide();
		});
	},
	
	//This will load the default game array and perform a shuffle
	initData: function(){
        //Create 2 sets of matching indices for boxIndexes array

        //Loop twice
        for(var x=0; x <=1;x++){
            //loop from 0 - number of game cards / 2 minus 1
            for(var i=0; i<= (noOfBoxGame/2)-1;i++){
                boxIndexes.push(i);
            }            
        } 
        this.shuffleArray(boxIndexes);
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
	timer: function(){
		alert('timer')
	},

	
	buildGameBox: function(){
		var cards = "";
		var cardCover = "";

		//load the images and image cover
		for(var i = 1; i <= noOfBoxGame; i++){
        	cards += "<div id='box-" + i + "' class='box-picture'><img src='game-images/" + (parseInt(boxIndexes[i-1]) + 1) + ".png'/></div>";
            cardCover += "<div id='box-cover-" + i + "' class='box-cover' data-id='" + (parseInt(boxIndexes[i-1]) + 1) + "'></div>";
        }
		
		cards = "<div class='box-image-wrapper_" + noOfBoxGame + "'>"+ cards +"</div>"
		cardCover = "<div class='box-cover-wrapper_" + noOfBoxGame + "'>" + cardCover + "</div>";
		$("#game-content").html(cards + cardCover);
		$(".box-picture").show();
        
        //add event to click the box cover image
		$(".box-cover").off("click");
		$(".box-cover").on("click", function(){
			// On first click ~ start timer, add restart btn
			if(firstClick){
				$(".play").show();
				memory.timer();
			}

			if(noOfClick <= 1){
				firstClick = false;
				clickCounter++;
				$("#no-of-clicks").html(clickCounter);
				
				noOfClick++;
				$(this).addClass('animated flipOutX'); 
				
				var clickCover = {
					ImageID: $(this).attr("data-id"),
					CoverID: $(this).attr("id").replace("box-cover-","")
				}
				clickImages.push(clickCover);
				
				if(noOfClick >= 2){
					//check if the revealed images are correct
					if(clickImages[0].ImageID == clickImages[1].ImageID && clickImages[0].CoverID !== clickImages[1].CoverID){
						correctGuess++;
						$("#correct-guess").html(correctGuess);
						
						//reset the variables
						noOfClick = 0;
						clickImages = [];
						
						//if the game is completed then perform a reset
						if(correctGuess >= (noOfBoxGame/2)){
							$("#canvas-game, #game-statistic").fadeOut(1000); 
							$("#game-message").addClass('animated bounceInDown').css('animation-delay', '1s').show(); 
							correctGuess = 0;
							$("#correct-guess").html(correctGuess);
							clickCounter = 0;
							$("#no-of-clicks").html(clickCounter);
						}
					}else{
						//if not the same then close the image cover again.
						setTimeout(function(){
							clickImages.forEach(function(item, index){
								$("#box-cover-" + item.CoverID).removeClass("flipOutX").addClass('animated flipInX'); 
							});
							//reset
							noOfClick = 0;
							clickImages = [];
						}, timeOutRestore);
					}
					
					
				}
			}
		});
	},
	
	//function to call main functions to render the game
	renderGameLayout: function(){
		$("#game-message").hide();
		$("#canvas-game, #game-statistic").show();
		this.initData();
		this.buildGameBox();
    }
    

    
}