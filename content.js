chrome.storage.sync.get('activated', function(result) {
    if (result.activated) {
        $("body").on('click', function() {
            // Gets clicked on word (or selected text if text is selected)
            var t = '';
            if (window.getSelection && (sel = window.getSelection()).modify) {
                // Webkit, Gecko
                var s = window.getSelection();
                if (s.isCollapsed) {
                    s.modify('move', 'forward', 'character');
                    s.modify('move', 'backward', 'word');
                    s.modify('extend', 'forward', 'word');
                    t = s.toString();
                    s.modify('move', 'forward', 'character'); //clear selection
                }
                else {
                    t = s.toString();
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
            }
            alert(t);
        });
    }
})


// testing

chrome.storage.sync.get('words', function(result) {
    console.log(result.words);
});

chrome.storage.sync.get('activated', function(result) {
    console.log(result.activated);
});
