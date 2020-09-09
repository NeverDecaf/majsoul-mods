// ==UserScript==
// @name         DimTsumogiri
// @namespace    https://github.com/NeverDecaf/
// @version      0.1
// @description  Dim tsumogiri similar to replay mode, set CHEATY = false to only dim for 1 go-around
// @author       NeverDecaf
// @match        https://www.majsoul.com/*
// @match        https://game.maj-soul.com/*
// @match        https://majsoul.union-game.com/
// @match        https://game.mahjongsoul.com/
// @match        https://mahjongsoul.game.yo-star.com/
// @grant        none
// ==/UserScript==
const CHEATY = true;
var waittedashimod = setInterval(() => {
    if (view && view.Block_QiPai && view.ViewPai) {
        const defaultColorF = view.ViewPai.prototype.GetDefaultColor;
        view.Block_QiPai.prototype.AddQiPai = (function() {
            var cacheF = view.Block_QiPai.prototype.AddQiPai;
            return function() {
                arguments[0].ismoqie = arguments[2];
                cacheF.apply(this, arguments);
            };
        })();
        view.ViewPai.prototype.GetDefaultColor = (function() {
            return function() {
                var color = defaultColorF.apply(this, arguments);
                if (this.val.ismoqie)
                    return new Laya.Vector4(.8, .8, .8, 1);
                return color;
            };
        })();
        view.Block_QiPai.prototype.QiPaiPass = (function() {
            var cacheF = view.Block_QiPai.prototype.QiPaiPass;
            return function() {
                if (this.last_pai && !CHEATY)
                    this.last_pai.GetDefaultColor = defaultColorF;
                cacheF.apply(this, arguments);
            };
        })();
        clearInterval(waittedashimod);
    }
}, 1000);