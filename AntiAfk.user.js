// ==UserScript==
// @name         AntiAfk
// @namespace    https://github.com/NeverDecaf/
// @version      0.2
// @description  Prevents getting kicked for inactivity
// @author       NeverDecaf
// @match        https://www.majsoul.com/*
// @match        https://game.maj-soul.com/*
// @match        https://majsoul.union-game.com/
// @match        https://game.mahjongsoul.com/
// @match        https://mahjongsoul.game.yo-star.com/
// @grant        none
// ==/UserScript==
var waitheatbeat = setInterval(function() {
    if (this && this.GameMgr && this.GameMgr.Inst && Laya) {
        Laya.timer.loop(1e3, this.GameMgr, this.GameMgr.Inst.clientHeatBeat)
        clearInterval(waitheatbeat);
    }
}, 1000);
