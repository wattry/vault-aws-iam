# vault-aws-iam
Authenticates and reads secrets with HashiCorp vault using AWS IAM roles.

# Examples

```javascript
const vault = new VaultAws({
  server: 'example.vault.com',
  port: '8200',
  AWS: {
    region: 'us-east-1'
  }
});

// Initialize the package with this
async function setup() {
  await vault.login('iam-role');
}

// Fetch the secret you require and do what you need with it.
function getSecret(secretName) {
  const { data } = await vault.read('secret/data/name');

  return data[secretName];
}
```