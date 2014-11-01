var clientId = '998729760425-p0qih54o248tcj7g1ocs4nkm4bjr43km.apps.googleusercontent.com';
var apiKey = 'S4cSTinwCBCiNjfEbnKmoGSo';
var scopes = 'https://www.googleapis.com/auth/calendar';

function handleClientLoad() {
    gapi.client.setApiKey(apiKey);
    window.setTimeout(checkAuth,1);
}

function checkAuth() {
    gapi.auth.authorize({
        client_id: clientId, 
        scope: scopes, 
        immediate: true}, handleAuthResult);
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
    gapi.auth.authorize({
        client_id: clientId, 
        scope: scopes, 
        immediate: false}, handleAuthResult);
    return false;
}

// Load the API and make an API call. 
function makeApiCall() {
    var calListRequest = gapi.client.request({
        'path': '/calendar/v3/users/me/calendarList',
    });
    
    calListRequest.then(function(resp) {
        var ids = resp.result.items;
        var items = [];
        for (var i = 0; i < ids.length; i++) {
            items.push({'id': ids[i].id});
        }
        freeBusyReq(items);
    }, function(reason) {
        console.log('Error: ' + reason.result.error.message);
    });
    
}

function freeBusyReq(items) {
    var freeBusyRequest = gapi.client.request({
        'path': '/calendar/v3/freeBusy',
        'method': 'POST',
        'body': {
            "timeMin": "2014-10-31T00:00:00+00:00",
            "timeMax": "2014-11-05T00:00:00+00:00",
            "items": items
        }
    });
    
    freeBusyRequest.then(function(resp) {
        var cals = resp.result.calendars;
        var keys = Object.keys(cals);
        var intervals = [];
        for (var i = 0; i < keys.length; i++) {
            var busyArr = cals[keys[i]].busy;
            for (var j = 0; j < busyArr.length; j++) {
                busyArr[j].start = new Date(busyArr[j].start);
                busyArr[j].end = new Date(busyArr[j].end);
            }
            intervals = intervals.concat(busyArr);
        }
        
        intervals = mergeIntervals(intervals);
        l(intervals);
        intervalsToText(intervals, "dddd MMM. D, h:mma", "h:mma zz", " - ");
    }, function(reason) {
        console.log('Error: ' + reason.result.error.message);
    });
}

/**
   arr is an array of objects with properties 
   'start' and 'end', both of which are Date objects
 **/
function mergeIntervals(arr) {
    l(arr);
    // sort by start time
    arr.sort(function(a, b){
        return a.start - b.start;
    });
    
    l(arr);
    // iterate through intervals and merge them
    var stack = [];
    for (var i = 0; i < arr.length; i++) {
        // stack is empty or this interval doesn't overlap with the last
        // so just push this interval
        if (stack.length == 0 ||
            !overlaps(stack[stack.length - 1], arr[i])) {
            stack.push(arr[i]);
        } 
        // otherwise merge this interval with the last one and push the merged
        else {
            var merged_intv = merge(stack.pop(), arr[i]);
            stack.push(merged_intv);
        }
    }
    return stack;
}

/**
   Returns if a and b overlap.
   Assumes a starts before or same time as b
**/
function overlaps(a, b) {
    return b.start <= a.end;
}

function merge(a, b) {
    return {
        start: a.start,
        end: b.end
    };
}

function l(thing) {
    console.log(thing);
}

/**
   Given an array of intervals {'start': ... , 'end': ... },
   return text describing those intervals.
**/
function intervalsToText(intervals, startFormat, endFormat, glue) {
    var s = "";
    for (var i = 0; i < intervals.length; i++) {
        s += moment(intervals[i].start).format(startFormat) 
            + glue + moment(intervals[i].end).format(endFormat) + "\n";
    }
    console.log(s);
}
