/*!
 * jQuery Number Pad
 * Version 0.6
 *
 * Copyright 2015, MedMen
 * https://medmen.com
 *
 * https://github.com/mmmg/jquery-numberpad
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
(function($) {

    $.fn.numberPad = function(options) {

        var settings = $.extend(true, {}, $.fn.numberPad.defaults, options);

        function round(value, decimals) {
            return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
        }

        var columnPercent = 100 / settings.columns;

        var keyPass = 'numberpad-key';

        function addKey(text) {
            var $key = $('<a href="" />');
            $key.addClass(keyPass);
            $key.addClass(keyPass + '-' + text);
            $key.addClass(settings.keyClass);
            $key.css({
                'float': 'left',
                'display': 'block',
                'width': round(columnPercent, 4)+'%',
                'text-align': 'center',
            });
            $key.html(text);
            return $key;
        }

        if (settings.extraRow.items) {
            var extraItemsCount = settings.extraRow.items.length;
            if (extraItemsCount <= settings.columns) {
                var extrasWidth = 100 / extraItemsCount;
            } else {
                var extrasWidth = columnPercent;
            }
            extrasWidth = round(extrasWidth, 4);
        }

        var extraExpand = settings.extraRow.expand,
            extraLast = extraItemsCount-1;

        function addExtra(index, val) {
            var $extra = addKey(val);
            if (extraItemsCount % 2 != settings.columns % 2 &&
                    (extraExpand == "first" || extraExpand == "last")) {
                if ((index == 0 && extraExpand == "first") ||
                        (index == extraLast && extraExpand == "last")) {
                    $extra.css({
                        'width': (columnPercent * 2) + '%'
                    });
                } else {
                    $extra.css({
                        'width': columnPercent + '%'
                    });
                }
            } else {
                $extra.css({
                    'width': extrasWidth + '%'
                });
            }
            return $extra;
        }

        return this.each(function() {
            var $input = $(settings.inputElement),
                $container = $(this),
                $keysCollection = $([]);

            if (!$input.length) {
                if ($(this).is(':input')) {
                    $input = $(this);
                } else if ($(this).find(':input').length) {
                    $input = $(this).find(':input');
                } else {
                    $input = $('<input type="text">').insertBefore(this);
                }
            }
            if ($(this).is(':input')) {
                $container = $(this).wrap('<div />').parent();
                $container.addClass('numberpad-container');
            } else {
                $container = $(this).addClass('numberpad-container');
            }

            if (settings.extraRow.position == "top") {
                $.each(settings.extraRow.items, function(index, val) {
                    $extra = addExtra(index, val);
                    $keysCollection = $keysCollection.add($extra);
                });
            }
            if (settings.calculatorOrder) {
                if (settings.start > settings.end) {
                    for(var i = settings.start; i >= settings.end; i--) {
                        var $key = addKey(i);
                        $key.css({
                            'float': 'right'
                        });
                        $keysCollection = $keysCollection.add($key);
                    }
                } else {
                    for(var i = settings.end; i >= settings.start; i--) {
                        var $key = addKey(i);
                        $key.css({
                            'float': 'right'
                        });
                        $keysCollection = $keysCollection.add($key);
                    }
                }
            } else {
                if (settings.start > settings.end) {
                    for(var i = settings.start; i >= settings.end; i--) {
                        var $key = addKey(i);
                        $keysCollection = $keysCollection.add($key);
                    }
                } else {
                    for(var i = settings.start; i <= settings.end; i++) {
                        var $key = addKey(i);
                        $keysCollection = $keysCollection.add($key);
                    }
                }
            }
            if (settings.extraRow.position == "bottom") {
                $.each(settings.extraRow.items, function(index, val) {
                    $extra = addExtra(index, val);
                    $keysCollection = $keysCollection.add($extra);
                });
            }

            $container.append($keysCollection);
            $container.append('<div style="clear: both;" />');

            $(this).bind('numberPadPress', function(event, text) {
                var $key = $container.find('.'+keyPass+':contains('+text+')');
                if (!$input.is(':input')) {
                    var val = $input.text() + $key.text();
                    $input.text(val);
                } else {
                    var val = $input.val() + $key.text();
                    $input.val(val);
                }
                if (typeof settings.onPress === "function") {
                    settings.onPress.call($key, $input, event);
                }
            });

            var el = this;
            $container.on(settings.event, '.'+keyPass, function(event) {
                event.preventDefault();
                var text = $(this).text();
                if (typeof settings.beforeAdd === "function"){
                    var beforeAdd = settings.beforeAdd.call(this, $input, text, event)
                }
                if(beforeAdd){
                    $(el).trigger('numberPadPress', text);
                }
            });

        });

    };

    $.fn.numberPad.defaults = {
        event: 'click',         // The type of event that the number keys should react to in order to enter the number
        start: 1,               // Stating number (To switch the order make this larger than 'end')
        end: 9,                 // Ending number (To switch the order make this smaller than 'start')
        calculatorOrder: false, // Layout the numbers like a calculator (789/456/123) (Order of 'start' and 'end' does not matter in this mode)
        columns: 3,             // Number of buttons across
        extraRow: {
            position: 'bottom', // Place extra row at the 'top' or 'bottom'
            items: [],          // Object containing items to place in the extra row, example: ['*', '0', '#']
            expand: false       // Expand the 'first' or 'last' button to be twice as wide as a number button, if needed for layout purposes
        },
        inputElement: null,     // Input to receive the numbers
        keyClass: '',           // Add a class to each button on the number pad
        onPress: function($input, event) {}, // Callback function triggered when you press a button on the number pad
        beforeAdd: function($input, text, event) {return true;} // Callback function triggered before adding to the input field
    };

}(jQuery));
