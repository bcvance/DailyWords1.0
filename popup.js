let activatedBtn = document.getElementById('activated');

chrome.storage.sync.get('activated', function(result) {
    if (!result.activated) {
        activatedBtn.innerHTML = 'activate';
    }
    else {
        activatedBtn.innerHTML = 'deactivate';
    }
})

activatedBtn.onclick = () => {
    if (activatedBtn.innerHTML === 'activate') {
        activatedBtn.innerHTML = 'deactivate';
        chrome.storage.sync.set({'activated': true});
        chrome.storage.sync.get('activated', function(result) {
            console.log(result.activated);
        })
    }
    else {
        activatedBtn.innerHTML = 'activate';
        chrome.storage.sync.set({'activated': false});
        chrome.storage.sync.get('activated', function(result) {
            console.log(result.activated);
        })
    }
}