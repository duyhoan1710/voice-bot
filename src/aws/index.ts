import AWS from 'aws-sdk';

const access_key = process.env.REACT_APP_AWS_ACCESS_KEY as string;
const secret_key = process.env.REACT_APP_AWS_SECRET_KEY as string;

AWS.config.credentials = new AWS.Credentials(
  access_key, // Your access key ID
  secret_key, // Your secret access key
);

// Define your service region.
AWS.config.region = "ap-south-1";

export default AWS;
