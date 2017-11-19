/**
 * Created by pedro.f.marquez.soto on 2/16/2017.
 */

import dynalite from 'dynalite';
import AWS from 'aws-sdk';

var dynaliteServer = dynalite({
    createTableMs: 50
});

module.exports.mockDB = () => {
    AWS.config.update({
        accessKeyId: "localAccessKey",
        secretAccessKey: "localSecretAccessKey",
        region: "us-east-2"
    });

    var dynamodb = new aws.DynamoDB({
        endpoint: 'http://localhost:8000'
    });


    return new Promise((resolve, reject) => {
        dynaliteServer.listen(4567, function(err) {
            dynamodb.listTables({}, function(err, data) {
                if (err) console.log(err, err.stack); // an error occurred
                else {
                    if (data.TableNames.length <= 0) {
                        dynamodb.createTable({
                                TableName: "TacoGallery",
                                KeySchema: [{
                                        AttributeName: "id",
                                        KeyType: "HASH"
                                    }, //Partition key
                                    {
                                        AttributeName: "name",
                                        KeyType: "RANGE"
                                    } //Sort key
                                ],
                                AttributeDefinitions: [{
                                        AttributeName: "id",
                                        AttributeType: "S"
                                    },
                                    {
                                        AttributeName: "name",
                                        AttributeType: "S"
                                    }
                                ],
                                ProvisionedThroughput: {
                                    ReadCapacityUnits: 10,
                                    WriteCapacityUnits: 10
                                }
                            },
                            function(err, data) {
                                if (err) {
                                    console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
                                    reject(err);
                                } else {
                                    setTimeout(() => {
                                        resolve(data);
                                    }, 1000)
                                }
                            });
                    } else {
                        resolve();
                    }
                }
            });
        });
    });
}