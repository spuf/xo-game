var board_size = 20;

var board = [];
for (var i = 0; i < board_size*board_size; i++)
	board.push(' ');
	
var last_move = true;
// x = true, o = false

var moves = 0;

$(document).ready(function () {
		
    var html = '<table cellpadding="0" cellspacing="0">';
    for (var row = 0; row < board_size; row++) {
        html += '<tr>';
        for (var col = 0; col < board_size; col++) {
            html += '<td id="m' + (board_size * row + col) + '" class="move"></td>';
        }
        html += '</tr>';
    }
    html += '</table>';
    $('#board').html(html);

    $('.move').click(function () {
        var p = parseInt($(this).attr('id').substring(1));
		setBoard(p);
        return false;
    }).mouseenter(function () {
        $(this).addClass((last_move?'x':'o')+'-gray');
		var pos = parseInt($(this).attr('id').substring(1));
		var result = get_result(get_board_copy(board, pos, last_move?'x':'o'), last_move?'x':'o');
		$('#info-this').text(JSON.stringify(result));
    }).mouseleave(function () {
        $(this).removeClass((last_move?'x':'o')+'-gray');
    });

});

function setBoard(pos){
	if (board[pos] == ' ') {
		var result = get_result(get_board_copy(board, pos, last_move?'x':'o'), last_move?'x':'o');
		$('#info-last').text(JSON.stringify(result));

		board[pos] = last_move?'x':'o';
		$('.last').removeClass('last');
		$('#m' + pos).unbind('click').removeClass('move').addClass(last_move ? 'x-green' : 'o-red').addClass('last');
		$('#moves').text(++moves);
		$('#move').text((last_move?'[x]':'[o]')+' has moved');
	
		checkWinner(board);
		return true;
	} else {
		return false;
	}
}

function makeMove(){
	$('#move').text((last_move?'[x]':'[o]')+' thinking...');
	
	var move = bot_move(board, last_move);
	setBoard(move);
}

function checkWinner(board) {
	var winner = check_win(board);
	if(!winner){
		last_move = !last_move;
		if (!last_move)
			setTimeout(makeMove, 1);
	} else {// 164
		$('#move').text((last_move?'[x]':'[o]')+' win');
		
		$('.last').removeClass('last');
        for (var i = 0; i < winner.count; i++) {
            var pos = board_size * (winner.row + i * winner.dy) + (winner.col + i * winner.dx);
            $('#m' + pos).addClass('last');
        }
        $('.move').removeClass('move').unbind('click');
	}	
}

function get_symbol(board, row, col){
    if (0 <= row && row < board_size && 0 <= col && col < board_size)
        return board[row * board_size + col];
    else
        return '*';
}

function check_win(board){
	var rule = 5;
	var winning = 0;
	for (var row = 0; row < board_size; row++) {
		for (var col = 0; col < board_size; col++) {
			if (get_symbol(board, row, col) != ' '){
				// horizontal
				if (col <= board_size - rule){
					winning = 1;
					while (get_symbol(board, row, col) == get_symbol(board, row, col + winning))
						winning += 1;
					if (winning >= rule)
						return {'row': row, 'col': col, 'count': winning, 'dx': 1, 'dy': 0};
				}
				// vertical
				if(row <= board_size - rule){
					// |
					winning = 1;
					while (get_symbol(board, row, col) == get_symbol(board, row + winning, col))
						winning += 1;
					if (winning >= rule)
						return {'row': row, 'col': col, 'count': winning, 'dx': 0, 'dy': 1};
					
					// /
					if (col >= rule - 1){
						winning = 1;
						while (get_symbol(board, row, col) == get_symbol(board, row + winning, col - winning))
							winning += 1;
						if (winning >= rule)
							return {'row': row, 'col': col, 'count': winning, 'dx': -1, 'dy': 1};
					}
					// \o
					if (col <= board_size - rule){
						winning = 1;
						while (get_symbol(board, row, col) == get_symbol(board, row + winning, col + winning))
							winning += 1;
						if (winning >= rule)
							return {'row': row, 'col': col, 'count': winning, 'dx': 1, 'dy': 1};
					}
				}
			}
		}
	}
    return false;
}

function check_row(board, rule, symbol){
    var opened = 0;
    var closed = 0;
	var winning = 0;
	for (var row = 0; row < board_size; row++) {
		for (var col = 0; col < board_size; col++) {
            if (get_symbol(board, row, col) == symbol){
                // horizontal
                if (col <= board_size - rule){
                    winning = 1;
                    while (get_symbol(board, row, col) == get_symbol(board, row, col + winning) && winning <= rule)
                        winning += 1;
                    if (winning == rule){
                        if (get_symbol(board, row, col + winning) == ' ' && get_symbol(board, row, col - 1) == ' ')
                            opened += 1;
                        else
                            closed += 1;
					}
				}
                // vertical
                if (row <= board_size - rule){
                    // |
                    winning = 1;
                    while (get_symbol(board, row, col) == get_symbol(board, row + winning, col) && winning <= rule)
                        winning += 1;
                    if (winning == rule) {
                        if (get_symbol(board, row + winning, col) == ' ' && get_symbol(board, row - 1, col) == ' ')
                            opened += 1;
                        else
                            closed += 1;
					}
                    // /
                    if (col >= rule - 1){
                        winning = 1;
                        while (get_symbol(board, row, col) == get_symbol(board, row + winning, col - winning) && winning <= rule)
                            winning += 1;
                        if (winning == rule){
                            if (get_symbol(board, row + winning, col - winning) == ' ' && get_symbol(board, row - 1, col + 1) == ' ')
                                opened += 1;
                            else
                                closed += 1;
						}
					}
                    // \o
                    if (col <= board_size - rule){
                        winning = 1;
                        while (get_symbol(board, row, col) == get_symbol(board, row + winning, col + winning) && winning <= rule)
                            winning += 1;
                        if (winning == rule){
                            if (get_symbol(board, row + winning, col + winning) == ' ' && get_symbol(board, row - 1, col - 1) == ' ')
                                opened += 1;
                            else
                                closed += 1;
						}
					}
				}
			}
		}
	}
    return { 'opened': opened, 'closed': closed };
}

function is_better(x, y){
    if (x['5o'] + x['5c'] == y['5o'] + y['5c']) {
        if (x['4o'] == y['4o']) {
            if (x['3o'] == y['3o']) {
                if (x['2o'] == y['2o']) {
                    if (x['4c'] == y['4c']) {
                        if (x['3c'] == y['3c']) {
                            if (x['2c'] == y['2c']) {
                                return null;
                            } else 
                                return (x['2c'] > y['2c']);
                        } else 
                            return (x['3c'] > y['3c']);
                    } else 
                        return (x['4c'] > y['4c']);
                } else 
                    return (x['2o'] > y['2o']);
            } else 
                return (x['3o'] > y['3o']);
        } else 
            return (x['4o'] > y['4o']);
    } else 
        return (x['5o'] + x['5c'] > y['5o'] + y['5c']);
}

function get_result(temp_board, symbol){
    var result = {};
    for(var rule = 2; rule <= 6; rule++){
        var count = check_row(temp_board, rule, symbol);
        result[rule + 'o'] = count['opened'];
        result[rule + 'c'] = count['closed'];
	}
    return result;
}

function get_board_copy(board, pos, symbol) {
	var temp_board = [];
	for (var i = 0; i < board_size*board_size; i++)
		temp_board.push(board[i]);
	temp_board[pos] = symbol;
	return temp_board;
}

function bot_move(board, player){
	var enemy = player ? 'o' : 'x';
	var me = player ? 'x' : 'o';

	var best_pos = 0;
	var best_result = null;
	var move_result = null;

	//defense
	for(var i=0; i < board_size*board_size; i++){
		if (board[i] == ' '){
			var result = get_result(get_board_copy(board, i, enemy), enemy);

			if (best_result == null){
				best_pos = i;
				best_result = result;
				move_result = get_result(get_board_copy(board, i, me), me);
			}else{
				var better_than = is_better(result, best_result);
				if (better_than == null){
					//get the best of two
					result = get_result(get_board_copy(board, i, me), me);
					if (is_better(result, move_result)){
						best_pos = i;
						move_result = result;
					}
				}else{
					if (better_than){
						best_pos = i;
						best_result = result;
					}
				}
			}
		}
	}
	if (best_result['5o'] + best_result['5c'] == 0){
		//offense
		var count_before = check_row(board, 3, me);
		var count_before_4 = check_row(board, 4, me);
		for(var i=0; i < board_size*board_size; i++){
			if(board[i] == ' '){
				var temp_board = get_board_copy(board, i, me);
				if (best_result['4o'] == 0){ // + best_result['3o']
						var count = check_row(temp_board, 4, me);
						var result = count['closed'] - count_before_4['closed'];
						if (result > 0)
							best_pos = i;
						var count = check_row(temp_board, 3, me);
						var result = count['opened'] - count_before['opened'];
						if (result > 0)
							best_pos = i;
				}
				var count = check_row(temp_board, 4, me);
				var result = count['opened'];
				if (result > 0) {
					best_pos = i;
					break;
				}
			}
		}
	}
	//win move
	for (var i=0; i < board_size*board_size; i++) {
		if (board[i] == ' ') {
			var count = check_row(get_board_copy(board, i, me), 5, me);
			var result = count['opened'] + count['closed'];
			if (result > 0){
				best_pos = i;
				break;
			}
		}
	}
	if (board[best_pos] != ' ')
		alert('superposition! = ' + best_pos + ' = '+board[best_pos]);
	return best_pos;
}