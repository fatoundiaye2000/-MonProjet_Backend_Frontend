#!/usr/bin/env node
// Script pour uploader les images locales vers Cloudinary

const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

// Configuration Cloudinary
cloudinary.config({
  cloud_name: 'dgr0kva7h',
  api_key: '742628142121922',
  api_secret: 'hV9eEW1KkpoFe0FlogJ0SHHM11Q'
});

const imagesDir = path.join(__dirname, 'backend', 'uploads', 'images');
const imagesToUpload = [
  'event_1767731725433_f04f6f9c.jpg',
  'event_1767732256076_7594c16a.jpg',
  'event_1767732304324_ee1f3d49.jpg',
  'event_1767732541267_a1d12c20.png',
  'event_1767732568405_8b853f8f.jpg'
];

async function uploadImages() {
  console.log('🚀 Démarrage upload images vers Cloudinary...\n');
  
  const uploadedFiles = [];
  
  for (const filename of imagesToUpload) {
    const filePath = path.join(imagesDir, filename);
    
    if (!fs.existsSync(filePath)) {
      console.log(`❌ Fichier non trouvé: ${filename}`);
      continue;
    }
    
    try {
      console.log(`📤 Upload: ${filename}...`);
      
      const result = await cloudinary.uploader.upload(filePath, {
        folder: 'evenix/images',
        resource_type: 'auto',
        overwrite: false
      });
      
      uploadedFiles.push({
        localName: filename,
        cloudinaryName: result.public_id,
        url: result.secure_url
      });
      
      console.log(`✅ Succès: ${result.public_id}`);
      console.log(`   URL: ${result.secure_url}\n`);
      
    } catch (error) {
      console.error(`❌ Erreur upload: ${filename}`);
      console.error(`   ${error.message}\n`);
    }
  }
  
  console.log('\n=== RÉSUMÉ ===');
  console.log(`✅ ${uploadedFiles.length} fichier(s) uploadé(s)`);
  console.log('\nImages uploadées:');
  uploadedFiles.forEach((file, i) => {
    console.log(`${i+1}. ${file.cloudinaryName}`);
    console.log(`   📍 ${file.url}`);
  });
  
  // Sauvegarder dans un fichier pour référence
  fs.writeFileSync(
    path.join(__dirname, 'cloudinary-images.json'),
    JSON.stringify(uploadedFiles, null, 2)
  );
  
  console.log('\n✅ Résumé sauvegardé dans cloudinary-images.json');
}

uploadImages().catch(err => {
  console.error('❌ Erreur générale:', err);
  process.exit(1);
});
