package com.example.demo.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.dto.EvenementDTO;
import com.example.demo.dto.AdresseDTO;
import com.example.demo.dto.TarifDTO;
import com.example.demo.dto.TypeEventDTO;
import com.example.demo.entities.Evenement;
import com.example.demo.entities.TypeEvent;
import com.example.demo.entities.Adresse;
import com.example.demo.entities.Tarif;
import com.example.demo.repos.EvenementRepository;
import com.example.demo.repos.TypeEventRepository;
import com.example.demo.repos.AdresseRepository;
import com.example.demo.repos.TarifRepository;

@Service
public class EvenementServiceImpl implements EvenementService {

    @Autowired
    private ModelMapper modelMapper;
    
    @Autowired
    private EvenementRepository evenementRepository;
    
    @Autowired
    private TypeEventRepository typeEventRepository;
    
    @Autowired
    private AdresseRepository adresseRepository;
    
    @Autowired
    private TarifRepository tarifRepository;

    @Override
    public Evenement convertDtoToEntity(EvenementDTO evenementDTO) {
        return modelMapper.map(evenementDTO, Evenement.class);
    }

    @Override
    public EvenementDTO convertEntityToDto(Evenement evenement) {
        EvenementDTO dto = modelMapper.map(evenement, EvenementDTO.class);
        
        // L'image est stockée en tant que nom de fichier uniquement
        // Le frontend construira l'URL complète avec uploadService.getImageUrl()
        
        return dto;
    }

    @Override
    public EvenementDTO findById(Long id) {
        System.out.println("🔵 EvenementService.findById(" + id + ")");
        Optional<Evenement> evenementOptional = evenementRepository.findById(id);
        
        if (evenementOptional.isPresent()) {
            EvenementDTO dto = convertEntityToDto(evenementOptional.get());
            System.out.println("✅ Événement trouvé: " + dto.getTitreEvent());
            return dto;
        } else {
            System.err.println("❌ Événement non trouvé avec l'ID: " + id);
            throw new RuntimeException("Événement non trouvé avec l'ID: " + id);
        }
    }

    @Override
    public List<EvenementDTO> findAll() {
        System.out.println("🔵 EvenementService.findAll()");
        List<Evenement> evenements = evenementRepository.findAll();
        System.out.println("✅ " + evenements.size() + " événements trouvés dans la base");
        
        List<EvenementDTO> dtos = evenements.stream()
                .map(this::convertEntityToDto)
                .collect(Collectors.toList());
        
        return dtos;
    }

    @Override
    public EvenementDTO save(EvenementDTO evenementDTO) {
        System.out.println("🔵 EvenementService.save()");
        System.out.println("📝 Titre: " + evenementDTO.getTitreEvent());
        System.out.println("📝 Image: " + evenementDTO.getImage());
        System.out.println("📝 TypeEvent: " + (evenementDTO.getTypeEvent() != null ? "ID=" + evenementDTO.getTypeEvent().getIdTypeEvent() : "null"));
        System.out.println("📝 Adresse: " + (evenementDTO.getAdresse() != null ? evenementDTO.getAdresse().getRue() : "null"));
        System.out.println("📝 Tarif: " + (evenementDTO.getTarif() != null ? evenementDTO.getTarif().getPrix() : "null"));
        
        try {
            // Convertir en entité
            Evenement evenement = modelMapper.map(evenementDTO, Evenement.class);
            
            // Chercher/créer TypeEvent
            if (evenementDTO.getTypeEvent() != null && evenementDTO.getTypeEvent().getIdTypeEvent() != null) {
                TypeEvent typeEvent = typeEventRepository.findById(evenementDTO.getTypeEvent().getIdTypeEvent())
                    .orElseGet(() -> {
                        System.out.println("⚠️  TypeEvent non trouvé, création automatique");
                        TypeEvent newTypeEvent = new TypeEvent();
                        newTypeEvent.setIdTypeEvent(evenementDTO.getTypeEvent().getIdTypeEvent());
                        newTypeEvent.setNomType(evenementDTO.getTypeEvent().getNomType());
                        return typeEventRepository.save(newTypeEvent);
                    });
                evenement.setTypeEvent(typeEvent);
            }
            
            // Chercher/créer Adresse
            if (evenementDTO.getAdresse() != null) {
                Adresse adresse = modelMapper.map(evenementDTO.getAdresse(), Adresse.class);
                if (adresse.getIdAdresse() == null) {
                    adresse = adresseRepository.save(adresse);
                    System.out.println("✅ Nouvelle adresse créée: ID=" + adresse.getIdAdresse());
                }
                evenement.setAdresse(adresse);
            }
            
            // Chercher/créer Tarif
            if (evenementDTO.getTarif() != null) {
                Tarif tarif = modelMapper.map(evenementDTO.getTarif(), Tarif.class);
                if (tarif.getIdTarif() == null) {
                    tarif = tarifRepository.save(tarif);
                    System.out.println("✅ Nouveau tarif créé: ID=" + tarif.getIdTarif());
                }
                evenement.setTarif(tarif);
            }
            
            // Sauvegarder l'événement
            Evenement savedEvenement = evenementRepository.save(evenement);
            
            EvenementDTO savedDto = convertEntityToDto(savedEvenement);
            System.out.println("✅ Événement sauvegardé avec ID: " + savedDto.getIdEvent());
            
            return savedDto;
            
        } catch (Exception e) {
            System.err.println("❌ Erreur save: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Erreur lors de la sauvegarde: " + e.getMessage(), e);
        }
    }

    @Override
    public EvenementDTO update(EvenementDTO evenementDTO) {
        System.out.println("🔵 EvenementService.update()");
        System.out.println("📝 ID: " + evenementDTO.getIdEvent());
        System.out.println("📝 Titre: " + evenementDTO.getTitreEvent());
        System.out.println("📝 Image: " + evenementDTO.getImage());
        
        // Vérifier si l'événement existe
        if (!evenementRepository.existsById(evenementDTO.getIdEvent())) {
            System.err.println("❌ Événement non trouvé: " + evenementDTO.getIdEvent());
            throw new RuntimeException("Événement non trouvé avec l'ID: " + evenementDTO.getIdEvent());
        }
        
        try {
            Evenement evenement = convertDtoToEntity(evenementDTO);
            Evenement updatedEvenement = evenementRepository.save(evenement);
            
            EvenementDTO updatedDto = convertEntityToDto(updatedEvenement);
            System.out.println("✅ Événement mis à jour: " + updatedDto.getIdEvent());
            
            return updatedDto;
            
        } catch (Exception e) {
            System.err.println("❌ Erreur update: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Erreur lors de la mise à jour: " + e.getMessage(), e);
        }
    }

    @Override
    public void deleteById(Long id) {
        System.out.println("🔵 EvenementService.deleteById(" + id + ")");
        
        // Vérifier si l'événement existe
        if (!evenementRepository.existsById(id)) {
            System.err.println("❌ Événement non trouvé: " + id);
            throw new RuntimeException("Événement non trouvé avec l'ID: " + id);
        }
        
        try {
            evenementRepository.deleteById(id);
            System.out.println("✅ Événement supprimé: " + id);
        } catch (Exception e) {
            System.err.println("❌ Erreur delete: " + e.getMessage());
            throw new RuntimeException("Erreur lors de la suppression: " + e.getMessage(), e);
        }
    }
}