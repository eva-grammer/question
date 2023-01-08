
function createPEP(result) {

    //根据单词 选意思
    createSelectTitleByWord(result);
    //根据译文 选单词
    createSelectWordByTitle(result);
    //根据单词 选音标
    createSelectPronuceByWord(result);
    //根据译文 选音标
    createSelectPronuceByWordTitle(result);
    //根据译文 写单词
    createWriteWordByTitle(result);

    //根据音频 猜单词 
    createSelectWordByAudio(result);

    //根据音频 写单词 
    createWriteWordByAudio(result);

}


function createSelectTitleByWord(result) {
    //根据单词 选意思 
    createTest("根据单词 选意思", (wordInfo) => {
        return createTitleByWord(wordInfo);
    },

        result.words, "title"
    );

}

function createSelectWordByTitle(result) {
    //根据译文 选单词

    createTest("根据译文 选单词", (wordInfo) => {
        return createTitleByYiWen(wordInfo);
    },
        result.words, "word"
    );
}
function createSelectPronuceByWord(result) {
    //根据单词 选音标

    createTest("根据单词 选音标", (wordInfo) => {
        return createTitleByWord(wordInfo);
    },

        result.words, "eUYinBiao"
    );

}
function createSelectPronuceByWordTitle(result) {
    //根据译文 选音标
    createTest("根据译文 选音标", (wordInfo) => {
        return createTitleByYiWen(wordInfo);
    },

        result.words, "eUYinBiao"
    );
}

function createWriteWordByTitle(result) {
    //根据译文 写单词
    createTitle("根据译文 写单词");
    let questions = [];
    result.words.forEach((oneWord) => {

        questions.push({ title: createTitleByYiWen(oneWord), answer: oneWord.word.split('').join(' ') });

    });
    createQuestion(questions, true, true);



}

function createSelectWordByAudio(result) {
    //根据音频 猜单词 
    createTest("根据音频 猜单词", (wordInfo) => {
        return createTitleByAudio(wordInfo);
    },
        result.words, "word"
    );

}

function createWriteWordByAudio(result) {
    //根据音频 写单词  

    //根据译文 写单词
    createTitle("根据音频 写单词 ");
    let questions = [];
    result.words.forEach((oneWord) => {

        questions.push({ title: createTitleByAudio(oneWord), answer: oneWord.word.split('').join(' ') });

    });
    createQuestion(questions, true, true);

}

function createTitleByYiWen(wordInfo) {
    let wordDiv = document.createElement("div");
    let optsArray = splitChines(wordInfo.title);
    if (optsArray.length == 1) {
        wordDiv.textContent = wordInfo.title;
    } else {
        let hasAdd = false;
        optsArray.forEach((element) => {
            if (!element) { return; }
            if (hasAdd) {
                let br = document.createElement("br");

                wordDiv.appendChild(br);
            }
            let o = document.createElement("span");
            o.textContent = element;
            hasAdd = true;
            wordDiv.appendChild(o);
        });
    }
    createPronounce(wordInfo.word, wordInfo.eUYinBiao, 1, wordDiv, true);
    createPronounce(wordInfo.word, wordInfo.eUYinBiao, 2, wordDiv, true);
    return wordDiv;
}
function createTitleByWord(wordInfo) {
    let wordDiv = document.createElement("div");
    let wordElement = document.createElement("strong");
    wordElement.textContent = wordInfo.word;
    wordDiv.appendChild(wordElement);
    createPronounce(wordInfo.word, wordInfo.eUYinBiao, 1, wordDiv, true);
    createPronounce(wordInfo.word, wordInfo.uSAYinBiao, 2, wordDiv, true);
    return wordDiv;
}
function createPronounce(word, yinbiao, typenumber, parentElement, showYinbiao) {
    if (!yinbiao) return;
    if (showYinbiao) {
        let pronunceElement1 = document.createElement("span");
        pronunceElement1.textContent = (typenumber == 1 ? "(英)" : "(美)") + yinbiao;
        parentElement.appendChild(pronunceElement1);
    }
    let link = document.createElement("a");
    link.className = "play-link";
    link.href = `https://dict.youdao.com/dictvoice?audio=${word}\&type=${typenumber}`;
    link.textContent = "播放";


    parentElement.appendChild(link);
}
function createTitleByAudio(wordInfo) {
    let wordDiv = document.createElement("div");
    createPronounce(wordInfo.word, wordInfo.eUYinBiao, 1, wordDiv, true);
    createPronounce(wordInfo.word, wordInfo.uSAYinBiao, 2, wordDiv, true);
    return wordDiv;
}

function createTest(title, getTestTitle, testArray, attrName) {

    createTitle(title);
    let ol = document.createElement("ol");
    testArray.forEach((wordInfo, index) => {

        let li = document.createElement("li");
        li.className = "one-test oneWord";
        let oneTest = createOneTest(getTestTitle, testArray, index, attrName);
        li.appendChild(oneTest);
        ol.appendChild(li);

    })
    article.appendChild(ol);
}

function createOneTest(getTestTitle, options, correctIndex, attrName) {
    let ul = document.createElement("ul");
    let li_title = document.createElement("li");
    let correctAnswer = options[correctIndex];
    let titleContent = getTestTitle(correctAnswer);
    if (titleContent.textContent !== undefined) {
        titleContent.className = "word-title";
        li_title.appendChild(titleContent);
    } else {

        li_title.textContent = titleContent;
    }


    let parentElement = createRadioOptions(options, correctAnswer, correctIndex, attrName);
    let li_Result = document.createElement("li");
    li_Result.className = "my-result";
  
    ul.appendChild(li_title);
    ul.appendChild(parentElement);
    ul.appendChild(li_Result);
    addTotalTestNumber(li_Result);
    return ul;
}
function createRadioOptions(words, correctAnswerItem, wordindex, attrName) {


    let correctAnswer = correctAnswerItem[attrName];
    let arrayOpts = [{ opt: correctAnswer, isCorrect: true, playword: words[wordindex].word, }];
    let exceptNum = [wordindex];
    let random = getRndInteger(words.length, exceptNum);
    arrayOpts.push({ opt: words[random][attrName], isCorrect: false });
    random = getRndInteger(words.length, exceptNum);

    arrayOpts.push({ opt: words[random][attrName], isCorrect: false });
    random = getRndInteger(words.length, exceptNum);
    arrayOpts.push({ opt: words[random][attrName], isCorrect: false });

    arrayOpts.sort(randomSort);

    let name = guid();


    let optsWrapDiv = document.createElement("ul");




    arrayOpts.forEach(element => {
        let li = document.createElement("li");
        li.className = "radio-option";
        let input = document.createElement("input");
        input.type = "radio";
        input.name = name;
        input.value = element.isCorrect;
        input.id = guid();
        input.playword = element.playword;
        let inputlabel = document.createElement("label");
        inputlabel.for = input.id;
        let optsArray = splitChines(element.opt);
        if (optsArray.length == 1) {
            inputlabel.textContent = element.opt;
        } else {
            let hasAdd = false;
            optsArray.forEach((element) => {
                if (!element) { return; }
                if (hasAdd) {
                    let br = document.createElement("br");

                    inputlabel.appendChild(br);
                }
                let o = document.createElement("span");
                o.textContent = element;
                hasAdd = true;
                inputlabel.appendChild(o);
            });
        }

        li.appendChild(input);
        li.appendChild(inputlabel);
        optsWrapDiv.appendChild(li);
    });
    return optsWrapDiv;
}