let words_default = {};
let activated_default = false;

console.log('test1');
chrome.runtime.onInstalled.addListener(() => {
    console.log('test2');
    chrome.storage.sync.get({'words': words_default}, function(result) {
        console.log(result.words);
        chrome.storage.sync.set({'words': result.words}, () => {
            console.log('words stored')
        });
    });
    let activated = false;
    chrome.storage.sync.get({'activated': activated_default}, function(result) {
            console.log(result.activated);
            chrome.storage.sync.set({'activated': result.activated}, () => {
                console.log('activated stored')
            })
    });         
}); 


    
