
let tempAudio = null;
let currentPlayAudio = null;
let maxAudioNumber = 4;
let lastElement = null;
let clickAudio = [];
let clickAudioIndex = -1;
let clickAudioUrl =
    "https://vod.ruotongmusic.com/sv/371bb841-179ccf90325/371bb841-179ccf90325.wav";
function createAudio(url, source) {
    let temp = new Audio(url);
    temp.errorSource = source;
    temp.errorCount = 0;
    temp.tag = "";
    temp.canPause = false;
    temp.onabort = function (e) {
        console.error(e)
        console.error("来自播放音频onabort第" + (temp.errorCount ? temp.errorCount : 0) + "次错误[" + temp.errorSource + (temp.tag || "") + "]:");

        temp = reCreateAudio(temp);

    };
    return temp;
}
for (let index = 0; index < maxAudioNumber; index++) {

    clickAudio.push(createAudio(clickAudioUrl, "点击声效" + index));
}


let successAudio = createAudio(
    "https://vod.ruotongmusic.com/sv/28e211ba-179ccca0dfa/28e211ba-179ccca0dfa.wav", "成功声效"
);
function reCreateAudio(audio) {
    let newAudio = createAudio(audio.src, audio.errorSource);
    newAudio.errorCount = audio.errorCount;
    newAudio.tag = "-异常重建";
    return newAudio;
}
let failAudio = createAudio(
    "https://vod.ruotongmusic.com/sv/5dc38d4-179ccc95e2f/5dc38d4-179ccc95e2f.wav", "错误声效"
);


function playAudion(audio) {
    if (audio.duration) {
        audio.currentTime = 0;
    }
    audio.canPause = false;
    let playPromise = audio.play();
    if (playPromise !== undefined) {
        playPromise.then(_ => {
            audio.canPause = true;
        }).catch(error => {
            console.error(error)
            console.error("来自播放音频第" + (audio.errorCount ? audio.errorCount : 0) + "次错误[" + audio.errorSource + (audio.tag || "") + "]:");
            stopPlay();

        });
    }
}

function playAudionWithUrl(url, loop) {
    currentPlayAudio = createAudio(url, "播放音频：" + url);
    currentPlayAudio.loop = loop;
    if (!loop) {
        stopPlay();
    }
    playAudion(currentPlayAudio);
}

function stopPlay() {
    if (!lastElement) return;
    lastElement.innerText = lastElement.oldText;
    if (currentPlayAudio != null && currentPlayAudio.canPause) {
        currentPlayAudio.pause();
    }
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

    let index = ++clickAudioIndex;
    if (index == maxAudioNumber - 1) {

        clickAudioIndex = -1;
    }
    playAudion(clickAudio[index]);
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