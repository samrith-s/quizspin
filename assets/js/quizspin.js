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

    var slot1, slot2, slot3;
    slot1 = new Environment("slot1");
    slot2 = new Environment("slot2");
    slot3 = new Environment("slot3");

    loadConfig(slot1);
    loadConfig(slot2);
    loadConfig(slot3);


    $("#slot1, #slot2, #slot3").wrap("<div class='slotholder'></div>");
    $(".slotholder").wrapAll("<div class='slotwrapper'></div>");
    $(".slotwrapper").css({width: ''});

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

    var allMachines = [machine1, machine2, machine3];
    allSlots = allMachines;
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

    spinSlots(allSlots);

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