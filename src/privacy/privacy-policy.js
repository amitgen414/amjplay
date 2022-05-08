import {loadCookiePrivacyPolicy} from "../common/load-privacy-policy";

loadCookiePrivacyPolicy();

const container = document.getElementById("policy-container");

fetch("https://www.iubenda.com/api/privacy-policy/75955627/no-markup")
 .then(res => res.json())
 .then(data => {
  container.innerHTML = data.content;
 })