import tippy, { hideAll } from 'tippy.js';
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
let toolTipActive = false;

function wordFinder(event) {
    if (event.target.id !== 'save-btn'){
        console.log('word finder triggered');
        console.log(toolTipActive);
        if (!event.target.hasAttribute('click')) {
            console.log('doesnt have click attribute');
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
                if (t && !/\d/.test(t)){
                    console.log(`t is ${t}`);
                    let newSpan = document.createElement('span');
                    newSpan.id = `${t}-node`;
                    newSpan.setAttribute('click', 'true');
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
                        // see is there is a way for the tooltip to pop up on the below function call
                        const el = document.getElementById(`${t}-node`);
                        const instance = tippy(el, {
                            content: 
                            `<div>
                                <strong>${t} - </strong>
                                <p style='margin: 5px 0;'>${data.translations[0].text}</p>
                                <strong id='save-btn' style='text-decoration: underline; cursor: pointer;'>Save This Word</strong> 
                            </div>
                            `
                            ,
                            allowHTML: true,
                            trigger: 'click',
                            hideOnClick: true,
                            interactive: true,
                            showOnCreate: true,
                            // when tippy is showing, clicking anywhere simply minimizes the tippy,
                            // and does not try to evaluate next thing clicked
                            // onShow(instance) {
                            //     console.log('onSHow');
                            //     $("body").off('click');
                            // },
                            // when tippy is minimized, we reactivate wordFinder event listener so that
                            // we can continue to translate new terms
                            // onHidden(instance) {
                            //     console.log("onHidden");
                            //     hideAll();
                            //     $("body").on('click', (event) => {
                            //         wordFinder(event);
                            //     });
                            // }
                        });
                        el.style.backgroundColor = '#00ffd9';
                        document.getElementById('save-btn').onclick = (event) => {
                            // here we will save word - translation pair to storage
                            console.log(t);
                            if (event.target.innerHTML === 'Save This Word') {
                                event.target.innerHTML = 'Unsave Word';
                            }
                            else {
                                event.target.innerHTML = 'Save This Word';
                            }
                        }
                    })
                }   
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
        else {
            console.log('has click attribute');
        } 
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
        if (result.activated) {
            console.log('if executed')
            $("body").on('click', (event) => {
                wordFinder(event);
            });
        }
        // not removing event listener, deal with tomorrow
        else {
            console.log('else executed');
            toolTipActive = false;
            $("body").off('click');
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
