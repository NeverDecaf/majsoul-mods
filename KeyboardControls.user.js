// ==UserScript==
// @name         KeyboardControls
// @namespace    https://github.com/NeverDecaf/
// @version      0.1
// @description  Adds in-game keyboard controls
// @author       NeverDecaf
// @match        https://www.majsoul.com/*
// @match        https://game.maj-soul.com/*
// @match        https://majsoul.union-game.com/
// @match        https://game.mahjongsoul.com/
// @match        https://mahjongsoul.game.yo-star.com/
// @grant        none
// ==/UserScript==

// v2
// get keycodes here: https://keycode.info/

// planned:
// selector for multi-wait chi calls
// hotkeys for auto buttons (on left)
// hotkey for end of round Confirm(3) button

// maybe:
// tsumogiri + cancel on same button? might be conflicts such as tenpai state
// correctly switch selected tile after calling if tile moved


// If CONFIRM_DISCARDS is false tile hotkeys will discard immediately.
var CONFIRM_DISCARDS = false;
//                   1   2   3   4   5   6   7   8   9   0    -    =  bksp |
var TILE_HOTKEYS = [49, 50, 51, 52, 53, 54, 55, 56, 57, 48, 189, 187, 8, 220];
// some may not display correctly, override below:
var TILE_DISP = ['', '', '', '', '', '', '', '', '', '', '', '=', '←', '\\'];
var HOTKEYS = {
    'left': 37, // left arrow
    'right': 39, // right arrow
    'discard': 13, // enter
    'tsumogiri': 84, // t
    'skip': 83, // s
    'pon': 80, // p
    'chi': 67, // c
    'kan': 75, // k
    'win': 87, // w
    'riichi': 82, // r
    'pei': 78, // n
    'nineterminalsabort': 188, // ,
}
// NUMPAD KEYS:        7    8    9    4    5    6   1   2   3   0    .    +
var EMOJI_HOTKEYS = [103, 104, 105, 100, 101, 102, 97, 98, 99, 96, 110, 107];
//////////////////////////////////////////////
//////////////////////////////////////////////
//////////////////////////////////////////////
var waitkbmod = setInterval(() => {
    try {
        uiscript.UI_DesktopInfo.Inst.block_emo
        view.ViewPlayer_Me.Inst.hand

        window.onkeydown = function(e) {
            // should enable spamming while key is held down (might be system/browser dependant)
            var key = e.keyCode ? e.keyCode : e.which;
            switch (key) {
                case HOTKEYS.left:
                    // move 1 tile left
                    move_left();
                    break;
                case HOTKEYS.right:
                    // move 1 tile right
                    move_right();
                    break;
            }
        }
        window.onkeyup = function(e) {
            var key = e.keyCode ? e.keyCode : e.which;
            switch (key) {
                case HOTKEYS.discard:
                    discardTile(selectedTile);
                    break;
                case HOTKEYS.tsumogiri:
                    discardTile(view.ViewPlayer_Me.Inst.hand.length - 1);
                    break;
                case HOTKEYS.skip:
                    callOperation('btn_cancel')
                    break;
                case HOTKEYS.pon:
                    callOperation('btn_peng')
                    break;
                case HOTKEYS.chi:
                    callOperation('btn_chi')
                    // if there are multiple, check this._data.chi.length > 1, see i.prototype.onBtn_Chi
                    break;
                case HOTKEYS.kan:
                    callOperation('btn_gang')
                    break;
                case HOTKEYS.win:
                    callOperation('btn_hu')
                    callOperation('btn_zimo')
                    break;
                case HOTKEYS.riichi:
                    callOperation('btn_lizhi')
                    break;
                case HOTKEYS.pei:
                    callOperation('btn_babei')
                    break;
                case HOTKEYS.nineterminalsabort:
                    callOperation('btn_jiuzhongjiupai')
                    break;
            }
            // send emojis
            if (EMOJI_HOTKEYS.includes(key)) {
                sendEmoji(EMOJI_HOTKEYS.indexOf(key));
            }
            // choose tile directly
            if (TILE_HOTKEYS.includes(key)) {
                var tile = TILE_HOTKEYS.indexOf(key);
                if (tile < view.ViewPlayer_Me.Inst.hand.length) {
                    if (CONFIRM_DISCARDS)
                        selectTile(tile);
                    else
                        discardTile(tile);

                }
            }

        }

        function discardTile(index) {
            view.ViewPlayer_Me.Inst._choose_pai = view.ViewPlayer_Me.Inst.hand[index];
            view.ViewPlayer_Me.Inst.can_discard && view.ViewPlayer_Me.Inst._choose_pai.valid && (view.ViewPlayer_Me.Inst.DoDiscardTile(),
                view.ViewPlayer_Me.Inst.resetMouseState())
        }

        function sendEmoji(index) {
            var validc = 0;
            if (!uiscript.UI_DesktopInfo.Inst.block_emo.allgray)
                uiscript.UI_DesktopInfo.Inst.block_emo.scrollview._container_items._childs.some((e, i) => {
                    if (e.getChildByName('btn')._clickHandler) {
                        if (validc == index) {
                            uiscript.UI_DesktopInfo.Inst.block_emo.muted = true;
                            uiscript.UI_DesktopInfo.Inst.block_emo.scrollview._container_items._childs[i].getChildByName('btn')._clickHandler.method()
                            return true;
                        }
                        validc++;
                    }
                });
        }
        uiscript.UI_DesktopInfo.Inst.block_emo.__proto__.switchShow = (function() {
            var cacheF = uiscript.UI_DesktopInfo.Inst.block_emo.__proto__.switchShow;
            return function() {
                if (this.muted)
                    this.muted = false;
                else
                    return cacheF.apply(this, arguments);
            };
        })();

        var selectedTile = 0;

        function selectTile(index) {
            var n = 0,
                a = 0;
            Laya.Browser.width / 1920 < Laya.Browser.height / 1080 ? a = (Laya.Browser.height - Laya.Browser.width / 1920 * 1080) / 2 : n = (Laya.Browser.width - Laya.Browser.height / 1080 * 1920) / 2;
            Laya.MouseManager.instance.mouseX = ((index * view.ViewPlayer_Me.Inst.handwidth + view.ViewPlayer_Me.Inst.handorigin_x) - view.ViewPlayer_Me.Inst.screen_left) / (view.ViewPlayer_Me.Inst.screen_right - view.ViewPlayer_Me.Inst.screen_left) * (Laya.Browser.width - 2 * n);
            Laya.MouseManager.instance.mouseY = (-view.ViewPlayer_Me.Inst.screen_top) / (view.ViewPlayer_Me.Inst.screen_bottom - view.ViewPlayer_Me.Inst.screen_top) * (Laya.Browser.height - 2 * a)
            selectedTile = index;
        }

        function move_left() {
            selectedTile = (selectedTile + view.ViewPlayer_Me.Inst.hand.length - 1) % view.ViewPlayer_Me.Inst.hand.length;
            while (!view.ViewPlayer_Me.Inst.hand[selectedTile].valid) {
                selectedTile = (selectedTile + view.ViewPlayer_Me.Inst.hand.length - 1) % view.ViewPlayer_Me.Inst.hand.length;
            }
            selectTile(selectedTile);
        }

        function move_right() {
            selectedTile = (selectedTile + 1) % view.ViewPlayer_Me.Inst.hand.length;
            while (!view.ViewPlayer_Me.Inst.hand[selectedTile].valid) {
                selectedTile = (selectedTile + 1) % view.ViewPlayer_Me.Inst.hand.length;
            }
            selectTile(selectedTile);
        }

        function callOperation(opname) {
            this.GameMgr.Inst._pre_mouse_point = new Laya.Point(1, 1);
            if (uiscript.UI_LiQiZiMo.Inst.enable && uiscript.UI_LiQiZiMo.Inst._oplist.includes(opname)) {
                uiscript.UI_LiQiZiMo.Inst.onClickOpBtn(opname)
            } else if (uiscript.UI_ChiPengHu.Inst.enable && uiscript.UI_ChiPengHu.Inst._oplist.includes(opname)) {
                uiscript.UI_ChiPengHu.Inst.onClickOpBtn(opname)
            }
        }

        var keycss = `
.key__button {
  box-sizing: border-box;
  line-height: 2vw;
  font-size: 1.5vw;
  text-align: center;
  width: 2vw;
  color: #555;
  height: 2vw;
  border-color: #f2f2f2;
  border-style: solid;
  text-shadow: 0 0.5px 1px #777, 0 2px 6px #f2f2f2;
  border-width: 1px;
  border-radius: .5vw;
  background: -webkit-linear-gradient(top, #f9f9f9 0%, #D2D2D2 80%, #c0c0c0 100%);
  font-family: sans-serif;
  display: inline-block;
  transition: box-shadow 0.3s ease, transform 0.15s ease;
  box-shadow: 0 0 1px #888,0 1px 0 #fff, 0 6px 0 #C0C0C0, 0 8px 17px rgba(#444, 0.4), 2px 1px 4px rgba(#444, 0.25), -2px 1px 4px rgba(#444, 0.25), 0 9px 16px rgba(#444, 0.1);
}
#tileLabels {
  display: flex;
  justify-content: space-around;
}
	`,
            head = document.head || document.getElementsByTagName('head')[0],
            style = document.createElement('style');
        head.appendChild(style);
        style.type = 'text/css';
        style.appendChild(document.createTextNode(keycss));

        function positionDiv() {
            var n = 0,
                a = 0,
                canvas = document.getElementById('layaCanvas');
            Laya.Browser.width / 1920 < Laya.Browser.height / 1080 ? a = (Laya.Browser.height - Laya.Browser.width / 1920 * 1080) / 2 : n = (Laya.Browser.width - Laya.Browser.height / 1080 * 1920) / 2;
            var x = (view.ViewPlayer_Me.Inst.handorigin_x - view.ViewPlayer_Me.Inst.screen_left - view.ViewPlayer_Me.Inst.handwidth / 2) / (view.ViewPlayer_Me.Inst.screen_right - view.ViewPlayer_Me.Inst.screen_left) * (Laya.Browser.width - 2 * n) + (window.innerWidth - canvas.width) / 2,
                y = (window.innerHeight - canvas.height) / 2 + canvas.height;
            tileLabels.style.left = x + 'px'
            tileLabels.style.top = 'calc(' + y + 'px - 2vw)'
            tileLabels.style.width = (view.ViewPlayer_Me.Inst.handwidth * 14 / (view.ViewPlayer_Me.Inst.screen_right - view.ViewPlayer_Me.Inst.screen_left) * (Laya.Browser.width - 2 * n)) + 'px';
        }

        var tileLabels = document.getElementById('tileLabels') || document.createElement("DIV");
        tileLabels.innerHTML = '';
        tileLabels.setAttribute('id', 'tileLabels')
        tileLabels.style.position = 'absolute';
        tileLabels.style.visibility = 'hidden';
        positionDiv();
        var TILE_ELEMENTS = [];
        TILE_HOTKEYS.forEach((key, i) => {
            let kdiv = document.createElement('DIV');
            kdiv.setAttribute('class', 'key__button');
            if (TILE_DISP[i])
                kdiv.innerHTML = TILE_DISP[i];
            else {
                let chrCode = key - 48 * Math.floor(key / 48);
                let chr = String.fromCharCode((96 <= key) ? chrCode : key);
                kdiv.innerHTML = chr;
            }
            tileLabels.appendChild(kdiv);
            TILE_ELEMENTS.push(kdiv);
        });
        document.body.appendChild(tileLabels);
        var resizeId;
        window.onresize = () => {
            clearTimeout(resizeId);
            resizeId = setTimeout(positionDiv, 500);
        }

        function isInGame() {
            return this != null && view != null && view.DesktopMgr != null && view.DesktopMgr.Inst != null && view.DesktopMgr.player_link_state != null && game.Scene_MJ.Inst.active && (!uiscript.UI_GameEnd.Inst || !uiscript.UI_GameEnd.Inst.enable);
        }
        setInterval(() => {
            if (isInGame()) {
                tileLabels.style.display = 'flex';
                // hide unneeded hotkeys
                TILE_ELEMENTS.forEach((e, i) => {
                    if (i < view.ViewPlayer_Me.Inst.hand.length)
                        e.style.visibility = 'visible';
                    else
                        e.style.visibility = 'hidden';
                });

            } else
                tileLabels.style.display = 'none';
        }, 500);

        clearInterval(waitkbmod);
    } catch (TypeError) {}
}, 1000);