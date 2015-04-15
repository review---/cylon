"use strict";

var Basestar = source("basestar"),
    Utils = source("utils");

var EventEmitter = require("events").EventEmitter;

describe("Basestar", function() {
  describe("#proxyMethods", function() {
    var methods = ["asString", "toString", "returnString"];

    var ProxyClass = function ProxyClass() {};

    ProxyClass.prototype.asString = function() {
      return "[object ProxyClass]";
    };

    ProxyClass.prototype.toString = function() {
      return "[object ProxyClass]";
    };

    ProxyClass.prototype.returnString = function(string) {
      return string;
    };

    var TestClass = function TestClass() {
      this.testInstance = new ProxyClass();
      this.proxyMethods(methods, this.testInstance, this, true);
    };

    Utils.subclass(TestClass, Basestar);

    it("can alias methods", function() {
      var testclass = new TestClass();
      expect(testclass.asString).to.be.a("function");
      expect(testclass.asString()).to.be.equal("[object ProxyClass]");
    });

    it("can alias existing methods if forced to", function() {
      var testclass = new TestClass();
      expect(testclass.toString).to.be.a("function");
      expect(testclass.toString()).to.be.equal("[object ProxyClass]");
    });

    it("can alias methods with arguments", function() {
      var testclass = new TestClass();
      expect(testclass.returnString).to.be.a("function");
      expect(testclass.returnString("testString")).to.be.equal("testString");
    });
  });

  describe("#respond", function() {
    var listener, callback, child;
    var Child = function Child() {};

    Utils.subclass(Child, Basestar);

    beforeEach(function() {
      child = new Child();

      listener = spy();
      callback = spy();

      child.on("event", listener);

      child.respond("event", callback, null, "arg1", 2, { three: true });
    });

    it("triggers the callback with all additional arguments", function() {
      expect(callback).to.be.calledWith(null, "arg1", 2, { three: true });
    });

    it("emits an event with all additional arguments", function() {
      expect(listener).to.be.calledWith("arg1", 2, { three: true });
    });

    context("when err is not null", function() {
      var errListener;

      beforeEach(function() {
        errListener = spy();
        child = new Child();
        child.on("error", errListener);
        child.respond(
          "event",
          callback,
          "Error on event!",
          "arg1",
          2,
          { three: true });
      });

      it("emits an error event", function() {
        expect(errListener).to.be.calledWith("Error on event!");
      });
    });
  });

  describe("#defineEvent", function() {
    var ProxyClass = function ProxyClass() {};

    var EmitterClass = function EmitterClass(update) {
      update || (update = false);
      this.proxy = new ProxyClass();
      this.defineEvent({
        eventName: "testevent",
        source: this,
        target: this.proxy,
        sendUpdate: update
      });
    };

    Utils.subclass(ProxyClass, Basestar);
    Utils.subclass(EmitterClass, Basestar);

    it("proxies events from one class to another", function() {
      var eventSpy = spy(),
          testclass = new EmitterClass(),
          proxy = testclass.proxy;

      proxy.on("testevent", eventSpy);
      testclass.emit("testevent", "data");

      expect(eventSpy).to.be.calledWith("data");
    });

    it("emits an 'update' event if told to", function() {
      var updateSpy = spy(),
          testclass = new EmitterClass(true),
          proxy = testclass.proxy;

      proxy.on("update", updateSpy);
      testclass.emit("testevent", "data");

      expect(updateSpy).to.be.calledWith("testevent", "data");
    });

    it("does not emit an 'update' event by default", function() {
      var updateSpy = spy(),
          testclass = new EmitterClass(),
          proxy = testclass.proxy;

      proxy.on("update", updateSpy);
      testclass.emit("testevent", "data");

      expect(updateSpy).to.not.be.calledWith("testevent", "data");
    });
  });

  describe("#defineAdaptorEvent", function() {
    var basestar;

    beforeEach(function() {
      basestar = new Basestar();
      basestar.connector = new EventEmitter();
    });

    it("proxies events between the connector and connection", function() {
      var eventSpy = spy();

      basestar.on("testevent", eventSpy);
      basestar.defineAdaptorEvent({ eventName: "testevent" });

      basestar.connector.emit("testevent", "data");
      expect(eventSpy).to.be.calledWith("data");
    });

    context("when given a string", function() {
      it("uses it as the eventName", function() {
        var eventSpy = spy();

        basestar.on("testevent", eventSpy);
        basestar.defineAdaptorEvent("testevent");

        basestar.connector.emit("testevent", "data");
        expect(eventSpy).to.be.calledWith("data");
      });
    });
  });

  describe("#defineDriverEvent", function() {
    var basestar;

    beforeEach(function() {
      basestar = new Basestar();
      basestar.connection = new EventEmitter();
    });

    it("proxies events between the connection and device", function() {
      var eventSpy = spy();

      basestar.on("testevent", eventSpy);
      basestar.defineDriverEvent({ eventName: "testevent" });

      basestar.connection.emit("testevent", "data");
      expect(eventSpy).to.be.calledWith("data");
    });

    context("when given a string", function() {
      it("uses it as the eventName", function() {
        var eventSpy = spy();

        basestar.on("testevent", eventSpy);
        basestar.defineDriverEvent("testevent");

        basestar.connection.emit("testevent", "data");
        expect(eventSpy).to.be.calledWith("data");
      });
    });
  });
});
