/*
    Calculator
*/
let config = {
    /*
        Define main atributes
    */
    current_arr: [ 0 ],
    current_str: "0",
    history_arr: [],
    history_str: "",
    memory_hold: "0",
    memory_str: "",
    key_code_allow: [
        8, 13, 27, 48, 49, 50, 51, 52, 53, 54, 55, 56,
        57, 61, 96, 97, 98, 99, 100, 101, 102, 103, 104,
        105, 106, 107, 109, 110, 111, 173, 190, 191
    ],
    display_result: document.querySelector( ".calc-display-result" ),
    display_history_main: document.querySelector( ".calc-display-history-main" ),
    display_history_mem: document.querySelector( ".calc-display-history-mem" ),
    clear: function () {
        this.current_arr = [];
        this.current_str = "0";
        this.history_arr = [];
        this.history_str = "";
        this.memory_hold = 0;
        this.memory_str = "";
    }
}

let buttons = {
    /*
        Create buttons, divide buttons to 3 blocks: memory, operations, numbers.
        Numbers block include "backspace", "+/-", "."
    */
    btn_arr: [
        { "C": "clear" }, { "AC": "clear_all" }, { "MS": "mem_save" },
        { "MR": "mem_read" }, { "M+": "mem_add" },
        { "7": "7" }, { "8": "8" }, { "9": "9" }, { "/": "divide" }, { "\u003c": "backspace" },
        { "4": "4" }, { "5": "5" }, { "6": "6" }, { "*": "mult" }, { "\u221a": "sqrt" },
        { "1": "1" }, { "2": "2" }, { "3": "3" }, { "-": "minus" }, { "%": "perc" },
        { "0": "0" }, { ".": "." }, { "+/-": "sign" }, { "+": "plus" }, { "=": "result"}
    ],
    btn_keys: { "numbers": {}, "memory": {}, "operations": {} }, // generated on init
    idx_numbers: [ 5, 6, 7, 9, 10, 11, 12, 15, 16, 17, 20, 21, 22 ],
    is_num: function ( idx ) {
        /*
            Calls from generate. Definde if iteration value from numbers block
        */
        for( let idx_num of this.idx_numbers ) {
            if( idx == idx_num ) {
                return true;
            }
        }
        return false;
    },
    generate: function () {
        /*
            Buttons generator
        */
        let btn_out = [];
        let buttons_top_div = document.querySelector( ".calc-buttons-top" );
        let buttons_main_div = document.querySelector( ".calc-buttons-main" );

        for( let i in this.btn_arr ) {
            let key, value;
            key = Object.entries( this.btn_arr [ i ] )[ 0 ][ 0 ].toString();
            value = Object.entries( this.btn_arr [ i ] )[ 0 ][ 1 ].toString();
            btn_out[ i ] = document.createElement( "button" );
            if( this.is_num( i ) ) {
                this.btn_keys[ "numbers" ][ key ] = value;
                buttons_div = buttons_main_div;
                btn_out[ i ].className = "calc-btn btn-primary";
            } else {
                if( i < 5 ) {
                    this.btn_keys[ "memory" ][ key ] = value;
                    buttons_div = buttons_top_div;
                    btn_out[ i ].className = "calc-btn btn-warning";
                } else {
                    this.btn_keys[ "operations" ][ key ] = value;
                    buttons_div = buttons_main_div;
                    btn_out[ i ].className = "calc-btn btn-primary";
                    if( i == this.btn_arr.length - 1 ) {
                        btn_out[ i ].className = "calc-btn btn-success";
                    }
                }
            }
            btn_out[ i ].innerHTML = key;
            btn_out[ i ].onclick = function() {
                return btn_handler( key, value );
            }
            buttons_div.appendChild( btn_out[ i ] );
        }
    }
};

function memory_operation( value ) {
    /*
        Operations with memory block
    */
    let current_num = Number( config.current_arr.join("") );
    function crop_mem_str() {
        /*
            Crop long memory string
        */
        if( config.memory_hold.toString().length > 5 ) {
            return "MEM";
        } else {
            return "M " + config.memory_hold;
        }
    }
    if( value == "clear" ) {
        config.current_arr = [];
    }
    if( value == "clear_all" ) {
        config.clear();
    }
    if( value == "mem_save" ) {
        config.memory_hold = current_num;
        config.memory_str = crop_mem_str();
    }
    if( value == "mem_read" ) {
        config.current_arr = config.memory_hold != 0 ? [ config.memory_hold ] : config.current_arr;
    }
    if( value == "mem_add" ) {
        config.memory_hold = config.memory_hold + current_num;
        config.memory_str = crop_mem_str();
    }
}

function numbers_operation( value ) {
    /*
        Operations with numbers block
    */
    let current_num = Number( config.current_arr.join("") );
    if( value == "backspace" ) {
        if( config.current_arr.length > 1 ) {
            config.current_arr.pop( config.current_arr.length - 1 );
        } else {
            config.current_arr = [ 0 ];
        }
    } else if( value == "sign" && config.current_arr !=  [ 0 ] ) {
        config.current_arr = Array.from( ( -current_num ).toString() );
    } else if( config.history_arr.includes( "=" ) ) {
        config.history_arr = [];
        config.current_arr = [ value ];
    } else if( value == "." && config.current_arr.includes( "." ) ) {
        return;
    } else if( value > -1 && value < 10 &&
               config.current_arr.length == 1 && config.current_arr[ 0 ] == 0 ) {
        config.current_arr = [ value ];
    } else {
        config.current_arr.push( value );
    }
}

function calculate( operation, sign ) {
    /*
        Main calculation function with operations block
    */
    let result;
    let current_num = Number( config.current_arr.join("") );
    if( config.history_arr.includes( "=" ) ) {
        config.history_arr = [];
    }
    if( operation == "sqrt" ) {
        result = Math.sqrt( current_num );
        result = 0;
    } else if( operation == "perc" ) {
        config.history_arr.push( current_num );
        let len = config.history_arr.length;
        if( config.history_arr[ len - 1 ] == 0 ) {
            config.history_arr.pop( len - 1 );
            return;
        }
        if( len > 2 ) {
            let part1 = config.history_arr.slice( 0, -2 );
            let part_sign = config.history_arr[ len - 2 ];
            let part2 = config.history_arr[ len - 1 ];
            result = eval( part1.join("") );
            if( part_sign == "*" ) {
                perc = result / 100 * part2;
                result = perc;
            } else {
                perc = result / 100 * part2;
                result = eval( result.toString() + part_sign + perc.toString() );
                result = result.toString();
            }
            config.current_arr = Array.from( result );
            config.history_arr = [];
        }
    } else if( operation != "result" ) {
        config.history_arr.push( current_num );
        config.history_arr.push( sign );
        config.current_arr = [ 0 ];
    } else if( operation == "result" ) {
        if( config.history_arr ) {
            config.history_arr.push( current_num );
            result = eval( config.history_arr.join("") ).toString();
            config.history_arr.push( "=", result );
            config.current_arr = [ result ];
        }
    }
    config.history_str = config.history_arr.join("");
}

function crop_result() {
    /*
        Crop result to fit display block. Calls from btn_handler
    */
    let result = config.current_arr.join("");
    let new_result;
    if( result.length > 10 ) {
        let exp_diff = result.length - 10 + 3; // plus 3 for add exp to string
        let exponent = 10 ** exp_diff;
        let split = result.split( "." );
        result = Number( result );
        if( Number.isInteger( result ) ) {
            new_result = Math.round( result / exponent );
            new_result = new_result.toString() + "e" + exp_diff.toString();
        } else {
            let crop = split[ 1 ] ? split[ 1 ].length - exp_diff + 2: 0;
            crop = crop > 0 ? crop : 0 ;
            new_result = result.toFixed( crop );
            new_result = new_result.toString() + "~";
        }
        result = new_result;
    }
    return result;
}

function btn_handler( key, value ) {
    /*
        Handler for buttons
    */
    let result;
    if( buttons.btn_keys[ "memory" ][ key ] ) {
        memory_operation( value );
    }
    if( buttons.btn_keys[ "operations" ][ key ] ) {
        calculate( value, key );
    }
    if( buttons.btn_keys[ "numbers" ][ key ] || key == "0" ) {
        numbers_operation( value );
    }
    config.current_str = crop_result();
    config.display_result.innerHTML = config.current_str;
    config.display_history_main.innerHTML = config.history_str;
    config.display_history_mem.innerHTML = config.memory_str;
}

function key_handler( ev ) {
    /*
        Handler for keyboard
    */
    document.activeElement.blur();
    if( config.key_code_allow.includes( ev.keyCode ) ) {
        let key = ev.key.toString();
        let value;
        ev.keyCode == 27 ? key = "C" : "";
        ev.keyCode == 13 ? key = "=" : "";
        ev.keyCode == 8 ? key = "\u003c" : "";
        for( i of [ "memory", "operations", "numbers" ] ) {
            buttons.btn_keys[ i ][ key ] ? value = buttons.btn_keys[ i ][ key ] : "";
        }
        btn_handler( key, value );
    }
}

function copy_to_clipboard() {
    /*
        Copy result to clipboard. By default set to click on display block
    */
    let dummy = document.createElement("textarea");
    document.body.appendChild(dummy);
    dummy.value = config.current_arr.join("");
    dummy.select();
    document.execCommand( "copy" );
    document.body.removeChild(dummy);
}

function init() {
    /*
        Start point
    */
    buttons.generate();
    document.addEventListener( 'keydown', key_handler );
    display = document.querySelector( ".calc-display" );
    display.onclick = copy_to_clipboard;
}

window.onload = init;
