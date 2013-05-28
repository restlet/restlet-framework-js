var Class = require("../../build/nodejs/lib/commons.js").Class;

var Clazz1 = new Class({
  name: "Clazz1",
  initialize: function() {
    //console.log("initialize - 1");
  },
  test: function() {
    //console.log("test - 1");
  }
});

var Clazz2 = new Class(Clazz1, {
  name: "Clazz2",
  initialize: function() {
    //console.log("initialize - 2");
    this.callSuperCstr();
  },
  test: function() {
    //console.log("test - 2");
    this.callSuper("test");
  }
});

var Clazz3 = new Class(Clazz2, {
  name: "Clazz3",
  initialize: function() {
    //console.log("initialize - 3");
    this.callSuperCstr();
  },
  test: function() {
    //console.log("test - 3");
    this.callSuper("test");
  }
});

var c = new Clazz2();
c.test();

var c = new Clazz3();
c.test();