
## File Structure
```html
<pre>
<b>grailed_challenge/</b>
  <b>db/</b>
    grailed-exercise.sqlite3
    grailed-exercise-live.sqlite3
    grailed-exercise-test.sqlite3
  <b>models/</b>
    grailed_interface.js
    queries.js
  <b>test/</b>
    test.js
  <b>utils/</b>
    file_overwrite.js
  app.js
  package.json
  test.js
  readme.md
</pre>
```
## Running the App
The app can be run from the command line, following the ```npm install``` command to install dependencies - using a ```production``` flag will not install testing libraries.

The app can be run with either ```npm start``` or ```node app.js```.

There is also an ```npm test``` script that will run a ```mocha``` test checking all three questions.

## Solving the 

## Design Notes & Style
The app uses the available ```sqlite3``` node.js module available on npm to do the brunt of its work. This library is written using callbacks to handle asynchronous events which plays nicely with the basic Node environment, so callbacks are used consistently through the project. The ```asyc``` library, and especially the ```waterfall``` method help maintain code clarity and prevent potential callback hell through deeply nested callback logic.

As stated above, the app tries to abstract methods to as generic as possible until absolutely necessary, allowing for code re-use and modularity.

Casing is handled as camel casing representing in-file values, while exports are handled through snake case/underscores to represent a value imported from another file.

## Testing
```npm test``` will run a full suite of tests using ```mocha```, using ```chai``` for its straightforward assertion library.

The test file works through each question and asserts the state of the data in the database before, during, and after running each solution. Target values were obtained through directly interfacing with the open-source SQLiteBrowser and running queries directly onto the database. 

Each question is tested on a fresh copy of the original database.

Assertion in the test quite checks the existence of data, the size of the results sets, the type of data returned, and when practical the direct result against target values.

## Experience and General Thoughts