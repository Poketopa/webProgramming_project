# Cryptocurrency Web Project

## Overview

This project is a **cryptocurrency-related website** that provides real-time coin information, a community board, and wallet integration for crypto transactions.

## Features

- **Main Page**: Displays a list of cryptocurrencies with real-time chart updates.
- **Coin Details Page**: Provides detailed price changes and information for selected coins.
- **Community Board**: Allows users to post, edit, and delete their own posts.
- **Kakao Login**: Enables users to log in with Kakao.
- **My Wallet**: Allows users to connect a MetaMask wallet and send cryptocurrency.

---

## Project Structure

📂 Crypto_Web_Project  
├── 📂 coinImage # Cryptocurrency and exchange logos  
│ ├── 🖼️ binance.png  
│ ├── 🖼️ bitget.png  
│ ├── 🖼️ bithumb.png  
│ ├── 🖼️ bnb.png  
│ ├── 🖼️ btc.png  
│ ├── 🖼️ bybit.png  
│ ├── 🖼️ doge.png  
│ ├── 🖼️ eth.png  
│ ├── 🖼️ etherscan.jpg  
│ ├── 🖼️ okx.png  
│ ├── 🖼️ sol.png  
│ ├── 🖼️ tron.png  
│ ├── 🖼️ upbit.png  
│ ├── 🖼️ usdc.png  
│ ├── 🖼️ usdt.png  
│ ├── 🖼️ xrp.png  
│  
├── 📂 css # Stylesheets for different pages  
│ ├── 🎨 base.css  
│ ├── 🎨 board.css  
│ ├── 🎨 coininfo.css  
│ ├── 🎨 deposit.css  
│ ├── 🎨 etherscan.css  
│ ├── 🎨 kakao-login.css  
│ ├── 🎨 my-wallet.css  
│ ├── 🎨 styles.css  
│ ├── 🎨 view-post.css  
│ ├── 🎨 writePost.css  
│  
├── 📂 html # HTML pages for different sections  
│ ├── 📄 board.html  
│ ├── 📄 coin-details.html  
│ ├── 📄 deposit.html  
│ ├── 📄 etherscan.html  
│ ├── 📄 home.html  
│ ├── 📄 kakao-login.html  
│ ├── 📄 my-wallet.html  
│ ├── 📄 view-post.html  
│ ├── 📄 write-post.html  
│  
├── 📂 img # Additional images used in the project  
│ ├── 🖼️ kakao.png  
│ ├── 🖼️ kakaoLogin.png  
│ ├── 🖼️ logo.jpg  
│  
├── 📂 js # JavaScript files for project functionality  
│ ├── 📜 board.js  
│ ├── 📜 chart.js  
│ ├── 📜 coin-detail.js  
│ ├── 📜 common.js  
│ ├── 📜 main.js  
│ ├── 📜 my-wallet.js  
│ ├── 📜 postDetail.js  
│ ├── 📜 view-post.js  
│ ├── 📜 writePost.js   
│  
├── 📄 index.html # Main entry point of the project

---

## Page Descriptions

### 0. **Intro Page (`intro.html`)**

<img src="https://github.com/user-attachments/assets/09e38c56-7d71-49b8-a2ce-a377d1130388" width="800">

### 1. **Main Page (`index.html`)**

- Displays a list of cryptocurrencies and their real-time prices.
- Clicking on a coin redirects to its detail page.

  <img src="https://github.com/user-attachments/assets/a37374bd-0dd1-43a7-85e3-01b3125d5a20" width="800">

### 2. **Coin Details Page (`coin-details.html`)**

- Shows the price chart and detailed information about a selected coin.

  <img src="https://github.com/user-attachments/assets/e6d574dc-4065-43a3-b4b0-3dcc08c6fc5b" width="800">

### 3. **Community Board (`board.html`)**

- Users can create, view, edit, and delete posts.

  <img src="https://github.com/user-attachments/assets/ddac01c0-a774-44ee-804d-d52a991660aa" width="800">

### 4. **Post Creation Page (`write-post.html`)**

- Users can create new posts and submit them to the database.

  <img src="https://github.com/user-attachments/assets/6e84d2c1-0a1b-48a7-bc69-dce053da2890" width="800">

### 5. **Post Viewing Page (`view-post.html`)**

- Displays details of a specific post.

  <img src="https://github.com/user-attachments/assets/3b620a97-1230-4cba-915f-b377dc630368" width="800">

### 6. **Kakao Login (`kakao-login.html`)**

- Provides user authentication via Kakao.

  <img src="https://github.com/user-attachments/assets/73af5038-54d6-401f-9c08-294cb5c2b788" width="800">

### 7. **My Wallet (`my-wallet.html`)**

- Allows users to connect their MetaMask wallet and perform transactions.

  <img src="https://github.com/user-attachments/assets/81459196-60cb-445e-a7f9-3cecd3063104" width="800">

### 8. **Etherscan (`etherscan.html`)**

- Displays Ethereum-based transaction history.

  <img src="https://github.com/user-attachments/assets/7e89fdfa-fc9e-4c92-ac48-03c39854ad33" width="800">

### 9. **Deposit Page (`deposit.html`)**

- Allows users to deposit cryptocurrency.

  <img src="https://github.com/user-attachments/assets/c0742b69-8435-4cc0-98f0-f12fb0a63c7e" width="800">

---

**Note:** API key-related code is commented out for security reasons. The provided code is incomplete and requires a valid API key to function properly.
