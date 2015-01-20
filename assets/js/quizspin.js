
var free = false;
var player = new Entity("player");

var coins = new Currency("coins");

player.createWallet(coins, 0, 9999999999, config.coins());

$(function() {
    initGame();
});

function initGame() {
    initBase();
    initPayOffArea();
    initSlotMachine();
    initSlots();
    initMessages();
//    initQuiz();
    observers();

    $("#currencyholder span").eq(1).text(player.coins.is());
}

function observers() {
    $("#handle img").unbind('click').on('click', pullHandle);
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
    }

    var ml=0;
    var combo = "";

    var m = $("#handle img");

    var machine1 = $("#slot1").slotMachine({
        active	: 1,
        delay	: 450
    });

    var machine2 = $("#slot2").slotMachine({
        active	: 1,
        delay	: 650
    });

    var machine3 = $("#slot3").slotMachine({
        active	: 1,
        delay	: 850
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
            free = true;
//            var question = Question.getByWeight(1);
//            console.log(question);
            $("#quiz").fadeIn(function() {
                Question.showQuizPanel(quiz, question);
            });
            $("#ptotemy-game").append("<div id='blank' class='environment'></div>");
            $(".slot-item-6 img").effect("pulsate");
            setTimeout(function() { $(".slot-item-6 img").attr("src", "assets/img/slotitems/7.png"); }, 400);

            freeSpin(5);
        }
    }
}

function freeSpin(n) {

    $("#freespins span").eq(1).fadeOut().text(n);
    setTimeout(function() {$("#freespins span").eq(1).fadeIn()}, 400);

//    $("#messages").fadeIn().css("display", "table");

    setTimeout(function() { $("#messages").fadeOut(); }, 2000);
    if(n>=1) {
        setTimeout(function() {
            $("#handle img").trigger('click');
            n--;
            console.log("Free spins left: " + n);
            freeSpin(n);
        }, 6000);
    }
    else {
        setTimeout(function() {
            $("#blank").remove();
            $(".slot-item-6 img").effect("pulsate");
            setTimeout(function() { $(".slot-item-6 img").attr("src", "assets/img/slotitems/6.png"); }, 400);
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

    //    $("#currencyholder span").eq(1).effect("slide").text(player.coins.is());
}

function updateCoins(coins, change) {

    $({someValue: coins}).animate({someValue: change}, {
        duration: 500,
        easing:'swing', // can be anything
        step: function() { // called on every step
            // Update the element's text with rounded-up value:
            $('#currencyholder span').eq(1).text(commaSeparateNumber(Math.round(this.someValue)));
        },
        complete:function(){
            $('#currencyholder span').eq(1).text(commaSeparateNumber(Math.round(this.someValue)));
        }
    });
}

function commaSeparateNumber (val){
    while (/(\d+)(\d{3})/.test(val.toString())){
        val = val.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
    }
    return val;
}