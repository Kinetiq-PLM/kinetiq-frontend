// src/aws/cognito.js
import { CognitoUserPool } from 'amazon-cognito-identity-js';

const poolData = {
  UserPoolId: "your_userpool_id", // e.g. ap-southeast-1_XXXXXXX
  ClientId: "your_app_client_id", // no secret!
};

export default new CognitoUserPool(poolData);
