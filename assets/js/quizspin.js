var allSlots = [];

$(function() {
    initGame();
});

function initGame() {
    initSlotMachine();
    initSlots();
    observers();
}

function observers() {
    $("#handle img").unbind('click').on('click', pullHandle);
}



function initSlots() {

    for(var i=0; i<3; i++) {

        var thisSlot = "slot" + (i+1);
        $("#slots").append("<div id='" + thisSlot + "'></div>");

        for(var j=0; j<5; j++) {
            $("#" + thisSlot).append("<div class='slots slot-item-" + (i+1) + "'>" +
                "<img src='assets/img/slotitems/" + (i+1) + ".png' /></div>");
        }
    }
}

function spinSlots(allSlots) {
    for(i in allSlots) {
        allSlots[i].shuffle(5);
        console.log(allSlots[i]);
    }
}

function initSlotMachine() {
    var slotmachine = new Environment("slotmachine");
    loadConfig(slotmachine);
}

function pullHandle() {
    var ml=0;

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
    machine3.shuffle(5);

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

                            complete:
                                function() {
                                    m.removeClass("no-click");

                                },

                            duration: 1800
                        }
                    );
                }
        }
    );
}