(function(window) {
    'use strict';

    function initialise() {
        var VisitLogger = {};
        VisitLogger.server = null;
        VisitLogger.cookieid = null;
        VisitLogger.expiry = 7;
        VisitLogger.cookie = Cookies.get(VisitLogger.cookieid);

        if (!VisitLogger.cookie) {
            Cookies.set(VisitLogger.cookieid, uuid(), {
                expires: VisitLogger.expiry
            });
        }

        VisitLogger.setserver = function(server) {
        VisitLogger.server = server;
        }

        VisitLogger.setcookieid = function(id) {
        VisitLogger.cookieid = id;
        }

        VisitLogger.setexpiry = function(ex) {
        VisitLogger.expiry = ex;
        }

        VisitLogger.logvisit = function(campaign, key, value) {
            if(VisitLogger.server || VisitLogger.cookieid) {
            var data = {
                key: key,
                value: value,
                campaign: campaign,
                uid: VisitLogger.cookie
            };
            $.post(VisitLogger.server + "/visitlogger/logvisit", data);
        }else {
            console.log("cookieid and servername must be set");
        }
        }

        return VisitLogger;
    }

    if (typeof(VisitLogger) === 'undefined') {

        window.VisitLogger = initialise();
    }

    function uuid() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    }
})(window);
