import { Router } from "express";
import crypto from 'crypto';
import { CognitoIdentityProviderClient, SignUpCommand } from "@aws-sdk/client-cognito-identity-provider";

const router = Router();
const client = new CognitoIdentityProviderClient({ region: "us-east-1" });

const calculateSecretHash = (username: string, clientId: string, clientSecret: string) => {
  const message = username + clientId;
  const hmac = crypto.createHmac('sha256', clientSecret);
  hmac.update(message);
  return hmac.digest('base64');
};

router.post('/sign-up', async (req, res) => {
  try {
    const { username, password, attributes, clientId } = req.body;
    
    const secretHash = calculateSecretHash(
      username,
      clientId,
      process.env.COGNITO_CLIENT_SECRET || ""
    );

    const command = new SignUpCommand({
      ClientId: clientId,
      Username: username,
      Password: password,
      SecretHash: secretHash,
      UserAttributes: [
        {
          Name: "email",
          Value: attributes.email
        }
      ]
    });

    const response = await client.send(command);
    res.json(response);
  } catch (error: any) {
    res.status(400).json({ 
      error: error.message || 'Failed to sign up user'
    });
  }
});

router.get('/test', (req, res) => {
  res.json({ message: 'Auth routes working!' });
});

export default router; 