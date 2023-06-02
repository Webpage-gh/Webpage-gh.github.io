/* 
 * Hint
 * Basic hinting system for providing in-game help when a player gets stuck.
 * (c) 2014 Q42
 * http://q42.com | @q42
 * Written by Martin Kool
 * martin@q42.nl | @mrtnkl
 */
var HintType = {
  None: 'None',
  RowsMustBeUnique: '不能有两行的相同的',
  ColsMustBeUnique: '不能有两列是相同的',
  RowMustBeBalanced: '每行中每种颜色的数量是相同的',
  ColMustBeBalanced: '每列中每种颜色的数量是相同的',
  MaxTwoRed: '三个红色方块不能处于一条线或行列中',
  MaxTwoBlue: '三个蓝色方块不能处于一条线或行列中',
  SinglePossibleRowCombo: '这里只能有一个组合',
  SinglePossibleColCombo: '这里只能有一个组合',
  Error: '这个似乎不对',
  Errors: '这些似乎不对'
};

function Hint(grid) {
  var self = this,
      active = false,
      visible = false,
      info = {
        type: HintType.None,
        tile: null,
        tile2: null,
        doubleRowOrCol: []
      }

  this.doubleColFound = [];
  this.doubleRowFound = [];

  function clear() {
    this.doubleColFound = [];
    this.doubleRowFound = [];
    hide();
    if (grid)
      grid.unmark();
    active = false;
    info = {
      type: HintType.None,
      tile: null,
      tile2: null,
      doubleRowOrCol: []
    }
  }

  function mark(tile, hintType, tile2, doubleRowOrCol) {
    if (active) {
      //console.log('mark', hintType, doubleRowOrCol)
      //console.log('tiles', tile, tile2)
      info.tile = tile;
      info.tile2 = tile2 || null;
      info.type = hintType;
      info.doubleRowOrCol = doubleRowOrCol;
      return true;
    }
    return false;
  }

  function next() {
    var wrongTiles = grid.wrongTiles;
    if (wrongTiles.length) {
      if (wrongTiles.length == 1) {
        wrongTiles[0].mark();
        show(HintType.Error);
      } else {
        $(wrongTiles).each(function(){
          this.mark();
        })
        show(HintType.Errors);
      }
      return;
    }
    active = true;
    grid.solve(false, true);
    if (info.tile) {
      show(info.type);      
      switch (info.type) {
        case HintType.RowMustBeBalanced:
          grid.markRow(info.tile.y);
          break;
        case HintType.ColMustBeBalanced:
          grid.markCol(info.tile.x);
          break;
        case HintType.RowsMustBeUnique:
          grid.markRow(info.tile.y);
          grid.markRow(info.doubleRowOrCol[0] != info.tile.y ? info.doubleRowOrCol[0] : info.doubleRowOrCol[1]);
          break;
        case HintType.ColsMustBeUnique:
          grid.markCol(info.tile.x);
          grid.markCol(info.doubleRowOrCol[0] != info.tile.x ? info.doubleRowOrCol[0] : info.doubleRowOrCol[1]);
          break;
        default:
          if (info.tile2)
            info.tile2.mark();
          info.tile.mark();
          break;
      }
    }
  }

  function show(type) {
    var s = type;
    $('#hintMsg').html('<span>' + s + '</span>');
    $('html').addClass('showHint');
    visible = true;
  }

  function hide() {
    $('html').removeClass('showHint');
    visible = false;
  }

  this.clear = clear;
  this.mark = mark;
  this.next = next;
  this.show = show;
  this.hide = hide;
  
  this.info = info;
  this.__defineGetter__('active', function() { return active; })
  this.__defineSetter__('active', function(v) { active = v; })
  this.__defineGetter__('visible', function() { return visible; })
};