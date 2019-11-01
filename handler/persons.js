const aws = require('aws-sdk');
const uuid = require('uuid/v4');
const bodyParser = require('body-parser');
const serverless = require('serverless-http');
const express = require('express');
const app = express();


const CONFIG_PERSONS_TABLE = process.env.CONFIG_PERSONS_TABLE;
const CONFIG_PERSONS_DYNAMODB_ENDPOINT = process.env.CONFIG_DYNAMODB_ENDPOINT;
const IS_OFFLINE = process.env.IS_OFFLINE;

let dynamoDb;

if (IS_OFFLINE === 'true') {
  dynamoDb = new aws.DynamoDB.DocumentClient({
    region: 'localhost',
    endpoint: CONFIG_PERSONS_DYNAMODB_ENDPOINT,
  });
} else {
  dynamoDb = new aws.DynamoDB.DocumentClient();
}

app.use(bodyParser.json({strict: false, limit: '10mb'}));


// get a list of all existing persons
app.get('/persons', async function(req, res){
  const dbParams = {
    TableName: CONFIG_PERSONS_TABLE,
  };

  let result = await dynamoDb.scan(dbParams).promise();

  res.json({ persons: result.Items });
});

// add a new person
app.post('/persons', async function(req, res) {
  const dbParams = {
    TableName: CONFIG_PERSONS_TABLE,
    Item: {
      personId: uuid(),
      name: 'test',
    }
  };

  try {
    await dynamoDb.put(dbParams).promise();
    res.json({ status: '200' });
  } catch (err) {
    res.status(400).json({ error: 'error adding person' })
  }
})

module.exports.handler = serverless(app);

