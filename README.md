# Description

A grid of images displaying content from GIPHY API. Refer to the PDF for full description.

## Setup

Setup is easy, you will be up and running in a couple of steps

1. Clone the repo
2. Open your terminal and navigate to the folder
3. Run `npm i`
4. Run `ng s --open` to open in the browser automatically or `ng s`, then click on [http://localhost:4200](http://localhost:4200) to view it in the browser.

## Testing

Code was written in BDD style, so there is 94.26% coverage. Once you go BDD, you can't go back 😀. To test the application, in your terminal, run `ng test` for UI browser test, `ng test --browsers ChromeHeadless` for headless test (my favourite 😀) and `ng test --no-watch --code-coverage` for headless test with the test coverage logged.

## Build

Building should be straight-forward, like any other Angular app, though I didn't try it. To build run `ng build`

## Pagination

I created a Pagination for this assignment to give the reviewer some insight about my code. In the real world a library should be used for this purpose, because it's a very generic feature and not part of the application. Even if it's done in-house, it should be as a library.

## Known Issues

Since it's a demo application, it's not perfect and I have highlighted known issues below

1. No loading State
2. Page gets activated before a successful response and stay active even if the response is negative
   Desired behaviour - should stay inactive until a successful response (not recommended) or should revert back to inactive after a failed response (recommended)
