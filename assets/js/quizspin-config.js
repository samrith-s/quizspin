
var config = {};

config.currencyName = "Coins"
config.coins = function() {
    return 100; //value to be returned
}

config.player = {
    type: "entity",
    states: [
        {name: "default", representation: ""}
    ]
}

config.base = {
    type: "environment",
    states: [
        {name: "default", representation: "<img src='assets/img/background.jpg'/>"}
    ]
}

config.slotmachine = {
    type: "environment",
    states: [
        {name: "default", representation: ""}
    ],
    locations: [
        // {name: "freespins", states: [
        //     {name: "default", representation: "<span>Free Spins</span><br /><span>0</span>"}
        // ]},
        {name: "machine", states: [
            {name: "default", representation: "<img src='assets/img/slotmachine.png' id='slotmachineimg'/><div class='location' id='handle'><img src='assets/img/handles.png'></div><div id='slots'></div><div id='displaybox'><span>Rewards this round: 0</span></div><div id='freespins'><span>Free Spins</span><br /><span>0</span></div><div id='currencyholder'><span>" + config.currencyName + "</span><span>" + config.coins() + "</span></div><div id='info-btn'><span>Info</span></div><div id='payofftable'><div id='payoffs'><h3>Payoff Table</h3><div></div></div><div id='botPanel'><div><img src='assets/img/payoff.png' /><img src='assets/img/info.png' /><img src='assets/img/about.png' /></div></div></div>"}
        ]},
        // {name: "handle", states: [
        //     {name: "default", representation: "<img src='assets/img/handles.png' />"}
        // ]},
        {name: "branding", states: [
            {name: "default", representation: ""}
        ]},
        {name: "logo", states: [
            {name: "default", representation: ""}
        ]},
        // {name: "slots", states: [
        //     {name: "default", representation: ""}
        // ]},
        // {name: "displaybox", states: [
        //     {name: "default", representation: "<span>Rewards this round: 0</span>"}
        // ]}
    ]
}

config.payofftable = {
    type: "environment",
    states: [
        {name: "default", representation: ""}
    ],
    locations: [
        // {name: "currencyholder", states: [
        //     {name: "default", representation: "<span>" + config.currencyName + "</span><span>" + config.coins() + "</span>"}
        // ]},
        // {name: "payoffs", states: [
        //     {name: "default", representation: "<h3>Payoff Table</h3><div></div>"}
        // ]},
        // {name: "botPanel", states: [
        //     {name: "default", representation:
        //         "<div>" +
        //             "<img src='assets/img/payoff.png' />" +
        //             "<img src='assets/img/info.png' />" +
        //             "<img src='assets/img/about.png' />" +
        //         "</div>"}
        // ]}
    ]
}

config.messages = {
    type: "environment",
    states: [
        {name: "default", representation: ""}
    ],
    locations: [
        {name: "messageBox", states: [
            {name: "default", representation: ""}
        ]}
    ]
}
