var clientId = '998729760425-p0qih54o248tcj7g1ocs4nkm4bjr43km.apps.googleusercontent.com';
var apiKey = 'S4cSTinwCBCiNjfEbnKmoGSo';
var scopes = 'https://www.googleapis.com/auth/calendar';

// Use a button to handle authentication the first time.
function handleClientLoad() {
    gapi.client.setApiKey(apiKey);
    window.setTimeout(checkAuth,1);
}

function checkAuth() {
    gapi.auth.authorize({client_id: clientId, scope: scopes, immediate: true}, handleAuthResult);
}

function handleAuthResult(authResult) {
    var authorizeButton = document.getElementById('authorize-button');
    if (authResult && !authResult.error) {
        authorizeButton.style.visibility = 'hidden';
        makeApiCall();
    } else {
        authorizeButton.style.visibility = '';
        authorizeButton.onclick = handleAuthClick;
    }
}

function handleAuthClick(event) {
    gapi.auth.authorize({client_id: clientId, scope: scopes, immediate: false}, handleAuthResult);
    return false;
}

// Load the API and make an API call.  Display the results on the screen.
function makeApiCall() {
    var restRequest = gapi.client.request({
        'path': '/calendar/v3/freeBusy',
        'method': 'POST',
        'body': {
            "timeMin": "2014-10-01T00:00:00+00:00",
            "timeMax": "2014-11-30T00:00:00+00:00",
            "items": [{
                "id": "raymond.dot.zeng@gmail.com"
            }]
        }
    });
    restRequest.then(function(resp) {
        console.log(resp.result);
        $("#content").html(JSON.stringify(resp.result));
    }, function(reason) {
        console.log('Error: ' + reason.result.error.message);
    });
}
