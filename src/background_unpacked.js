let serverhost = 'http://127.0.0.1:8000';
let words_default = {};
let activated_default = false;
import { Buffer } from 'buffer';

console.log('test1');
chrome.runtime.onInstalled.addListener(() => {
    // let url = 'https://api.twilio.com/2010-04-01/Accounts/AC91d35f2c7e8830c6f30c8dcc79b59382/Messages.json';
    // let headers = new Headers();
    // headers.set('Authorization', 'Basic ' + Buffer.from('AC91d35f2c7e8830c6f30c8dcc79b59382' + ':' + '36612d5b3a50d11a4277b81e32d4fcc0').toString('base64'));
    // headers.set('Content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
    // let details = {
    //     'Body': 'Thanks for installing Daily Words!',
    //     'From': '+18106311913',
    //     'To': '+18157939677'
    // }
    // let formBody = []
    // for (let property in details) {
    //     let encodedKey = encodeURIComponent(property);
    //     let encodedValue = encodeURIComponent(details[property]);
    //     formBody.push(encodedKey + '=' + encodedValue);
    // }
    // formBody = formBody.join('&');

    // fetch(url, {
    //     method: 'POST',
    //     headers: headers,
    //     body: formBody
    // })
    // .then(response => response.json())
    // .then(json => console.log(json));

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
            console.log('save ' + request.word + ' ' + request.translation);
            let url = serverhost + '/api/save'
            fetch(url, {
                method: 'POST',
                body: JSON.stringify({word: request.word, translation: request.translation})
            })
            .then(response => response.json())
            .then(response => console.log(response))
            .catch(error => console.log(error))

            return true
        }
        else if (request.type === 'delete') {
            console.log('delete ' + request.word + ' ' + request.translation)
            let url = serverhost + '/api/delete'
            fetch(url, {
                method: 'POST',
                body: JSON.stringify({word: request.word})
            })
            .then(response => response.json())
            .then(response => console.log(response))
            .catch(error => console.log(error))
            return true; 
        }
        
    }
)

// send messages to phone at specific time
// setInterval(function() {
//     let url = serverhost + '/api/send'
//     fetch(url, {
//         method: 'POST',
//     })
// }, 5000)


    
