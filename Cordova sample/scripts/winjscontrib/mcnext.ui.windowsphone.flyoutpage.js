﻿(function () {
    'use strict';
    WinJS.Namespace.define("MCNEXT.UI", {
        parentFlyoutPage: function (element) {
            if (!element)
                return null;

            var current = element.parentNode;

            while (current) {
                if (current.mcnFlyoutPage) {
                    return current.winControl;
                }
                current = current.parentNode;
            }
        },
        FlyoutPage: WinJS.Class.mix(WinJS.Class.define(function ctor(element, options) {
            var ctrl = this;
            ctrl.element = element || document.createElement('DIV');
            options = options || {};
            ctrl.element.style.display = 'none';

            ctrl.element.mcnFlyoutPage = true;
            ctrl.element.winControl = ctrl;
            ctrl.element.classList.add('mcn-flyoutpage');
            ctrl.element.classList.add('mcn-flyout');
            ctrl.element.classList.add('win-disposable');

            ctrl.hardwareBackBtnPressedBinded = ctrl.hardwareBackBtnPressed.bind(ctrl);
            ctrl.cancelNavigationBinded = ctrl.cancelNavigation.bind(ctrl);
            WinJS.UI.setOptions(this, options);

            if (!ctrl.enterAnimation)
                ctrl.enterAnimation = options.enterAnimation || WinJS.UI.Animation.enterPage;
            if (!ctrl.exitAnimation)
                ctrl.exitAnimation = options.exitAnimation || WinJS.UI.Animation.exitPage;

            ctrl._container = document.createElement('DIV');
            ctrl._container.className = 'mcn-flyoutpage-area';

            ctrl._overlay = document.createElement('DIV');
            ctrl._overlay.className = 'mcn-flyoutpage-overlay';
            ctrl._overlay.innerHTML = '<DIV class="mcn-flyoutpage-overlay-bg"></DIV>'
            ctrl._container.appendChild(ctrl._overlay);
            ctrl._overlay.onclick = function () {
                ctrl.hide();
            }

            ctrl._wrapper = document.createElement('DIV');
            ctrl._wrapper.className = 'mcn-flyoutpage-contentwrapper';
            ctrl._container.appendChild(ctrl._wrapper);

            ctrl._wrapperArea = document.createElement('DIV');
            ctrl._wrapperArea.className = 'mcn-flyoutpage-contentwrapperarea';
            ctrl._wrapper.appendChild(ctrl._wrapperArea);

            ctrl._bg = document.createElement('DIV');
            ctrl._bg.className = 'mcn-flyoutpage-bg';
            ctrl._wrapperArea.appendChild(ctrl._bg);

            ctrl._content = document.createElement('DIV');
            ctrl._content.className = 'mcn-flyoutpage-content';
            ctrl._wrapperArea.appendChild(ctrl._content);

            if (options.uri) {
                new WinJS.UI.HtmlControl(ctrl._content, { uri: options.uri }, function (elt) {
                    ctrl.contentCtrl = elt;
                    elt.flyoutPage = ctrl;
                    ctrl.bindLinks();
                });
            }
            else {
                MCNEXT.Utils.moveChilds(ctrl.element, ctrl._content);
                ctrl.bindLinks();
            }
            ctrl.element.appendChild(ctrl._container);

        }, {
            content: {
                get: function () {
                    return this._content;
                }
            },

            placement: {
                get: function () {
                    return this._placement;
                },
                set: function (value) {
                    var ctrl = this;
                    this._placement = value;
                    if (this._placement == 'right') {
                        ctrl.element.classList.add('partial-right');
                        if (!ctrl.enterAnimation) {
                            ctrl.enterAnimation = function (elements) { return MCNEXT.UI.Animation.slideFromRight(elements, { duration: 300 }) };
                        }
                        if (!ctrl.exitAnimation) {
                            ctrl.exitAnimation = function (elements) { return MCNEXT.UI.Animation.slideToRight(elements, { duration: 120 }) };
                        }
                    }
                    else if (this._placement == 'left') {
                        ctrl.element.classList.add('partial-left');
                        if (!ctrl.enterAnimation) {
                            ctrl.enterAnimation = function (elements) { return MCNEXT.UI.Animation.slideFromLeft(elements, { duration: 300 }) };
                        }
                        if (!ctrl.exitAnimation) {
                            ctrl.exitAnimation = function (elements) { return MCNEXT.UI.Animation.slideToLeft(elements, { duration: 120 }) };
                        }
                    }
                    else if (this._placement == 'bottom') {
                        ctrl.element.classList.add('partial-bottom');
                        if (!ctrl.enterAnimation) {
                            ctrl.enterAnimation = function (elements) { return MCNEXT.UI.Animation.slideFromBottom(elements, { duration: 300 }) };
                        }
                        if (!ctrl.exitAnimation) {
                            ctrl.exitAnimation = function (elements) { return MCNEXT.UI.Animation.slideToBottom(elements, { duration: 120 }) };
                        }
                    }
                    else if (this._placement == 'top') {
                        ctrl.element.classList.add('partial-top');
                        if (!ctrl.enterAnimation) {
                            ctrl.enterAnimation = function (elements) { return MCNEXT.UI.Animation.slideFromTop(elements, { duration: 300 }) };
                        }
                        if (!ctrl.exitAnimation) {
                            ctrl.exitAnimation = function (elements) { return MCNEXT.UI.Animation.slideToTop(elements, { duration: 120 }) };
                        }
                    }
                }
            },

            hardwareBackBtnPressed: function (arg) {
                var ctrl = this;
                var idx = MCNEXT.UI.FlyoutPage.openPages.indexOf(ctrl);
                if (idx == MCNEXT.UI.FlyoutPage.openPages.length - 1) {
                    ctrl.hide();
                    arg.handled = true;
                    if (arg.preventDefault)
                        arg.preventDefault();
                }
            },

            cancelNavigation: function (args) {
                //this.eventTracker.addEvent(nav, 'beforenavigate', this._beforeNavigate.bind(this));
                var p = new WinJS.Promise(function (c) { });
                args.detail.setPromise(p);
                setImmediate(function () {
                    p.cancel();
                });
            },

            addContentElement: function (element) {
                var ctrl = this;
                ctrl._content.appendChild(element);
            },

            pick: function (url, options) {
                var ctrl = this;
                options = options || {};
                options.uri = url;
                var p = new WinJS.Promise(function (complete, error) {
                    new WinJS.UI.HtmlControl(ctrl._content, options, function (elt) {
                        ctrl.contentCtrl = elt;
                        elt.close = function (result) {
                            ctrl.hide(result);
                        }
                        elt.flyoutPage = ctrl;
                        ctrl.bindLinks();
                        ctrl.show();

                        ctrl.onbeforehide = function () {
                            ctrl.onbeforehide = null;
                            var result = ctrl.result;
                            setImmediate(function () {
                                complete(result);
                            });
                        };
                        ctrl.onafterhide = function () {
                            ctrl.onafterhide = null;
                            WinJS.Utilities.disposeSubTree(ctrl._content);
                            if (ctrl.contentCtrl.unload) {
                                ctrl.contentCtrl.unload();
                            }
                            ctrl.contentCtrl = null;
                            ctrl._content.innerHTML = '';
                        };
                    });
                });

                return p;
            },

            show: function () {
                var ctrl = this;
                if (ctrl.contentCtrl && ctrl.contentCtrl.beforeshow) {
                    ctrl.contentCtrl.beforeshow();
                }
                this.dispatchEvent("beforeshow");
                ctrl.element.style.display = '';
                ctrl._wrapper.style.opacity = '0';
                ctrl._wrapper.style.display = '';
                ctrl._overlay.style.opacity = '0';



                WinJS.Navigation.addEventListener('beforenavigate', this.cancelNavigationBinded);
                if (window.Windows && window.Windows.Phone)
                    Windows.Phone.UI.Input.HardwareButtons.addEventListener("backpressed", this.hardwareBackBtnPressedBinded);
                else
                    document.addEventListener("backbutton", this.hardwareBackBtnPressedBinded, true);

                WinJS.UI.Animation.fadeIn(ctrl._overlay);
                return ctrl.enterAnimation(ctrl._wrapper).then(function () {
                    MCNEXT.UI.FlyoutPage.openPages.push(ctrl);
                    if (ctrl.contentCtrl && ctrl.contentCtrl.aftershow) {
                        ctrl.contentCtrl.aftershow();
                    }
                    ctrl.dispatchEvent("aftershow");
                    if (MCNEXT.UI.Application && MCNEXT.UI.Application.navigator)
                        MCNEXT.UI.Application.navigator.addLock();
                });
            },

            hide: function (result) {
                var ctrl = this;
                ctrl.result = result;
                if (ctrl.contentCtrl && ctrl.contentCtrl.beforehide) {
                    ctrl.contentCtrl.beforehide();
                }
                this.dispatchEvent("beforehide");

                if (MCNEXT.UI.Application && MCNEXT.UI.Application.navigator)
                    MCNEXT.UI.Application.navigator.removeLock();

                WinJS.Navigation.removeEventListener('beforenavigate', this.cancelNavigationBinded);
                if (window.Windows && window.Windows.Phone)
                    Windows.Phone.UI.Input.HardwareButtons.removeEventListener("backpressed", this.hardwareBackBtnPressedBinded);
                else
                    document.removeEventListener("backbutton", this.hardwareBackBtnPressedBinded);

                return ctrl.exitAnimation(ctrl._wrapper).then(function () {
                    ctrl._wrapper.style.display = 'none';
                    return WinJS.UI.Animation.fadeOut(ctrl._overlay);
                }).then(function () {
                    var idx = MCNEXT.UI.FlyoutPage.openPages.indexOf(ctrl);
                    MCNEXT.UI.FlyoutPage.openPages.splice(idx, 1);



                    ctrl.element.style.display = 'none';
                    if (ctrl.contentCtrl && ctrl.contentCtrl.afterhide) {
                        ctrl.contentCtrl.afterhide();
                    }
                    ctrl.dispatchEvent("afterhide");
                });


            },

            bindLinks: function () {
                var ctrl = this;
                $('*[data-flyout]', ctrl.element).each(function () {
                    var target = $(this).data('flyout');

                    if (target) {
                        $(this).tap(function (eltarg) {
                            var flyout = $(target);
                            if (flyout.length && flyout[0].winControl && flyout[0].winControl.show) {
                                //ctrl.hide().done(function () {
                                //    flyout[0].winControl.show();
                                //});

                                ctrl.element.style.zIndex = '500';
                                ctrl.hide().done(function () {
                                    ctrl.element.style.zIndex = '';
                                });
                                flyout[0].winControl.show();
                            }
                        });
                    }
                });

                $('*[data-link]', ctrl.element).each(function () {
                    var target = $(this).data('link');

                    if (target && target.indexOf('/') < 0) {
                        var tmp = MCNEXT.Utils.readProperty(window, target);
                        if (tmp) {
                            target = tmp;
                        }
                    }

                    if (target) {
                        $(this).tap(function (eltarg) {
                            var actionArgs = $(eltarg).data('link-args');
                            if (actionArgs && typeof actionArgs == 'string') {
                                try {
                                    var tmp = MCNEXT.Utils.readValue(eltarg, actionArgs);
                                    if (tmp) {
                                        actionArgs = tmp;
                                    }
                                    else {
                                        actionArgs = JSON.parse(actionArgs);
                                    }
                                }
                                catch (exception) {
                                    return;
                                }
                            }

                            ctrl.hide();
                            WinJS.Navigation.navigate(target, actionArgs);
                        });
                    }
                });

                $('*[data-action]', ctrl.element).each(function () {
                    var actionName = $(this).data('action');

                    var action = ctrl._content.winControl[actionName];
                    if (action && typeof action === 'function') {
                        $(this).tap(function (eltarg) {
                            var actionArgs = $(eltarg).data('action-args');
                            if (actionArgs && typeof actionArgs == 'string') {
                                try {
                                    var tmp = MCNEXT.Utils.readValue(eltarg, actionArgs);
                                    if (tmp) {
                                        actionArgs = tmp;
                                    }
                                    else {
                                        actionArgs = JSON.parse(actionArgs);
                                    }
                                }
                                catch (exception) {
                                    return;
                                }
                            }
                            ctrl.hide();
                            ctrl._content.winControl[actionName].bind(ctrl._content.winControl)({ elt: eltarg, args: actionArgs });
                        });
                    }
                });
            },

            dispose: function () {
                WinJS.Utilities.disposeSubTree(this.element);
            }
        }),
        WinJS.Utilities.eventMixin,
        WinJS.Utilities.createEventProperties("beforeshow", "beforehide", "aftershow", "afterhide"))
    });
    MCNEXT.UI.FlyoutPage.openPages = [];

    WinJS.Namespace.define("MCNEXT.UI.WindowsPhone", {
        FlyoutPage: MCNEXT.UI.FlyoutPage
    });

    WinJS.Namespace.define("MCNEXT.UI", {
        FlyoutPicker: WinJS.Class.mix(WinJS.Class.define(function ctor(element, options) {
            var ctrl = this;
            ctrl.element = element || document.createElement('DIV');
            options = options || {};
            ctrl.element.style.display = 'none';
            ctrl.element.classList.add('mcn-flyoutpicker');
            ctrl.element.classList.add('win-disposable');
            ctrl.element.mcnFlyoutPage = true;
            ctrl.element.winControl = ctrl;
            ctrl.flyoutPage = new MCNEXT.UI.FlyoutPage(null, options);
            var parentFlyoutPage = MCNEXT.UI.parentFlyoutPage(element);
            if (parentFlyoutPage) {
                parentFlyoutPage.addContentElement(ctrl.flyoutPage.element);
            }
            else {
                document.body.appendChild(ctrl.flyoutPage.element);
            }
        }, {
            dispose: function () {
                var ctrl = this;
                $(ctrl.flyoutPage.element).remove();
                $(ctrl.element).remove();
                ctrl.flyoutPage = null;
            },

            addContentElement: function (element) {
                var ctrl = this;
                ctrl.flyoutPage.addContentElement(element);
            },

            pick: function (url, options) {
                var ctrl = this;
                return ctrl.flyoutPage.pick(url, options);
            }
        }),
        WinJS.UI.DOMEventMixin,
        WinJS.Utilities.createEventProperties(""))
    });
})();