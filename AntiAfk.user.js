// ==UserScript==
// @name         AntiAfk
// @namespace    https://github.com/NeverDecaf/
// @version      0.1
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
        setInterval(() => {
            this.GameMgr.Inst._pre_mouse_point = new Laya.Point(Math.floor(Math.random() * document.getElementById('layaCanvas').width), Math.floor(Math.random() * document.getElementById('layaCanvas').height));
            document.dispatchEvent(new Event('mousemove'));
        }, 10000);
        clearInterval(waitheatbeat);
    }
}, 1000);