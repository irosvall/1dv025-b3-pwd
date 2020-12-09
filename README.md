# Personal Web Desktop (PWD)

## Introduction

In this examination assignment, you will focus on building a single page application (SPA) with chat integration against a web socket server. The backend (server-side code) of this assignment will be given, and your assignment is to write the client-side code.

In this assignment, you are supposed to build what we call a "Personal Web Desktop" (PWD). First of all, have a look at this recording to get a better view of the assignment.

[Demo - Personal Web Desktop](https://youtu.be/gNcMvPCyHC0)

## The assignment
The assignment can be divided into four parts; The PWD, the memory sub-application, the messages sub-application, and the custom sub-application.

## 1. The PWD (#1, #2, #3, #4, #5, #6)

The PWD-application is the main application in which the smaller applications live. This part will have a "desktop-like" feeling (#1) with a dock (#3) in which the sub-applications (#2) icons will be presented to the user. This application **should** be constructed as a SPA application (#6), and it is rewarding to create it as a PWA (progressive web application) with offline capabilities. 

A user should be able to open multiple instances of the same sub-application and multiple different sub-applications at once (#5).  The sub-applications in the PWD should be draggable using the mouse. It should be possible to place a sub-application on top of another sub-application, and the user should be able to give a sub-application focus so that it gets in front of other sub-applications. The user should be able to close the sub-applications (#4).

The PWD application should be extended with at least one additional custom feature (#2).

## 2. The Memory sub-app (#7, #8)

This sub-application is a simple [memory game](https://en.wikipedia.org/wiki/Concentration_(card_game)).

In a memory game, several pairs of tiles are placed face down in a grid. The point of the game is to flip over tiles and match the pairs together. If the images on the facing tiles match, the matching tiles are removed. If the images do not match, the tiles are flipped back face down. The object of the game is to find all pairs. The game is over when all the tiles are gone.

The Memory sub-app should be extended with at least one additional custom feature (#8).

For a full list of requirements, refer to #7.

## 3. The Messages sub-app (#9, #10)

This sub-application is a course-wide message chat using Web Sockets. Think of this application as a regular message client like WhatsApp, Signal, FB Messenger, or iMessage. 

The Messages sub-app should be extended with at least one additional custom feature (#10).

For a full list of requirements, refer to #9.

## 4. The Custom sub-app

As a third application, you are supposed to let your creativity come into play. Think of an application that you want to create and do that as your third application! Why not use this opportunity to try out some of the APIs in the browser that we still have not used!

To fulfill this part of the application, you should create an Issue describing your sub-application in the same way that the Memory and Messages sub-applications are described (preferably before coding the sub-app). Make sure to link this Issue under "Student defined requirements" in the [Release-report](./.gitlab/merge_request_templates/RELEASE.md). 

- Question: "Is it okay to just create a simple "about" application with some text?"
- Answer: Yes, however, one of the grading criteria for this assignment will come down to how well you can adopt to use APIs that you have not yet used in the course. 

## Requirements

Make sure to read [all requirements of the application](../../issues/). This includes: (#1, #2, #3, #4, #5, #6, #7, #8, #9, #10, #11, #12, #13, #14, #15, #16, #17, #18)
Pay extra attention to the labels indicating if the requirement is required (~"req::required") or optional (~"req::optional").

In this assignment you are required to close issues and tasks ([ ]) that you implement. You are also required to create your own issues (and close them) for added functionality. 

## Extending the assignment

This assignment is very flexible for you to extend and add extra features to, and the course management invites you to do so! To make sure that the feature is noticed by the examinator, please make sure to create a use case (just like the other issues) as an issue in which you describe the feature. Add the issue to the list of "Student defined requirements" in the [Release-report](./.gitlab/merge_request_templates/RELEASE.md) with a short comment describing the issue like "Offline support".

### Example of extensions:

- Lazy loading. Why load needed sub-apps before the user clicks on an icon?
- Offline support (with service workers).
- Save the state of all windows and their positions when exiting the app.
- Encrypted message application.
- Emoji enabled message application.
- Multiplayer Memory with game data synced over the chat.
- Video recording and/or streaming using WebRTC and the MediaStream Recording API.
- Make the app installable by adding a .webmanifest-file.

## Altering the requirements

If some requirements are blocking your possibility to extend the application the way you would like, it is often okay to skip or alter some requirements in the assignment as long as you do not make the assignment easier to solve or skip central goals in the course like not implementing web sockets. 

### What you need to do before side-stepping any requirements:

- When in doubt, contact the course management for a blessing.
- Add a comment next to the side stepped issue in the [Release-report](./.gitlab/merge_request_templates/RELEASE.md).
- Do not close the issue or task that is not implemented.
- If the feature is substantial, add it as a new Issue and link it in the [Release-report](./.gitlab/merge_request_templates/RELEASE.md). 
