##Database names
The database chosen is MongoDB.
The database name is customerOrder
The collection name for customers is customers
The collection name for orders is order.

##Design Approach
The schedule job runs every 55 mins and obtain a CSV file from the URL specified, and store all order data in an array. 
Then a connection is established with mongo server and the customer ID is obtained from the customer collection. This is then checked against the customer id
obtained from the CSV order file and only those orders that have a customer ID in the customer collection are pushed into a new array. The order will then be updated with the new items.

_Only certain parts of the code have been tested to see their working. The code works with a dummy CSV file on a local machine, can successfully obtain the data from a collection and compare it with the data from CSV file as well as insert data into the collection._

##Testing to be implemented
The code could be tested by using Mocha and Mongo-Unit a test framework for node.js that can be used to write tests for the code. 
1. The data obtained from the CSV file in the array needs to be tested and any special character needs to be changed so that the program doesn't crash using Mocha.
2. The code makes use of asynchronous code and needs to be tested which can be done using callback function using Mocha. 
3. Integration testing could be performed using Mongo-unit to obtain the data stored in database in MongoDB. 
