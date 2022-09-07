export default function () {
  return {
    username: "",
    password: "",
    token: localStorage.getItem("token") || "",
    localUser: null,
  };
}
