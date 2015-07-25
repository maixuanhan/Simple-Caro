/* CARO handling */
/* Han Mai */

/* GLOBAL CONFIG */
var BOARD_WIDTH = 30;
var BOARD_HEIGHT = 20;

/* Modify BOARD SIZE: */
/* INPUT: row: size of height */
/*        column: size of width */
function setBoardSize(row, column) {
    BOARD_HEIGHT = row;
    BOARD_WIDTH = column;
}

/* Draw new board */
/* INPUT: board: jQuery table object */
function drawBoard(board, sign) {
    board.empty();
    for (i = 0; i < BOARD_HEIGHT; i++) {
        var row = $('<tr></tr>');
        for (j = 0; j < BOARD_WIDTH; j++) {
            var cell = $('<td></td>').data({ 'row': i, 'col': j }).click(function () {
                $(this).html(sign).addClass('caro-' + sign).unbind('click');

                /* testing only */
                markWin(board, $(this).data('row'), $(this).data('col'),
                    checkRule1(board, $(this).data('row'), $(this).data('col')),
                    checkRule2(board, $(this).data('row'), $(this).data('col')),
                    checkRule3(board, $(this).data('row'), $(this).data('col')),
                    checkRule4(board, $(this).data('row'), $(this).data('col')));
            });
            row.append(cell);
        }
        board.append(row);
    }
}

/* Get value of a cell */
/* INPUT: board: jQuery table object */
/*        row: index of row */
/*        col: index of column */
/* RETURN: text value of the cell: 'x', 'o', or '' */
function getValueOfCell(board, row, col) {
    return board.find('tr:eq(' + row + ')').find('td:eq(' + col + ')').html();
}

/* Mark a cell with caro-win class */
/* INPUT: board: jQuery table object */
/*        row: index of row */
/*        col: index of column */
function markCellWin(board, row, col) {
    var cell = board.find('tr:eq(' + row + ')').find('td:eq(' + col + ')');
    if (!cell.hasClass('caro-win'))
        cell.addClass('caro-win');
}

/* Check horizontal line */
/* INPUT: board: jQuery table object */
/*        row: current row */
/*        col: current column */
/* RETURN: true: if pass the rule */
/*         false: if not */
function checkRule1(board, row, col) {
    var val = getValueOfCell(board, row, col);
    var blockedHead = false;
    var blockedTail = false;
    var count = 0;

    for (i = col; i >= 0; i--) {
        var current = getValueOfCell(board, row, i);
        if (current === val)
            count++;
        else if (current !== '') {
            blockedHead = true;
            break;
        }
        else
            break;
    }
    for (i = col + 1; i < BOARD_WIDTH; i++) {
        var current = getValueOfCell(board, row, i);
        if (current === val)
            count++;
        else if (current !== '') {
            blockedTail = true;
            break;
        }
        else
            break;
    }
    if (!(count != 5 || blockedHead && blockedTail)) {
        return true;
    }
    return false;
}

/* Check vertical line */
/* INPUT: board: jQuery table object */
/*        row: current row */
/*        col: current column */
/* RETURN: true: if pass the rule */
/*         false: if not */
function checkRule2(board, row, col) {
    var val = getValueOfCell(board, row, col);
    var blockedHead = false;
    var blockedTail = false;
    var count = 0;

    for (i = row; i >= 0; i--) {
        var current = getValueOfCell(board, i, col);
        if (current === val)
            count++;
        else if (current !== '') {
            blockedHead = true;
            break;
        }
        else
            break;
    }
    for (i = row + 1; i < BOARD_HEIGHT; i++) {
        var current = getValueOfCell(board, i, col);
        if (current === val)
            count++;
        else if (current !== '') {
            blockedTail = true;
            break;
        }
        else
            break;
    }
    if (!(count != 5 || blockedHead && blockedTail)) {
        return true;
    }
    return false;
}

/* Check diagonal line */
/* INPUT: board: jQuery table object */
/*        row: current row */
/*        col: current column */
/* RETURN: true: if pass the rule */
/*         false: if not */
function checkRule3(board, row, col) {
    var val = getValueOfCell(board, row, col);
    var blockedHead = false;
    var blockedTail = false;
    var count = 0;

    for (i = row, j = col; i >= 0 && j >= 0; i--, j--) {
        var current = getValueOfCell(board, i, j);
        if (current === val)
            count++;
        else if (current !== '') {
            blockedHead = true;
            break;
        }
        else
            break;
    }
    for (i = row + 1, j = col + 1; i < BOARD_HEIGHT && j < BOARD_WIDTH; i++, j++) {
        var current = getValueOfCell(board, i, j);
        if (current === val)
            count++;
        else if (current !== '') {
            blockedTail = true;
            break;
        }
        else
            break;
    }
    if (!(count != 5 || blockedHead && blockedTail)) {
        return true;
    }
    return false;
}

/* Check back diagonal line */
/* INPUT: board: jQuery table object */
/*        row: current row */
/*        col: current column */
/* RETURN: true: if pass the rule */
/*         false: if not */
function checkRule4(board, row, col) {
    var val = getValueOfCell(board, row, col);
    var blockedHead = false;
    var blockedTail = false;
    var count = 0;

    for (i = row, j = col; i >= 0 && j < BOARD_WIDTH; i--, j++) {
        var current = getValueOfCell(board, i, j);
        if (current === val)
            count++;
        else if (current !== '') {
            blockedHead = true;
            break;
        }
        else
            break;
    }
    for (i = row + 1, j = col - 1; i < BOARD_HEIGHT && j >= 0; i++, j--) {
        var current = getValueOfCell(board, i, j);
        if (current === val)
            count++;
        else if (current !== '') {
            blockedTail = true;
            break;
        }
        else
            break;
    }
    if (!(count != 5 || blockedHead && blockedTail)) {
        return true;
    }
    return false;
}

/* Mark WIN: highlight the win moves */
/* INPUT: board: jQuery table object */
/*        row: current row */
/*        col: current column */
/*        rule1: pass Rule1 */
/*        rule2: pass Rule2 */
/*        rule3: pass Rule3 */
/*        rule4: pass Rule4 */
function markWin(board, row, col, rule1, rule2, rule3, rule4) {
    var val = getValueOfCell(board, row, col);
    if (rule1) {
        for (i = col; i >= 0; i--) {
            if (getValueOfCell(board, row, i) === val)
                markCellWin(board, row, i);
            else
                break;
        }
        for (i = col + 1; i < BOARD_WIDTH; i++) {
            if (getValueOfCell(board, row, i) === val)
                markCellWin(board, row, i);
            else
                break;
        }
    }
    if (rule2) {
        for (i = row; i >= 0; i--) {
            if (getValueOfCell(board, i, col) === val)
                markCellWin(board, i, col);
            else
                break;
        }
        for (i = row + 1; i < BOARD_HEIGHT; i++) {
            if (getValueOfCell(board, i, col) === val)
                markCellWin(board, i, col);
            else
                break;
        }
    }
    if (rule3) {
        for (i = row, j = col; i >= 0 && j >= 0; i--, j--) {
            if (getValueOfCell(board, i, j) === val)
                markCellWin(board, i, j);
            else
                break;
        }
        for (i = row + 1, j = col + 1; i < BOARD_HEIGHT && j < BOARD_WIDTH; i++, j++) {
            if (getValueOfCell(board, i, j) === val)
                markCellWin(board, i, j);
            else
                break;
        }
    }
    if (rule4) {
        for (i = row, j = col; i >= 0 && j < BOARD_WIDTH; i--, j++) {
            if (getValueOfCell(board, i, j) === val)
                markCellWin(board, i, j);
            else
                break;
        }
        for (i = row + 1, j = col - 1; i < BOARD_HEIGHT && j >= 0; i++, j--) {
            if (getValueOfCell(board, i, j) === val)
                markCellWin(board, i, j);
            else
                break;
        }
    }
}