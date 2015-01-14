
var config = {};

config.initCoins = 100;

config.base = {
    type: "environment",
    states: [
        {name: "default", representation: "<img src='http://www.toptenz.net/wp-content/uploads/2014/01/god-of-war.jpg'/>"}
    ]
}

config.slotmachine = {
    type: "environment",
    states: [
        {name: "default", representation: ""}
    ],
    locations: [
        {name: "machine", states: [
            {name: "default", representation: "<img src='assets/img/slotmachine.png' />"}
        ]},
        {name: "handle", states: [
            {name: "default", representation: "<img src='assets/img/handles.png' />"}
        ]},
        {name: "branding", states: [
            {name: "default", representation: ""}
        ]},
        {name: "logo", states: [
            {name: "default", representation: ""}
        ]}
    ]
}

config.slot1 = {
    type: "environment",
    states: [
        {
            name: "default",
            representation: ""
        }
    ],
    locations: function() {

        var slotItems = [];

        for (var i = 0; i <=5; i++) {
            slotItems.push({
                name: "slot-1-item-" + parseInt(i+1),
                states: [
                    {name: "default", representation: "<img src='assets/img/slotitems/" + parseInt(i+1) + ".png' />"}
                ]
            });
        }

        return slotItems;
    }()
}

config.slot2 = {
    type: "environment",
    states: [
        {
            name: "default",
            representation: ""
        }
    ],
    locations: function() {

        var slotItems = [];

        for (var i = 0; i <=5; i++) {
            slotItems.push({
                name: "slot-2-item-" + parseInt(i+1),
                states: [
                    {name: "default", representation: "<img src='assets/img/slotitems/" + parseInt(i+1) + ".png' />"}
                ]
            });
        }

        return slotItems;
    }()
}

config.slot3 = {
    type: "environment",
    states: [
        {
            name: "default",
            representation: ""
        }
    ],
    locations: function() {

        var slotItems = [];

        for (var i = 0; i <=5; i++) {
            slotItems.push({
                name: "slot-3-item-" + parseInt(i+1),
                states: [
                    {name: "default", representation: "<img src='assets/img/slotitems/" + parseInt(i+1) + ".png' />"}
                ]
            });
        }

        return slotItems;
    }()
}
