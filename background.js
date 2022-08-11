let serverhost = 'http://127.0.0.1:8000';
let words_default = {};
let activated_default = false;

console.log('test1');
chrome.runtime.onInstalled.addListener(() => {
    let url = 'https://api.twilio.com/2010-04-01/Accounts/AC91d35f2c7e8830c6f30c8dcc79b59382/Messages.json';
    let headers = new Headers();
    headers.set('Authorization', 'Basic ' + btoa('AC91d35f2c7e8830c6f30c8dcc79b59382' + ':' + '8aab0161f52574807fb4dd796f7d5759'));
    headers.set('Content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
    let details = {
        'Body': 'test',
        'From': '+18106311913',
        'To': '+18157939677'
    }
    let formBody = []
    for (let property in details) {
        let encodedKey = encodeURIComponent(property);
        let encodedValue = encodeURIComponent(details[property]);
        formBody.push(encodedKey + '=' + encodedValue);
    }
    formBody = formBody.join('&');
    fetch(url, {
        method: 'POST',
        headers: headers,
        body: formBody
    })
    .then(response => response.json())
    .then(json => console.log(json));
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

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.type === 'save'){
            console.log(request.word, request.translation);
            let url = serverhost + '/api/save'
            fetch(url, {
                method: 'POST',
                // credentials: 'include',
                // headers: {
                //     'Content-Type': 'application/json',

                // }
                body: JSON.stringify({word: request.word, translation: request.translation})
            })
            .then(response => response.json())
            .then(response => console.log(response))
            .catch(error => console.log(error))

            return true
        }
        
    }
)

// chrome.runtime.onMessage.addListener(
//     function(request, sender, sendResponse) {
//       console.log(sender.tab ?
//                   "from a content script:" + sender.tab.url :
//                   "from the extension");
//     console.log(request.word, request.translation, request.type);
//       if (request.greeting === "hello")
//         sendResponse({farewell: "goodbye"});
//     }
//   );
    
