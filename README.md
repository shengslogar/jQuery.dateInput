jQuery.dateInput
================

Introduction
------------

Transforms `<input type="date">` into a date picker.

Requirements
------------
-   jQuery


Usage
-----

    $("input[type=date]").dateInput();
    
Features
--------

Supports following input attributes:

- `min` - Minimum date selectable (yyyy-mm-dd)
- `max` - Maximum date selectable (yyyy-mm-dd)
- `value` - Currently selected date (yyyy-mm-dd)

Disable weekend selection as follows by adding the parameter `true` when
calling plugin:

    $("input[type=date]").dateInput(true);

Bugs
----
To file a bug report, please shoot me an [email](http://shengslogar.com/email).

Version History
---------------
0.0.1

-   Initial version - highly untested (20170420)
-   Tweaked styles, hid weekend dates instead of just disabling them and published repo :) (20170518)

License
-------

This work is licensed under the
[Creative Commons Attribution 4.0 International License](http://creativecommons.org/licenses/by/4.0/).