function maskEmail(email, key) {
  let maskedEmail = "";
  for (let i = 0; i < email.length; i++) {
    const maskedChar = String.fromCharCode(
      email.charCodeAt(i) ^ key.charCodeAt(i % key.length)
    );
    maskedEmail += maskedChar;
  }
  return btoa(maskedEmail);
}

function unmaskEmail(maskedEmail, key) {
  const encodedEmail = atob(maskedEmail);
  let originalEmail = "";
  for (let i = 0; i < encodedEmail.length; i++) {
    const originalChar = String.fromCharCode(
      encodedEmail.charCodeAt(i) ^ key.charCodeAt(i % key.length)
    );
    originalEmail += originalChar;
  }
  return originalEmail;
}

function generateRandomKey(length) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let key = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    key += characters.charAt(randomIndex);
  }
  return key;
}

const key = generateRandomKey(16);

let mEmail = maskEmail("schaitanya860@gmail.com", key);

console.log(mEmail);

let uEmail = unmaskEmail(mEmail, key);

console.log(uEmail);