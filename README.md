Available.toString
==================

Easily take your calendar and get text saying when you are available. 

Why
===
Whenever you're trying to setup a meeting (think interviews), you'll be asked to provide your availibility in a certain date interval. I always have to go to my calendar and manually write down when I'm free. This task can and should be easily automated.

What
===
This is probably best as a Chrome extension but I don't want to use a hardcoded solution that's heavily dependant on the current Google Calendar HTML. If there's a way to use Google Calendar API's FreeBusy query with a chrome extension, that would be the best solution. Otherwise, it'll have to be a SPA.

Goals
===
Graphical calendar UI where the user highlights intervals and these intervals are translated to text 
- User enters setup info like date interval, exclude-weekends and after-x and before-x times to limit the initial highlighted area
- User can then manually drag and reshape the highlighted area to fine-tune their availibility
- FreeBusy info taken from Google cal to automatically un-select times already blocked off. 
- Press a button to intelligently convert the graphical representation to text that can be directly pasted in an email.


