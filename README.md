**PROJECT STRUCTURE AND LIBRARIES**

The web application uses React for the front-end and a Node Express app for the back-end.
The two communicate through a proxy set up on the React side. The way this works is,
any time the React app makes a request to something that’s not a static asset
(not an image or CSS or index.html, basically), it will forward the request to the server specified in the proxy
which will be the Express app running on a different port.
All of our other dependencies are listed in the package.json of the respective project.

**CODE STRUCTURE**

  - *FRONT-END*
  
  The code for the React app is split into pages and components. Starting point is the App.js component
  which depending on the tab you've clicked on will render one of the four pages. These pages make use of the different
  components we've created as well as ones we've imported.

  - *BACK-END*
  
  The bulk of the code for the back-end is in index.js. You can see all of the express routes there as well as
  functions for connecting to the MQTT server and  for making all the REST requests needed. dbConn.js creates
  a mysql connection to the database using the credentials in the config file. queryHandler.js then uses this connection
  to manipulate data in the different tables. All queries are parameterised in order to avoid SQL injection.
  The advantage of using this config file is that the credentials are never hard-coded and different credentials with
  different access rights can be easily distributed if need be.

**DATABASE**

We're using a database on dragon which has 5 tables - 2 that hold details for the sensors you've provided and the ones
that are relevant for Canterbury from the Environmental Agency, 2 that hold all the logs for these sensors and a table
that has the location and email address and phone number of all users that have subscribed for alerts.

**SUBSCRIBING AND ALERTS**

Users can subscribe to receive daily updates on the conditions of the river.
In order to do so, you first have to search for a location on the map and then
click the subscribe button. You'll then be able to enter your email, phone number, or both.
You'll receive a welcome message after doing so, and then every day at 9am you'll receive
a detailed email or text message notifying you of the current river levels and flood alerts.

**TEST MODE**

In order to test the functionality of the application, you can enter your email or phone number to
receive an instant flood alert message.
