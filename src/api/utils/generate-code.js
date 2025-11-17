// src/utils/generate-code.js

export function generateProductCode() {
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `P${rand}`;
}
