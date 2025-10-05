# Taswaq - Single Page E-Commerce Application

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/HTML5)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

> A modern, fully functional single-page e-commerce web application built with vanilla web technologies. Experience seamless online shopping with user authentication, dynamic product filtering, and real-time cart management - all in one HTML file.

## 🚀 Live Demo

[View Live Demo](https://3laaerfan.github.io/Taswaq/) | [Report Bug](https://github.com/3laaerfan/Taswaq/issues) | [Request Feature](https://github.com/3laaerfan/Taswaq/issues)

## 📸 Screenshots

![Homepage Desktop](imgs/Taswaq%20Screenshot.png)

## ✨ Features

### 🔐 Authentication System

- **User Registration**: Secure account creation with form validation
- **Login/Logout**: Persistent user sessions using localStorage
- **Form Validation**: Real-time input validation with error messaging

### 🛍️ Shopping Experience

- **Product Catalog**: Dynamic product display with detailed information
- **Advanced Filtering**: Filter by category, price range, and size
- **Shopping Cart**: Real-time cart updates with quantity management
- **Checkout Process**: Streamlined purchase flow with order confirmation

### 📱 Design & UX

- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Single Page Application**: Smooth navigation without page reloads
- **Modal Windows**: Enhanced user interaction with product details and confirmations
- **Real-time Updates**: Instant feedback for all user actions

### 💾 Data Management

- **Local Storage**: All user data and cart items persist across sessions
- **Session Management**: Automatic login state preservation
- **Data Validation**: Robust client-side data validation and sanitization

## 🏗️ Application Structure

### Navigation Sections

1. **🔑 Authentication** - User login and registration forms
2. **🏠 Home** - Product catalog with filtering and search capabilities
3. **🛒 Cart** - Shopping cart management and checkout process
4. **📞 Contact** - Contact form with modal confirmation system

### File Organization

```
Taswaq/
├── index.html              # Main application file
├── README.md              # Project documentation
├── css/
│   └── style.css         # Application styles
├── js/
│   └── app.js           # Application logic
└── imgs/                # Product images
    ├── Casual T-Shirt.avif
    ├── Denim Jacket.jpg
    ├── Designer Sunglasses.avif
    ├── Fitness Tracker.avif
    ├── Leather Wallet.avif
    ├── Running Shoes.avif
    ├── Smart Watch Series 5.avif
    ├── upwork.png
    └── Wireless Headphones.avif
    └── Taswaq Screenshot.png

```

## 🛠️ Technologies Used

| Technology            | Purpose                             | Version |
| --------------------- | ----------------------------------- | ------- |
| **HTML5**             | Structure and semantic markup       | Latest  |
| **CSS3**              | Styling and responsive design       | Latest  |
| **JavaScript (ES6+)** | Application logic and interactivity | ES2020+ |
| **Bootstrap**         | UI components and grid system       | 5.x     |
| **LocalStorage API**  | Client-side data persistence        | Native  |

## 🚀 Getting Started

### Prerequisites

- Modern web browser with JavaScript enabled
- No server or installation required!

### Quick Start

1. **Clone the repository**

   ```bash
   git clone https://github.com/3laaerfan/taswaq.git
   cd taswaq
   ```

2. **Launch the application**

   ```bash
   # Simply open the file in your browser
   open index.html
   # OR
   # Use a local server (recommended)
   python -m http.server 8000
   # Then visit http://localhost:8000
   ```

3. **Start shopping!**
   - Register a new account or use the demo credentials
   - Browse products and add items to your cart
   - Complete the checkout process

## 📖 Usage Guide

### User Registration & Login

1. Click on the "Register" button to create a new account
2. Fill in your name, email, and secure password
3. Login with your credentials to access the full shopping experience

### Shopping Workflow

1. **Browse Products**: View all available products on the home page
2. **Filter & Search**: Use category, price, and size filters to find specific items
3. **Add to Cart**: Click "Add to Cart" on any product
4. **Manage Cart**: Adjust quantities or remove items in the cart section
5. **Checkout**: Complete your purchase with the checkout flow

### Key Interactions

- **Product Details**: Click on product images or titles for detailed information
- **Real-time Cart**: Cart icon shows live item count and total
- **Responsive Navigation**: Menu adapts to screen size automatically

## 🌐 Browser Compatibility

| Browser | Version | Status             |
| ------- | ------- | ------------------ |
| Chrome  | 90+     | ✅ Fully Supported |
| Firefox | 88+     | ✅ Fully Supported |
| Safari  | 14+     | ✅ Fully Supported |
| Edge    | 90+     | ✅ Fully Supported |

### Requirements

- HTML5 support
- CSS3 features (Flexbox, Grid)
- ES6+ JavaScript (Arrow functions, Classes, Modules)
- LocalStorage API

## 🎯 Key Features Demonstration

### Authentication System

- Form validation with real-time feedback
- Secure password requirements
- Session persistence across browser sessions

### Product Management

- Dynamic product rendering from JavaScript objects
- Multi-criteria filtering system
- Responsive product grid layout

### Shopping Cart

- Real-time quantity updates
- Automatic total calculations
- Persistent cart state

## 🔧 Configuration

### Customizing Products

Edit the products array in `js/app.js`:

```javascript
const products = [
  {
    id: 1,
    name: "Product Name",
    price: 99.99,
    category: "category",
    image: "imgs/product-image.jpg",
    sizes: ["S", "M", "L"],
    description: "Product description",
  },
  // Add more products...
];
```

### Styling Customization

Modify `css/style.css` to change:

- Color scheme
- Typography
- Layout spacing
- Responsive breakpoints

## 🚧 Known Limitations

- **Demo Purpose**: No real payment processing
- **Local Storage**: Data limited to single browser/device
- **No Backend**: All data stored client-side only
- **Image Loading**: Requires local image files

## 🛣️ Roadmap

### Phase 1: Enhanced Features

- [ ] Product search functionality with auto-complete
- [ ] User profile management and settings
- [ ] Order history and tracking
- [ ] Wishlist and favorites system

### Phase 2: Advanced Functionality

- [ ] Product reviews and ratings
- [ ] Image gallery for products
- [ ] Price comparison and deals
- [ ] Social sharing capabilities

### Phase 3: Technical Improvements

- [ ] Progressive Web App (PWA) features
- [ ] Offline functionality
- [ ] Performance optimizations
- [ ] Enhanced accessibility features

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 👨‍💻 Author

**Your Name**

- GitHub: [@3laaerfan](https://github.com/3laaerfan)
- LinkedIn: [Alaa Erfan](https://www.linkedin.com/in/alaa-erfan/)

## 🙏 Acknowledgments

- Icons provided by [Font Awesome](https://fontawesome.com/)
- Styling framework: [Bootstrap](https://getbootstrap.com/)
- Images: [Your image source/credits]
- Inspiration from modern e-commerce platforms

## 📞 Support

If you have any questions or need support, please:

- Open an [issue](https://github.com/3laaerfan/Taswaq/issues)

---

<div align="center">
  <p>Made with ❤️ by Alaa Erfan</p>
  <p>⭐ Star this repository if you found it helpful!</p>
</div>
