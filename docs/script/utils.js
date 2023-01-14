

let errorInfoBox = null;
let totalTestNumber = 0;
function addTotalTestNumber(element) {
    totalTestNumber++;
    $(element).attr("wordNumber", totalTestNumber);
}
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
console.error = console.log = console.warn = console.info = function (error) {
    if (errorInfoBox) {
        errorInfoBox.value += error + "\r\n";
    }
}
window.onerror = function (error) {
    console.error("来自全局错误:")
    console.error(error)
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


function handlerSentence(d) {
    d.answer = d.answer.trim();
    d.originalWords = d.answer.split(/\s/);
    d.originalWords = removeEmpty(d.originalWords);
    let words = d.answer.split(/\s/);
    words = removeEmpty(words);
    words.sort(randomSort);
    d.words = words;

}

function createNextLink(callback) {
    let nav = document.getElementsByClassName("sidebar-nav")[0];
    if (!nav) {
        callback();
        return;
    }
    let allLinks = nav.getElementsByTagName("a");
    if (allLinks.length == 0) {
        setTimeout(v => createNextLink(callback), 500);
    } else {
        let total = allLinks.length;
        let currentUrl = document.location.href;
        for (let index = 0; index < total; index++) {
            const element = allLinks[index];
            if (currentUrl == element.href) {
                let nextIndex = index + 1;

                if (nextIndex < total) {
                    let nextLinkUrl = allLinks[nextIndex].href;
                    let nextLink = document.createElement("a");
                    nextLink.href = nextLinkUrl;
                    nextLink.target = "_self";
                    nextLink.textContent = "下一节";
                    article.appendChild(nextLink);
                    callback();
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
    article.appendChild(document.createElement("br"));
    article.appendChild(document.createElement("br"));
    article.appendChild(errorInfoBox);

}


let lastrandom = -1;
function getRndInteger(max, exceptNum) {
    let result = -1;

    while (result < 0 || exceptNum.indexOf(result) > -1 || result == lastrandom) {
        result = Math.floor(Math.random() * max);
    }
    exceptNum.push(result);
    lastrandom = result;
    return result;
}

function splitChines(title) {
    return title.split(/\s{4}/);
}
function registerStopDoubleTouchEvent() {
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

}

function createNote() {
    const olNote = document.createElement("ol");
    olNote.className = "note";
    const li1 = document.createElement("li");
    li1.textContent = "可以拖动已经选择的单词到另一个单词上面，以调整顺序。";
    const li2 = document.createElement("li");
    li2.textContent = "双击已选择的单词，可以删除掉。";
    olNote.appendChild(li1);
    olNote.appendChild(li2);
    article.appendChild(olNote);
}
function doubleClickWord(e) {

    let $word = $(e.target);
    let relationId = $word.attr("relationid");
    if (!relationId) {
        return;
    }

    if (e.target.tagName !== "SPAN") {
        return;
    }
    let buttonId = "#" + relationId;
    let $button = $(buttonId);
    $button.removeClass("select");
    let parentButton = $button.parent();
    let parentQuestion = $word.parent();
    $word.remove();
    hideButtons(parentQuestion, parentButton);

}

function hideButtons(li_Question, buttonsParent) {
    buttonsParent.children().show();
    const words = li_Question.children();
    const wordsCount = words.length;
    for (let index = 0; index < wordsCount - 1; index++) {
        const word = $(words[index]);
        const id = "#" + word.attr("relationId");
        buttonsParent.find(id).hide();
    }
}

function createPlayLink(parentElement, words, isOneWord) {
    let link_play = document.createElement("a");
    link_play.textContent = "播放";
    link_play.className = "play-link";
    let playStr = "";
    if (isOneWord) {
        playStr = words.join("");
    } else {
        playStr = words.join("+");
    }
    link_play.href =
        "https://dict.youdao.com/dictvoice?audio=" +
        playStr +
        "&le=eng&le=eng&type=2";
    parentElement.appendChild(link_play);
}


function createResetButton(parentElement) {
    let btn_reset = document.createElement("button");
    btn_reset.textContent = "重置";
    btn_reset.className = "btn_reset";
    parentElement.appendChild(btn_reset);
}


function createH4Title(title) {
    createTitle(title, 4);
}

function handleAnswerResult(isCorrect, resultElement, palayWordOnSuccess) {
    if (isCorrect) {
        resultElement.text("恭喜，回答正确！");
        resultElement.removeClass("error");
        resultElement.addClass("success");
        playSuccessAudio();

        if (palayWordOnSuccess) {
            let playWord = palayWordOnSuccess;
            if (resultElement.hasClass("oneword")) {
                playWord = palayWordOnSuccess.join("");
            }
            playSentence(playWord, 500);
        }
        let wordNumber = resultElement.attr("wordNumber") * 1;
        if (wordNumber == totalTestNumber) {
            startFire();
        }
    } else {
        resultElement.text("很遗憾，回答错误，继续努力！！");
        resultElement.removeClass("success");
        resultElement.addClass("error");

        playFailAudio();
    }
}
function createTitle(title, hTitleNumber = 3) {
    let h = document.createElement("h" + hTitleNumber);
    h.innerText = title;
    article.appendChild(h);
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