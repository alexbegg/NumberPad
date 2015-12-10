(function($) {

    $.fn.numberPad = function(options) {

        var settings = $.extend({
            start: 1,
            end: 9,
            calculatorOrder: false,
            columns: 3,
            extraRow: {
                items: ['0'],
                position: 'bottom'
            },
            inputElement: null,
            keyClass: 'numberpad-key',
            onSelect: null
        }, options);

        function round(value, decimals) {
            return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
        }

        var columnPercent = 100 / settings.columns;

        function addKey(i) {
            var $key = $('<a href="" />');
            $key.addClass(settings.keyClass);
            $key.addClass(settings.keyClass + '-' + i);
            $key.css({
                'float': 'left',
                'display': 'block',
                'width': round(columnPercent, 4)+'%',
                'text-align': 'center',
            });
            $key.html(i);
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

        return this.each(function() {
            var $input = $(settings.inputElement),
                $container = $(this),
                $keysCollection = $([]),
                $zero;
            if (!$input.is('input')) {
                if ($(this).is('input')) {
                    $input = $(this);
                } else if ($(this).find('input').length) {
                    $input = $(this).find('input');
                } else {
                    $input = $('<input type="text">').insertAfter(this);
                }
            }
            if ($(this).is('input')) {
                $container = $(this).wrap('<div />').parent();
                $container.addClass('numberpad-container');
            } else {
                $container = $(this).addClass('numberpad-container');
            }

            if (settings.extraRow.position == "top") {
                $.each(settings.extraRow.items, function(index, val) {
                    $extra = addKey(val).css({
                        'width': extrasWidth + '%'
                    });
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
                    $extra = addKey(val).css({
                        'width': extrasWidth + '%'
                    });
                    $keysCollection = $keysCollection.add($extra);
                });
            }

            $container.append($keysCollection);

            $keysCollection.click(function(event) {
                event.preventDefault();
                var $key = $(this);
                var val = $input.val() + $key.text();
                $input.val(val);
                if (typeof settings.onSelect === "function") {
                    settings.onSelect($key, $input, event);
                }
            });

        });

    };

}(jQuery));
