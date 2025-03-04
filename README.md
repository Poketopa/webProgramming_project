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
├── 📂 web3_wallet # Web3 wallet integration  
│ ├── 📄 connectWallet.js  
│ ├── 📄 web3Test.html  
│  
├── 📄 index.html # Main entry point of the project

---

## Page Descriptions

### 1. **Main Page (`index.html`)**

- Displays a list of cryptocurrencies and their real-time prices.
- Clicking on a coin redirects to its detail page.

### 2. **Coin Details Page (`coin-details.html`)**

- Shows the price chart and detailed information about a selected coin.

### 3. **Community Board (`board.html`)**

- Users can create, view, edit, and delete posts.

### 4. **Post Creation Page (`write-post.html`)**

- Users can create new posts and submit them to the database.

### 5. **Post Viewing Page (`view-post.html`)**

- Displays details of a specific post.

### 6. **Kakao Login (`kakao-login.html`)**

- Provides user authentication via Kakao.

### 7. **My Wallet (`my-wallet.html`)**

- Allows users to connect their MetaMask wallet and perform transactions.

### 8. **Etherscan (`etherscan.html`)**

- Displays Ethereum-based transaction history.

### 9. **Deposit Page (`deposit.html`)**

- Allows users to deposit cryptocurrency.

---

**Note:** API key-related code is commented out for security reasons. The provided code is incomplete and requires a valid API key to function properly.
