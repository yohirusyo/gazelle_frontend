export default function () {
  return {
    username: null,
    password: null,
    token: localStorage.getItem("token") || null,
    localUser: null,
  };
}
