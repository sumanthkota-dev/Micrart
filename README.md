
# Micrart

![Micrart](./assets/logo.png) <!-- Optional: replace with your logo path -->

> Modern web platform for showcasing artwork, publishing blog posts, and building a creative community.

---

## Table of Contents

- [Description](#description)  
- [Features](#features)  
- [Demo](#demo)  
- [Installation](#installation)  
- [Environment Variables](#environment-variables)  
- [Usage](#usage)  
- [Project Structure (example)](#project-structure-example)  
- [Technologies Used](#technologies-used)  
- [Contributing](#contributing)  
- [Code of Conduct](#code-of-conduct)  
- [License](#license)  
- [Contact](#contact)  

---

## Description

Micrart is a full-featured platform for artists and art lovers. It provides tools to upload and manage artworks, publish blog posts, and let visitors leave reviews. It's designed with responsive modern UI patterns and an admin dashboard for content management.

---

## Features

- Artist/Admin dashboard for uploading and managing artworks  
- Blog creation and management (with images)  
- Image upload + in-browser crop & preview flow  
- Public reviews (can be left without logging in)  
- Responsive layout for mobile & desktop  
- Basic authentication for admin routes  
- Easy-to-deploy (Vercel, Netlify, or custom host)

---

## Demo

> Live demo: _(Add your deployed URL here, e.g. https://micrart.example.com)_

---

## Installation

> These instructions assume a Next.js/React frontend project. Adjust to your stack if different.

1. **Clone the repo**

```bash
git clone https://github.com/sumanthkota-dev/Micrart.git
cd Micrart
```

2. **Install dependencies**

Using npm:

```bash
npm install
```

Or yarn:

```bash
yarn install
```

3. **Create environment file**

Create a `.env.local` file in the project root (see [Environment Variables](#environment-variables) below).

4. **Run dev server**

```bash
npm run dev
# or
yarn dev
```

Open `http://localhost:3000` in your browser.

---

## Environment Variables

Create `.env.local` and add values for your services. Example:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key      # optional, backend-only
NEXTAUTH_URL=http://localhost:3000                   # if using NextAuth
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080       # if using a separate API
```

> **Security note:** Never commit secrets to Git. Use `.gitignore` to keep `.env.local` out of version control.

---

## Usage

### Common scripts

```bash
# Run development server
npm run dev
# Build for production
npm run build
# Start production server
npm start
# Lint
npm run lint
# Format (if using prettier)
npm run format
```

### Admin / Content flow (example)

1. Visit `/admin` and sign in with admin credentials.
2. Navigate to dashboard → Upload Artwork.
3. Crop and preview uploaded images, then publish.
4. Create blog posts via admin → Blogs → New Post.

### Build & deploy to Vercel (example)

- Connect the GitHub repo to Vercel.
- Set environment variables in Vercel dashboard.
- Deploy — Vercel will run `npm run build` automatically.

---

## Project Structure (example)

```
/micrart
├─ /public
│  └─ /assets
├─ /src
│  ├─ /components
│  ├─ /pages
│  ├─ /lib
│  └─ /styles
├─ .env.local
├─ next.config.js
├─ package.json
└─ README.md
```

Adjust to match your repo structure.

---

## Technologies Used

- **Frontend:** React, Next.js  
- **Styling:** Tailwind CSS (or your preferred CSS framework), Material 3-inspired UI patterns  
- **Auth / Backend-as-a-Service:** Supabase (Auth, Database, Storage)  
- **Image Crop:** `react-easy-crop`  
- **Notifications:** `react-hot-toast`  
- **Deployment:** Vercel / Netlify / GitHub Pages / Custom server  
- Developer tooling: ESLint, Prettier, Husky (optional)

---

## Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository.  
2. Create a feature branch:

```bash
git checkout -b feature/your-feature-name
```

3. Make changes in your branch and commit with clear messages:

```bash
git add .
git commit -m "feat: add awesome feature"
```

4. Push to your fork:

```bash
git push origin feature/your-feature-name
```

5. Open a Pull Request describing your changes and why they are useful.

### Guidelines

- Keep commits atomic and descriptive.  
- Follow the project's code style (run `npm run lint` / `npm run format`).  
- Add unit or integration tests where applicable.  
- If the change is large, open an issue first to discuss the design.  
- Be respectful and follow the code of conduct.

---

## Code of Conduct

By contributing to Micrart, you agree to abide by the project's Code of Conduct. Be respectful, constructive, and professional in all interactions.

---

## License

This project is licensed under the **MIT License**. See the `LICENSE` file for details.

```
MIT License
Copyright (c) 2025 Sumanth Kota
```

Replace the year and owner as appropriate.

---

## Contact

If you have questions, ideas, or need help:

- **Author / Maintainer:** Sumanth Kota  
- **GitHub:** https://github.com/sumanthkota-dev  
- **Email:** your-email@example.com

---

## Screenshots (optional)

Add screenshots in `assets/` and reference them in this README:

![Dashboard screenshot](./assets/dashboard.png)  
![Artwork upload flow](./assets/upload-crop.png)

---

## Extras (optional)

- Add CI workflows (`.github/workflows/ci.yml`) for lint/test/build.  
- Add PR templates and issue templates for contributors.  
- Add a `CONTRIBUTING.md` file and expand contributing guidelines.

---

**Thank you for using Micrart — happy building!**
