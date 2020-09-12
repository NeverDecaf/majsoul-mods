// ==UserScript==
// @name         BackgroundMute
// @namespace    https://github.com/NeverDecaf/
// @version      0.1
// @description  Mute sounds if window lost focus
// @author       NeverDecaf
// @match        https://www.majsoul.com/*
// @match        https://game.maj-soul.com/*
// @match        https://majsoul.union-game.com/
// @match        https://game.mahjongsoul.com/
// @match        https://mahjongsoul.game.yo-star.com/
// @grant        none
// ==/UserScript==
const soundOptions = ['audio', 'music', 'lizhi', 'yuyin', 'teshuyuyin'];
var soundSettings = {};
var waitaudiomod = setInterval(function() {
    if (view && view.AudioMgr) {
		unMute = function() {
			if (old = window.localStorage.getItem('soundSettings'))
				soundSettings = JSON.parse(old);
            Object.entries(soundSettings).forEach(([k, v]) => {
                view.AudioMgr[k] = v;
            });
		}
		unMute();
        document.body.onfocus = () => {
			unMute();
        }
        document.body.onblur = () => {
            soundOptions.forEach((n) => {
                soundSettings[n + 'Volume'] = view.AudioMgr[n + 'Volume'];
                soundSettings[n + 'Muted'] = view.AudioMgr[n + 'Muted'];
				window.localStorage.setItem('soundSettings',JSON.stringify(soundSettings));
            });
            soundOptions.forEach((n) => {
                view.AudioMgr[n + 'Muted'] = true;
            });
        }
        clearInterval(waitaudiomod);
    }
}, 1000);