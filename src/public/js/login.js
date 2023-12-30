const token = "someToken";
//const resetToken = "someToken";

// Construct the reset password link dynamically
const resetPasswordLink = document.getElementById("resetPasswordLink");
resetPasswordLink.href = `/api/users/regenerate-password-reset/${token}`;
//resetPasswordLink.href = `/api/users/reset-password/${resetToken}`;
