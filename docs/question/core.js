let tempAudio = null;
let currentPlayAudio = null;
let errorInfoBox = null;
let maxAudioNumber = 4;
let lastElement = null;
currentPlayNumber = 0;
var clickAudioUrl =
    "https://vod.ruotongmusic.com/sv/371bb841-179ccf90325/371bb841-179ccf90325.wav";
var clickAudio = [];
for (let index = 0; index < maxAudioNumber; index++) {
    var temp = new Audio(clickAudioUrl);
    temp.errorSource = "点击声效" + index;
    clickAudio.push(temp);
}


var successAudio = new Audio(
    "https://vod.ruotongmusic.com/sv/28e211ba-179ccca0dfa/28e211ba-179ccca0dfa.wav"
);
successAudio.errorSource = "成功声效";
var failAudio = new Audio(
    "https://vod.ruotongmusic.com/sv/5dc38d4-179ccc95e2f/5dc38d4-179ccc95e2f.wav"
);
failAudio.errorSource = "错误声效";
function randomSort(a, b) {
    return Math.random() > 0.5 ? -1 : 1;
}
function removeEmpty(array) {
    var newArray = [];
    array.forEach((v) => {
        if (v) {
            newArray.push(v);
        }
    });
    return newArray;
}
console.error = function (error) {
    if (errorInfoBox) {
        errorInfoBox.value += error + "\r\n";
    }
}
window.onerror = function (error) {
    console.error("来自全局错误:")
    console.error(error)
}
function createQuestion(data) {
    var article = document.getElementsByTagName("article")[0];
    var h1 = document.createElement("h4");
    h1.innerText = "句型练习";
    var ol = document.createElement("ol");
    data.forEach((oneQuestion) => {
        var question = createOneQuestion(oneQuestion);
        ol.appendChild(question);
    });

    article.appendChild(h1);
    article.appendChild(ol);
}

function createDialog(data) {
    var article = document.getElementsByTagName("article")[0];
    var h1 = document.createElement("h4");
    h1.innerText = "对话练习";
    var ol = document.createElement("ol");
    data.forEach((oneDialog) => {
        var question = createOneDialog(oneDialog);
        ol.appendChild(question);
    });

    article.appendChild(h1);
    article.appendChild(ol);
}

function createHtmlContents(contents) {
    var article = document.getElementsByTagName("article")[0];
    var count = article.childElementCount;
    for (let index = 0; index < count; index++) {
        article.removeChild(article.children[0]);

    }

    contents.forEach((oneContent) => {
        createOneHtmlContent(oneContent, article);
    });
}


function createOneQuestion(d) {
    var li = document.createElement("li");

    var ul = document.createElement("ul");
    li.appendChild(ul);
    var li_title = document.createElement("li");
    li_title.textContent = d.title;
    var li_QuestionParent = document.createElement("li");
    var li_action = document.createElement("li");
    var li_result = document.createElement("li");
    var li_words = document.createElement("li");
    var li_Question = document.createElement("div");
    li_QuestionParent.appendChild(li_Question);
    li_Question.className = "select-word";
    createResetButton(li_action, li_Question, li_words);
    createPlayLink(li_action, d.originalWords);

    createWordButton(
        d.words,
        d.answer,
        d.originalWords,
        li_words,
        li_Question,
        li_result
    );
    ul.appendChild(li_title);
    ul.appendChild(li_QuestionParent);
    ul.appendChild(li_words);
    ul.appendChild(li_action);
    ul.appendChild(li_result);

    return li;
}
function createOneDialog(d) {
    var li = document.createElement("li");

    var ul = document.createElement("ul");
    li.appendChild(ul);

    d.title.forEach((title) => {
        var li_title1 = document.createElement("li");
        li_title1.textContent = title;
        ul.appendChild(li_title1);
    });
    d.answer.forEach((answer) => {
        let li_words = document.createElement("li");
        let li_QuestionParent = document.createElement("li");
        var li_Question = document.createElement("div");
        li_QuestionParent.appendChild(li_Question);
        li_Question.className = "select-word";
        let li_action = document.createElement("li");
        var li_result = document.createElement("li");
        createWordButton(
            answer.words,
            answer.en,
            answer.originalWords,
            li_words,
            li_Question,
            li_result
        );

        createResetButton(li_action, li_Question, li_words);
        createPlayLink(li_action, answer.originalWords);
        ul.appendChild(li_QuestionParent);
        ul.appendChild(li_words);
        ul.appendChild(li_action);
        ul.appendChild(li_result);
    });

    return li;
}
function createOneHtmlContent(d, parent) {

    if (d.tagName) {
        d.imgSrc.forEach(url => {
            var imgElement = document.createElement("IMG");
            imgElement.src = url;
            parent.appendChild(imgElement);
        });
        var element = document.createElement(d.tagName);
        element.textContent = d.content;
        parent.appendChild(element);
    } else if (d.answer) {

        handlerDialogEnWord(d, "answer");
        var ul = document.createElement("ul");
        var li_title = document.createElement("li");
        li_title.textContent = d.title;
        var li_QuestionParent = document.createElement("li");
        var li_action = document.createElement("li");
        var li_result = document.createElement("li");
        var li_words = document.createElement("li");
        var li_Question = document.createElement("div");
        li_QuestionParent.appendChild(li_Question);
        li_Question.className = "select-word";
        createResetButton(li_action, li_Question, li_words);
        createPlayLink(li_action, d.originalWords);

        createWordButton(
            d.words,
            d.answer,
            d.originalWords,
            li_words,
            li_Question,
            li_result
        );
        ul.appendChild(li_title);
        ul.appendChild(li_QuestionParent);
        ul.appendChild(li_words);
        ul.appendChild(li_action);
        ul.appendChild(li_result);
        var li_describ = document.createElement("li");
        li_describ.textContent = d.describe;
        ul.appendChild(li_describ);
        parent.appendChild(ul);
    }

}
function createWordButton(
    words,
    answer,
    originalWords,
    parent,
    li_Question,
    li_result
) {
    words.forEach((word) => {
        var button = document.createElement("button");
        button.innerText = word;
        button.onclick = function () {
            let audio = clickAudio[currentPlayNumber];

            if (currentPlayNumber == maxAudioNumber - 1) {
                currentPlayNumber = 0;
            } else {
                currentPlayNumber++;
            }
            playAudion(audio);
            if (li_Question.childElementCount == 0) {
                li_Question.lastButtons = [];
            }
            if (button.oldValue === undefined) {
                var li_word = document.createElement("span");
                li_word.textContent = word;
                if (!button.relationId) {
                    button.relationId = guid();
                }
                li_word.id = button.relationId;
                button.oldValue = word;
                button.className = "select";
                li_Question.lastButtons.push(button);
                li_Question.appendChild(li_word);
            } else {
                var lastButton =
                    li_Question.lastButtons[li_Question.lastButtons.length - 1];
                if (lastButton == button) {
                    li_Question.lastButtons.length -= 1;
                    button.oldValue = undefined;
                    button.className = "";
                    var relation = document.getElementById(button.relationId);
                    if (relation) relation.remove();
                }
            }

            check(words.length, answer, li_Question, li_result, originalWords);
        };
        parent.appendChild(button);
    });
}
function playAudion(audio, onError) {
    if (audio.duration) {
        audio.currentTime = 0;
    }
    audio.canPause = false;
    var playPromise = audio.play();
    if (playPromise !== undefined) {
        playPromise.then(_ => {
            audio.canPause = true;
        }).catch(error => {
            console.error("来自播放音频错误[" + audio.errorSource + "]:");
            console.error(error);
            if (onerror) {
                onError();
            } else {

                setTimeout(() => {
                    var errorSource = audio.errorSource;
                    audio = new Audio(audio.src);
                    audio.errorSource = errorSource + "-异常重试";
                    playAudion(audio);
                }, 500)

            }
        });
    }
}
function playAudionWithUrl(url, loop, onError) {
    let audio = null;
    if (loop) {
        audio = currentPlayAudio;
    } else {
        audio = tempAudio;
    }
    if (audio == null) {
        audio = new Audio(url);
        if (loop) {

            currentPlayAudio = audio;
            currentPlayAudio.errorSource = "播放音频";
            audio.loop = loop;
        } else {
            tempAudio = audio;
            tempAudio.errorSource = "成功时音频";
        }

    } else {
        audio.src = url;
    }
    playAudion(audio, onError);
}
function createPlayLink(liparent, words) {
    var link_play = document.createElement("a");
    link_play.textContent = "播放";
    link_play.href =
        "https://dict.youdao.com/dictvoice?audio=" +
        words.join("+") +
        "&le=eng&le=eng&type=2";
    liparent.appendChild(link_play);
}
function createResetButton(liparent, li_Question, li_words) {
    var btn_reset = document.createElement("button");
    btn_reset.textContent = "重置";
    btn_reset.onclick = function () {
        li_Question.lastButtons.forEach((element) => {
            element.className = "";
            element.oldValue = undefined;
        });
        li_Question.lastButtons = [];
        for (
            let index = li_Question.childElementCount - 1;
            index >= 0;
            index--
        ) {
            const element = li_Question.children[index];
            element.remove();
        }
        for (let index = 0; index < li_words.childElementCount; index++) {
            const element = li_words.children[index];
            element.oldValue = undefined;
        }
    };
    liparent.appendChild(btn_reset);
}

function check(
    wordLength,
    answer,
    resultElements,
    li_result,
    originalWords
) {
    if (wordLength !== resultElements.childElementCount) {
        li_result.textContent = "";
        return;
    }
    var test = undefined;
    for (let index = 0; index < resultElements.childElementCount; index++) {
        const element = resultElements.children[index];

        if (test == undefined) {
            test = element.innerText;
        } else {
            test += " " + element.innerText;
        }
    }
    var isSuccess = test == answer;
    if (isSuccess) {
        li_result.textContent = "正确";
        li_result.className = "success";
        playAudion(successAudio);
        setTimeout(() => {
            var href =
                "https://dict.youdao.com/dictvoice?audio=" +
                originalWords.join("+") +
                "&le=eng&le=eng&type=2";
            stopPlay();
            playAudionWithUrl(href, false);
        }, 1000);
    } else {
        li_result.textContent = "错误";
        li_result.className = "error";
        playAudion(failAudio);
    }
}
function guid() {
    function S4() {
        return (((1 + Math.random()) * 0x10000) | 0)
            .toString(16)
            .substring(1);
    }
    return (
        S4() +
        S4() +
        "-" +
        S4() +
        "-" +
        S4() +
        "-" +
        S4() +
        "-" +
        S4() +
        S4() +
        S4()
    );
}
function startPlay(element) {
    stopPlay();
    lastElement = element;
    element.oldText = element.innerText;
    element.innerText = "停止";
}
function stopPlay() {
    if (!lastElement) return;
    lastElement.innerText = lastElement.oldText;
    if (currentPlayAudio != null && currentPlayAudio.canPause) {
        currentPlayAudio.pause();
    }
}
function playOne(element) {
    startPlay(element);
    let url = element.href;
    playAudionWithUrl(url, true, stopPlay);
}
function handlerDialogEnWord(d, propertyName) {
    d[propertyName] = d[propertyName].trim();
    var words = d[propertyName].split(/\s/);
    words = removeEmpty(words);
    words.sort(randomSort);
    d.words = words;
    d.originalWords = d[propertyName].split(/\s/);
    d.originalWords = removeEmpty(d.originalWords);
}
function createNextLink() {
    var nav = document.getElementsByClassName("sidebar-nav")[0];
    var allLinks = nav.getElementsByTagName("a"); 
    var total = allLinks.length;
    var currentUrl = document.location.href;
    console.log(allLinks);
    console.log(currentUrl);

   
    for (let index = 0; index < total; index++) {
        const element = allLinks[index];

        if (currentUrl == element.href) {
            index += 1;
            if (index < total) {
                let nextLink = allLinks[index];
                nextLink.href = nextLink.href;
                nextLink.target = "_self";
                nextLink.textContent = "下一节";
                var article = document.getElementsByTagName("article")[0];
                article.appendChild(nextLink);
                console.log("生成下一节");
                return;
            }

        }

    } 
    console.log("未生成下一节");
}

function createErrorInfoBox() {

    errorInfoBox = document.createElement("textarea");
    errorInfoBox.rows = "10";
    errorInfoBox.value = "程序错误信息：\r\n";
    var article = document.getElementsByTagName("article")[0];

    article.appendChild(document.createElement("br"));
    article.appendChild(document.createElement("br"));
    article.appendChild(errorInfoBox);

}
function playLinkClick(srcElement) {
    var innerText = srcElement.innerText;
    if (innerText == "播放") {
        srcElement.onclick = function (e) {
            e.preventDefault();
        };
        playOne(srcElement);
        return true;
    }
    if (innerText == "停止") {
        srcElement.onclick = function (e) {
            e.preventDefault();
            return false;
        };
        stopPlay();
        return true;
    }
    return false;
}
function loadQuestion() {
    url = this.document.location.href.replace("/#/./", "/question/") + ".json";
    $.getJSON(url, function (result) {
        if (result.questions) {
            result.questions.forEach((d) => {
                handlerDialogEnWord(d, "answer");
            });
            createQuestion(result.questions);
        }
        if (result.contents) {
            createHtmlContents(result.contents);
        }


        if (result.dialogs) {
            result.dialogs.forEach((d) => {
                d.answer.forEach((d) => {
                    handlerDialogEnWord(d, "en");
                });
            });
            createDialog(result.dialogs);
        }
        createNextLink();
        createErrorInfoBox();
    });
}
window.onload = function () {
    document.addEventListener("touchstart", function (event) {
        if (event.touches.length > 1) {
            event.preventDefault();
        }
    });

    var lastTouchEnd = 0;

    document.addEventListener(
        "touchend",
        function (event) {
            var now = new Date().getTime();
            if (now - lastTouchEnd <= 300) {
                event.preventDefault();
            }
            lastTouchEnd = now;
        },
        false
    );

    document.addEventListener("gesturestart", function (event) {
        event.preventDefault();
    });

    loadQuestion();

};
function reloadByUrl(url) {
    this.document.location.href = url;
    this.document.location.reload();
    return false;
}
onmousedown = function (event) {
    if (event.srcElement.tagName != "A") {
        return;
    }
    event.preventDefault();
    var innerText = event.srcElement.innerText;
    var isPlayLink = playLinkClick(event.srcElement);
    if (isPlayLink) {
        return false;
    }
    var url = event.srcElement.href;
    if (innerText == "下一节") {
        return reloadByUrl(url);
    }

    else {

        var localUrl = document.location.href;
        if (localUrl.endsWith("/#/")) {
            return reloadByUrl(url);

        } else {


            var rootTagName = event.srcElement.parentElement?.parentElement?.parentElement?.parentElement?.parentElement?.parentElement?.tagName;
            if (rootTagName == "ASIDE") {
                return reloadByUrl(url);
            }
        }
    }
};