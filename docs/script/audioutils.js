

let currentPlayAudio = null;

let MaxTryPlayCount = 10;
let lastElement = null;

function createAudio(url, audioSrc, loop) {
    let u = navigator.userAgent;
    let isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; 
    let temp = new Howl({
        src: [url],
        preload: true,
        loop: loop === true,
        html5: !isAndroid, // 设置为true 页面将使用原生video 标签渲染 不会导致资源跨域的情况

    });
    return temp;
}
let clickAudio = createAudio(

    "https://eva-grammer.github.io/question/media/alert.wav", "点击声效"
);

let successAudio = createAudio(
    "https://eva-grammer.github.io/question/media/success.wav", "成功声效"
);

let failAudio = createAudio(
    "https://eva-grammer.github.io/question/media/error.wav", "错误声效"
);


function playAudion(audio) {
    audio.play();
}
function playAudionWithUrl(url, loop) {
    if (!loop) {
        stopPlay();
    }
    unloadTempAudion();
    currentPlayAudio = createAudio(url, "播放音频：" + url, loop);
    playAudion(currentPlayAudio);
}
function unloadTempAudion() {
    if (currentPlayAudio) {
        currentPlayAudio.unload();
        currentPlayAudio = undefined;
    }
}
function stopPlay() {
    if (!lastElement) return;
    lastElement.innerText = lastElement.oldText;
    unloadTempAudion();
}

function playOne(element) {
    stopPlay();
    lastElement = element;
    element.oldText = element.innerText;
    element.innerText = "停止";
    let url = element.href;
    playAudionWithUrl(url, true);
}


function playAlertAudio() {
    playAudion(clickAudio);
}
function playSuccessAudio() {

    playAudion(successAudio);
}

function playFailAudio() {


    playAudion(failAudio);
}

function playSentence(word, timeOut = 1000) {
    let playWord = word;
    if (word.join) {
        playWord = word.join("+");
    }
    setTimeout(() => {
        let href =
            "https://dict.youdao.com/dictvoice?audio=" +
            playWord +
            "&le=eng&le=eng&type=2";
        playAudionWithUrl(href, false);
    }, timeOut);
}