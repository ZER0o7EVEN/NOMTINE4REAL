# NOTMINE4REAL - Modernized Frontend

A modern, professional gaming platform built with React, featuring user profiles, ranking systems, virtual shops, and role-based permissions.

## 🚀 Features

### ✨ User Profiles
- Rich profile customization with 20+ options
- Status messages and bio
- Avatar frames and badges
- Custom themes and colors
- Profile layouts (vertical, horizontal, minimal)
- Achievement display
- XP/Level tracking

### 🏆 Ranking System
- 6 tiers: Bronze → Legend
- XP-based progression
- Daily login bonuses
- Activity-based rewards
- Clear progression path

### 🛒 Virtual Shop
- 6 cosmetic items
- Coin currency system
- Purchase tracking
- Future expansion ready
- Purchasable items:
  - Premium Badge
  - Gold Frame
  - Theme Bundle
  - Custom Title
  - Particle Effect
  - Glow Aura

### 👥 Role Management
- **Owner** (username "Owner"): Highest authority
- **Admin**: Community management
- **User**: Regular members
- Role-based badges and permissions

### 🎨 Customization Options (20+)
1. Bio (200 chars)
2. Status Message (50 chars)
3. Profile Color
4. Background Color
5. Avatar Frame (5 options)
6. Badge (6 options)
7. Theme (6 presets)
8. Custom Title (30 chars)
9. Profile Layout (3 options)
10. Display Rank (toggle)
11. Show Followers (toggle)
12. Show Status (toggle)
13. Allow Messages (toggle)
14. Show XP Progress (toggle)
15. Show Achievements (toggle)
16. Header Image
17. Accent Color
18. Font Size
19. And more...

## 📦 Tech Stack

- **React 18** - UI Framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Zustand** - State management
- **Lucide React** - Icons
- **Firebase** - Backend ready

## 🏗️ Project Structure

```
src/
├── components/
│   ├── Header.jsx
│   ├── LoginPage.jsx
│   ├── HomePage.jsx
│   ├── ProfilePage.jsx
│   ├── ProfileSettingsPage.jsx
│   ├── ProfilesPage.jsx
│   ├── ShopPage.jsx
│   └── RanksPage.jsx
├── stores/
│   └── appStore.js
├── App.jsx
├── main.jsx
└── index.css
```

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ (for future use)
- npm or yarn

### Installation (for future reference)

```bash
npm install
npm run dev
```

## 📝 Demo Accounts

- **Owner** - Full admin privileges
- **Player1** - Regular user
- **Gamer123** - Regular user
- **ProPlayer** - Regular user

## 🎮 Demo Features

### Login System
- Quick login with demo accounts
- Custom username support
- Auto-generated user profiles

### Profile System
- View and customize user profiles
- 20+ customization options
- Profile preview
- Achievement display

### Ranking System
- 6 tier ranks with XP requirements
- Progress tracking
- Daily bonuses
- Milestone rewards

### Virtual Shop
- 6 cosmetic items
- Coin-based currency
- Purchase tracking
- Item inventory

### Community Features
- Discover other players
- Search and filter profiles
- Sort by followers, level, or activity
- View player statistics

## 🔐 Security

### Role-Based Access Control
- Owner role for platform administrators
- Admin role for community moderators
- User role for regular members
- Future: Firebase authentication integration

## 🎯 Future Enhancements

- Firebase database integration
- Real-time notifications
- Direct messaging system
- Game library integration
- Leaderboards
- Social media sharing
- Mobile app version
- Dark/Light theme toggle
- Localization support

## 🛠️ Configuration

### Customizable Settings
- Avatar frame styles
- Badge options
- Theme presets
- Profile layouts
- Rank requirements
- Shop items and prices

## 📊 Data Structure

### User Profile
```javascript
{
  id: string,
  username: string,
  bio: string,
  status: string,
  theme: string,
  profileColor: string,
  badges: array,
  followers: number,
  level: number,
  xp: number,
  // ... 20+ more options
}
```

### Rank
```javascript
{
  id: number,
  name: string,
  minXP: number,
  color: string,
}
```

### Shop Item
```javascript
{
  id: number,
  name: string,
  price: number,
  type: string,
  description: string,
}
```

## 🎨 Design Principles

- **Clean**: Minimalist interface with purpose
- **Professional**: Modern aesthetics
- **Engaging**: Smooth animations and transitions
- **Accessible**: Clear visual hierarchy
- **Responsive**: Works on all devices

## 💡 Usage Tips

1. **Customization**: Visit Profile Settings to customize your profile
2. **Shopping**: Browse the Shop to purchase cosmetics
3. **Ranking**: Check the Ranks page to see progression requirements
4. **Community**: Visit Profiles to discover and follow other players
5. **Profile**: View your profile to see all customizations

## 📈 Metrics

- 1,234+ active players
- 6 shop items available
- 6 rank tiers
- 20+ customization options
- Multiple badge types
- Theme variety

## 🤝 Contributing

This is a demo platform built as a proof of concept. For production use, additional features and security measures would be needed.

## 📄 License

© 2024 NOTMINE4REAL. All rights reserved.

## 🙋 Support

For issues or suggestions, please refer to the project documentation.
