﻿//you may use this code freely as long as you keep the copyright notice and don't 
// alter the file name and the namespaces
//This code is provided as is and we could not be responsible for what you are making with it
//project is available at http://winjscontrib.codeplex.com

var WinJSContrib = WinJSContrib || {};
WinJSContrib.UI = WinJSContrib.UI || {};

/**
 * @namespace
 */
WinJSContrib.UI.Animation = WinJSContrib.UI.Animation || {};

(function (Animation) {
    var equivalents = WinJS.Utilities._browserStyleEquivalents || { transform: { cssName: 'transform' } };

    /**
     * configurable fade out
     * @param {Object} hidden element or array of elements
     * @param {number} duration fading duration
     * @param {Object} options options like delay, easing
     */
    WinJSContrib.UI.Animation.fadeOut = function (hidden, duration, options) {
        options = options || {};
        var args = {
            property: "opacity",
            delay: options.delay || 0,
            duration: duration || options.duration || 167,
            timing: options.easing || "ease-in-out",
            to: 0
        };

        return WinJS.UI.executeTransition(hidden, args);
    }

    /**
     * configurable fade in
     * @param {Object} hidden element or array of elements
     * @param {number} duration fading duration
     * @param {Object} options options like delay, easing
     */
    WinJSContrib.UI.Animation.fadeIn = function (hidden, duration, options) {
        options = options || {};
        return WinJS.UI.executeTransition(
            hidden,
            {
                property: "opacity",
                delay: options.delay || 0,
                duration: duration || options.duration || 167,
                timing: options.easing || "ease-in-out",
                to: 1
            });
    }

    function staggerDelay(initialDelay, extraDelay, delayFactor, delayCap) {
        return function (i) {
            var ret = initialDelay;
            for (var j = 0; j < i; j++) {
                extraDelay *= delayFactor;
                ret += extraDelay;
            }
            if (delayCap) {
                ret = Math.min(ret, delayCap);
            }
            return ret;
        };
    }    

    /**
     * configurable page exit effect
     * @param {Object} hidden element or array of elements
     * @param {number} duration transition duration
     * @param {Object} options options like delay, easing
     */
    WinJSContrib.UI.Animation.pageExit = function (hidden, duration, options) {
        options = options || {};
        var args = {
            property: "opacity",
            delay: options.delay || staggerDelay(5, 83, 1, 333),
            duration: duration || options.duration || 450,
            timing: options.easing || "ease-in",
            to: 0
        };

        return WinJS.UI.executeTransition(hidden, args);
    }

    /**
     * configurable page enter effect
     * @param {Object} elements element or array of elements
     * @param {number} duration transition duration
     * @param {Object} options options like delay, easing
     */
    WinJSContrib.UI.Animation.enterPage = function (elements, duration, options) {
        options = options || {};
        var args = {
            property: "opacity",
            delay: options.delay || staggerDelay(5, 83, 1, 333),
            duration: duration || options.duration || 700,
            timing: options.easing || "ease-out",
            to: 1
        };

        return WinJS.UI.executeTransition(elements, args);
    }

    function slideAnim(element, keyframeName, isIn, options) {
        var offsetArray;
        var options = options || {};

        var duration = options.duration || 400;
        var delay = options.delay || 5;
        var stagger = staggerDelay(delay, 83, 1, duration - 2 * delay);
        var animationParams = {
            keyframe: keyframeName,
            property: equivalents.transform.cssName,
            delay: stagger,
            duration: duration,
            timing: options.easing || "cubic-bezier(0.1, 0.9, 0.2, 1)"
        }

        var promise1 = WinJS.UI.executeAnimation(element, animationParams);

        var transitionParams = {
            property: "opacity",
            delay: stagger,
            duration: duration / 2,
            timing: "ease-in",
            from: 0,
            to: 1
        }

        if (!isIn) {
            transitionParams.from = 1;
            transitionParams.to = 0;
            if (transitionParams.delay < duration / 2)
                transitionParams.delay = duration / 2;
        }
        var promise2 = WinJS.UI.executeTransition(element, transitionParams);
        return WinJS.Promise.join([promise1, promise2]);
    }

    WinJSContrib.UI.Animation.custom = slideAnim;

    /**
     * configurable slide effect
     * @param {Object} elements element or array of elements
     * @param {Object} options options like duration, delay, easing
     */
    WinJSContrib.UI.Animation.slideFromBottom = function (elements, options) {
        return slideAnim(elements, 'WinJSContrib-slideFromBottom', true, options);
    }

    /**
     * configurable slide effect
     * @param {Object} elements element or array of elements
     * @param {Object} options options like duration, delay, easing
     */
    WinJSContrib.UI.Animation.slideFromTop = function (elements, options) {
        return slideAnim(elements, 'WinJSContrib-slideFromTop', true, options);
    }

    /**
     * configurable slide effect
     * @param {Object} elements element or array of elements
     * @param {Object} options options like duration, delay, easing
     */
    WinJSContrib.UI.Animation.slideFromLeft = function (elements, options) {
        return slideAnim(elements, 'WinJSContrib-slideFromLeft', true, options);
    }

    /**
     * configurable slide effect
     * @param {Object} elements element or array of elements
     * @param {Object} options options like duration, delay, easing
     */
    WinJSContrib.UI.Animation.slideFromRight = function (elements, options) {
        return slideAnim(elements, 'WinJSContrib-slideFromRight', true, options);
    }

    /**
     * configurable slide effect
     * @param {Object} elements element or array of elements
     * @param {Object} options options like duration, delay, easing
     */
    WinJSContrib.UI.Animation.slideToBottom = function (elements, options) {
        return slideAnim(elements, 'WinJSContrib-slideToBottom', false, options);
    }

    /**
     * configurable slide effect
     * @param {Object} elements element or array of elements
     * @param {Object} options options like duration, delay, easing
     */
    WinJSContrib.UI.Animation.slideToTop = function (elements, options) {
        return slideAnim(elements, 'WinJSContrib-slideToTop', false, options);
    }

    /**
     * configurable slide effect
     * @param {Object} elements element or array of elements
     * @param {Object} options options like duration, delay, easing
     */
    WinJSContrib.UI.Animation.slideToLeft = function (elements, options) {
        return slideAnim(elements, 'WinJSContrib-slideToLeft', false, options);
    }

    /**
     * configurable slide effect
     * @param {Object} elements element or array of elements
     * @param {Object} options options like duration, delay, easing
     */
    WinJSContrib.UI.Animation.slideToRight = function (elements, options) {
        return slideAnim(elements, 'WinJSContrib-slideToRight', false, options);
    }

    /**
     * animation for tab exit
     * @param {Object} elements element or array of elements
     * @param {Object} options options like duration, delay, easing
     */
    WinJSContrib.UI.Animation.tabExitPage = function (element, options) {
        var offsetArray;
        options = options || {};
        var stagger = staggerDelay(options.delay || 5, 83, 1, 333)
        var animationParams = {
            keyframe: "WinJSContrib-tabExitPage",
            property: equivalents.transform.cssName,
            delay: stagger,
            duration: options.duration || 200,
            timing: "ease-in"
        }

        var promise1 = WinJS.UI.executeAnimation(element, animationParams);

        var transitionParams = {
            property: "opacity",
            delay: stagger,
            duration: options.duration || 200,
            timing: "linear",
            from: 1,
            to: 0
        }
        var promise2 = WinJS.UI.executeTransition(element, transitionParams);
        return WinJS.Promise.join([promise1, promise2]);
    }

    /**
     * animation for tab exit
     * @param {Object} elements element or array of elements
     * @param {Object} options options like duration, delay, easing
     */
    WinJSContrib.UI.Animation.tabEnterPage = function (element, options) {
        var offsetArray;
        options = options || {};
        var stagger = staggerDelay(options.delay || 50, 83, 1, 333);
        var promise1 = WinJS.UI.executeAnimation(
            element,
            {
                keyframe: "WinJSContrib-tabEnterPage",
                property: equivalents.transform.cssName,
                delay: stagger,
                duration: options.duration || 300,
                timing: "ease-out"
            });
        var promise2 = WinJS.UI.executeTransition(
            element,
            {
                property: "opacity",
                delay: stagger,
                duration: options.duration || 300,
                timing: "ease-out",
                from: 0,
                to: 1
            });
        return WinJS.Promise.join([promise1, promise2]);
    }

    /**
     * exit and grow animation
     * @param {Object} elements element or array of elements
     * @param {number} duration transition duration
     * @param {Object} options options like delay, easing
     */
    WinJSContrib.UI.Animation.exitGrow = function (element, duration, options) {
        var offsetArray;
        options = options || {};
        var stagger = staggerDelay(options.delay || 0, 10, 1, 50);
        var promise1 = WinJS.UI.executeAnimation(
            element,
            {
                keyframe: "WinJSContrib-exitGrow",
                property: equivalents.transform.cssName,
                delay: stagger,
                duration: duration || options.duration || 300,
                timing: options.easing || "ease-in"
            });
        var promise2 = WinJS.UI.executeTransition(
            element,
            {
                property: "opacity",
                delay: stagger,
                duration: duration || options.duration || 300,
                timing: options.easing || "ease-in",
                from: 1,
                to: 0
            });
        return WinJS.Promise.join([promise1, promise2]);
    }

    /**
     * exit and shrink animation
     * @param {Object} elements element or array of elements
     * @param {number} duration transition duration
     * @param {Object} options options like delay, easing
     */
    WinJSContrib.UI.Animation.exitShrink = function (element, duration, options) {
        var offsetArray;
        options = options || {};
        var stagger = staggerDelay(options.delay || 10, 30, 1, 50);
        var promise1 = WinJS.UI.executeAnimation(
            element,
            {
                keyframe: "WinJSContrib-exitShrink",
                property: equivalents.transform.cssName,
                delay: stagger,
                duration: duration || options.duration || 300,
                timing: options.easing || "ease-in"
            });
        var promise2 = WinJS.UI.executeTransition(
            element,
            {
                property: "opacity",
                delay: stagger,
                duration: duration || options.duration || 300,
                timing: options.easing || "ease-in",
                from: 1,
                to: 0
            });
        return WinJS.Promise.join([promise1, promise2]);
    }

    /**
     * shrink and fall animation
     * @param {Object} elements element or array of elements
     * @param {Object} options options like delay, easing
     */
    WinJSContrib.UI.Animation.shrinkAndFall = WinJS.Utilities.markSupportedForProcessing(function (element, options) {
        var offsetArray;
        var options = options || {};
        var promise1 = WinJS.UI.executeAnimation(
            element,
            {
                keyframe: "WinJSContrib-shrinkAndFall",
                property: equivalents.transform.cssName,
                delay: staggerDelay(10, 30, 1, 50),
                duration: options.duration || 600,
                timing: "ease-in"
            });
        var promise2 = WinJS.UI.executeTransition(
            element,
            {
                property: "opacity",
                delay: staggerDelay(10, 30, 1, 50),
                duration: options.duration || 600,
                timing: "ease-in",
                from: 1,
                to: 0
            });
        return WinJS.Promise.join([promise1, promise2]);
    });

    /**
     * enter and shrink animation
     * @param {Object} elements element or array of elements
     * @param {number} duration transition duration
     * @param {Object} options options like delay, easing
     */
    WinJSContrib.UI.Animation.enterShrink = function (element, duration, options) {
        var offsetArray;
        options = options || {};
        var stagger = staggerDelay(options.delay || 50, 40, 1, 350);

        var promise1 = WinJS.UI.executeAnimation(
            element,
            {
                keyframe: "WinJSContrib-enterShrink",
                property: equivalents.transform.cssName,
                delay: stagger,
                duration: duration || options.duration || 450,
                timing: options.easing || "ease-out"
            });
        var promise2 = WinJS.UI.executeTransition(
            element,
            {
                property: "opacity",
                delay: stagger,
                duration: duration || options.duration || 700,
                timing: options.easing || "ease-out",
                from: 0,
                to: 1
            });
        return WinJS.Promise.join([promise1, promise2]);
    }
})(WinJSContrib.UI.Animation);