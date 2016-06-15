
var config = {};

config.currencyName = "Questions"
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
        
        {name: "machine", states: [
            {name: "default", representation: "<img src='assets/img/slotmachine.png' id='slotmachineimg'/><div class='location' id='handle'><img src='assets/img/handles.png'></div><div id='slots'></div><div id='displaybox'><span>Rewards this round: 0</span></div><div id='freespins'><span>Score</span><br /><span>0</span></div><div id='currencyholder'><span>" + config.currencyName + "</span><span>" + config.coins() + "</span></div><div id='info-btn'><span>Instructions</span></div><div id='payofftable'><div id='payoffs'><h3>Payoff Table</h3><div></div></div><div id='botPanel'><div><img src='assets/img/payoff.png' /><img src='assets/img/info.png' /><img src='assets/img/about.png' /></div></div></div>"}
        ]},
        {name: "branding", states: [
            {name: "default", representation: ""}
        ]},
        {name: "logo", states: [
            {name: "default", representation: ""}
        ]},
    ]
}

config.payofftable = {
    type: "environment",
    states: [
        {name: "default", representation: ""}
    ],
    locations: [
       
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
