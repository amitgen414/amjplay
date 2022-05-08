export function loadCookiePrivacyPolicy() {
 window._iub = window._iub || {};

 window._iub.csConfiguration = {
  "askConsentAtCookiePolicyUpdate": true,
  "ccpaApplies": true,
  "consentOnContinuedBrowsing": false,
  "enableCcpa": true,
  "invalidateConsentWithoutLog": true,
  "lang": "en", "perPurposeConsent": true,
  "priorConsent": false,
  "purposes": "1,4,5",
  "siteId": 2635088,
  "cookiePolicyId": 75955627,
  "cookiePolicyUrl": "./cookie-policy.html",
  "banner": {
   "acceptButtonColor": "#0d6efd",
   "acceptButtonDisplay": true,
   "backgroundColor": "#000000",
   "closeButtonDisplay": false,
   "customizeButtonColor": "#0d6efd",
   "customizeButtonDisplay": true,
   "explicitWithdrawal": true,
   "listPurposes": true,
   "logo": null,
   "position": "bottom",
   "rejectButtonColor": "#0d6efd",
   "rejectButtonDisplay": true,
   "acceptButtonCaption": "Accept",
   "content": "We and selected third parties use cookies or similar technologies for technical purposes and, with your consent, for other purposes (“basic interactions & functionalities” and “measurement”) as specified in the <a href=\"./cookie-policy.html\">cookie policy</a>.\n\nYou can freely give, deny, or withdraw your consent at any time."
  }
 }
 const script = document.createElement("script");

 script.setAttribute("src", "https://cdn.iubenda.com/cs/iubenda_cs.js");
 script.setAttribute("async", true);

 document.body.appendChild(script);
}