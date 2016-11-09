(function(window) {
    'use strict';

    function initialise() {
        var VisitLogger = {};
        VisitLogger.server = 'URL';
        VisitLogger.cookie = Cookies.get('venueexplorer');
        if (!VisitLogger.cookie) {
            Cookies.set('venueexplorer', uuid(), {
                expires: 7
            });
        }


        VisitLogger.logvisit = function(campaign, key, value) {
            var data = {
                key: key,
                value: value,
                campaign: campaign,
                uid: VisitLogger.cookie
            };
            $.post(VisitLogger.server, data)
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
