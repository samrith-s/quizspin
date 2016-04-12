
var free = false;
var player = new Entity("player");

var coins = new Currency("coins");

var Score = function(totalQuestions) {
    this.correct = 0;
    this.incorrect = 0;
    this.total = totalQuestions;
    this.questionsAnswered = [];
    this.sum= 0;
};
Score.prototype.addCorrect = function(question) {
    this.correct++;
    this.questionsAnswered.push(question);
};
Score.prototype.addIncorrect = function(question) {
    this.incorrect++;
    this.questionsAnswered.push(question);
}
Score.prototype.getScore = function() {
    return Math.round((this.correct/this.total)*100);
}
// var quizScore = new Score(questionbank.questions.length);
player.createWallet(coins, 0, 9999999999, config.coins());

var quesbank = [];



$(function() {
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
    initPayOffTable();

    
    $("#statement-area, #options, #knowmore").wrapAll("<div id='quizinnerwrapper'></div>");
    quesbank = Question.getTopicWiseRandomQuestions(questionbank.questionsFromTopic);
    totalQue = Question.getTopicWiseRandomQuestions(questionbank.questionsFromTopic);
    // quesbank = shuffle(quesbank);
    // console.log(quesbank);
    quizScore = new Score(quesbank.length);
    // quesbank = shuffleQuestions(quesbank);
    $("#currencyholder span").eq(1).text('0/' + quesbank.length);
}

function observers() {
    $("#handle img").unbind('click').on('click', pullHandle);
    $('#info-btn').unbind('click').on('click',display_payoff);
    
    // $('#info-btn').addClass('active-info-btn');
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
    initPayOffTable();
}

function initPayOffTable() {
    $("#payoffs h3").empty();
    $("#payoffs h3").text("Payoff Table");
    $("#payoffs div").empty();

    for(var i=5; i>=1; i--) {
        var rwd;

        if(i==5) rwd = 60;
        else if(i==4) rwd = 40;
        else if(i==3) rwd = 30;
        else if(i==2) rwd = 20;
        else rwd = 10;

        if(i==4 || i ==5) {
            for(var j=3; j>=1; j--) {
                $("#payoffs div").append("<img src='assets/img/slotitems/" + i + ".png' />");
            }
            $("#payoffs div").append(" " + rwd + " ");

            for(var j=2; j>=1; j--) {
                $("#payoffs div").append("<img src='assets/img/slotitems/" + i + ".png' />");
            }
            $("#payoffs div").append(" " + (rwd/2) + " ");
            $("#payoffs div").append("<img src='assets/img/slotitems/" + i + ".png' />");
            $("#payoffs div").append(" " + Math.floor(rwd/4));
        }
        else {
            for(var j=3; j>=1; j--) {
                $("#payoffs div").append("<img src='assets/img/slotitems/" + i + ".png' />");
            }
            $("#payoffs div").append(" " + rwd + " ");

            for(var j=2; j>=1; j--) {
                $("#payoffs div").append("<img src='assets/img/slotitems/" + i + ".png' />");
            }
            $("#payoffs div").append(" " + Math.floor(rwd/2));
        }
        $("#payoffs div").append("<br />");
    }

    $("#payoffs div").append("<span><img src='assets/img/slotitems/6.png' /> Answer questions to win big!</span>");
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

    var machine1 = $("#slot1").slotMachine({
        active  : 1,
        delay   : 450
    });

    var machine2 = $("#slot2").slotMachine({
        active  : 1,
        delay   : 650
    });

    var machine3 = $("#slot3").slotMachine({
        active  : 1,
        delay   : 850
    });

    machine1.shuffle(5);
    machine2.shuffle(5);
    machine3.shuffle(5, function() {
        processCombo(machine1, machine2, machine3);
        $("#handle img").removeClass("no-click");
    });

    m.animate({
            "width": "500px"
        },
        {
            start:
                function() {
                    m.addClass("no-click");
                },

            step:
                function(now, fx) {
                    ml = ml+50;

                    if(ml > 450)
                        ml = 450;

                    m.css("margin-left", "-" + ml + "px");
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
                }
        }
    );
}

function processCombo(machine1, machine2, machine3) {
    var combo = machine1.active + "" + machine2.active + "" + machine3.active;
    rewards(combo);

    if(!free)
    {
        if(machine1.active == 5 || machine2.active == 5 || machine3.active == 5) {
                playQuiz();
        }
    }
}

function playQuiz() {
    var question = quesbank.shift();
    // console.log(question)


    $("#quiz").css({display:"table"}); Question.showQuizPanel(quiz, question);
    $("#quiz").fadeIn(1000);

    $(question).unbind('answered').on('answered', function(e, data) {
        if(data.correct) {
            quizScore.addCorrect(question);
            // setScore(quizScore.getScore());
            //increment score in scorm and commit
            if(quesbank.length==0) {
                victory();
                // set completion, set score and commit
                // setComplete()

            }
            else {
                free = true;
                freeSpin(1);
                $("#quiz").fadeOut(500);
                $("#messages").css("display", "table");
                $("#messages").removeClass("environment");
                $("#messageBox").html("<p>You have won 1 free spin!</p>" +
                    "<p>The <img src='assets/img/slotitems/7.png' /> gives you 50 bonus per slot!</p>")
                $("#messages").fadeIn(500);
                setTimeout(function() { $("#messages").fadeOut(500);}, 5000);
            }
        }
        else {
            free = false;
            // quesbank.unshift(question);
            quizScore.addIncorrect(question);
            $("#quiz").fadeOut(500);
        }
    });
}

function freeSpin(n) {
    $("#blank").remove();
    $("#ptotemy-game").append("<div id='blank' class='environment'></div>");
    $("#freespins span").eq(1).fadeOut().text(n);
    setTimeout(function() {$("#freespins span").eq(1).fadeIn()}, 400);
    $(".slot-item-6 img").effect("pulsate");

    setTimeout(function() { $("#messages").fadeOut(); }, 2000);
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

//    rwd = machine1.active + "" + machine2.active + "" + machine3.active;

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
            // Update the element's text with rounded-up value:
            // $('#currencyholder span').eq(1).text(commaSeparateNumber(Math.round(this.someValue)));
            $('#currencyholder span').eq(1).text(quizScore.correct + '/' + totalQue.length);
        },
        complete:function(){
            // $('#currencyholder span').eq(1).text(commaSeparateNumber(Math.round(this.someValue)));
            $('#currencyholder span').eq(1).text(quizScore.correct + '/' + totalQue.length);
            // setScore(change);
        }
    });
}

function handleIcons() {

    $("#payoffs h3").empty();
    $("#payoffs div").empty();

    $("#botPanel img").eq(0).unbind('click').on('click', function() {
        initPayOffTable();
        // console.log("CLICKED!");
    });
    $("#botPanel img").eq(1).unbind('click').on('click', function() {
        $("#payoffs h3").text("Instructions");
        $("#payoffs div").text("The main aim of the game is to spin the slot machine and get points." +
                        " Earn more points if you answer questions right. " +
                        "Free spins are awarded for every correct answer."
        )
    });
    $("#botPanel img").eq(2).unbind('click').on('click', function() {
        $("#payoffs h3").text("Story");
        $("#payoffs div").text("Welcome to Quiz Spin. " +
        "Spin the slots to try your luck. But as they say, you can make your own luck. " +
        "Can you? Answer the questions to win big and leave lady luck gasping... ");
    });

}

function victory() {
    percentage = (quizScore.correct/totalQue.length)*100
    $("#quiz").fadeOut();
    $("#messageBox").html("<h6 class='adjust-font'>Game Over</h6>" +
        "<h4 class='adjust-font'>Congratulations!<br/>You scored "+ percentage + "%</h4>" +
        "<h6 class='adjust-font'>Correct: "+ quizScore.correct +"<br/>Incorrect: "+ quizScore.incorrect +"</h6>" +
        "<div id='retry-btn'><span>Retry</span></div>");
    $("#messages").css("display", "table");
    $("#messages").removeClass("environment");
    $("#messages").fadeIn();
    $('#retry-btn').unbind('click').on('click',retryGame);
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

// function shuffleQuestions(array) {
//     var seq = array.slice(0, questionbank.sequentialQuestions);
//     var nonSeq = shuffle(array.slice(questionbank.sequentialQuestions));
//     return seq.concat(nonSeq).reverse();
// }

function display_payoff() {
    // $('#payoffs').show();
    // $('#botPanel').show();
    var info = $('#info-btn')
    if(info.hasClass('info-active')) {
        $('#payoffs').fadeOut();
        $('#botPanel').fadeOut();
        info.removeClass('info-active');
        $('#handle').css('z-index',1);
        $('#info-btn span').html('Info');
        $('#handle, #displaybox, #slots, #freespins, #currencyholder, #slotmachineimg').css('opacity', 1)
    }
    else {
        $('#payoffs').fadeIn();
        $('#botPanel').fadeIn();
        info.addClass('info-active');
        $('#handle').css('z-index',0);
        $('#info-btn span').html('Exit');
        $('#handle, #displaybox, #slots, #freespins, #currencyholder, #slotmachineimg').css('opacity', 0.2)
    }
}


function retryGame(){
    location.reload();
}
