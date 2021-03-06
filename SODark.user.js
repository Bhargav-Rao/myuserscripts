// ==UserScript==
// @name          SO Dark
// @namespace     http://github.com/TinyGiant/
// @description	  Real dark styling for Stack Overflow and some Stack Exchange sites
// @author        @TinyGiant
// @run-at        document-start
// @version       1.0.0.6
// @include       /^https?:\/\/.*?(stackoverflow.com|stackexchange.com|superuser.com|serverfault.com|askubuntu.com|stackapps.com|mathoverflow.net)/.*$/
// ==/UserScript==

(function() {
    var css = [
        " body {",
        "  -webkit-filter: invert(100%) hue-rotate(180deg) !important;",
        "  filter: invert(100%) hue-rotate(180deg) !important;",
        "  background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkAgMAAAANjH3HAAAACVBMVEUaGhohISElJSUh9lebAAAB20lEQVRIx4XWuZXDMAwE0C0SAQtggIIYoAAEU+aKOHhYojTrYP2+QfOW/5QIJOih/q8HwF/pb3EX+UPIveYcQGgEHiu9hI+ihEc5Jz5KBIlRRRaJ1JtoSAl5Hw96hLB1/up1tnIXOck5jZQy+3iU2hAOKSH1JvwxHsp+5TLF5MOl1/MQXsVs1miXc+KDbYydyMeUgpPQreZ7fWidbNhkXNJSeAhc6qHmHD8AYovunYyEACWEbyIhNeB9fRrH3hFi0bGPLuEW7xCNaohw1vAlS805nfsrTspclB/hVdoqusg53eH7FWot+wjYpOViX8KbFFKTwlnzvj65P9H/vD0/hibYBGhPwlPO8TmxRsaxsNnrUmUXpNhirlJMPr6Hqq9k5Xn/8iYQHYIuQsWFC6Z87IOxLxHphSY4SpuiU87xJnJr5axfeRd+lnMExXpEWPpuZ1v7qZdNBOjiHzDREHX5fs5Zz9p6X0vVKbKKchlSl5rv+3p//FJ/PYvoKryI8vs+2G9lzRmnEKkh+BU8yDk515jDj/HAswu7CCz6U/Mxb/PnC9N41ndpU4hUU7JGk/C9PmP/M2xZYdvBW2PObyf1IUiIzoHmHW9yTncliYs9A9tVNppdShfgQaTLMf+j3X723tLeHgAAAABJRU5ErkJggg==) !important;",
        " }",
        " .major-provider {",
        "  font-size: 0;",
        "  white-space: nowrap;",
        " }",
        " .major-provider .icon-container,",
        " .major-provider .text {",
        "  vertical-align: top;",
        "  display: inline-block !important;",
        "  float: none !important;",
        "  font-size: 16px !important;",
        " }",
        " .major-provider .icon-container::before,",
        " .major-provider .text::before,",
        " .major-provider * span {",
        "  display: inline-block !important;",
        "  vertical-align: middle !important;",
        " }",
        " .major-provider .icon {",
        "  background-size: 200% 100% !important;",
        " }",
        " .major-provider.google-login {",
        "  background-color: #e0492f !important;",
        " }",
        " .major-provider.facebook-login {",
        "  background-color: #395697 !important;",
        " }",
        " .major-provider.facebook-login .icon {",
        "  background-position: -100% 0 !important;",
        " }",
        " .major-provider .icon-container::before,",
        " .major-provider .text::before {",
        "  height: 100%;",
        "  content: '';",
        " }",
        " .lv-info, .lv-stats-wrapper {",
        "  background: transparent;",
        " }",
        " .container {",
        "  box-shadow: none !important;",
        " }",
        " .community-bulletin {",
        "  padding-left: 0px !important;",
        " }",
        " .hat {",
        "   z-index: 1;",
        "   pointer-events: none;",
        " }",
        " .container {",
        "   background-color: transparent !important;",
        "   background-image: none !important;",
        " }",
        " .lightbox, .wmd-prompt-background, .wmd-button-bar {",
        "  background: #fff !important;",
        " }",
        " .wmd-button-bar {",
        "  -webkit-filter: grayscale(100%);",
        " }",
        " html body .topbar .topbar-icon-on, html body .topbar .topbar-icon-on:hover, .topbar .profile-me:hover {",
        "  background-color: #ddd !important;",
        " }",
        " html body .topbar .topbar-icon-on.icon-site-switcher, html body .topbar .topbar-icon-on.icon-site-switcher:hover {",
        "  background-color: #444 !important;",
        " }",
        " .topbar {",
        "  background: #fff !important;",
        "  color: #000 !important;",
        " }",
        " .topbar * {",
        "  color: #000 !important;",
        " }",
        " img, .icon-site-switcher, .user-gravatar32, .user-gravatar32 * {",
        "  -webkit-filter: invert(100%) hue-rotate(180deg) !important;",
        "  filter: invert(100%) hue-rotate(180deg) !important;",
        " }",
        " .search-container input {",
        "  border-color: #ddd !important",
        " }",
        " #content {",
        "  background: rgba(200,200,200,0.5) !important;",
        " }",
        " .footerwrap {",
        "  background: rgba(150,150,150,0.5) !important;",
        "  padding-top: 20px !important;",
        " }",
        " #sidebar > * {",
        "  background: transparent !important;",
        "  border: 0px !important;",
        " }",
        " .question-status {",
        "  background: rgba(255,255,255,0.5) !important;",
        " }",
        " #footer {",
        "  padding-top: 0 !important;",
        "  background: none !important",
        " }",
        " pre, code, .card, .messages {",
        "  background: rgba(255,255,255,0.5) !important;",
        " }",
        " pre > code {",
        "  background: transparent !important;",
        " }",
        " #tabs a, .tabs a {",
        "  background: transparent !important;",
        " }",
        " #tabs a, .tabs a {",
        "  padding: 5px 10px 7.5px 10px !important;",
        "  line-height: initial !important;",
        "  border: 0 !important;",
        " }",
        " #tabs .youarehere, .tabs .youarehere {",
        "  background: rgba(240,240,240,0.5) !important;",
        "  border: 1px solid rgba(150,150,150, 0.5) !important;",
        "  border-radius: 5px;",
        " }",
        " #content #tabs a#tab-bounties, .bounty-indicator {",
        "  background: #5ba0d3 !important;",
        "  color: #000 !important;",
        "  border-radius: 5px !important",
        " }",
        " .mine .messages, .tagged-interesting, blockquote {",
        "  background: rgba(224,229,0,0.25) !important;",
        " }",
        " blockquote {",
        "  border-left: 4px solid #7e8100 !important;",
        " }",
        " #hmenus .nav ul li.youarehere a, #hmenus .nav ul li a:hover {",
        "  color: #fff;",
        "  background: #5ba0d3 !important;",
        " }",
        " #hmenus .nav ul li a {",
        "  padding: 4px 10px 5px;",
        "  font-size: 14px;",
        "  line-height: 1.3;",
        "  color: #000 !important;",
        "  background: #9ea3a9;",
        "  font-weight: bold !important;",
        " }",
        " #hmenus .nav li {",
        "  display: inline-block;",
        "  margin: 0 0 0 0;",
        "  padding: 0;",
        " }",
        " #hmenus .nav {",
        "  margin-right: 0px !important;",
        " }",
        " #header {",
        "  width: 1030px !important;",
        "  box-sizing: border-box !important;",
        " }",
        " .status * {",
        "  background: transparent !important;",
        "  color: #000 !important;",
        " }",
        " .status, .status * {",
        "  color: #fa0200 !important;",
        " }",
        " .status.answered {",
        "  background-color: rgba(134,134,134,0.5) !important;",
        " }",
        " .status.answered-accepted {",
        "  background-color: rgba(69,134,6,0.5) !important;",
        " }",
        " .status.answered, .status.answered *,",
        " .status.answered-accepted, .status.answered-accepted * {",
        "  color: #000 !important;",
        " }",
        " .footerwrap a {",
        "  color: #043245 !important;",
        " }",
        " .footerwrap td a {",
        "  color: #333 !important;",
        " }",
        " .deleted-answer, ",
        " .deleted-question {",
        "  background: rgba(200,0,0,0.1) !important;",
        " }",
        " .edit-tags-wrapper .dno {",
        "  display: inline !important;",
        " }"
    ].join("\n");

    if (false);
    else if ("undefined" != typeof GM_addStyle)  GM_addStyle(css);
    else if ("undefined" != typeof PRO_addStyle) PRO_addStyle(css);
    else if ("undefined" != typeof addStyle)     addStyle(css);
    else (document.head || document.getElementsByTagName("head")[0]).appendChild(document.createElement("style").appendChild(document.createTextNode(css)).parentNode);
})();
