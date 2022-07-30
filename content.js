function wordFinder() {
    // Gets clicked on word (or selected text if text is selected)
    var t = '';
    let start;
    let end;
    let html;
    let range;
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
        start = s.anchorOffset;
        end = start + t.length;
        let newSpan = document.createElement('span');
        newSpan.appendChild(document.createTextNode('test'));
        if (s.rangeCount) {
            range.deleteContents();
            range.insertNode(newSpan);
        }
    } else if ((sel = document.selection) && sel.type != "Control") {
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
