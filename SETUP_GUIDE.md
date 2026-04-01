# 🔧 Guide de Correction - Erreurs d'API

## 🚨 Problème:
```
Erreur: Erreur lors de la récupération des utilisateurs
Erreur lors du chargement des événements: Erreur lors de la récupération des événements
```

## ✅ Cause identifiée:
Le backend ne peut pas démarrer car **il manque une base de données MySQL configurée**.

---

## 🚀 Solutions rapides (Choisissez UN):

### Solution 1️⃣: Docker Compose (Recommandé - 2 minutes)
Vous ne besoin que de Docker installé.

```powershell
# 1. Démarrer MySQL avec Docker
docker-compose up -d

# 2. Attendre 10 secondes que MySQL démarre
Start-Sleep -Seconds 10

# 3. Démarrer le backend
cd backend
.\mvnw spring-boot:run
```

Vérifiez que MySQL démarre:
```powershell
docker ps
docker logs monprojet-mysql
```

---

### Solution 2️⃣: MySQL Local (Si Docker n'est pas disponible)

1. **Installer MySQL** à partir de: https://dev.mysql.com/downloads/mysql/
2. **Créer la base de données**:
   ```sql
   CREATE DATABASE monprojet;
   ```
3. **Démarrer le backend** avec:
   ```powershell
   cd backend
   .\mvnw spring-boot:run
   ```

---

### Solution 3️⃣: Base de données en mémoire H2 (Profil dev)

```powershell
cd backend
.\mvnw spring-boot:run -Dspring-boot.run.arguments="-Dspring.profiles.active=h2"
```

**⚠️ Attention:** Les données seront perdues au redémarrage!

---

## 🧪 Tester après configuration:

1. Backend devrait écouter sur: **http://localhost:8081**

2. Tester les endpoints dans une nouvelle fenêtre PowerShell:
```powershell
# Test événements
Invoke-WebRequest -Uri "http://localhost:8081/api/evenements/test" -UseBasicParsing

# Test utilisateurs
Invoke-WebRequest -Uri "http://localhost:8081/api/users/all" -UseBasicParsing
```

3. Frontend devrait se connecter automatiquement au backend

---

## 🛠️ Configuration pour production:

Définissez les variables d'environnement:
```powershell
$env:DB_URL = "jdbc:mysql://your-host:3306/your_db"
$env:DB_USERNAME = "your_user"
$env:DB_PASSWORD = "your_password"
```

Puis démarrez le backend:
```powershell
.\mvnw spring-boot:run
```

---

## 📁 Fichiers modifiés:
- `backend/src/main/resources/application.properties` - Config par défaut
- `backend/src/main/resources/application-h2.properties` - Profil H2 dev
- `backend/pom.xml` - Ajout dépendance H2
- `docker-compose.yml` - Stack MySQL Docker

