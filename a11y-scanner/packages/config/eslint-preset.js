module.exports = {
  extends: [
    "next",
    "prettier",
    "@typescript-eslint/recommended",
  ],
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  rules: {
    "@next/next/no-html-link-for-pages": "off",
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/no-explicit-any": "warn",
    "prefer-const": "error",
    "no-var": "error",
  },
  ignorePatterns: [
    "node_modules/",
    "dist/",
    ".next/",
    "build/",
  ],
};