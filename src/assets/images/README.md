# Image Assets

This directory contains all the image assets for the LearnHub Pro dashboard.

## Required Images:

### User Avatars:
- `user-avatar.png` - Default user profile picture
- `default-avatar.png` - Fallback avatar

### Provider Logos:
- `google-logo.png` - Google logo
- `linkedin-logo.png` - LinkedIn Learning logo
- `ibm-logo.png` - IBM logo
- `stanford-logo.png` - Stanford Online logo
- `aws-logo.png` - Amazon Web Services logo
- `cisco-logo.png` - Cisco logo
- `adobe-logo.png` - Adobe logo

### Course Thumbnails:
- `course-1.jpg` to `course-10.jpg` - Course thumbnail images

## Image Specifications:

### Course Thumbnails:
- Dimensions: 380x200px
- Format: JPG
- Size: < 100KB each

### Provider Logos:
- Dimensions: 40x40px
- Format: PNG with transparency
- Size: < 20KB each

### User Avatars:
- Dimensions: 100x100px
- Format: PNG
- Size: < 50KB each

## Usage:

All images are referenced in the services with paths like `/assets/images/filename.ext`.

You can replace these placeholder references with actual image files by adding them to this directory.

## Fallbacks:

The application includes fallback logic for missing images:
- User avatars fall back to `default-avatar.png`
- Course thumbnails have alt text for accessibility
- Provider logos have fallback to company names
