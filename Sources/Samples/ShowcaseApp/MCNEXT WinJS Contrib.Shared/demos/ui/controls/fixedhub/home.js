﻿(function () {
    "use strict";
    var items = [];

    //we generate some items
    for (var i = 0 ; i < 10 ; i++) {
        items.push({ title: "article " + (i + 1), image: "./images/mcnstore.jpg" });
    }

    WinJS.UI.Pages.define("./demos/ui/controls/fixedhub/home.html", {
        processed: function (element, options) {
            var controls = {
                hub: element.querySelector("#pageHub").winControl,
                section1 : {
                    section: element.querySelector("#section1").winControl,
                    grid: element.querySelector("#section1 .mcn-hub-section-content").winControl
                },
                section2 : {
                    section: element.querySelector("#section2").winControl,
                    grid: element.querySelector("#section2 .mcn-hub-section-content").winControl
                },
                section3 : {
                    section: element.querySelector("#section3").winControl,
                    grid: element.querySelector("#section3 .mcn-hub-section-content").winControl
                },
                section4 : {
                    section: element.querySelector("#section4").winControl,
                    grid: element.querySelector("#section4 .mcn-hub-section-content").winControl
                },
                section5 : {
                    section: element.querySelector("#section5").winControl,
                    grid: element.querySelector("#section5 .mcn-hub-section-content").winControl
                }
            };
            this.controls = controls;            
            controls.hub.multipass = options.multipass;

            controls.section1.grid.prepareItems(options.items);
            controls.section2.grid.prepareItems(options.items);
            controls.section3.grid.prepareItems(options.items);
            controls.section4.grid.prepareItems(options.items);
            controls.section5.grid.prepareItems(options.items);

            //adding a new section to the hub through code, just for demo
            controls.hub.renderSection({ title: "section 6" }, element.querySelector("#hubtemplate"), true).done(function (section) {
                var grid = section.element.querySelector(".mcn-hub-section-content").winControl;
                grid.prepareItems(options.items);
            });
            $(".pagetitle", element).text("fixed items (by " + options.multipass + " " + (controls.hub.sections.length*options.items.length) + " items)");
        },

        //this method is bound declaratively thanks to our custom navigator
        itemClick: function(clickArg){
            WinJS.Navigation.navigate("./pages/detailPage/detailPage.html", clickArg.itemData);
        }
    });
})();

var DefaultFixedGridLayout = {
    horizontal: { query: "(orientation: landscape)", layout: "horizontal", itemsPerColumn: 3, cellSpace: 5, cellWidth: 300, cellHeight: 250 },
    vertical: { query: "(orientation: portrait)", layout: "vertical", itemsPerRow: 2, cellWidth: 300, cellHeight: 250 },
    snapped: { query: "(orientation: portrait) and (max-width: 340px)", itemsPerRow: 1, layout: "vertical", cellWidth: 300, cellHeight: 250 }
};

//this method is bound declaratively thanks to our custom navigator
function articleClicked(clickArg) {
    WinJS.Navigation.navigate("./pages/detailPage/detailPage.html", clickArg.itemData);
}