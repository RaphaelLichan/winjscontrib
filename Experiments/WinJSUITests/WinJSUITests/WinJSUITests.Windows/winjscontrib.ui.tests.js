var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/// <reference path="typings/typings/winjs/winjs.d.ts" />
/// <reference path="typings/winjscontrib/winjscontrib.core.d.ts" />
var __global = this;
var WinJSContrib;
(function (WinJSContrib) {
    var UI;
    (function (UI) {
        var Tests;
        (function (Tests) {
            Tests.RegisteredCampaigns = [];
            Tests.Scenario = WinJS.Binding.define({
                name: '',
                message: '',
                state: -1,
                run: null
            });
            var _Campaign = (function () {
                function _Campaign(name, scenarios) {
                    if (scenarios === void 0) { scenarios = []; }
                    this.name = name;
                    this.scenarios = scenarios;
                    this._initObservable();
                }
                _Campaign.prototype.run = function (options) {
                    var _this = this;
                    var document = new Document(__global.document.body);
                    options = options || {};
                    this.total = this.scenarios.length;
                    this.nbFail = 0;
                    this.nbSuccess = 0;
                    this.nbRun = 0;
                    this.isRunning = true;
                    this.scenarios.forEach(function (scenario) {
                        scenario.state = -1;
                    });
                    return WinJSContrib.Promise.waterfall(this.scenarios, function (scenario) {
                        return _this.runScenario(document, scenario, options);
                    }).then(function (data) {
                        _this.isRunning = false;
                        return data;
                    });
                };
                _Campaign.prototype.runScenario = function (document, scenario, options) {
                    var _this = this;
                    options = options || {};
                    this.nbRun++;
                    scenario.state = 2;
                    console.info("RUNNING " + scenario.name);
                    this.currentTest = scenario.name;
                    if (options.onteststart) {
                        options.onteststart(scenario);
                    }
                    return scenario.run(document).then(function () {
                        scenario.state = 1;
                        _this.nbSuccess++;
                        return { success: true };
                    }, function (err) {
                        scenario.state = 0;
                        _this.nbFail++;
                        if (err.stack) {
                            scenario.message = err.stack;
                        }
                        else if (err.message) {
                            scenario.message = err.message;
                        }
                        else {
                            scenario.message = JSON.stringify(err);
                        }
                        return { success: false, error: err };
                    });
                };
                return _Campaign;
            })();
            Tests.Campaign = WinJS.Class.mix(_Campaign, WinJS.Binding.mixin, WinJS.Binding.expandProperties({ nbRun: 0, nbSuccess: 0, nbFail: 0, total: 0, currentTest: 0, isRunning: false }));
            var UIElementAction = (function () {
                function UIElementAction(element) {
                    this.element = element;
                }
                UIElementAction.prototype.click = function () {
                    var el = this.element;
                    console.log("trigger click");
                    if (el.mcnTapTracking) {
                        el.mcnTapTracking.callback(el, {});
                    }
                    else {
                        this.element.click();
                    }
                };
                UIElementAction.prototype.input = function (val) {
                    this.element.value = val;
                };
                return UIElementAction;
            })();
            Tests.UIElementAction = UIElementAction;
            var UIElementCheck = (function () {
                function UIElementCheck(element) {
                    this.element = element;
                }
                UIElementCheck.prototype.hasText = function (val) {
                    throw new Error("not implemented");
                };
                UIElementCheck.prototype.hasValue = function (val) {
                    throw new Error("not implemented");
                };
                return UIElementCheck;
            })();
            Tests.UIElementCheck = UIElementCheck;
            var UIElementRoot = (function () {
                function UIElementRoot(root) {
                    this.root = root;
                }
                UIElementRoot.prototype.on = function (selector) {
                    var elt = this.root.querySelector(selector);
                    if (!elt) {
                        console.error("element action not found for " + selector);
                        throw new Error("element action not found for " + selector);
                    }
                    console.log("element found " + selector);
                    var res = new UIElementAction(elt);
                    return res;
                };
                UIElementRoot.prototype.check = function (selector) {
                    var elt = this.root.querySelector(selector);
                    if (!elt)
                        throw new Error("element check not found for " + selector);
                    var res = new UIElementCheck(elt);
                    return res;
                };
                UIElementRoot.prototype._waitForElement = function (selector, timeout) {
                    if (timeout === void 0) { timeout = 3000; }
                    var completed = false;
                    var optimeout = setTimeout(function () {
                        completed = true;
                    }, timeout);
                    var p = new WinJS.Promise(function (complete, error) {
                        var promise = p;
                        var check = function () {
                            var elt = this.root.querySelector(selector);
                            if (!completed && elt) {
                                completed = true;
                                clearTimeout(optimeout);
                                complete(elt);
                            }
                            else if (!completed) {
                                setTimeout(function () { check(); }, 50);
                            }
                            else {
                                completed = true;
                                error({ message: 'element not found ' + selector });
                            }
                        };
                        check();
                    });
                    return p;
                };
                UIElementRoot.prototype.waitForElement = function (selector, timeout) {
                    if (timeout === void 0) { timeout = 3000; }
                    return this._waitForElement(selector, timeout).then(function (elt) {
                        return new UIElementAction(elt);
                    });
                };
                UIElementRoot.prototype.waitForRoot = function (selector, timeout) {
                    if (timeout === void 0) { timeout = 3000; }
                    return this._waitForElement(selector, timeout).then(function (elt) {
                        return new UIElementRoot(elt);
                    });
                };
                return UIElementRoot;
            })();
            Tests.UIElementRoot = UIElementRoot;
            var Document = (function (_super) {
                __extends(Document, _super);
                function Document() {
                    _super.apply(this, arguments);
                }
                Document.prototype.clearHistory = function () {
                    WinJS.Navigation.history.backStack = [];
                };
                Document.prototype.navigateTo = function (url, args) {
                    var _this = this;
                    return WinJS.Navigation.navigate(url, args).then(function () {
                        return WinJS.Promise.timeout(100);
                    }).then(function () {
                        return _this.waitForPage(url);
                    });
                };
                Document.prototype.wait = function (timeout) {
                    if (timeout === void 0) { timeout = 3000; }
                    return WinJS.Promise.timeout(timeout);
                };
                Document.prototype.waitForPage = function (url, timeout) {
                    if (timeout === void 0) { timeout = 3000; }
                    var completed = false;
                    console.log("wait for page " + url);
                    var optimeout = setTimeout(function () {
                        completed = true;
                    }, timeout);
                    var p = new WinJS.Promise(function (pagecomplete, pageerror) {
                        var promise = p;
                        var check = function () {
                            if (!completed && WinJS.Navigation.location === url) {
                                var ui = WinJSContrib.UI;
                                var navigator = (ui && ui.Application) ? ui.Application.navigator : undefined;
                                if (!navigator)
                                    throw new Error("no global navigation defined");
                                var pageControl = navigator.pageControl;
                                if (pageControl) {
                                    var p = pageControl.readyComplete;
                                    if (pageControl.pageLifeCycle) {
                                        p = pageControl.pageLifeCycle.steps.ready.promise;
                                    }
                                    p.then(function () {
                                        clearTimeout(optimeout);
                                        completed = true;
                                        console.log("page found " + url);
                                        //setTimeout(function () {
                                        var res = new Page(pageControl.element);
                                        pagecomplete(res);
                                        //}, 50);
                                    });
                                }
                            }
                            else if (!completed) {
                                setTimeout(function () { check(); }, 50);
                            }
                            else {
                                completed = true;
                                console.error('page not found ' + url);
                                pageerror({ message: 'page not found ' + url });
                            }
                        };
                        check();
                    });
                    return p;
                };
                return Document;
            })(UIElementRoot);
            Tests.Document = Document;
            var Page = (function (_super) {
                __extends(Page, _super);
                function Page() {
                    _super.apply(this, arguments);
                }
                return Page;
            })(UIElementRoot);
            Tests.Page = Page;
        })(Tests = UI.Tests || (UI.Tests = {}));
    })(UI = WinJSContrib.UI || (WinJSContrib.UI = {}));
})(WinJSContrib || (WinJSContrib = {}));
//# sourceMappingURL=winjscontrib.ui.tests.js.map