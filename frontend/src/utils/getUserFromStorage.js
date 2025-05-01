export const getUserFromStorage = () => {
  const data = JSON.parse(localStorage.getItem("userInfo") || null);
  if (data?.user?.token) {
    console.log("TOKEN", data.user.token);
    return data.user.token;
  } else {
    console.log("No token found in localStorage");
    return null;
  }
};
