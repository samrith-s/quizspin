
var free = false;
var player = new Entity("player");

var coins = new Currency("coins");
var spinsound = document.getElementById('spinner-sound');

var Score = function(totalQuestions) {
    // fake stuff
    this.questionsAnswered = [];

    this.roundScores = [];
    this.totalAnswered = 0;
    // this.currentRoundNo = 0;
    this.passedLevel = -1; // -1 is F, 0 - B, 1 - I, 2 - A
    this.currentLevel = 0;
};
// Level will be a number (0, 1 or 2)
Score.prototype.createRound = function(roundNo, level) {
    this.roundScores.push({
        totalQuestions: questionbank.questionsInRound,
        roundNo: roundNo,
        level: level,
        questionsAnswered: [],
        correct: 0,
        incorrect: 0,
        passed: false
    });
    return _.find(this.roundScores, {roundNo: roundNo});
};
Score.prototype.getRoundNo = function() {
    return Math.floor(this.totalAnswered / questionbank.questionsInRound);
};
Score.prototype.addCorrect = function(question) {
    var currentRound = null;
    var roundNo = this.getRoundNo();
    var level = this.getNextGameGrade();
    if(!this.roundScores[roundNo])
        currentRound = this.createRound(roundNo, level);
    else currentRound = this.getRound(roundNo);
    currentRound.correct++;
    currentRound.questionsAnswered.push(question);
    currentRound.passed = this.isRoundPassed(currentRound);
    this.totalAnswered++;
    this.setGameGrade();
}
Score.prototype.isRoundPassed = function(round) {
    var answeredCount = round.questionsAnswered.length;
    if(answeredCount >= round.totalQuestions && round.correct >= questionbank.passingThresholdInRound)
        return true;
    else
        return false;
};
Score.prototype.getRound = function(roundNo) {
    return _.find(this.roundScores, {roundNo: roundNo});
};
Score.prototype.addIncorrect = function(question, roundNo, level) {
    var currentRound = null;
    var roundNo = this.getRoundNo();
    var level = this.getNextGameGrade();
    if(!this.roundScores[roundNo])
        currentRound = this.createRound(roundNo, level);
    else currentRound = this.getRound(roundNo);
    currentRound.incorrect++;
    currentRound.questionsAnswered.push(question);
    currentRound.passed = this.isRoundPassed(currentRound);
    this.totalAnswered++;
    this.setGameGrade();
};
Score.prototype.setGameGrade = function() {
    var grade = -1;
    _.map(this.roundScores, function(round) {
        if(round.passed && round.level > grade) {
            grade = round.level
        }
    });
    this.passedLevel = grade;
};
Score.prototype.getNextGameGrade = function() {
    if (this.passedLevel >= 2) {
        return 2;
    }
    // if (this.passedLevel < 0) {
    //     return 1;
    // }
    else 
        return this.passedLevel + 1;
};
Score.prototype.getScore = function() {
    return Math.round(((this.passedLevel + 1) / 3) * 100) ;
}
Score.prototype.getGrade = function() {
    var grade="";
    grade = Math.round(((this.passedLevel + 1) / 3) * 100) 
    if (grade == 0){
        return "F"
    }else if (grade == 33){
        return "B"
    }else if (grade == 67){
        return "I"
    }else if (grade == 100){
        return "A"
    }
}


player.createWallet(coins, 0, 9999999999, config.coins());

var quesbank = [];



$(function() {
    setScore(0);
    initGame();
});

function initGame() {
    initBase();
    initPayOffArea();
    initSlotMachine();
    initSlots();
    initMessages();
    initQuiz();
    observers();
    handleIcons();
    initInstructions();

    
    $("#statement-area, #options, #knowmore").wrapAll("<div id='quizinnerwrapper'></div>");
    quesbank = Question.getTopicWiseRandomQuestions(questionbank.questionsFromTopic);
    quizScore = new Score(quesbank.length);
    $("#currencyholder span").eq(1).text('0/' + quesbank.length);
}

function observers() {
    $("#handle img").unbind('click').on('click', pullHandle);
    $('#info-btn').unbind('click').on('click',display_payoff);
}

function initBase() {
    var base = new Environment("base");
    loadConfig(base);
}

function initMessages() {
    var messages = new Environment("messages");
    loadConfig(messages);
    $("#messages").hide();
    $("#messageBox").removeClass("location");
}

function isQuestion(slotIndex) {
    if (slotIndex == 0){
        return true;
    }
    else if(slotIndex == 1){
        return true;
    }
    else if(slotIndex == 2){
        return false;
    }
    else if(slotIndex == 3){
        return true;
    }
    else if(slotIndex == 4){
        return true;
    }
    else if(slotIndex == 5){
        return false;
    }
    else if(slotIndex == 6){
        return true;
    }
}

function initSlots() {

    for(var i=0; i<3; i++) {

        var thisSlot = "slot" + (i+1);
        $("#slots").append("<div id='" + thisSlot + "'></div>");

        for(var j=0; j<6; j++) {
            $("#" + thisSlot).append("<div class='slots slot-item-" + (j+1) + "'>" +
                "<img src='assets/img/slotitems/" + (j+1) + ".png' /></div>");
        }
    }
}

function initSlotMachine() {
    var slotmachine = new Environment("slotmachine");
    loadConfig(slotmachine);
}

function initPayOffArea() {
    var payofftable = new Environment("payofftable");
    loadConfig(payofftable);
}

function pullHandle() {
    if(!free){
        updateCoins(player.coins.is(), player.coins.is()-10);
        player.coins.is(player.coins.is()-10);
        $(".slot-item-6 img").attr("src", "assets/img/slotitems/6.png");
    }

    var ml=0;
    var combo = "";

    var m = $("#handle img");

    machine1 = $("#slot1").slotMachine({
        active  : 1,
        delay   : 450
    });

    machine2 = $("#slot2").slotMachine({
        active  : 1,
        delay   : 650
    });

    machine3 = $("#slot3").slotMachine({
        active  : 1,
        delay   : 850
    });

    machine1.shuffle(2);
    machine2.shuffle(2);
    machine3.shuffle(2, function() {
        processCombo(machine1, machine2, machine3);
        $("#handle img").removeClass("no-click");

    });

    m.animate({
            "width": "500px"

        },
        {
            start:
                function() {
                    PlaySound('spinner-sound');
                    $('#handle img').addClass("no-click");
                },

            step:
                function(now, fx) {
                    ml = ml+50;

                    if(ml > 450)
                        ml = 450;

                    m.css("margin-left", "-" + ml + "px");
                    PlaySound('cranker');
                },

            duration: 800,

            complete:
                function() {

                    m.animate({
                            "width": "500px"
                        },
                        {
                            step:
                                function(now, fx) {
                                    ml = ml-50;

                                    if(ml > 630)
                                        ml = 630;

                                    m.css("margin-left", "-" + ml + "px");
                                },

                            duration: 1800
                        }
                        
                    );
                    setTimeout(function(){
                            StopSound('spinner-sound');
                    },2650);

                }
        }
    );
}

function processCombo(machine1, machine2, machine3) {
    var combo = machine1.active + "" + machine2.active + "" + machine3.active;
    rewards(combo);

    if(!free)
    {
        playQuiz();
        // if((!isQuestion(machine1.active) && !isQuestion(machine2.active) && isQuestion(machine3.active)) || (!isQuestion(machine1.active) && isQuestion(machine2.active) && !isQuestion(machine3.active)) || (isQuestion(machine1.active) && !isQuestion(machine2.active) && !isQuestion(machine3.active))){
        //     playQuiz(1);
        // }
        // else if((!isQuestion(machine1.active) && isQuestion(machine2.active) && isQuestion(machine3.active)) || (isQuestion(machine1.active) && !isQuestion(machine2.active) && isQuestion(machine3.active)) || (isQuestion(machine1.active) && isQuestion(machine2.active) && !isQuestion(machine3.active))){
        //     playQuiz(2)

        // }
        // else if(isQuestion(machine1.active) && isQuestion(machine2.active) && isQuestion(machine3.active)){
        //     playQuiz(3)
        // }
    }
}

function playQuiz() {
    var qCount = quizScore.getNextGameGrade(), question = null;
    if (qCount == 0){
        question = _.sample(_.filter(quesbank,{topic:'Basic'}));
    }
    else if (qCount == 1){
        question = _.sample(_.filter(quesbank,{topic:'Intermediate'})); 
    } 
    else if(qCount == 2){
        question = _.sample(_.filter(quesbank,{topic:'Advanced'}));   
    }
    // console.log(_.map(question.options, "correct"));
    if(!question && qCount == 1){
        $("#messages").css("display", "table");
        $("#messages").removeClass("environment");
        $("#messageBox").html("<p>No Questions</p>")
        $("#messages").fadeIn(500);
        setTimeout(function() { $("#messages").fadeOut(500);}, 1000);
        return;
    }
    else if(!question) {
        $("#messages").css("display", "table");
        $("#messages").removeClass("environment");
        $("#messageBox").html("<p>No Questions from this category</p>")
        $("#messages").fadeIn(500);
        setTimeout(function() { $("#messages").fadeOut(500);}, 1000);
        // return playQuiz(qCount - 1);
        return;
    }
    // quizScore.totalScoring(question.seq)
    if(quesbank.indexOf(question) != -1){
        quesbank.splice(quesbank.indexOf(question), 1);
    }


    $("#quiz").css({display:"table"}); Question.showQuizPanel(quiz, question);
    $("#quiz").fadeIn(1000);

    function checkVictory() {
        if (quizScore.totalAnswered == 30){
            setTimeout(function(){
                victory();
                // setScore(quizScore.questionsAnswered.length);
                setScore(quizScore.getScore());
                $('#currencyholder span').eq(1).text(quizScore.questionsAnswered.length + '/' + quizScore.total)
                $('#freespins span').eq(1).text(quizScore.getGrade());
            },1000)
        }
    }
    function processAnswer(e, data) {
        // console.log(data);
        if(data.correct) {
            quizScore.addCorrect(question);
            setScore(quizScore.getScore());
            //increment score in scorm and commit
            free = true;
            freeSpin(0);
            $("#quiz").fadeOut(500);
            $("#messages").css("display", "table");
            $("#messages").removeClass("environment");
            $("#messageBox").html("<p>Yes! That was correct</p>"  +
                "<p><button type='button' class='know_more' style='background: rgba(225, 228, 20, 0.8);;border: none;color: black !important;font-size: 0.6em;padding: 5px;cursor: pointer;'>Know More!</button></p>"
                )
            $("#messages").fadeIn(500);
            know_more_image(data.img,0);
            setTimeout(function() {
                // $("#messages").fadeOut(500);
                // checkVictory();
            }, 1000);
            $('#currencyholder span').eq(1).text(quizScore.questionsAnswered.length + '/' + quizScore.total)
            $('#freespins span').eq(1).text(quizScore.getGrade());
        }
        else {
            free = false;
            quizScore.addIncorrect(question);
            $("#quiz").fadeOut(500);
            $("#messages").css("display", "table");
            $("#messages").removeClass("environment");
            $("#messageBox").html("<p>Oops! That was incorrect</p>"  +
                "<p><button type='button' class='know_more' style='background: rgba(225, 228, 20, 0.8);;border: none;color: black !important;font-size: 0.6em;padding: 5px;cursor: pointer;'>Know More!</button></p>"
                )
            $("#messages").fadeIn(500);
            know_more_image(data.img,0);
            setTimeout(function() { 
                // $("#messages").fadeOut(500);
                // checkVictory();
            }, 1000);
            $('#currencyholder span').eq(1).text(quizScore.questionsAnswered.length + '/' + quizScore.total)
            $('#freespins span').eq(1).text(quizScore.getGrade());
        }
    }

    function know_more_image(img,freespin){
        $('.know_more').unbind('click').bind('click',function(){
            $("#messages").fadeOut(500, function() {
                $("#messages").css("display", "table");
                $("#messages").removeClass("environment");
                $("#messageBox").html("<div id='know_more_image_wrapper' style='width: 50%;margin: auto;position: relative;'><img src='" + img + "' id='know_more_img' style='width: 100%;height: auto;'></div><div class='exit_message' style='position: absolute;top: 0;right: 0;font-size: 0.6em;background: rgba(140, 72, 72, 0.8);padding: 5px;cursor:pointer;'>Exit</div>")
                $("#messages").fadeIn(500);
                close_know_more(freespin);    
            })
        });
    }

    function close_know_more(freespin){
        $('.exit_message').unbind('click').bind('click',function(){
            checkVictory();
            $("#messages").fadeOut();
        });
    }



    $(question).unbind('answered').on('answered', processAnswer);
    // setScore(quizScore.questionsAnswered.length);
}

function freeSpin(n) {
    $("#blank").remove();
    $("#ptotemy-game").append("<div id='blank' class='environment'></div>");
    $('#freespins span').eq(1).text(quizScore.getGrade());
    setTimeout(function() {$("#freespins span").eq(1).fadeIn()}, 400);
    $(".slot-item-6 img").effect("pulsate");

    // setTimeout(function() { $("#messages").fadeOut(); }, 2000);
    if(n>=1) {
        setTimeout(function() {
            $("#handle img").trigger('click');
            $(".slot-item-6 img").attr("src", "assets/img/slotitems/7.png");
            n--;
            freeSpin(n);

        }, 6000);
    }
    else {
        setTimeout(function() {
            $("#blank").remove();
            free=false;
        },6000);
    }
}

function rewards(combo) {

    var rwd=0;
    if(/000/.test(combo))
        rwd += 10;
    else if(/00./.test(combo) || /.00/.test(combo) || /0.0/.test(combo))
        rwd += 5;

    if(/111/.test(combo))
        rwd += 20;
    else if(/11./.test(combo) || /.11/.test(combo) || /1.1/.test(combo))
        rwd += 10;

    if(/222/.test(combo))
        rwd += 30;
    else if(/22./.test(combo) || /.22/.test(combo) || /2.2/.test(combo))
        rwd += 15;

    if(/333/.test(combo))
        rwd += 40;
    else if(/33./.test(combo) || /.33/.test(combo) || /3.3/.test(combo))
        rwd += 20;
    else if(/3../.test(combo) || /..3/.test(combo) || /.3./.test(combo))
        rwd += 10;

    if(/444/.test(combo))
        rwd += 60;
    else if(/44./.test(combo) || /.44/.test(combo) || /4.4/.test(combo))
        rwd += 30;
    else if(/4../.test(combo) || /..4/.test(combo) || /.4./.test(combo))
        rwd += 15;

    if(free) {
        if(/555/.test(combo))
            rwd += 150;
        else if(/55./.test(combo) || /.55/.test(combo) || /5.5/.test(combo))
            rwd += 100;
        else if(/5../.test(combo) || /..5/.test(combo) || /.5./.test(combo))
            rwd += 50;
    }


    updateCoins(player.coins.is(), player.coins.is() + rwd);
    player.coins.is(player.coins.is() + rwd);

    $("#displaybox span").effect("pulsate").text("Rewards this round: " + rwd);
}

function updateCoins(coins, change) {

    $({someValue: coins}).animate({someValue: change}, {
        duration: 500,
        easing:'swing', // can be anything
        step: function() { // called on every step
            $('#currencyholder span').eq(1).text(quizScore.questionsAnswered.length + '/' + quizScore.total)
        },
        complete:function(){
            $('#currencyholder span').eq(1).text(quizScore.questionsAnswered.length + '/' + quizScore.total)
        }
    });
}

function handleIcons() {

    $("#payoffs h3").empty();
    $("#payoffs div").empty();
    $("#botPanel img").eq(0).css('display','none');
    $("#botPanel img").eq(1).css('display','none');
    $("#botPanel img").eq(2).css('display','none');

    $("#botPanel img").eq(1).unbind('click').on('click', function() {
        $("#payoffs h3").text("Instructions");
        $("#payoffs div").text("Pull the lever to get a question. " +
                        "The complexity of the question depends on the number of question marks that appear. " +
                        "If you don't see a question mark, pull the lever again. " +
                        "Answer a question correctly to move on to the Basic, Intermediate and then the Advanced level. " +
                        "All the best!"
        )
    });
}

function victory() {
    userScore = quizScore.getScore();
    grade = quizScore.getGrade();
    $("#quiz").fadeOut();
    retry_class = "hide";
    finalText = "";
    if (grade == "F"){
        finalText = "You failed"
    }
    else if (grade == "B"){
        finalText = "You are Basic user <br>Congratulations!"
    }
    else if (grade == "I"){
        finalText = "You are Intermediate user <br>Congratulations!"
    }else if (grade == "A"){
        finalText = "You are Advanced user <br>Congratulations!"
    }
    $("#messageBox").html("<h6 class='adjust-font'>Game Over</h6>" +
        "<h5 class='adjust-font'>" + finalText + "</h5>" +
        "<h6 style='display:none;' class='adjust-font'>Correct: "+ quizScore.correct +"<br/>Incorrect: "+ quizScore.incorrect +"</h6>" +
        "<div id='retry-btn' class='"+ retry_class +"'><span>Retry</span></div>");
    $("#messages").css("display", "table");
    $("#messages").removeClass("environment");
    $("#messages").fadeIn();
    $('#retry-btn').unbind('click').on('click',retryGame);
    retry_class = "hide"; 
    setScore(quizScore.getScore());
    setComplete();
}

function commaSeparateNumber (val){
    while (/(\d+)(\d{3})/.test(val.toString())){
        val = val.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
    }
    return val;
}

function shuffle(array) {
    for (var j, x, i = array.length; i; j = Math.floor(Math.random() * i), x = array[--i], array[i] = array[j], array[j] = x);
    return array;
}

function display_payoff() {
    var info = $('#info-btn')
    if(info.hasClass('info-active')) {
        $('#payoffs').fadeOut();
        $('#botPanel').fadeOut();
        info.removeClass('info-active');
        $('#handle').css('z-index',1);
        $('#info-btn span').html('Instructions');
        $('#handle, #displaybox, #slots, #freespins, #currencyholder, #slotmachineimg').css('opacity', 1)
    }
    else {
        $('#payoffs').fadeIn();
        $('#botPanel').fadeIn();
        $("#botPanel img").eq(1).trigger('click');
        info.addClass('info-active');
        $('#handle').css('z-index',0);
        $('#info-btn span').html('Exit');
        $('#handle, #displaybox, #slots, #freespins, #currencyholder, #slotmachineimg').css('opacity', 0.2)
    }
}


function retryGame(){
    // location.reload();
    setScore(0);
    initGame();
}
 
function initInstructions(){
    $("#messages").css("display", "table");
    $("#messages").removeClass("environment");
    $("#messageBox").html("<p style='font-size:0.8em;padding: 5px;'>Click on the handle to play</p><div id='start-btn'><span>Start</span></div>")
    $("#messages").fadeIn(500);
    $('#start-btn').unbind('click').on('click',closeStartModal);
} 

function closeStartModal(){
    $("#messages").fadeOut(500);
}

function PlaySound(soundobj) {
    var thissound = document.getElementById(soundobj);
    $('#' + soundobj).stop();
    thissound.volume = 1;
    thissound.play();
    $('#' + soundobj).animate({volume: 0.1}, 8000, function () {
        thissound.volume = 1;
    });
}

function StopSound(soundobj) {
    var thissound = document.getElementById(soundobj);
    thissound.pause();
    thissound.currentTime = 0;
}

