This project was created as my final project for the course CS50's Web Programming with Python and Javascript.


Project Description: 
My project is a single-page application designed as "Jeopardy'esque" word guessing game. Once an initial baseline word is
entered by the user, a definition for a related/associated words is provided. 
The user is tasked with guessing the correct word within a certain time limit. If the user guesses 10 words correctly
before the time runs out, the user wins. If the user fails to do so, the user loses.
Guessing a word correctly is rewarded with time, an extra 10seconds are added to the users metrics. 
Guessing a letter incorrectly is not punished.
e.g. an initial entry of the word "Baby" might cue a definition "a nutritional substance produced by mammals"
answer- "milk"


Files included:
search.html - main html page with all html content.
layout.html - html page with generic html
input.js - Javascript file with instructions for altering content on page based on users actions
largescreen.css - css file for large screens and tablets
smallscreen.css - css file for small screens/phones for a responsive design experience


Self Designed Requirements list:
-On Submitting an initial word, a fetch api call should go to Datamuse and get associated word matches related to entered word
-On Submitting the initial word, a fetch api call should go to webster dictionary api and get definition of associated word
-A series of textboxes should be created matching the associated word. If a letter (e.g. "Q")is entered in to the 
entry boxes which does not match the letter for the associated word(e.g. 
"guess", Q_ _ _ _ _), the background color should change to indicate an error.
-On clicking the guess button, a keyboard layout should be displayed.
-On clicking a random letter in the layout (e.g. "S"), and if said letter is contained in the associated word (e.g. "guess")
the entries are filled in (e.g. _ _ _ s_ s_)
-On clicking the hint button, the app should make a get api call to thesaurus API to get synonyms to the associated words. 
These should be displayed to the user.
-A timer, preferably animated, should track how much time the user has left. 
-On typing in the word entry field, the timer should be "paused" while the user makes an entry. 
-On either changing a word, and clicking submit or on entering/guessing a letter, the timer should continue from where it left off.
-If all letters entered by the user are a correct match with the associated word & no boxes have been left blank, the system should
store this as a correct answer in the database.
-If the associated word list is exhausted, display an appropriate message to user to change their word choice.
-Once a word has been chosen, store the word in a database to ensure it cannot be used again 
-For each correct word match, by the user a tracking system should exist to show progress. E.g. This can be done 
by  color coding letters.
-On "winning" the game,(when game letters "MIND THE GAP" have been colored out), run a visual animation to celebrate user's efforts.
-On "Losing" the game, (when timer counts to zero), have a color visual indication of this.
-After either "winning" or "Losing" clicking "play" should reset the game (colors, counters etc.) with the exception
 of the already inputted words, in order to enable the player "play again!"
-Have an "About" section with a brief description of the game objective. 


Project Acceptance Justification :
I believe this project meets the complexity requirements requested of a final project as it incorporates  many
of the elements taught in the course (see requirements above)- Single-page apps, SVG animation, database storage, 
Asynchronous API calls, responsive design etc, and does so in a way that is fun and enjoyable for the user.


Final Notes
Thanks to the Brian Yu and David Malan and to the Entire staff and production group of this course. 
Phenomenal work!, and for me life Changing.
 


