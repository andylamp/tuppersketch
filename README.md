# TupperSketch

This is a web application that is designed to allow the user to draw a bitmap on the top grid which is then
reflected to the bottom grid. This is accomplished by using Jeff Tupper's self-referential formula [1] which 
draws the top bitmap picture to the bottom grid along with the unique offset value (`k`) that corresponds 
to that particular bitmap. 

Additioanlly, the application (obviously) also allows the drawing of the math formula itself (the offset 
`k` is hardcoded). The code is fairly tested... so no (significant) problems/bugs are expected... but you 
never know. Little more details on how this works can be found [here][1], while a live page that you can 
use it is [here][2] (thanks Github pages!).

# License

Unless otherwise stated, MIT License.

References:

[1] Tupper, Jeff "Reliable Two-Dimensional Graphics Methods for Mathematical Formulae with Two Free Variables", SIGGRAPH-2001

[1]: http://andylamp.github.io/tuppersketch/about.html
[2]: http://andylamp.github.io/tuppersketch/index.html
