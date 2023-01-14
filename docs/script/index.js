function handleContent(result) {
    removePlaceHolder();
    if (result.questions) {

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
            article.appendChild(h2);
            createQuestion(result.parseShort);
        }
    }

    if (result.dialogs) {

        createDialog(result.dialogs);
    }


    registerButtonEvent();
    registerResetButtonEvent();
    registerPlayLinkClick();
    registerRadioEvent();
    createNextLink(()=>{
        createRelationBookLink()
        createErrorInfoBox();
        registerSelectedWordDbClick();
    });
  
}


function loadQuestion() {
    let url = this.document.location.href.replace("/#/./", "/question/") + ".json";
    if (!window.localData) {
        $.getJSON(url, function (result) {
            handleContent(result);
        });
    } else {
        handleContent(window.localData)
    }

}

window.onload = function () {
    registerStopDoubleTouchEvent();
    window.article = document.getElementsByTagName("article")[0];
    createNote();
    loadQuestion();

};
