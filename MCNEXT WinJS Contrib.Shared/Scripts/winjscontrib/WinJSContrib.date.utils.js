﻿//you may use this code freely as long as you keep the copyright notice and don't 
// alter the file name and the namespaces
//This code is provided as is and we could not be responsible for what you are making with it
//project is available at http://winjscontrib.codeplex.com

/// <reference path="WinJSContrib.binding.utils.js" />
/// <reference path="moment.min.js" />

var WinJSContrib;
WinJSContrib.Utils = WinJSContrib.Utils || {};
WinJSContrib.Bindings = WinJSContrib.Bindings || {};

(function () {    
    'use strict';

        /**
         * configure moment.js for french
         */
        WinJSContrib.Utils.momentFr = function () {
            moment.locale('fr', {
                months: "janvier_février_mars_avril_mai_juin_juillet_août_septembre_octobre_novembre_décembre".split("_"),
                monthsShort: "janv._févr._mars_avr._mai_juin_juil._août_sept._oct._nov._déc.".split("_"),
                weekdays: "dimanche_lundi_mardi_mercredi_jeudi_vendredi_samedi".split("_"),
                weekdaysShort: "dim._lun._mar._mer._jeu._ven._sam.".split("_"),
                weekdaysMin: "Di_Lu_Ma_Me_Je_Ve_Sa".split("_"),
                longDateFormat: {
                    LT: "HH:mm",
                    L: "DD/MM/YYYY",
                    LL: "D MMMM YYYY",
                    LLL: "D MMMM YYYY LT",
                    LLLL: "dddd D MMMM YYYY LT"
                },
                calendar: {
                    sameDay: "[Aujourd'hui à] LT",
                    nextDay: '[Demain à] LT',
                    nextWeek: 'dddd [à] LT',
                    lastDay: '[Hier à] LT',
                    lastWeek: 'dddd [dernier à] LT',
                    sameElse: 'L'
                },
                relativeTime: {
                    future: "dans %s",
                    past: "il y a %s",
                    s: "quelques secondes",
                    m: "une minute",
                    mm: "%d minutes",
                    h: "une heure",
                    hh: "%d heures",
                    d: "un jour",
                    dd: "%d jours",
                    M: "un mois",
                    MM: "%d mois",
                    y: "un an",
                    yy: "%d ans"
                },
                ordinal: function (number) {
                    return number + (number === 1 ? 'er' : 'ème');
                },
                week: {
                    dow: 1, // Monday is the first day of the week.
                    doy: 4  // The week that contains Jan 4th is the first week of the year.
                }
            });
        }

        /** 
         * format date using binding argument 'formatDate'
         * @param {Object} source object owning data
         * @param {string[]} sourceProperty path to object data
         * @param {HTMLElement} dest DOM element targeted by binding
         * @param {string[]} destProperty path to DOM element property targeted by binding
         */
        WinJSContrib.Bindings.formatDate = WinJS.Utilities.markSupportedForProcessing(function formatDateBinding(source, sourceProperty, dest, destProperty) {
            var sourcedata = WinJSContrib.Utils.readProperty(source, sourceProperty);
            if (!sourcedata) {
                dest.innerText = '';
            } else {
                var arg = WinJSContrib.Bindings.bindingArguments(dest, 'formatDate');
                dest.innerText = moment(sourcedata).format(arg);
            }
        });

        function daysSince(m, d, y) {
            if (d == '' || m == '' || y == '') {
                //alert("All fields must be entered");
                return;
            }

            if (isNaN(m) || isNaN(y) || isNaN(d)) {
                //alert("Only numbers .");
                return;
            }

            var myDate = new Date();
            var yourDate = new Date(y, m - 1, d);

            var secondsInADay = 1000 * 60 * 60 * 24;
            var diff = Math.floor((myDate.getTime() - yourDate.getTime()) / secondsInADay);
            return diff;
        }


        /**
         * display number of days since a date
         * @param {Object} source object owning data
         * @param {string[]} sourceProperty path to object data
         * @param {HTMLElement} dest DOM element targeted by binding
         * @param {string[]} destProperty path to DOM element property targeted by binding
         */
        WinJSContrib.Bindings.daysSinceDate = WinJS.Utilities.markSupportedForProcessing(function daysSinceDateBinding(source, sourceProperty, dest, destProperty) {
            var sourcedata = WinJSContrib.Utils.readProperty(source, sourceProperty);
            if (!sourcedata) {
                dest.innerText = '';
            } else {
                var m = sourcedata.getMonth() + 1, d = sourcedata.getDate(), y = sourcedata.getFullYear();
                var fromdate = daysSince(m, d, y);
                dest.innerText = fromdate;
            }
        });

        /**
         * apply moment.js humanize formatting on a date. Use 'humanizeFormat' and 'addSuffix' arguments to configure binding
         * @param {Object} source object owning data
         * @param {string[]} sourceProperty path to object data
         * @param {HTMLElement} dest DOM element targeted by binding
         * @param {string[]} destProperty path to DOM element property targeted by binding
         */
        WinJSContrib.Bindings.humanizeDate = WinJS.Utilities.markSupportedForProcessing(function humanizeDate(source, sourceProperty, dest, destProperty) {
            var sourcedata = WinJSContrib.Utils.readProperty(source, sourceProperty);
            if (!sourcedata) {
                dest.innerText = '';
            } else {
                var arg = WinJSContrib.Bindings.bindingArguments(dest, "humanizeFormat"),
                    addSuffix = WinJSContrib.Bindings.bindingArguments(dest, "addSuffix");
                dest.innerText = moment.duration(sourcedata, arg).humanize(addSuffix);
            }
        });

    
})();