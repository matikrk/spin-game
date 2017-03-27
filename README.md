# spin-game

Small game created in Vanila.js with ES6

Working only in modern browsers: FF, Chrome. Babel transform and polyfils now are turned off.

Librares used in development process:
* webpack
* less
* eslint - with airnBnB ruleset

Some details:
* Game start after loading all resources
* Spin symbols can be easy change by provide newURL, cfg.symbolsPath
* Game default renderes in body, to change place use cfg.gameContainer
* For easly managment code and faster redrawing game is rendered in 4 layers
* * Loader - canvas - Loader phase
* * Background - canvas -Background image with some static drawings - not changing whole game
* * UI - html div - Top layer where player interact with game. Here is drawed all buttons
* * Main - canvas - Contains higly changable things, like spinners.
