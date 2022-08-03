import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';
// import './styles.css';

// function appendScripts() {
//     let script1 = document.createElement('script');
//     script1.src = 'https://unpkg.com/@popperjs/core@2/dist/umd/popper.min.js';
//     let script2 = document.createElement('script');
//     script2.src = 'https://unpkg.com/tippy.js@6/dist/tippy-bundle.umd.js';
//     document.body.appendChild(script1);
//     document.body.appendChild(script2);
//     console.log('appended');
// }
    


// if (document.readyState !== 'loading') {
//     console.log('document is already ready, just execute code here');
//     appendScripts();
// } else {
//     document.addEventListener('DOMContentLoaded', function () {
//         console.log('document was not ready, place code here');
//         appendScripts();
//     });
// }

const authKey = '5031f0dc-e832-6b09-1dc2-b0e10aa41692:fx';

function wordFinder() {
    console.log('word finder triggered');
    // Gets clicked on word (or selected text if text is selected)
    var t = '';
    let html;
    let range;
    let sel;
    if (window.getSelection && (sel = window.getSelection()).modify) {
        // Webkit, Gecko
        var s = window.getSelection();
        if (s.isCollapsed) {
            s.modify('move', 'forward', 'character');
            s.modify('move', 'backward', 'word');
            s.modify('extend', 'forward', 'word');
            t = s.toString();
            range = s.getRangeAt(0);
            s.modify('move', 'forward', 'character'); //clear selection
        }
        else {
            t = s.toString();
        }

        // interpolate span around word on click

        let newSpan = document.createElement('span');
        newSpan.id = `${t}-node`;
        newSpan.appendChild(document.createTextNode(t));
        if (s.rangeCount) {
            range.deleteContents();
            range.insertNode(newSpan);
        }

        fetch(`https://api-free.deepl.com/v2/translate?auth_key=${authKey}&text=${t}&target_lang=EN-US`, {
            method: 'POST'
        })
        .then((response) => response.json())
        .then((data) => {
            tippy(`#${t}-node`, {
                content: data.translations[0].text
            });
        })
        
        
    } 

    // need to look into what this case is doing/when it gets triggered

    else if ((sel = document.selection) && sel.type != "Control") {
        // IE 4+
        var textRange = sel.createRange();
        if (!textRange.text) {
            textRange.expand("word");
        }
        // Remove trailing spaces
        while (/\s$/.test(textRange.text)) {
            textRange.moveEnd("character", -1);
        }
        t = textRange.text;
        start = textRange.startOffset;
        end = start + t.length;
        html = `<div><span>${t}</span></div>`;
        textRange.pasteHTML(html); 
        // get translation somehow (some sort of api most likely)
        // once I have the translation, put that as the content in the tooltip div
        // put tooltiptext span inside div and put the text from t inside of it
        // follow the rest of the css to make the tooltip functional
    }
}

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      console.log(sender.tab ?
                  "from a content script:" + sender.tab.url :
                  "from the extension");
    // I think this set is redundant since I set "activated" in popup.js
      chrome.storage.sync.set({'activated': request.status});
      chrome.storage.sync.get('activated', function(result){
        console.log(result.activated);
        if (result.activated) {
            console.log('if executed')
            $("body").on('click', wordFinder);
        }
        else {
            console.log('else executed');
            $("body").off('click', wordFinder);
        }
      });
    }
  );





// testing

// chrome.storage.sync.get('words', function(result) {
//     console.log(result.words);
// });

// chrome.storage.sync.get('activated', function(result) {
//     console.log(result.activated);
// });
