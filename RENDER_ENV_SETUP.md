📋 INSTRUCTIONS POUR AJOUTER LES VARIABLES D'ENVIRONNEMENT SUR RENDER
=====================================================================

⚠️ IMPORTANT: Tu dois ajouter ces variables manuellement dans le dashboard Render

Voici comment faire:

1. Va sur: https://dashboard.render.com/
2. Clique sur ton service: "backend evenix"
3. Va à l'onglet "Environment"
4. Clique sur "Add Environment Variable" ou édite les variables existantes

AJOUTE OU MODIFIE CES VARIABLES:
================================

CLOUDINARY_CLOUD_NAME
   Valeur: dgr0kva7h

CLOUDINARY_API_KEY
   Valeur: 742628142121922

CLOUDINARY_API_SECRET
   Valeur: hV9eEW1KkpoFe0FlogJ0SHHM11Q

GARDER LES VARIABLES EXISTANTES:
   - DB_URL
   - DB_USERNAME
   - DB_PASSWORD
   - SPRING_PROFILES_ACTIVE=prod
   - JAVA_OPTS=-Djavax.net.ssl.trustAll=true

RÉSUMÉ COMPLET DES VARIABLES À AVOIR:
======================================

DB_URL = jdbc:mysql://gateway01.eu-central-1.prod.aws.tidbcloud.com:4000/evenix?useSSL=true&serverTimezone=UTC
DB_USERNAME = 3mR9zUw1KNB8X4q.root
DB_PASSWORD = (comme dans Render actuellement)
SPRING_PROFILES_ACTIVE = prod
JAVA_OPTS = -Djavax.net.ssl.trustAll=true
CLOUDINARY_CLOUD_NAME = dgr0kva7h
CLOUDINARY_API_KEY = 742628142121922
CLOUDINARY_API_SECRET = hV9eEW1KkpoFe0FlogJ0SHHM11Q

Ensuite CLIQUE SUR "DEPLOY" pour redémarrer l'application.

✅ Une fois que tu as ajouté les variables et redéployé, réponds "c'est fait!" et je vérifierai que tout fonctionne! 🚀
