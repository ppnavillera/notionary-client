# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Notionary is a Chrome extension that helps users look up English word definitions and save them to Notion. The extension integrates with Supabase for authentication and uses Gemini API for word definitions.

## Development Commands

- `npm run dev` - Start Vite development server
- `npm run build` - Build for production (TypeScript compilation + Vite build)
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## Architecture Overview

### Extension Structure
This is a Chrome MV3 extension with multiple entry points:
- **Popup** (`src/App.tsx`) - Main React UI shown when extension icon is clicked
- **Background Script** (`src/background.ts`) - Service worker handling authentication flow and popup management
- **Content Script** (`src/content.ts`) - Injected into web pages to communicate with the main application

### Key Components

#### Authentication Flow
- Uses Supabase Auth with Google OAuth
- Extension redirects to `localhost:3000` for login
- Content script captures auth success and passes session to background script
- Session stored in `chrome.storage.local`
- Two-step verification: user login + Notion setup completion

#### State Management
- Extension uses Chrome storage API for persistence
- Key storage items: `session` (auth data), `notionSetup` (boolean flag)
- Background script manages popup activation based on auth/setup state

#### Build Configuration
- Vite configured for multi-entry build (popup, background, content)
- TypeScript with React/SWC for fast refresh
- Output files: `background.js`, `content.js`, `assets/[name].js`

### File Structure
- `src/App.tsx` - Main popup interface with word search and definition display
- `src/background.ts` - Chrome extension background service worker
- `src/content.ts` - Content script for cross-origin message handling  
- `src/api.ts` - API functions for Gemini word lookup and Notion saving
- `src/interface.ts` - TypeScript interfaces (Result type)
- `src/supabaseClient.ts` - Supabase client configuration
- `public/manifest.json` - Chrome extension manifest (MV3)

### API Integration
- **Gemini API**: Word definition lookup via Supabase Edge Functions
- **Notion API**: Save definitions to user's Notion database
- **Supabase**: Authentication and session management

### Extension Permissions
Requires: `scripting`, `activeTab`, `contextMenus`, `identity`, `storage`, `tabs`
Host permissions: `http://*/*`, `https://*/*`, `http://localhost:*/*`