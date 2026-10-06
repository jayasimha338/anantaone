# AnantaOne — Google Drive + Netlify pilot

This is an installable mobile website (PWA) for the AnantaOne three-month trial. It has customer booking, provider registration, auto-assignment, private Google Drive storage and a Razorpay-ready commission ledger.

## 1. Create the private Drive database

1. In the Google account that owns `jayasimha338@gmail.com`, create a blank Google Sheet named **AnantaOne Operations**.
2. Copy the long value in its URL between `/d/` and `/edit`. This is the spreadsheet ID.
3. From that Sheet select **Extensions → Apps Script**. Replace the default code with `google-apps-script/Code.gs`.
4. Replace `PASTE_YOUR_GOOGLE_SHEET_ID_HERE` in the code with the Sheet ID.
5. Run `initializeAnantaOne` once from the Apps Script editor and allow Google permissions. This creates Customers, Providers, JobsPayments and Settings tabs.
6. Deploy with **Deploy → New deployment → Web app**. Set **Execute as: Me** and **Who has access: Anyone**. Copy the Web App URL.
7. Paste that URL into `APPS_SCRIPT_URL` in `config.js`.

Keep the Sheet private. Only the web-app endpoint is public; the site cannot read sheet rows. Never add PAN values to email messages.

## 2. Enable safe auto-assignment

Provider applications enter the private **Providers** tab with `Documents verified = Pending`. A team member must review documents and change it to `Yes`. Set the provider's `Availability` to `Available`; only then can that provider be automatically matched. The system matches service category + area and chooses the lowest assignment count, then changes the provider to `Assigned` to avoid duplicate live jobs.

## 3. Payments (3.5% customer + 3.5% provider)

The customer pays the quote plus 3.5%. The provider pays 3.5% of the quote. For a ₹1,000 job: customer payment ₹1,035; provider fee ₹35; provider payout ₹965; AnantaOne earns ₹70 (7%).

Create and complete a Razorpay business account/KYC before accepting live money. In Apps Script **Project Settings → Script properties**, add `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET`. These are never added to the website. The provided payment-link helpers can be used only after the team adds a quote. Do not publish a live payment flow until you have reviewed Razorpay's marketplace/split-settlement terms and applicable tax/legal requirements.

## 4. Publish to Netlify

1. Change `PUBLIC_APP_URL` in `config.js` after the first deploy to the Netlify URL.
2. At [Netlify](https://app.netlify.com/), choose **Add new site → Deploy manually**.
3. Drag the **contents** of this `anantaone-production` folder (the level containing `index.html`) into the upload area.
4. Copy the new `https://…netlify.app` URL into `PUBLIC_APP_URL` in `config.js`, then deploy the folder again.
5. Test one customer and one provider form. Check the private Google Sheet and emails before sharing the QR code.

The site QR code uses the published URL and lets mobile users install it from Chrome. Netlify hosting is free for an initial static pilot; custom domains and payment-provider accounts have their own terms/costs.
