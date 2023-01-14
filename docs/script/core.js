
function createQuestion(data, hasTitle, isOneWord) {
    if (!hasTitle) { createH4Title("句型练习"); }

    let ol = document.createElement("ol");
    data.forEach((oneQuestion) => {
        createOneQuestion(ol, oneQuestion, isOneWord);
    });
    article.appendChild(ol);
}

function createDialog(data) {
    createH4Title("对话练习");
    data.forEach((oneDialog) => {

        let questions = [];
        oneDialog.title.forEach((title, index) => {
            questions.push({ title: title, answer: oneDialog.answer[index].en });
        });
        createQuestion(questions, true);
    });
}

function removePlaceHolder() {
    let count = article.childElementCount;
    let lastElement = article.children[count - 1];
    if (lastElement.textContent == "." || lastElement.textContent == "loading...") {
        lastElement.remove();
    }
}
function createHtmlContents(contents) {

    contents.forEach((oneContent) => {
        createOneHtmlContent(oneContent);
    });
}


function createOneQuestion(parent, question, isOneWord) {
    handlerSentence(question);
    let li = document.createElement("li");
    li.className = "one-test";
    let ul = document.createElement("ul");
    li.answer = question.originalWords;
    li.appendChild(ul);
    let li_title = document.createElement("li");
    if (question.title.textContent !== undefined) {
        question.title.className = "word-title";
        li_title.appendChild(question.title);
    } else {

        li_title.textContent = question.title;
    }
    let li_QuestionParent = document.createElement("li");
    li_QuestionParent.className = "my-answer";
    let li_Question = document.createElement("div");
    li_Question.className = "selected-word";
    if (isOneWord === true) {
        li_Question.className = "selected-word one-word";
    }
    li_QuestionParent.appendChild(li_Question);

    let li_words = document.createElement("li");
    li_words.className = "my-words";
    createWordButton(question.words, li_words);

    let li_action = document.createElement("li");
    li_action.className = "my-action";
    createResetButton(li_action);
    createPlayLink(li_action, question.originalWords);

    let li_result = document.createElement("li");
    li_result.className = "my-result";
    if (isOneWord === true) {
        li_result.className = "my-result oneword";
    }

    ul.appendChild(li_title);
    ul.appendChild(li_QuestionParent);
    ul.appendChild(li_words);
    ul.appendChild(li_action);
    ul.appendChild(li_result);
    addTotalTestNumber(li_result);
    if (question.describe) {
        let li_describe = document.createElement("li");
        li_describe.textContent = question.describe;
        ul.appendChild(li_describe);
    }
    parent.appendChild(li);
}

function createOneHtmlContent(d) {

    if (d.tagName) {
        d.imgSrc.forEach(url => {
            let imgElement = document.createElement("IMG");
            imgElement.src = url;
            article.appendChild(imgElement);
        });
        let element = document.createElement(d.tagName);
        element.textContent = d.content;
        article.appendChild(element);
    } else if (d.answer) {

        handlerSentence(d);
        createOneQuestion(article, d);
    } else if (d.yinbiao) {
        let li_word = document.createElement("p");
        let li_strong = document.createElement("strong");
        li_strong.textContent = d.word;
        li_word.appendChild(li_strong);
        li_word.appendChild(document.createTextNode(d.yinbiao));

        let li_a = document.createElement("a");
        li_a.href = "https://dict.youdao.com/dictvoice?audio=" + d.word + "&type=2";
        li_a.textContent = "播放";
        li_a.className = "play-link";
        li_word.appendChild(li_a);
        li_word.appendChild(document.createTextNode(d.hanyi));
        article.appendChild(li_word);
    }

}


function createWordButton(words, parent) {
    words.forEach((word) => {
        let button = document.createElement("button");
        button.className = "button-option";
        button.id = guid();
        button.innerText = word;
        parent.appendChild(button);
    });


}

function checkQuestion(oneTest) {
    const answer = oneTest[0].answer;

    const selectedWords = oneTest.find(".selected-word").children();
    const resultElement = oneTest.find(".my-result");
    if (answer.length == selectedWords.length) {
        let myAnswer = "";
        selectedWords.each((index, selectedWord) => {
            if (myAnswer) myAnswer += " ";
            myAnswer += selectedWord.textContent;
        });

        const answerStr = oneTest[0].answer.join(' ');
        handleAnswerResult(myAnswer == answerStr, resultElement, answer);

    }
}

