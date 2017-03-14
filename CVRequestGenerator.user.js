// ==UserScript==
// @name           CV Request Generator
// @namespace      https://github.com/SO-Close-Vote-Reviewers/
// @version        2.0.0.2
// @description    This script generates formatted close vote requests and sends them to a specified chat room
// @author         @TinyGiant
// @include        /^https?:\/\/(?!chat)\w*.?(stackexchange.com|stackoverflow.com|serverfault.com|superuser.com|askubuntu.com|stackapps.com|mathoverflow.net)\/.*/
// @updateURL      https://github.com/Tiny-Giant/myuserscripts/raw/master/CVRequestGenerator.user.js
// @grant          GM_xmlhttpRequest
// @grant          unsafeWindow
// ==/UserScript==
/* jshint -W097 */
/* jshint esnext: true */
/* globals GM_info, unsafeWindow, GM_xmlhttpRequest, console */
'use strict';

const scriptName = GM_info.script.name.replace(/\s+/g, '');
const scriptVersion = GM_info.script.version;
const scriptURL = GM_info.script.updateURL;
const scriptVersionURL = 'https://github.com/Tiny-Giant/myuserscripts/raw/master/CVRequestGenerator.version';

document.body.appendChild(Object.assign(document.createElement('style'), { textContent: `
    .request-gui-toggle {
        padding:0 3px 2px 3px;
        color:#888;
    }
    .request-gui-toggle:hover {
        color:#444;
        text-decoration:none;
    }
    .request-gui-wrapper {
        position:relative;
        display:inline-block;
    }
    .request-gui-wrapper * {
        box-sizing: border-box;
    }
    .request-gui-dialog {
        z-index:1;
        position:absolute;
        white-space:nowrap;
        border:1px solid #ccc;
        border-radius: 5px;
        background:#FFF;
        box-shadow:0px 5px 10px -5px rgb(0,0,0,0.5);
    }
    .request-gui-form {
        padding: 6px;
    }
    .request-gui-form input {
        display: inline-block;
        font-size: 13px;
        line-height: 15px;
        padding: 8px 10px;
        box-sizing: border-box;
        border-radius: 0;
        margin: 0px;
    }
    .request-gui-reason {
        border-top-left-radius: 3px;
        border-bottom-left-radius: 3px;
        height: 32px;
    }
    .request-gui-submit {
        border-top-right-radius: 3px;
        border-bottom-right-radius: 3px;
        height: 32px;
    }
    .request-gui-update {
        border-top: 1px solid #ccc;
        display: block;
        padding: 10px;
        text-align: center;
    }
    .request-gui-update:hover {
        background: #eee;
        border-bottom-left-radius: 5px;
        border-bottom-right-radius: 5px;
    }
    .request-gui-dialog * {
        vertical-align: middle;
    }
    .request-gui-type-select, .request-gui-tag-select {
        display: inline-block;
        vertical-align: middle;
        height: 32px;
        overflow: hidden;
    }
    .request-gui-type-select a, .request-gui-tag-select a {
        display: block;
        font-size: 13px;
        line-height: 20px;
        margin: 0px;
    }
    .request-gui-label {
        padding-right: 30px;
    }
`}));

let StackExchange = window.StackExchange;

if (typeof StackExchange === 'undefined') {
    StackExchange = unsafeWindow.StackExchange;
}

let globals = {};

globals.debugging = false;

if (globals.debugging) {
    globals.room = {
        "host": "https://chat.stackoverflow.com",
        "url": "https://chat.stackoverflow.com/rooms/68414/socvr-testing-facility",
        "id": "68414"
    };
} else {
    globals.room = {
        "host": "http://chat.stackoverflow.com",
        "url": "http://chat.stackoverflow.com/rooms/41570/so-close-vote-reviewers",
        "id": "41570",
    };
}

globals.base = window.location.protocol + '//' + window.location.host;

let funcs = {};

//Wrap local storage access so that we avoid collisions with other scripts
funcs.getStorage = key => localStorage[scriptName + '_' + key]; 
      
funcs.setStorage = (key, val) => (localStorage[scriptName + '_' + key] = val); 

funcs.notify = (() => {
    let count = 0;

    return (message, time) => new Promise((resolve, reject) => {
        StackExchange.notify.show(message, ++count);

        if (typeof time === "number" && !isNaN(time)) {
            setTimeout(() => {
                StackExchange.notify.close(count);
                resolve(true);
            }, time);
        }
    });
})();

funcs.update = force => new Promise((resolve, reject) => { 
    GM_xmlhttpRequest({
        method: 'GET',
        url: scriptVersionURL,
        onload: xhr => {
            let newVersion = xhr.responseText.trim();

            let proposed = newVersion.split(".");
            let current = scriptVersion.split(".");

            let isNewer = false;

            while(proposed.length < current.length) {
                proposed.push("0");
            }
            while(proposed.length > current.length) {
                current.push("0");
            }

            for(let i = 0; i < proposed.length; i++) {
                if (+proposed[i] > +current[i]) {
                    isNewer = true;
                    break;
                }
                if (+proposed[i] < +current[i]) {
                    isNewer = false;
                    break;
                }
            }

            if (isNewer) {
                if (funcs.getStorage('LastAcknowledgedVersion') != newVersion || force) {
                    if (window.confirm('A new version of the CV Request Generator is available, would you like to install it now?')) {
                        window.location.href = scriptURL;
                    }
                    else {
                        funcs.setStorage('LastAcknowledgedVersion', newVersion);
                    }
                }
            }
            else  {
                if (force)  {
                    funcs.notify('No new version available');
                }
            }
            
            resolve(xhr);
        },
        onerror: xhr => {
            reject(xhr);
            funcs.notify('Failed querying new script version. Check the console.');
            throw new Error('Failed querying new script version. Check the console.');
        }
    });
});

funcs.fetchFkey = () => new Promise((resolve, reject) =>  {
    GM_xmlhttpRequest({
        method: 'GET',
        url: globals.room.url,
        onload: xhr =>  {
            if (xhr.status !== 200) {
                reject(xhr);
                funcs.notify('Failed retrieving key');
                throw new Error('Failed retrieving key');
            }
            
            let fkey = xhr.responseText.match(/hidden" value="([\dabcdef]{32})/)[1];

            if (fkey === null)  {
                reject(xhr);
                funcs.notify('Failed retrieving key.');
                throw new Error('Failed retrieving key.');
            }
            
            resolve(fkey);
        },
        onerror: xhr => {
            reject(xhr);
            funcs.notify('Failed retrieving key.');
            throw new Error('Failed retrieving key.');
        }
    });
});

/* jshint ignore:start */
funcs.request = request => new Promise(async (resolve, reject) =>  {
    const fkey = await funcs.fetchFkey();
    
    GM_xmlhttpRequest({
        method: 'POST',
        url: globals.room.host + '/chats/' + globals.room.id + '/messages/new',
        headers:  { 'Content-Type': 'application/x-www-form-urlencoded' },
        data: 'text=' + encodeURIComponent(request) + '&fkey=' + fkey,
        onload: xhr => {
            if (xhr.status !== 200 || !JSON.parse(xhr.responseText).id) {
                reject(xhr);
                console.log(xhr)
                funcs.notify('Failed sending request')
                throw new Error('Failed sending request');
            }
            funcs.notify('Close vote request sent.',1000);
            resolve(xhr);
        },
        onerror: xhr => {
            reject(xhr);
            console.log(xhr)
            funcs.notify('Failed sending request.')
            throw new Error('Failed sending request.');
        }
    });
});
/* jshint ignore:end */

funcs.addXHRListener = callback => {
    const open = XMLHttpRequest.prototype.open;

    XMLHttpRequest.prototype.open = function(...args)  {
        this.addEventListener('load', event => callback(event), false);
        open.apply(this, args);
    };
};

function RequestGUI(scope) {
    if (!(scope instanceof HTMLElement)) {
        funcs.notify('CVRGUI expects scope to be an instance of HTML element.');
        throw new Error('CVRGUI expects scope to be an instance of HTML element.');
    }

    const question = {};
    let selectedTag, selectedType;

    question.id = scope.dataset.questionid;

    if (typeof question.id === 'undefined') {
        funcs.notify('Question ID is not defined.');
        throw new Error('Question ID is not defined.');
    }

    question.title = (() =>  {
        let title = document.querySelector('a[href*="questions/' + question.id + '"]');

        if (title === null) {
            return 'Title not found';
        }

        return title.textContent.replace(/\[(.*)\]/g, '($1)');
    })();

    question.url = window.location.protocol + '//' + window.location.host + '/q/' + question.id;

    question.time = (() =>  {
        let time = scope.querySelector('.post-signature:not([align="right"]) .relativetime');

        if (time !== null) {
            return time.title;
        }
    })();

    question.author = {};

    question.author.name = (() =>  {
        let details = scope.querySelector('.post-signature:not([align="right"]) .user-details');

        if (details === null) {
            return 'Author not found';
        }

        return details.textContent.trim().split('\n')[0].trim();
    })();

    question.author.url = (() => {
        let link = scope.querySelector('.owner a');

        if (link !== null) {
            return link.href;
        }
    })();
    
    question.tags = [...scope.querySelectorAll('.post-taglist .post-tag')].map(e => e.textContent);

    const nodes = new Proxy({
        scope: scope,
        menu: scope.querySelector('.post-menu'),
        wrapper: Object.assign(document.createElement('span'), {
            className: 'request-gui-wrapper',
            innerHTML: `
                <a href="#" class="request-gui-toggle">request</a>
                <div class="request-gui-dialog" style="display: none">
                    <form class="request-gui-form"><!--
                        --><div class="request-gui-type-select"></div><!--
                        --><div class="request-gui-tag-select"></div><!--
                        --><input type="text" class="request-gui-reason" placeholder="Enter reason..."><!--
                        --><input type="submit" class="request-gui-submit" value="Send Request"><!--
                    --></form>
                    <a href="#" class="request-gui-update">Check for updates</a>
                </div>
            `
        })
    }, {
        get: (target, key) => {
            if (!(key in target)) {
                target[key] = nodes.wrapper.querySelector(`.request-gui-${ key.replace(/[A-Z]/g, match => '-' + match.toLowerCase()) }`);
            }
            return target[key];
        },
        has: (target, key) => {
            if (!(key in target)) {
                target[key] = nodes.wrapper.querySelector(`.request-gui-${ key.replace(/[A-Z]/g, match => '-' + match.toLowerCase()) }`);
            }
            return !!target[key];
        },
    });
    
    Object.assign(nodes.dialog, {
        hide: () =>  {
            nodes.dialog.style.display = 'none';
        },
        show: () =>  {
            nodes.dialog.style.display = '';
        },
        toggle: () =>  {
            nodes.dialog[['hide', 'show'][+!!nodes.dialog.style.display]]();
        }
    });
    
    nodes.tagSelect.insertAdjacentHTML('beforeend', question.tags.reduce((m, e) => m + `<a href="#" class="post-tag">${ e }</a>`, ''));

    if (typeof nodes.menu !== "undefined") {
        nodes.menu.appendChild(nodes.wrapper);
    }

    const listeners = {
        wrapper: { 
            click: event => event.stopPropagation()
        },
        toggle: {
            click: event => {
                nodes.dialog.toggle();
                event.preventDefault();
            }
        },
        form: {
            submit: event => {
                event.preventDefault();

                let reason = nodes.reason.value;

                if (reason === '')  {
                    throw new Error('No reason supplied');
                }

                send(reason);
            }
        },
        update: {
            click: event => {
                event.preventDefault();
                funcs.update(true);
            }
        },
        typeSelect:  (function() {
            let open = false;
            
            return {
                click: event => {
                    event.preventDefault();
                    nodes.typeSelect.style.overflow = open ? '' : 'visible';
                    if (open) {
                        nodes.typeSelect.scrollTop = event.target.offsetTop - 6;
                        selectedType = event.target.textContent;
                    }
                    open = !open;
                }
            };
        })(),
        tagSelect: (function() {
            let open = false;
            
            return {
                click: event => {
                    event.preventDefault();
                    nodes.tagSelect.style.overflow = open ? '' : 'visible';
                    if (open) {
                        nodes.tagSelect.scrollTop = event.target.offsetTop - 6;
                        selectedTag = event.target.textContent;
                    }
                    open = !open;
                }
            };
        })()
    };

    for (let node in listeners) {
        if (node in listeners && node in nodes) {
            for (let type in listeners[node]) {
                if(type in listeners[node]) {
                    nodes[node].addEventListener(type, listeners[node][type], false);
                } else {
                }
            }
        } else {
        }
    }

    document.addEventListener('click', event => {
        if (!nodes.dialog.style.display) {
            nodes.dialog.hide();
        }
    }, false);

    let send;
    /* jshint ignore:start */
    send = async reason => {
        let title = '[' + question.title + '](' + question.url + ')'; 
        let user = question.author.name;

        if (question.author.url) {
            user = '[' + question.author.name + '](' + question.author.url + ')';
        }

        let time = question.time;

        if (time !== undefined) {
            user += ' - ' + time;
        }

        let before = `[tag:cv-pls] [tag:${ selectedTag || question.tags[0] }] `;
        let after = ' ' + title + ' - ' + user;

        let remaining = 500 - (before.length + after.length);

        if (reason.length > remaining) {
            reason = reason.substr(0, remaining - 3).trim() + '...';
        }

        let request = before + reason + after;

        const response = await funcs.request(request);
        
        nodes.dialog.hide();
    };
    /* jshint ignore:end */

    Object.assign(this, {
        question: question,
        nodes: nodes,
        listeners: listeners,
        send: send
    });
}

let questions = Array.from(document.querySelectorAll('.question'));

let RequestGUIs = {};
          
for(let question of questions) {
    let gui = new RequestGUI(question);
    
    if (typeof gui !== 'undefined') {
        RequestGUIs[gui.question.id] = gui;
    }
}

funcs.addXHRListener(event =>  {
    if (/ajax-load-realtime|review.next\-task|review.task\-reviewed/.test(event.target.responseURL)) {
        
        var matches = /data-questionid=\\?"(\d+)/.exec(event.target.responseText);
        
        if (matches === null) {
            return;
        }
        
        let question = document.querySelector('[data-questionid="' + matches[1] + '"]');
        
        if (question === null) {
            return;
        }
        
        let gui = new RequestGUI(question);
        
        RequestGUIs[gui.question.id] = gui;
    }
});

(() => {
    let nodes = {};
    
    const HTML = `
        <label class="request-gui-label">
            <input type="checkbox" class="request-gui-checkbox">
            Send request
        </label>
    `;
            
    let reasons = {
        101: "Duplicate",
        102: {
            2: "Belongs on another site",
            3: "Custom reason",
            4: "General computing hardware / software",
            7: "Professional server / networking administration",
            11: "Typographical error or cannot reproduce",
            13: "Debugging / no MCVE",
            16: "Request for off-site resource",
        },
        103: "Unclear what you're asking",
        104: "Too broad",
        105: "Primarily opinion-based"
    };
    
    funcs.addXHRListener(event => {
        if (/close\/popup/.test(event.target.responseURL)) {
            nodes.popup = document.querySelector('#popup-close-question');

            if (nodes.popup === null) {
                return;
            }

            nodes.votes = nodes.popup.querySelector('.remaining-votes');

            if (nodes.votes === null) {
                return;
            }

            nodes.votes.insertAdjacentHTML('beforebegin', HTML);
            
            Object.assign(nodes, {
                checkbox: nodes.popup.querySelector('.request-gui-checkbox'),
                textare: nodes.popup.querySelector('textarea'),
                submit: nodes.popup.querySelector('.popup-submit')
            });
        }
    });
    
    funcs.addXHRListener(event => {
        if (/close\/add/.test(event.target.responseURL)) {
            let questionid = /\d+/.exec(event.target.responseURL);
            
            if (questionid === null) {
                return;
            }
            
            questionid = questionid[0];
            
            if (!(questionid in RequestGUIs)) {
                return;
            }
            
            let gui = RequestGUIs[questionid];
            
            if (nodes.textarea instanceof HTMLElement) {
                reasons[102][3] = nodes.textarea.value; 
            }
            
            let data = JSON.parse(event.target.responseText);
            
            let reason = reasons[data.CloseReason];
            
            if (typeof data.CloseAsOffTopicReasonId !== 'undefined') {
                reason = reason[data.CloseAsOffTopicReasonId];
            }
            
            if (/tools\/new-answers-old-questions/.test(window.location.href)) {
                reason += ' (new activity)';
            }

            gui.nodes.reason.value = reason;
            
            if (nodes.checkbox.checked) {
                gui.send(reason);
            }
        }
    });
})();
