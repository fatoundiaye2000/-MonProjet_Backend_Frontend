package com.example.demo.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@Service
public class CloudinaryService {

    private final Cloudinary cloudinary;

    public CloudinaryService(
            @Value("${cloudinary.api-key}") String apiKey,
            @Value("${cloudinary.api-secret}") String apiSecret,
            @Value("${cloudinary.cloud-name}") String cloudName) {
        
        Map<String, String> config = new HashMap<>();
        config.put("cloud_name", cloudName);
        config.put("api_key", apiKey);
        config.put("api_secret", apiSecret);
        
        this.cloudinary = new Cloudinary(config);
        System.out.println("✅ Cloudinary initialisé pour: " + cloudName);
    }

    /**
     * Uploader un fichier vers Cloudinary
     */
    public Map<String, Object> uploadFile(MultipartFile file) throws IOException {
        System.out.println("📤 Upload vers Cloudinary: " + file.getOriginalFilename());
        
        try {
            Map<String, Object> uploadParams = ObjectUtils.asMap(
                "folder", "evenix/images",
                "resource_type", "auto",
                "overwrite", false
            );
            
            Map<String, Object> uploadResult = cloudinary.uploader().upload(file.getBytes(), uploadParams);
            
            System.out.println("✅ Upload Cloudinary réussi!");
            System.out.println("   URL: " + uploadResult.get("secure_url"));
            
            return uploadResult;
            
        } catch (IOException e) {
            System.err.println("❌ Erreur upload Cloudinary: " + e.getMessage());
            throw e;
        }
    }

    /**
     * Supprimer un fichier de Cloudinary
     */
    public void deleteFile(String publicId) throws Exception {
        System.out.println("🗑️ Suppression Cloudinary: " + publicId);
        
        try {
            cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
            System.out.println("✅ Fichier supprimé de Cloudinary");
        } catch (Exception e) {
            System.err.println("❌ Erreur suppression Cloudinary: " + e.getMessage());
            throw e;
        }
    }
}
