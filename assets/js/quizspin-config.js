
var config = {};

config.currencyName = "Coins"
config.coins = function() {
    return 100; //value to be returned
}

config.base = {
    type: "environment",
    states: [
        {name: "default", representation: "<img src='http://quizspin.ptotem.in/img/quizspin/background.jpg'/>"}
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
        ]},
        {name: "slots", states: [
            {name: "default", representation: ""}
        ]}
    ]
}

config.payofftable = {
    type: "environment",
    states: [
        {name: "default", representation: ""}
    ],
    locations: [
        {name: "currencyholder", states: [
            {name: "default", representation: "<span>" + config.currencyName + "</span><span>" + config.coins() + "</span>"}
        ]},
        {name: "payoffs", states: [
            {name: "default", representation: "<div><h3>Payoff Table</h3></div>"}
        ]},
        {name: "iconsPanel", states: [
            {name: "default", representation:
                "<div>" +
                    "<img src='assets/img/payoff.png' />" +
                    "<img src='assets/img/info.png' />" +
                    "<img src='assets/img/about.png' />" +
                    "<img src='assets/img/exit.png' />" +
                "</div>"}
        ]}
    ]
}