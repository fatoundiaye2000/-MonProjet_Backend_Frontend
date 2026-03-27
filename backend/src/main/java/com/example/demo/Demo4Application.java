 package com.example.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import com.example.demo.entities.Adresse;
import com.example.demo.entities.Evenement;
import com.example.demo.entities.Tarif;
import com.example.demo.entities.Role;
import com.example.demo.entities.TypeEvent;
import com.example.demo.entities.User;
import com.example.demo.repos.AdresseRepository;
import com.example.demo.repos.EvenementRepository;
import com.example.demo.repos.RoleRepository;
import com.example.demo.repos.TarifRepository;
import com.example.demo.repos.TypeEventRepository;
import com.example.demo.service.FileStorageService;
import com.example.demo.service.UserService;
import org.springframework.boot.CommandLineRunner;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.Date;

@SpringBootApplication
@ComponentScan(basePackages = "com.example.demo")
public class Demo4Application implements CommandLineRunner {

    @Autowired
    UserService userService;
    
    @Autowired
    RoleRepository roleRepository;
    
    @Autowired
    FileStorageService fileStorageService;

    @Autowired
    EvenementRepository evenementRepository;

    @Autowired
    TypeEventRepository typeEventRepository;

    @Autowired
    TarifRepository tarifRepository;

    @Autowired
    AdresseRepository adresseRepository;
    
    public static void main(String[] args) {
        ApplicationContext ctx = SpringApplication.run(Demo4Application.class, args);
        
        System.out.println("==========================================");
        System.out.println("🔍 BEANS CHARGÉS PAR SPRING :");
        System.out.println("==========================================");
        
        String[] beanNames = ctx.getBeanDefinitionNames();
        for (String beanName : beanNames) {
            if (beanName.toLowerCase().contains("controller") || 
                beanName.toLowerCase().contains("user") ||
                beanName.toLowerCase().contains("security")) {
                System.out.println("✅ " + beanName + " -> " + ctx.getBean(beanName).getClass().getName());
            }
        }
        
        System.out.println("==========================================");
        System.out.println("🌐 ENDPOINTS DISPONIBLES:");
        System.out.println("==========================================");
        System.out.println("GET  http://localhost:8081/test");
        System.out.println("GET  http://localhost:8081/api/users/login");
        System.out.println("POST http://localhost:8081/api/users/login");
        System.out.println("GET  http://localhost:8081/api/users/all");
        System.out.println("POST http://localhost:8081/api/users/register");
        System.out.println("==========================================");
    }
    
    @Override
    public void run(String... args) throws Exception {
        fileStorageService.init();
        System.out.println("🚀 Application démarrée avec succès!");
    }
    
    @Bean
    CommandLineRunner init_users() {
        return args -> {
            try {
                System.out.println("=== DÉBUT INITIALISATION ===");
                
                // CRÉER LES RÔLES
                if (roleRepository.findByRole("ADMIN") == null) {
                    userService.addRole(new Role(null, "ADMIN"));
                    System.out.println("✔ Rôle ADMIN créé");
                }
                
                if (roleRepository.findByRole("USER") == null) {
                    userService.addRole(new Role(null, "USER"));
                    System.out.println("✔ Rôle USER créé");
                }
                
                // CRÉER LES UTILISATEURS
                User admin = userService.findUserByEmail("admin@example.com");
                boolean adminExists = admin != null;
                if (admin == null) {
                    admin = new User();
                    admin.setEmail("admin@example.com");
                    admin.setEnabled(true);
                    admin.setNom("Admin");
                    admin.setPrenom("System");
                }
                admin.setPassword("Admin123!");
                userService.saveUser(admin);
                if (adminExists) {
                    System.out.println("✔ Utilisateur admin mis à jour");
                } else {
                    System.out.println("✔ Utilisateur admin créé");
                }
                
                User user = userService.findUserByEmail("user@example.com");
                boolean userExists = user != null;
                if (user == null) {
                    user = new User();
                    user.setEmail("user@example.com");
                    user.setEnabled(true);
                    user.setNom("User");
                    user.setPrenom("Normal");
                }
                user.setPassword("User123!");
                userService.saveUser(user);
                if (userExists) {
                    System.out.println("✔ Utilisateur user mis à jour");
                } else {
                    System.out.println("✔ Utilisateur user créé");
                }
                
                // ASSIGNER LES RÔLES
                userService.addRoleToUser("admin@example.com", "ADMIN");
                userService.addRoleToUser("admin@example.com", "USER");
                userService.addRoleToUser("user@example.com", "USER");

                // Ajouter quelques comptes démo supplémentaires (pour retrouver ~6 utilisateurs comme avant)
                String[][] demoUsers = new String[][]{
                    {"alice@example.com", "Alice", "Demo"},
                    {"bob@example.com", "Bob", "Demo"},
                    {"charlie@example.com", "Charlie", "Demo"},
                    {"diana@example.com", "Diana", "Demo"}
                };

                for (String[] du : demoUsers) {
                    String email = du[0];
                    String nom = du[1];
                    String prenom = du[2];

                    User u = userService.findUserByEmail(email);
                    if (u == null) {
                        u = new User();
                        u.setEmail(email);
                        u.setEnabled(true);
                        u.setNom(nom);
                        u.setPrenom(prenom);
                        u.setPassword("User123!");
                        userService.saveUser(u);
                        System.out.println("✔ Utilisateur démo " + email + " créé");
                    }
                    userService.addRoleToUser(email, "USER");
                }
                System.out.println("✔ Rôles assignés");

                // Seed événements uniquement si la base métier est vide
                if (evenementRepository.count() == 0) {
                    System.out.println("=== DÉBUT INITIALISATION DONNÉES DÉMO (événements) ===");

                    User adminUser = userService.findUserByEmail("admin@example.com");
                    if (adminUser == null) {
                        throw new RuntimeException("Admin introuvable pour seed événements.");
                    }

                    // Types
                    TypeEvent festival = new TypeEvent();
                    festival.setNomType("Festival");
                    festival = typeEventRepository.save(festival);

                    TypeEvent exposition = new TypeEvent();
                    exposition.setNomType("Exposition");
                    exposition = typeEventRepository.save(exposition);

                    TypeEvent spectacle = new TypeEvent();
                    spectacle.setNomType("Spectacle");
                    spectacle = typeEventRepository.save(spectacle);

                    TypeEvent conference = new TypeEvent();
                    conference.setNomType("Conférence");
                    conference = typeEventRepository.save(conference);

                    // Adresses
                    Adresse addrParis = makeAdresse("10 rue de la Culture", "Paris", "75001");
                    Adresse addrLyon = makeAdresse("20 avenue des Arts", "Lyon", "69001");
                    Adresse addrMarseille = makeAdresse("5 place du Théâtre", "Marseille", "13001");
                    addrParis = adresseRepository.save(addrParis);
                    addrLyon = adresseRepository.save(addrLyon);
                    addrMarseille = adresseRepository.save(addrMarseille);

                    // Tarifs
                    Tarif tarif35 = makeTarif(false, 35.0);
                    Tarif tarif0 = makeTarif(false, 0.0);
                    Tarif tarif25 = makeTarif(false, 25.0);
                    Tarif tarif10 = makeTarif(false, 10.0);
                    tarif35 = tarifRepository.save(tarif35);
                    tarif0 = tarifRepository.save(tarif0);
                    tarif25 = tarifRepository.save(tarif25);
                    tarif10 = tarifRepository.save(tarif10);

                    // Images: fichiers déjà présents dans backend/uploads/images (vus via /files/list)
                    String[] images = new String[]{
                        "event_1767731725433_f04f6f9c.jpg",
                        "event_1767732256076_7594c16a.jpg",
                        "event_1767732304324_ee1f3d49.jpg",
                        "event_1767732541267_a1d12c20.png",
                        "event_1767732568405_8b853f8f.jpg"
                    };

                    long dayMs = 24L * 60L * 60L * 1000L;
                    Date now = new Date();

                    // 1) Festival
                    evenementRepository.save(makeEvenement(
                        adminUser, festival, addrLyon, tarif35,
                        "Festival de Jazz International",
                        "Concert de jazz avec des artistes internationaux renommés du monde entier.",
                        new Date(now.getTime() + 15 * dayMs),
                        new Date(now.getTime() + 17 * dayMs),
                        images[1],
                        150
                    ));

                    // 2) Exposition
                    evenementRepository.save(makeEvenement(
                        adminUser, exposition, addrParis, tarif0,
                        "Exposition d'Art Contemporain",
                        "Collection exceptionnelle d'œuvres d'art contemporain d'artistes émergents.",
                        new Date(now.getTime() + 2 * dayMs),
                        new Date(now.getTime() + 60 * dayMs),
                        images[3],
                        100
                    ));

                    // 3) Spectacle
                    evenementRepository.save(makeEvenement(
                        adminUser, spectacle, addrMarseille, tarif25,
                        "Spectacle de Danse Moderne",
                        "Performance captivante mêlant danse contemporaine et nouvelles technologies.",
                        new Date(now.getTime() + 80 * dayMs),
                        new Date(now.getTime() + 81 * dayMs),
                        images[2],
                        200
                    ));

                    // 4) Conférence
                    evenementRepository.save(makeEvenement(
                        adminUser, conference, addrParis, tarif10,
                        "Conférence Culture & Patrimoine",
                        "Conférence autour des projets culturels et de la préservation du patrimoine.",
                        new Date(now.getTime() + 7 * dayMs),
                        new Date(now.getTime() + 7 * dayMs + (6 * 60L * 60L * 1000L)),
                        images[0],
                        50
                    ));

                    // 5) Atelier
                    evenementRepository.save(makeEvenement(
                        adminUser, festival, addrLyon, tarif35,
                        "Atelier Créatif : Arts & Numérique",
                        "Atelier pratique pour explorer la création artistique avec des outils numériques.",
                        new Date(now.getTime() + 25 * dayMs),
                        new Date(now.getTime() + 26 * dayMs),
                        images[4],
                        75
                    ));

                    System.out.println("✔ Événements de démo créés.");
                    System.out.println("=== INITIALISATION DONNÉES DÉMO (événements) TERMINÉE ===");
                }
                
                System.out.println("=== INITIALISATION TERMINÉE ===");
                
            } catch (Exception e) {
                System.out.println("❌ Erreur lors de l'initialisation: " + e.getMessage());
                e.printStackTrace();
            }
        };
    }
    
    @Bean
    public ModelMapper modelMapper() {
        return new ModelMapper();
    }

    private Adresse makeAdresse(String rue, String ville, String codePostal) {
        Adresse a = new Adresse();
        a.setRue(rue);
        a.setVille(ville);
        a.setCodePostal(codePostal);
        return a;
    }

    private Tarif makeTarif(boolean isPromotion, double prix) {
        Tarif t = new Tarif();
        t.setIsPromotion(isPromotion);
        t.setPrix(prix);
        return t;
    }

    private Evenement<Object> makeEvenement(
        User organisateur,
        TypeEvent typeEvent,
        Adresse adresse,
        Tarif tarif,
        String titreEvent,
        String description,
        Date dateDebut,
        Date dateFin,
        String image,
        Integer nbPlace
    ) {
        Evenement<Object> evenement = new Evenement<>();
        evenement.setOrganisateur(organisateur);
        evenement.setTypeEvent(typeEvent);
        evenement.setAdresse(adresse);
        evenement.setTarif(tarif);
        evenement.setTitreEvent(titreEvent);
        evenement.setDescription(description);
        evenement.setDateDebut(dateDebut);
        evenement.setDateFin(dateFin);
        evenement.setImage(image);
        evenement.setNbPlace(nbPlace);
        return evenement;
    }
}
