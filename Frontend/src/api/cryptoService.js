import { uploadPublicKey } from './userAPI';

const KEY_ALGORITHM = {
  name: 'RSA-OAEP',
  modulusLength: 2048,
  publicExponent: new Uint8Array([1, 0, 1]),
  hash: 'SHA-256',
};

const generateKeyPair = async () => window.crypto.subtle.generateKey(KEY_ALGORITHM, true, ['encrypt', 'decrypt']);
const exportKey = async (key) => window.crypto.subtle.exportKey('jwk', key);
const importKey = async (jwk, usage) => window.crypto.subtle.importKey('jwk', jwk, KEY_ALGORITHM, true, [usage]);
const arrayBufferToBase64 = (buffer) => {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
};

const base64ToArrayBuffer = (base64) => {
  const binary_string = window.atob(base64);
  const len = binary_string.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binary_string.charCodeAt(i);
  }
  return bytes.buffer;
};

export const getOrGenerateKeys = async (token) => {
  const publicKeyJwk = JSON.parse(localStorage.getItem('velo_publicKey'));
  const privateKeyJwk = JSON.parse(localStorage.getItem('velo_privateKey'));

  if (publicKeyJwk && privateKeyJwk) {
    console.log('Kunci sudah ada, memuat dari localStorage.');
    return { publicKey: publicKeyJwk, privateKey: privateKeyJwk };
  }

  console.log('Membuat key pair baru...');
  const keyPair = await generateKeyPair();
  const exportedPublicKey = await exportKey(keyPair.publicKey);
  const exportedPrivateKey = await exportKey(keyPair.privateKey);

  localStorage.setItem('velo_publicKey', JSON.stringify(exportedPublicKey));
  localStorage.setItem('velo_privateKey', JSON.stringify(exportedPrivateKey));

  try {
    console.log('Mengunggah public key ke server...');
    await uploadPublicKey(exportedPublicKey, token);
    console.log('Public key berhasil diunggah.');
  } catch (error) {
    console.error('Gagal mengunggah public key:', error);
  }

  return { publicKey: exportedPublicKey, privateKey: exportedPrivateKey };
};

export const encryptMessage = async (recipientPublicKeyJwk, message) => {
  try {
    const publicKey = await importKey(recipientPublicKeyJwk, 'encrypt');
    const encodedMessage = new TextEncoder().encode(message);
    const encryptedBuffer = await window.crypto.subtle.encrypt(KEY_ALGORITHM, publicKey, encodedMessage);
    return arrayBufferToBase64(encryptedBuffer);
  } catch (error) {
    console.error('Encryption failed:', error);
    throw error;
  }
};

export const decryptMessage = async (encryptedMessageBase64) => {
  try {
    const privateKeyJwk = JSON.parse(localStorage.getItem('velo_privateKey'));
    if (!privateKeyJwk) throw new Error('Private key tidak ditemukan.');

    const privateKey = await importKey(privateKeyJwk, 'decrypt');
    const encryptedBuffer = base64ToArrayBuffer(encryptedMessageBase64);
    const decryptedBuffer = await window.crypto.subtle.decrypt(KEY_ALGORITHM, privateKey, encryptedBuffer);

    return new TextDecoder().decode(decryptedBuffer);
  } catch (error) {
    console.error('Decryption failed:', error);
    return 'Gagal mendekripsi pesan...';
  }
};
