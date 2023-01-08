function registerResetButtonEvent() {

    $(".btn_reset").on("click", function (e) {
        playAlertAudio();
        let $button = $(e.target);
        let $oneTest = $button.closest(".one-test");
        let parentQuestion = $oneTest.find(".selected-word").first();
        parentQuestion.empty();
        $oneTest.find(".button-option").removeClass("select").show();
    })
}

function registerSelectedWordDbClick() {
    $(".selected-word").on("dblclick", "span", function (e) {
        let wordElement = $(e.target);
        let parentQuestion = $(e.delegateTarget);
        let $button = $("#" + wordElement.attr("relationId"));
        $button.removeClass("select");
        $(e.target).remove();
        hideButtons(parentQuestion, $button.parent());
    });
}

function registerPlayLinkClick() {
    $(".play-link").click(function (e) {
        e.preventDefault();
        let srcElement = e.target;
        let innerText = srcElement.innerText;
        if (innerText == "播放") {
            playOne(srcElement);

        } else
            if (innerText == "停止") {
                stopPlay();
            }
        return false;
    });
}

function registerButtonEvent() {
    $(".button-option").on("click", function (e) {
        playAlertAudio();
        let $button = $(e.target);
        let $oneTest = $button.closest(".one-test");
        let selected = $button.hasClass("select");
        let parentQuestion = $oneTest.find(".selected-word");
        if (selected) {
            $button.removeClass("select");
            parentQuestion.children().last().remove();

        } else {
            $button.addClass("select");
            let li_word = document.createElement("span");
            li_word.textContent = $button.text();

            let $li_word = $(li_word);
            $li_word.addClass("selected-word-option");
            $li_word.attr("relationId", $button.attr("id"));
            parentQuestion.append($li_word);
            registerDragDropWord($li_word);
        }
        hideButtons(parentQuestion, $button.parent());
        checkQuestion($oneTest);
    })
}

function registerDragDropWord($li_word) {
    $li_word.draggable({
        containment: "parent",
        cursor: "move",
        stop: function (event, ui) {

            ui.helper.removeClass("move");
            ui.helper.css({ top: 0, left: 0 })
            ui.helper.parent().children().removeClass("waitmove");
        },
        start: function (event, ui) {
            ui.helper.addClass("move");
            ui.helper.parent().children().addClass("waitmove");
        },

    }).droppable({
        drop: function (event, ui) {
            ui.helper.removeClass("move");
            ui.helper.html(ui.helper.html());
            ui.helper.css({ top: 0, left: 0 })
            let $target = $(event.target);
            if ($target.hasClass("selected-word-option")) {
                ui.helper.insertBefore(event.target)
            }

            ui.helper.parent().children().removeClass("waitmove");
            let $oneTest = $target.closest(".one-test");
            checkQuestion($oneTest);
        },
    })
}

function registerRadioEvent() {
    $('[type=radio]').on("change", function (e) {
        let $radio = $(e.target);
        let resultElement = $radio.closest(".one-test").find(".my-result");
        let isCorrect = $radio.val();
        handleAnswerResult(isCorrect === "true", resultElement, e.target.playword);
    })
}
