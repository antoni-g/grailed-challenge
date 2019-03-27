
##File Structure
```
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
##Running the App
The app can be run from the command line, following the ```npm install``` command to install dependencies - using a ```production``` flag will not install testing libraries.

The app can be run with either ```npm start``` or ```node app.js```.

##Design Notes & Style
The app uses the available ```sqlite3``` node.js module available on npm to do the brunt of its work. This library is written using callbacks to handle asynchronous events which plays nicely with the basic Node environment, so callbacks are used consistently through the project. The ```asyc``` library, and especially the ```waterfall``` method help maintain code clarity and prevent callback hell through deeply nested callback logic.

Casing is handled as camel casing representing in-file values, while exports are handled through _ underscore to represent a value exported from another file.

##Testing


##Style Notes

##Experience and General Thoughts