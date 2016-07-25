/* global minEmoji */
"use strict";
(function() {
    var captureid;

    function getData(captureid) {
        var promise = new Promise(function(resolve) {
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function() {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    resolve(JSON.parse(JSON.parse(xhr.responseText).data));
                    //resolve(JSON.parse(xhr.responseText));
                }
            };
            xhr.open("GET", "http://0.0.0.0:3000/api/captures/data?id=" + captureid, true);
            xhr.send();
        });
        return promise;
    }

    function getParameterByName(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }

    function getChat() {
        return document.querySelector("#chat");
    }

    function loadMessages(messages) {
        var chat = getChat();
        var msg, row, element, time, textOutput, lastElement, lastDirection;
        for (var i = 0; i < messages.length; i++) {
            msg = messages[i];
            row = document.createElement("div");
            row.classList.add("row");
            element = document.createElement("div");
            element.classList.add("message");
            row.appendChild(element);
            if (msg.type === "chat") {
                textOutput = minEmoji(msg.text.replace(/\n/g, "<br>").replace(/\s/g, '&thinsp;'));
                element.innerHTML = textOutput;
                time = document.createElement("span");
                time.textContent = msg.time;
                time.classList.add("time");
                element.appendChild(time);
            }
            if (msg.direction === "out") {
                element.classList.add("out");
                row.classList.add("out");
            } else {
                element.classList.add("in");
                row.classList.add("in");
            }
            chat.appendChild(row);
            if (!lastElement) {
                element.classList.add("before");
            } else if (lastDirection !== msg.direction) {
                element.classList.add("before");
            }
            lastElement = element;
            lastDirection = msg.direction;
        }
    }

    function init() {
        captureid = getParameterByName("id");
        getData(captureid).then(loadMessages);
    }

    window.addEventListener("load", init);
}());
