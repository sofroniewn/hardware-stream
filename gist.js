var Lightning = require('lightning.js');

var lightning = new Lightning();

lightning.lineStreaming([1,1,2,3,5,8,13,21])
    .then(function(viz) {
        viz.open()
        setInterval(function() {
            viz.appendData([Math.random()]); // appends to existing data
            // or
            // viz.updateData([Math.random()]); // replaces existing data
        }, 1000);
    });