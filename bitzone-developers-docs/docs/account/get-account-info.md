---
title: Get account info
---

GET /v1/account/info — returns account information.

## QR payment testing (Get account info)

This application can be opened via URLs on the `pandapay24.com` domain with the `/qr` path and payment parameters.

### Parameters

| Parameter | Type   | Required | Description                 | Example               |
|----------:|:-------|:---------|:----------------------------|:----------------------|
| amount    | number | Yes      | Payment amount              | `1000`               |
| currency  | string | No       | Currency (default: `RUB`)   | `RUB`, `USD`         |
| recipient | string | Yes      | Payment recipient           | `Иванов И.И.`        |
| bank      | string | Yes      | Bank name                   | `Sber`, `Tinkoff`    |
| account   | string | Yes      | Account/card number         | `1234567890`         |
| purpose   | string | No       | Payment purpose/description | `Оплата услуг`       |

### Example URLs

- Basic payment (all required fields):
  - [Open basic payment](https://pandapay24.com/qr?amount=1000&currency=RUB&recipient=%D0%98%D0%B2%D0%B0%D0%BD%D0%BE%D0%B2%20%D0%98.%D0%98.&bank=Sber&account=1234567890)

- Full payment with purpose:
  - [Open full payment](https://pandapay24.com/qr?amount=2500.50&currency=RUB&recipient=%D0%9F%D0%B5%D1%82%D1%80%D0%BE%D0%B2%20%D0%9F%D0%B5%D1%82%D1%80&bank=Tinkoff&account=9876543210&purpose=%D0%9E%D0%BF%D0%BB%D0%B0%D1%82%D0%B0%20%D0%B0%D1%80%D0%B5%D0%BD%D0%B4%D1%8B)

- USD payment:
  - [Open USD payment](https://pandapay24.com/qr?amount=100&currency=USD&recipient=John%20Doe&bank=Chase&account=111122223333&purpose=Service%20payment)

- Payment without currency (defaults to RUB):
  - [Open default-currency payment](https://pandapay24.com/qr?amount=500&recipient=%D0%A1%D0%B8%D0%B4%D0%BE%D1%80%D0%BE%D0%B2%20%D0%A1.%D0%A1.&bank=Alfa&account=555566667777)

### How to use

- On a phone browser:
  - Open your browser (Chrome, Safari, etc.)
  - Enter one of the URLs above
  - Tap Go; the app will open automatically with pre-filled data

- On a desktop browser:
  - Paste one of the URLs into the address bar and press Enter
  - If the app is installed on your device, a chooser dialog may appear
  - Select the app to open

### What happens

- The browser attempts to open the URL
- Android resolves an app via an intent filter for the URL
- The app opens the QR payment screen
- All fields are filled from the URL parameters

### Development (local testing)

Use `adb` to trigger the intent on a connected Android device or emulator:

```bash
adb shell am start -a android.intent.action.VIEW -d "https://pandapay24.com/qr?amount=1000&currency=RUB&recipient=Test&bank=Sber&account=1234567890"
```

### Notes

- Required parameters: `amount`, `recipient`, `bank`, `account`
- URL must start with: `https://pandapay24.com/qr?`
- Parameters are separated by `&`
- Cyrillic characters will be URL-encoded automatically by the browser
