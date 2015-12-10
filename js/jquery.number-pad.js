(function($) {

    $.fn.numberPad = function(options) {

        var defaults = {
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
            onPress: function($input, event) {} // Callback function triggered when you press a button on the number pad
        };

        var settings = $.extend(true, {}, defaults, options);

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
            $container.on('click', '.'+keyPass, function(event) {
                event.preventDefault();
                var text = $(this).text();
                $(el).trigger('numberPadPress', text);
            });

        });

    };

}(jQuery));
