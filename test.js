import bcrypt from "bcrypt";

async function testPassword() {
  const enteredPassword = "3"; // The plain text password
  const storedHash = "$2b$10$xFPJEXAFR/kty0jBReUbvOgiGJqw5BjwHrPghZZLnqqCr/Tq/9yV."; // Stored hash

  const isMatch = await bcrypt.compare(enteredPassword, storedHash);
  console.log("✅ Password Match Test Result:", isMatch);
}

testPassword();
