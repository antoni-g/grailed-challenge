
## File Structure
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



## Running the App
The app can be run from the command line, following the ```npm install``` command to install dependencies - using a ```production``` flag will not install testing packages.

The app can be run with either ```npm start``` or ```node app.js```.

Debug output is instead handled with the ```debug``` package, so ```DEBUG='grailed_interface','cli' node app.js``` can be used to output color-formatted, file and time stamped logging information to the console.

There is also an ```npm test``` script that will run a ```mocha``` test checking all three questions.



## Solutions
The question solutions ```grailed_interface.js```. This file contains the three methods that return the correct solutions for each question, and includes the direct database interface. Since the questions have overlapping logical steps taken towards their solutions, their functions each have code reused as often as possible. SQL queries themselves are organized in ```queries.js``` helps us programmatically pass the target tables and desired values to construct queries and are abstracted to be reused as often as possible.

**1 Write a function that finds all users with disallowed usernames. Disallowed usernames can be found in the `disallowed_usernames` table.**

```disallowed_usernames(name,finalCB)``` - This method executes a SQL query on the ```name``` table and returns the resulting dataset or appropriate error through a callback. The query is constructed with ```queries.js```.

**2 Write a function that resolves all username collisions. E.g., two users with the username `foo` should become `foo` and `foo1`. The function accepts an optional "dry run" argument that will print the affected rows to the console, not commit the changes to the db.**

```collisionResolution = function(name, dryRun, finalCB)```- This method shares the same logic as 3, so abstracts this to ```_conflictResolution```, listed below.

**3 Write a function that resolves all disallowed usernames. E.g., `grailed` becomes `grailed1`. The function accepts an optional "dry run" argument that will print the affected rows to the console, not commit the changes to the db.**

```disallowedResolution = function(name, dryRun, finalCB)```- This method shares the same logic as 3, so abstracts this to ```_conflictResolution```, listed below. 

** _conflictResolution **

```_conflictResolution(name, dryRun, dataSet, finalCB)``` - This method wraps the logic to solve both questions 2 and 3, only with different criteria. Since the only difference between questions two and three is whether the data set is duplicates or rows that contain usernames in ```disallowed_usernames```, first the necessary query is constructed and run to get the resultant matches.

The first query is then used to construct a second query to return any extended matches; that is any rows that contain a username that extends any of the results of the first query. This prevents the possiblility of any potential collisions after renaming - ie, if our database contains some number of users with the username "grailed" and also a user with the name "grailed3", no user will be renamed to "grailed3". 

Renaming is done by first mapping the usernames contained in our extended matches query into a Set, allowing for O(1) lookups for potential collisions. Then, for each resultant username from our first query:
  1. Append a random integer to our username. A random integer is chosen to obscure as much information as possible about our database that can be derived from our urls.
  2. Check if this potential rename already exists - if it does, repeat step 1.
  3. Store this username in the target update collections, and store it in our Set to prevent future collisions during this run.

If this is a dry run, the updated data is return but not pushed to the database.

Otherwise, once all conflicts have been resolved, an update query is constructed. To preserve atomicty of updates, the program aims to generate as few updates as possible. SQLite is limited to 1000 variables per statement, so a statement is constructed for each 333 values that need updating and run. If at any point an update fails, the process does not continue.



## Design Notes & Style
The app uses the available ```sqlite3``` node.js module available on npm to do the brunt of its work. This library is written using callbacks to handle asynchronous events which plays nicely with the basic Node environment, so callbacks are used consistently through the project. The ```asyc``` library, and especially the ```waterfall``` method help maintain code clarity and prevent potential callback hell through deeply nested callback logic.

As stated above, the app tries to abstract methods to as generic as possible until absolutely necessary, allowing for code re-use and modularity.

Casing is handled as camel casing representing in-file values, while exports are handled through snake case/underscores to represent a value imported from another file. An underscore, '_' before a method name in the interface denote internal/private methods that are not exported.



## Testing
```npm test``` will run a full suite of tests using ```mocha```, using ```chai``` for its straightforward assertion library.

The test file works through each question and asserts the state of the data in the database before, during, and after running each solution. Target values were obtained through directly interfacing with the open-source SQLiteBrowser and running queries directly onto the database. 

Each question is tested on a fresh copy of the original database. This is done by simply overwriting the ```grailed-exercise-test.sqlite3``` file with a copy of ```grailed-exercise.sqlite3```, the original as-given database. 

Assertion in the test quite checks the existence of data, the size of the results sets, the type of data returned, and when practical the direct result against target values.

## Experience and General Thoughts
