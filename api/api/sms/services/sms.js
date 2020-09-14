require('dotenv').config();
const AWS = require('aws-sdk');

module.exports = {
  async send(phoneNumber, message) {
    const params = {
      Message: message,
      PhoneNumber: `+1${phoneNumber}`, // force US
      MessageAttributes: {
        'AWS.SNS.SMS.SenderID': {
          DataType: 'String',
          StringValue: 'TXTRMDR'
        }
      }
    };

    const publishText = new AWS.SNS({ apiVersion: '2010-03-31' })
      .publish(params)
      .promise();

    await publishText;

    return;
  }
};
