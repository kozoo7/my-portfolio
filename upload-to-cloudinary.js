require('dotenv').config();
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Directory containing your videos
const videoDir = './projects/motion-infographic/videos';

// Function to upload a single video
async function uploadVideo(filePath) {
    try {
        const fileName = path.basename(filePath, path.extname(filePath));
        console.log(`Uploading ${fileName}...`);
        
        // Upload the video
        const result = await cloudinary.uploader.upload(filePath, {
            resource_type: "video",
            public_id: `motion-infographic/${fileName}`,
            chunk_size: 6000000,
            eager: [
                // Generate a thumbnail
                { format: 'jpg', transformation: [
                    { width: 800, crop: 'scale' },
                    { quality: 'auto', fetch_format: 'auto' }
                ]}
            ],
            eager_async: true
        });

        console.log(`Successfully uploaded ${fileName}`);
        console.log(`Video URL: ${result.secure_url}`);
        console.log(`Thumbnail URL: ${result.eager[0].secure_url}`);
        return result;
    } catch (error) {
        console.error(`Error uploading ${filePath}:`, error);
    }
}

// Function to upload all videos in the directory
async function uploadAllVideos() {
    try {
        const files = fs.readdirSync(videoDir);
        const videoFiles = files.filter(file => 
            ['.mp4', '.mov', '.avi', '.webm'].includes(path.extname(file).toLowerCase())
        );

        console.log(`Found ${videoFiles.length} videos to upload`);

        for (const file of videoFiles) {
            const filePath = path.join(videoDir, file);
            await uploadVideo(filePath);
        }

        console.log('All videos uploaded successfully!');
    } catch (error) {
        console.error('Error reading directory:', error);
    }
}

// Create .env file if it doesn't exist
if (!fs.existsSync('.env')) {
    const envContent = `CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret`;
    fs.writeFileSync('.env', envContent);
    console.log('Created .env file. Please fill in your Cloudinary credentials.');
    process.exit(1);
}

// Run the upload
uploadAllVideos(); 