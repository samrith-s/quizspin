
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
        {name: "payoffs", states: [
            {name: "default", representation: ""}
        ]},
        {name: "iconsPanel", states: [
            {name: "default", representation: ""}
        ]},
        {name: "currencyholder", states: [
            {name: "default", representation: ""}
        ]}
    ]
}