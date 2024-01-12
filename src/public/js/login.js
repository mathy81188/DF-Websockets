const token = "someToken";

const resetPasswordLink = document.getElementById("resetPasswordLink");
resetPasswordLink.href = `/api/users/regenerate-password-reset/${token}`;
