/**
 * @name        jquery.dateInput
 * @author      Sheng-Liang Slogar <slogar.sheng@gmail.com>
 * @version     0.0.1
 * @link        https://github.com/shengslogar/jquery.dateInput
 * @requires    jQuery, helper CSS
 * @description Transforms input=date into a date picker
 */

(function ($) {

    var GLOBAL_instanceCount = 0; // purely for tabIndex integrity

    // expands inputs, left padding with 0 to desired length
    function forceLength(str, len) {
        str = str.toString();
        var diff = len - str.length;

        for (var i = 0; i < diff; i++)
            str = '0' + str;

        return str;
    }

    $.fn.dateInput = function (EXCLUDE_WEEKENDS) {

        var $this = $(this);
        $this.addClass('jq-di-h'); // hide input

        var dateMin,
            dateMax,
            monthMin = 0,
            monthMax = 11,
            dayMin = 1,
            dayMax = 31,
            yearMin = 0,
            yearMax = Infinity;

        // bounds
        if ($this.attr('min')) {
            var min = $this.attr('min');
            dateMin = new Date(min + ' 00:00');

            min = min.split('-');
            yearMin = Number(min[0]);
            monthMin = Number(min[1]) - 1; // base 0
            dayMin = Number(min[2]);
        }

        if ($this.attr('max')) {
            var max = $this.attr('max');
            dateMax = new Date(max + ' 00:00');

            max = max.split('-');
            yearMax = Number(max[0]);
            monthMax = Number(max[1]) - 1; // base 0
            dayMax = Number(max[2]);
        }

        // parent
        var $cal = $('<div>', {'class': 'jq-di' + (EXCLUDE_WEEKENDS ? ' jq-di--nw' : '')});
        $this.after($cal); // append

        var date = new Date();

        var $navLeft = $('<a>', {'class': 'jq-di-l', html: '&lsaquo;'}).click(function () {
            date.setMonth(date.getMonth() - 1);
            refresh();
        });

        var $title = $('<span>', {'class': 'jq-di-t', html: '&nbsp;'});
        var $navRight = $('<a>', {'class': 'jq-di-r', html: '&rsaquo;'}).click(function () {
            date.setMonth(date.getMonth() + 1);
            refresh();
        });
        var $week = $('<div>', {
            'class': 'jq-di-w',
            html: '<span class="jq-di-wknd">Sun</span>'
            + '<span>Mon</span>'
            + '<span>Tue</span>'
            + '<span>Wed</span>'
            + '<span>Thu</span>'
            + '<span>Fri</span>'
            + '<span class="jq-di-wknd">Sat</span>'
        });

        var $dates = $('<div>', {'class': 'jq-di-d'}).on('click', 'span', function () {
            var $_this = $(this);

            // is date and not buffer square
            if ($_this.hasClass('jq-di-d_d')) {

                date.setDate($_this.text());
                refresh();
            }
        });

        // dom
        $cal.append($navLeft)
            .append($title)
            .append($navRight)
            .append($week)
            .append($dates);

        var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October',
            'November', ' December'];
        var days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

        function validRange() {

            var valid = true;

            if (dateMax && date.getTime() > dateMax.getTime()) {
                date.setTime(dateMax.getTime());
                valid = false;
            }

            if (dateMin && date.getTime() < dateMin.getTime()) {
                date.setTime(dateMin.getTime());
                valid = false;
            }

            return valid;
        }

        var cachedDate;

        // reloads date display
        function refresh(loadFromVal) {

            // load date based off of input value
            if (loadFromVal)
                date = new Date(Date.parse($this.val() + ' 00:00') || date.getTime());

            // lock into range

            validRange();

            if (EXCLUDE_WEEKENDS) {

                // local copy, validRange() would
                // otherwise tamper with our date obj
                var _date = new Date(date.getTime());

                // sunday
                if (date.getDay() == 0) {

                    // try going forward one day (monday)
                    date.setDate(_date.getDate() + 1);

                    // not good? go back two days
                    if (!validRange()) {
                        date.setDate(_date.getDate() - 2);
                        validRange();
                    }
                }
                // saturday
                else if (date.getDay() == 6) {

                    // try going back
                    date.setDate(_date.getDate() - 1);

                    // not good? go forward
                    if (!validRange()) {
                        date.setDate(_date.getDate() + 2);
                        validRange();
                    }
                }
            }

            var curDay = date.getDate();
            var curMonth = date.getMonth();
            var curYear = date.getFullYear();

            $title.html(months[curMonth] + ' \'' + date.getFullYear().toString().substring(2));

            var dayBuffer;
            var dayOfWeek;

            (function () {
                var _date = new Date(date);
                _date.setDate(1);
                dayOfWeek = dayBuffer = _date.getDay();
            }());


            // save month display
            if (!cachedDate
                || (cachedDate && (date.getMonth() != cachedDate.getMonth() || date.getYear() != cachedDate.getYear()))) {

                $dates.html(''); // reset

                // push starting date to correct position on week with
                // buffer squares
                for (var i = 0; i < dayBuffer; i++) {
                    $dates.append($('<span>', {'class': 'jq-di-d_p'}));
                }

                var daysInMonth = days[curMonth];

                // feb/leapyear
                if (curMonth == 1)
                    if (((curYear % 4 == 0) && (curYear % 100 != 0)) || (curYear % 400 == 0))
                        daysInMonth--;

                // layout actual month
                for (var i = 1; i <= daysInMonth; i++) {

                    var disabled = (curYear == yearMax && curMonth == monthMax && i > dayMax)
                        || (curYear == yearMin && curMonth == monthMin && i < dayMin);

                    var excWkndCheck = (EXCLUDE_WEEKENDS && (dayOfWeek == 0 || dayOfWeek == 6));

                    disabled = disabled || excWkndCheck;

                    $dates.append($('<span>', {
                        'class': 'jq-di-d_d'
                        + (i == curDay ? ' jq-di-d_d--s' : '')
                        + (disabled ? ' jq-di-d_d--d' : '')
                        + (excWkndCheck ? ' jq-di-wknd' : ''),
                        html: i,
                        tabIndex: i + (31 * GLOBAL_instanceCount) + 100 // offset by 100 to avoid ruining any existing tab-indices
                    }));

                    dayOfWeek++;

                    if (dayOfWeek > 6)
                        dayOfWeek = 0;
                }
            }
            else {
                // select current date
                $dates.children('.jq-di-d_d--s').removeClass('jq-di-d_d--s');
                $dates.children('.jq-di-d_d').eq(curDay - 1).addClass('jq-di-d_d--s');
            }

            // update input
            var newVal = curYear + '-' + forceLength(curMonth + 1, 2) + '-' + forceLength(curDay, 2);
            if ($this.val() != newVal)
                $this.val(newVal).trigger('change');

            cachedDate = new Date(date);
        }

        $this.on('change', function () {
            refresh(true);
        });

        refresh(true); // init
        GLOBAL_instanceCount++;

        return this; // chain
    };
}(jQuery));