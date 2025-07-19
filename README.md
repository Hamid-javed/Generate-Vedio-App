# Santa Video Creator Backend

A comprehensive Node.js backend for creating personalized Santa videos, inspired by Mesaj Mos Craciun.

## Features

- 🎬 **Video Template Selection** - 3 pre-defined Santa video templates
- 🎤 **Voice Synthesis** - ElevenLabs integration for personalized voiceovers
- 📸 **Photo Upload & Editing** - Support for 1-4 photos with crop/zoom functionality
- 📄 **Santa Letter Upload** - Optional PDF/image letter upload
- 📝 **Custom Script Selection** - Predefined dialogue segments
- 💳 **Payment Processing** - Stripe integration
- 🎥 **Video Generation** - FFmpeg-powered video compilation
- 📧 **Email Notifications** - Automated delivery notifications

## Quick Start

1. **Install Dependencies**
\`\`\`bash
npm install
\`\`\`

2. **Setup Environment**
\`\`\`bash
cp .env.example .env
# Edit .env with your API keys
\`\`\`

3. **Create Directories**
\`\`\`bash
node scripts/setup-directories.js
\`\`\`

4. **Start Server**
\`\`\`bash
npm run dev
\`\`\`

## API Endpoints

### Templates
- `GET /api/templates` - Get all video templates
- `GET /api/templates/:id` - Get specific template

### Voice Synthesis
- `POST /api/voice/preview` - Generate name preview
- `POST /api/voice/generate` - Generate full voiceover

### File Upload
- `POST /api/upload/photos` - Upload child photos
- `POST /api/upload/letter` - Upload Santa letter
- `POST /api/upload/photos/:id/edit` - Edit photo

### Scripts
- `GET /api/scripts/segments` - Get script segments
- `GET /api/scripts/goodbye` - Get goodbye messages
- `POST /api/scripts/create` - Create custom script

### Payment
- `POST /api/payment/create-intent` - Create payment intent
- `POST /api/payment/webhook` - Stripe webhook
- `GET /api/payment/status/:id` - Check payment status

### Video Generation
- `GET /api/video/status/:orderId` - Get generation status
- `GET /api/video/download/:orderId` - Download video
- `POST /api/video/regenerate/:orderId` - Regenerate video

## Environment Variables

\`\`\`env
# Required
ELEVENLABS_API_KEY=your_api_key
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Email
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# Optional
AWS_ACCESS_KEY_ID=for_s3_storage
AWS_SECRET_ACCESS_KEY=for_s3_storage
\`\`\`

## Video Processing Pipeline

1. **Payment Confirmation** triggers video generation
2. **Template Loading** - Load selected video clips
3. **Audio Processing** - Add personalized voiceover
4. **Photo Compositing** - Insert photos into green screen segments
5. **Text Overlays** - Add child's name as text
6. **Final Compilation** - Stitch everything together
7. **Email Delivery** - Send download link

## File Structure

\`\`\`
├── routes/          # API route handlers
├── services/        # Business logic services
├── uploads/         # User uploaded files
├── assets/          # Video templates and clips
├── data/           # JSON data files
└── scripts/        # Utility scripts
\`\`\`

## Dependencies

- **Express** - Web framework
- **FFmpeg** - Video processing
- **Sharp** - Image processing
- **ElevenLabs** - Voice synthesis
- **Stripe** - Payment processing
- **Nodemailer** - Email delivery
- **Multer** - File uploads

## Production Deployment

1. Install FFmpeg on server
2. Configure cloud storage (S3)
3. Set up proper SMTP service
4. Configure Stripe webhooks
5. Set production environment variables

## Support

For issues or questions, please check the documentation or contact support.
