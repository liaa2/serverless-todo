const aws = require('aws-sdk');
const uuid = require('uuid/v4');

const dynamoDb = new aws.DynamoDB.DocumentClient();
const TableName = 'todoList-items';

const create = (event, context, callback) => {
  const body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
  const newItem = {
    itemId: uuid(),
    info: {
      createdAt: Date.now(),
      description: body.description,
      title: body.title,
    }
  };

  dynamoDb.put({
    TableName,
    Item: newItem,
  }, (err, data) => {
    if(err) {
      console.log("ERROR", err);
      
      callback(null, {
        statusCode: 500,
        body: JSON.stringify(err.code)
      })
    } else {
      console.log('data', data, newItem);
      callback(null, {
        statusCode: 201,
        body: JSON.stringify(newItem)
      })
    }
  });
}

const retrieve = (event, context, callback) => {
  console.log("event", event);
  
  dynamoDb.get({
    TableName,
    Key: {
      itemId: event.pathParameters.id,
    },
  }, (err, result) => {
    if (err) {
      console.log("ERROR", err);
      callback(null, {
        statusCode: 500,
        body: JSON.stringify(err.code)
      })
    } else {
      console.log("RESULT", result);
      
      if (!result.Item) {
        callback(null, {
          statusCode: 404,
          body: JSON.stringify(result),
        })
      } else {
        callback(null, {
          statusCode: 200,
          body: JSON.stringify(result.Item),
        })
      }
    }
  });
}

module.exports = {
  create,
  retrieve,
}


// 'use strict';

// module.exports.hello = async event => {
//   return {
//     statusCode: 200,
//     body: JSON.stringify(
//       {
//         message: 'Go Serverless v1.0! Your function executed successfully!',
//         input: event,
//       },
//       null,
//       2
//     ),
//   };

//   // Use this code if you don't use the http event with the LAMBDA-PROXY integration
//   // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
// };
