# jQuery.NumberPad

jQuery.NumberPad is a jQuery plugin that will generate a numeric keypad. The numbers pressed will be added to the value of an input element.

## Usage

There are multiple ways you can insert in the number pad:

```
#!javascript

// On inputs, the number pad will be placed below the input:
$('input.numberpad').numberPad();

// In any other element, an input will be created and the number pad will be below it:
$('div.numberpad_box').numberPad();

// Or you can place the number pad and input in separate places and specify the input element in the options:
$('div.numberpad_box').numberPad({
    inputElement: 'input.number_input'
});

```

## Examples

```
#!javascript

// Pin pad
$('.numberpad').numberPad({
    extraRow: {
        items: ['0']
    }
});

// Calculator layout
$('.numberpad').numberPad({
    calculatorOrder: true,
    extraRow: {
        items: ['0', '.'],
        expand: 'first'
    }
});

// Telephone layout
$('.numberpad').numberPad({
    extraRow: {
        items: ['*', '0', '#']
    }
});
```

## Options

```
#!javascript


$('.numberpad').numberPad({
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
});
```