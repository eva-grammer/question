let tempAudio = null;
let currentPlayAudio = null;
let errorInfoBox = null;
let maxAudioNumber = 4;
let lastEerrorSourcelement = null;
let currentPlayNumber = 0;
let clickAudioUrl =
    "https://vod.ruotongmusic.com/sv/371bb841-179ccf90325/371bb841-179ccf90325.wav";
let clickAudio = [];
for (let index = 0; index < maxAudioNumber; index++) {
    let temp = new Audio(clickAudioUrl);
    temp.errorSource = "点击声效" + index;
    temp.onabort = function () {
        temp = reCreateAudio(temp);
    };
    clickAudio.push(temp);
}


let successAudio = new Audio(
    "https://vod.ruotongmusic.com/sv/28e211ba-179ccca0dfa/28e211ba-179ccca0dfa.wav"
);
successAudio.errorSource = "成功声效";
successAudio.onabort = function () {
    successAudio = reCreateAudio(successAudio);

};
function reCreateAudio(audio) {
    let newAudio = new Audio(audio.src);
    let errorCount = audio.errorCount;
    newAudio.errorSource = audio.errorSource;
    newAudio.tag = "-异常重建";
    if (!errorCount) {
        errorCount = 1;
    }
    else {
        errorCount += 1;
    }
    newAudio.errorCount = errorCount;

    return newAudio;
}
let failAudio = new Audio(
    "https://vod.ruotongmusic.com/sv/5dc38d4-179ccc95e2f/5dc38d4-179ccc95e2f.wav"
);
failAudio.errorSource = "错误声效";
failAudio.onabort = function () {
    failAudio = reCreateAudio(failAudio);

};
function randomSort(a, b) {
    return Math.random() > 0.5 ? -1 : 1;
}
function removeEmpty(array) {
    let newArray = [];
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
    let article = document.getElementsByTagName("article")[0];
    let h1 = document.createElement("h4");
    h1.innerText = "句型练习";
    let ol = document.createElement("ol");
    data.forEach((oneQuestion) => {
        let question = createOneQuestion(oneQuestion);
        ol.appendChild(question);
    });

    article.appendChild(h1);
    article.appendChild(ol);
}

function createDialog(data) {
    let article = document.getElementsByTagName("article")[0];
    let h1 = document.createElement("h4");
    h1.innerText = "对话练习";
    let ol = document.createElement("ol");
    data.forEach((oneDialog) => {
        let question = createOneDialog(oneDialog);
        ol.appendChild(question);
    });

    article.appendChild(h1);
    article.appendChild(ol);
}

function createHtmlContents(contents) {
    let article = document.getElementsByTagName("article")[0];
    let count = article.childElementCount;
    for (let index = 0; index < count; index++) {
        article.removeChild(article.children[0]);

    }
    createNote();
    contents.forEach((oneContent) => {
        createOneHtmlContent(oneContent, article);
    });
}


function createOneQuestion(d) {
    let li = document.createElement("li");

    let ul = document.createElement("ul");
    li.appendChild(ul);
    let li_title = document.createElement("li");
    li_title.textContent = d.title;
    let li_QuestionParent = document.createElement("li");
    let li_action = document.createElement("li");
    let li_result = document.createElement("li");
    let li_words = document.createElement("li");
    let li_Question = document.createElement("div");
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
    let li = document.createElement("li");

    let ul = document.createElement("ul");
    li.appendChild(ul);

    d.title.forEach((title) => {
        let li_title1 = document.createElement("li");
        li_title1.textContent = title;
        ul.appendChild(li_title1);
    });
    d.answer.forEach((answer) => {
        let li_words = document.createElement("li");
        let li_QuestionParent = document.createElement("li");
        let li_Question = document.createElement("div");
        li_QuestionParent.appendChild(li_Question);
        li_Question.className = "select-word";
        let li_action = document.createElement("li");
        let li_result = document.createElement("li");
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
            let imgElement = document.createElement("IMG");
            imgElement.src = url;
            parent.appendChild(imgElement);
        });
        let element = document.createElement(d.tagName);
        element.textContent = d.content;
        parent.appendChild(element);
    } else if (d.answer) {

        handlerDialogEnWord(d, "answer");
        let ul = document.createElement("ul");
        let li_title = document.createElement("li");
        li_title.textContent = d.title;
        let li_QuestionParent = document.createElement("li");
        let li_action = document.createElement("li");
        let li_result = document.createElement("li");
        let li_words = document.createElement("li");
        let li_Question = document.createElement("div");
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
        if (d.describe) {
            let li_describe = document.createElement("li");
            li_describe.textContent = d.describe;
            ul.appendChild(li_describe);
        }
        parent.appendChild(ul);
    } else if (d.yinbiao) {
        let li_word = document.createElement("p");
        let li_strong = document.createElement("strong");
        li_strong.textContent = d.word;
        li_word.appendChild(li_strong);
        li_word.appendChild(document.createTextNode(d.yinbiao));

        let li_a = document.createElement("a");
        li_a.href = "https://dict.youdao.com/dictvoice?audio=" + d.word + "&type=2";
        li_a.textContent = "播放";
        li_word.appendChild(li_a);
        li_word.appendChild(document.createTextNode(d.hanyi));
        parent.appendChild(li_word);
    }

}

let wordNumber = 0;
function createWordButton(
    words,
    answer,
    originalWords,
    parent,
    li_Question,
    li_result
) {
    wordNumber++;
    $(li_Question).attr("wordNumber", wordNumber)
    words.forEach((word) => {
        let button = document.createElement("button");
        button.id = guid();
        button.innerText = word;
        button.onclick = function () {

            let audio = clickAudio[currentPlayNumber];
            if (currentPlayNumber == maxAudioNumber - 1) {
                currentPlayNumber = 0;
            } else {
                currentPlayNumber++;
            }
            playAudion(audio);
            const isSelected = $(button).hasClass("select");
            if (isSelected) {
                $(button).removeClass("select");
                $("#" + button.relationId).remove();
            } else {
                $(button).addClass("select");
                let li_word = document.createElement("span");
                li_word.textContent = word;
                if (!button.relationId) {
                    button.relationId = guid();
                }
                li_word.id = button.relationId;
                li_word.relationId = button.id;
                li_Question.appendChild(li_word);
                draggableHandle(li_word, words,
                    answer,
                    originalWords,
                    li_Question,
                    li_result);
                check(words.length, answer, li_Question, li_result, originalWords);
            }
            hideButtons(li_Question, parent);

        };
        parent.appendChild(button);
    });


}
function draggableHandle(li_word, words,
    answer,
    originalWords,
    li_Question,
    li_result) {
    $(li_word).draggable({
        containment: "parent",
        cursor: "move",
        stop: function (event, ui) {
            console.log("stop ", event, ui);
            ui.helper.removeClass("move");
            // ui.helper.html(ui.helper.attr("oldValue"));
            ui.helper.css({ top: 0, left: 0 })
            ui.helper.parent().children().removeClass("waitmove");
        },
        start: function (event, ui) {
            ui.helper.addClass("move");
            ui.helper.attr("oldValue", ui.helper.html());
            // ui.helper.empty();
            ui.helper.parent().children().addClass("waitmove");
            console.log("stop ", event, ui);
        },

    }).droppable({
        drop: function (event, ui) {
            ui.helper.removeClass("move");
            ui.helper.html(ui.helper.attr("oldValue"));
            console.log("drop ", event, ui);
            ui.helper.css({ top: 0, left: 0 })
            if (event.target.tagName == "SPAN") {
                ui.helper.insertBefore(event.target)
            }

            ui.helper.parent().children().removeClass("waitmove");
            check(words.length, answer, li_Question, li_result, originalWords);
        },
    });

}
function hideButtons(li_Question, buttonsParent) {
    const buttonCount = buttonsParent.childElementCount;
    for (let index = 0; index < buttonCount; index++) {
        const element = buttonsParent.children[index];
        $(element).show();
    }

    const wordsCount = li_Question.childElementCount;
    for (let index = 0; index < wordsCount; index++) {
        const element = li_Question.children[index];
        if (index < wordsCount - 1) {
            $("#" + element.relationId).hide();
        }

    }

}

function playAudion(audio, onError) {
    if (audio.duration) {
        audio.currentTime = 0;
    }
    audio.canPause = false;
    let playPromise = audio.play();
    if (playPromise !== undefined) {
        playPromise.then(_ => {
            audio.canPause = true;
        }).catch(error => {
            console.error("来自播放音频第" + (audio.errorCount ? audio.errorCount : 0) + "次错误[" + audio.errorSource + audio.tag || "" + "]:");
            if (onerror) {
                onError();
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
    let link_play = document.createElement("a");
    link_play.textContent = "播放";
    link_play.href =
        "https://dict.youdao.com/dictvoice?audio=" +
        words.join("+") +
        "&le=eng&le=eng&type=2";
    liparent.appendChild(link_play);
}

function createResetButton(liparent, li_Question, li_words) {
    let btn_reset = document.createElement("button");
    btn_reset.textContent = "重置";
    btn_reset.onclick = function () {
        $(li_Question).first().empty();
        $(li_words).first().find("button").removeClass("select").show();

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
    let test = undefined;
    for (let index = 0; index < resultElements.childElementCount; index++) {
        const element = resultElements.children[index];

        if (test == undefined) {
            test = element.innerText;
        } else {
            test += " " + element.innerText;
        }
    }
    let isSuccess = test == answer;
    if (isSuccess) {
        li_result.textContent = "正确";
        li_result.className = "success";
        if ($(resultElements).attr("wordNumber") * 1 == wordNumber) {
            startFire();
        }
        playAudion(successAudio);

        setTimeout(() => {
            let href =
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
    let words = d[propertyName].split(/\s/);
    words = removeEmpty(words);
    words.sort(randomSort);
    d.words = words;
    d.originalWords = d[propertyName].split(/\s/);
    d.originalWords = removeEmpty(d.originalWords);
}

function createNextLink() {
    let nav = document.getElementsByClassName("sidebar-nav")[0];
    let allLinks = nav.getElementsByTagName("a");
    if (allLinks.length == 0) {

        setTimeout(v => createNextLink(), 500);
    } else {
        let total = allLinks.length;
        let currentUrl = document.location.href;
        for (let index = 0; index < total; index++) {
            const element = allLinks[index];
            if (currentUrl == element.href) {
                index += 1;
                if (index < total) {
                    let nextLinkUrl = allLinks[index].href;
                    let nextLink = document.createElement("a");
                    nextLink.href = nextLinkUrl;
                    nextLink.target = "_self";
                    nextLink.textContent = "下一节";
                    let article = document.getElementsByTagName("article")[0];
                    article.appendChild(nextLink);
                    createErrorInfoBox();
                    return;
                }

            }
        }
    }
}

function createErrorInfoBox() {

    errorInfoBox = document.createElement("textarea");
    errorInfoBox.rows = "10";
    errorInfoBox.value = "程序错误信息：\r\n";
    let article = document.getElementsByTagName("article")[0];

    article.appendChild(document.createElement("br"));
    article.appendChild(document.createElement("br"));
    article.appendChild(errorInfoBox);

}
function playLinkClick(srcElement) {
    let innerText = srcElement.innerText;
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
    createNote();
    let url = this.document.location.href.replace("/#/./", "/question/") + ".json";
    if (!localData) {
        $.getJSON(url, function (result) {
            handleContent(result);
        });
    } else {
        handleContent(localData)
    }

}
function handleContent(result) {
    if (result.questions) {
        result.questions.forEach((d) => {
            handlerDialogEnWord(d, "answer");
        });
        createQuestion(result.questions);
    }
    if (result.contents) {
        createHtmlContents(result.contents);
    }
    if (result.words) {
        createPEP(result);


        if (result.parseShort) {
            let h2 = document.createElement("H2");
            h2.textContent = "常用表达式";
            let article = document.getElementsByTagName("article")[0];

            article.appendChild(h2);
            result.parseShort.forEach((d) => {
                handlerDialogEnWord(d, "answer");
            });
            createQuestion(result.parseShort);
        }
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
    $(".select-word").delegate("span", "dblclick", function (e) {
        doubleClickWord(e);

    });
}
function createPEP(result) {
    let article = document.getElementsByTagName("article")[0];
    //根据单词 选意思
    createSelectTitleByWord(result, article);


    //根据单词 选音标
    createSelectPronuceByWord(result, article)


    //根据意思 写单词
    createWriteWordByTitle(result, article)

    //根据音频 猜单词 
    createSelectWordByAudio(result, article)

    //根据音频 写单词 
    createWriteWordByAudio(result, article)

}

function createSelectTitleByWord(result, article) {
    //根据单词 选意思
    let article = document.getElementsByTagName("article")[0];





}

function createSelectPronuceByWord(result, article) {
    //根据单词 选音标
    let article = document.getElementsByTagName("article")[0];




}

function createWriteWordByTitle(result, article) {
    //根据意思 写单词
    let article = document.getElementsByTagName("article")[0];




}

function createSelectWordByAudio(result, article) {
    //根据音频 猜单词 
    let article = document.getElementsByTagName("article")[0];



    //根据音频 写单词 


}

function createWriteWordByAudio(result, article) {
    //根据音频 写单词 
    let article = document.getElementsByTagName("article")[0];






}
window.onload = function () {
    document.addEventListener("touchstart", function (event) {
        if (event.touches.length > 1) {
            event.preventDefault();
        }
    });

    let lastTouchEnd = 0;

    document.addEventListener(
        "touchend",
        function (event) {
            let now = new Date().getTime();
            if (now - lastTouchEnd <= 300) {
                doubleClickWord(event)
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
function createNote() {
    const olNote = document.createElement("ol");
    olNote.className = "note";
    const li1 = document.createElement("li");
    li1.textContent = "可以拖动已经选择的单词到另一个单词上面，以调整顺序。";
    const li2 = document.createElement("li");
    li2.textContent = "双击已选择的单词，可以删除掉。";
    olNote.appendChild(li1);
    olNote.appendChild(li2);
    let article = document.getElementsByTagName("article")[0];

    article.appendChild(olNote);
}
function doubleClickWord(e) {
    if (!e.target?.relationId) {
        return;
    }
    let buttonId = "#" + e.target.relationId
    $(buttonId).removeClass("select");
    let parent = $(e.target).parent().parent().next();
    let parentQuestion = $(e.target).parent()[0];
    $(e.target).remove();
    hideButtons(parentQuestion, parent[0]);

}

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
    let innerText = event.srcElement.innerText;
    let isPlayLink = playLinkClick(event.srcElement);
    if (isPlayLink) {
        return false;
    }
    let url = event.srcElement.href;
    if (innerText == "下一节") {
        return reloadByUrl(url);
    }

    else {

        let localUrl = document.location.href;
        if (localUrl.endsWith("/#/")) {
            return reloadByUrl(url);

        } else {


            let rootTagName = event.srcElement.parentElement?.parentElement?.parentElement?.parentElement?.parentElement?.parentElement?.tagName;
            if (rootTagName == "ASIDE") {
                return reloadByUrl(url);
            }
        }
    }
};
(function ($) {
    $.support.touch = true; // typeof Touch === 'object';

    if (!$.support.touch) {
        return;
    }

    var proto = $.ui.mouse.prototype,
        _mouseInit = proto._mouseInit;

    $.extend(proto, {
        _getElementToBind: function () {
            const el = this.element;
            return el;
        },

        _mouseInit: function () {
            this._getElementToBind().bind("touchstart." + this.widgetName, $.proxy(this, "_touchStart"));
            _mouseInit.apply(this, arguments);
        },

        _touchStart: function (event) {
            if (event.originalEvent.targetTouches.length != 1) {
                return false;
            }

            if (!this._mouseCapture(event, false)) { // protects things like the "handle" option on sortable
                return true;
            }

            this.element
                .bind("touchmove." + this.widgetName, $.proxy(this, "_touchMove"))
                .bind("touchend." + this.widgetName, $.proxy(this, "_touchEnd"));

            this._modifyEvent(event);

            $(document).trigger($.Event("mouseup")); // reset mouseHandled flag in ui.mouse
            this._mouseDown(event);

            return false;
        },

        _touchMove: function (event) {
            this._modifyEvent(event);
            this._mouseMove(event);
        },

        _touchEnd: function (event) {
            this.element
                .unbind("touchmove." + this.widgetName)
                .unbind("touchend." + this.widgetName);
            this._mouseUp(event);
        },

        _modifyEvent: function (event) {
            event.which = 1;
            var target = event.originalEvent.targetTouches[0];
            event.pageX = target.clientX;
            event.pageY = target.clientY;
        }

    });

})(jQuery);