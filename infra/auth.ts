export const userPool = new sst.aws.CognitoUserPool(
  'ProshootUserPool',
  {
    mfa: 'optional',
  },
  {},
);

const GoogleClientId = new sst.Secret('GOOGLE_CLIENT_ID');
const GoogleClientSecret = new sst.Secret('GOOGLE_CLIENT_SECRET');

const googleProvider = userPool.addIdentityProvider('Google', {
  type: 'google',
  details: {
    authorize_scopes: 'email profile',
    client_id: GoogleClientId.value,
    client_secret: GoogleClientSecret.value,
  },
  attributes: {
    email: 'email',
    name: 'name',
    username: 'sub',
  },
});

export const poolClient = new aws.cognito.UserPoolClient('ProshootaiClient', {
  name: 'proshootai-client',
  userPoolId: userPool.id,

  // OAuth configuration
  allowedOauthFlows: ['code'],
  allowedOauthFlowsUserPoolClient: true,
  allowedOauthScopes: ['email', 'openid', 'profile'],

  // Callback URLs
  callbackUrls: ['http://localhost:5173/'],
  logoutUrls: ['http://localhost:5173/'],

  // Generate secret
  generateSecret: false,

  // Supported identity providers
  supportedIdentityProviders: [googleProvider.providerName],

  // Token validity
  accessTokenValidity: 1, // 1 hour
  idTokenValidity: 1, // 1 hour
  refreshTokenValidity: 30, // 30 days

  // Token expiration
  tokenValidityUnits: {
    accessToken: 'hours',
    idToken: 'hours',
    refreshToken: 'days',
  },

  // Prevent user existence errors
  preventUserExistenceErrors: 'ENABLED',

  // Enable token revocation
  enableTokenRevocation: true,
});
