// Mute sounds if window lost focus
const soundOptions = ['audio', 'music', 'lizhi', 'yuyin', 'teshuyuyin'];
var soundSettings = {};
var waitaudiomod = setInterval(function() {
    if (view && view.AudioMgr) {
        document.body.onfocus = () => {
            Object.entries(soundSettings).forEach(([k, v]) => {
                view.AudioMgr[k] = v;
            });
        }
        document.body.onblur = () => {
            soundOptions.forEach((n) => {
                soundSettings[n + 'Volume'] = view.AudioMgr[n + 'Volume'];
                soundSettings[n + 'Muted'] = view.AudioMgr[n + 'Muted'];
            });
            soundOptions.forEach((n) => {
                view.AudioMgr[n + 'Muted'] = true;
            });
        }
        clearInterval(waitaudiomod);
    }
}, 1000);