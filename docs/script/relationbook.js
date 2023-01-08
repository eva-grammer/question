const books = [
    { shortPath: "question", name: "《零基础英语语法练习》" },
    { shortPath: "sentence", name: "《老外每天都在用到的286个英语关键句型（第二版）》" },
    { shortPath: "interview", name: "《英语面试》" },
    { shortPath: "ysgrammar", name: "《雅思语法突破9分》" },
    { shortPath: "grammer", name: "《英语语法》" },
    { shortPath: "dictionary", name: "《20000词汇巅峰速记班》" },
    { shortPath: "pep3", name: "《人教版小学英语（3年级起点）》" },
    { shortPath: "speaking", name: "" },
    { shortPath: "", name: "" },
    { shortPath: "", name: "" },
    { shortPath: "", name: "" },
    { shortPath: "", name: "" },
    { shortPath: "", name: "" },
    { shortPath: "", name: "" },
    { shortPath: "", name: "" },
    { shortPath: "", name: "" },
    { shortPath: "", name: "" },
    { shortPath: "", name: "" },
];

function createRelationBookLink() {
    let hr = document.createElement("hr");
    article.appendChild(hr);
    let ul = document.createElement("ul");

    books.forEach(book => {
        if (book.shortPath && book.name) {
            let li = document.createElement("li");
            let url = "https://eva-grammer.github.io/" + book.shortPath;
            let bookLink = document.createElement("a");
            bookLink.href = url;
            bookLink.target = "_blank";
            bookLink.textContent = book.name;
            li.appendChild(bookLink);
            ul.appendChild(li);
        }
    })
    article.appendChild(ul);
    hr = document.createElement("hr");
    article.appendChild(hr);
}
