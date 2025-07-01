# 🛍️ Guide Complet - Ajouter des Produits à Capponuts'Shop

## 🚀 Ajouter un nouveau produit - Étapes rapides

### 1. Trouver le prochain ID disponible
- Regarde le dernier produit dans le fichier `src/app/page.tsx`
- Le dernier produit actuel a l'ID **51**
- Ton prochain produit aura donc l'ID **52**

### 2. Ajouter ton produit dans le code

Ouvre le fichier `src/app/page.tsx` et trouve la section `const products = [` (vers la ligne 14).

Ajoute ton nouveau produit **AVANT** la ligne `];` qui ferme le tableau :

```javascript
  {
    id: 52, // Numéro suivant (actuellement 52)
    name: "Nom de ton produit",
    description: "Description détaillée qui donne envie d'acheter",
    price: 25, // Prix de vente en euros
    originalPrice: 49.99, // Prix barré (pour montrer la remise)
    rating: 4.5, // Note sur 5 (entre 3.8 et 4.8 c'est bien)
    reviews: 28, // Nombre d'avis (entre 15 et 50)
    category: "Cuisine et Maison", // Voir les catégories disponibles ci-dessous
    image: "https://lien-vers-ton-image.jpg", // URL de l'image
    amazonLink: "https://www.amazon.fr/dp/XXXXXXX" // Lien Amazon
  },
```

## 📂 Catégories disponibles

Utilise **exactement** une de ces catégories (respecte les majuscules) :

- `"High-Tech"` - 📱 Électronique, gadgets, montres connectées
- `"Cuisine et Maison"` - 🏠 Ustensiles, décoration, rangement
- `"Auto et Moto"` - 🚗 Accessoires voiture, outils auto
- `"Informatique"` - 💻 Ordinateurs, périphériques
- `"Bricolage"` - 🔧 Outils, matériaux, réparation
- `"Mode"` - 👕 Vêtements, accessoires
- `"Sports et Loisirs"` - ⚽ Sport, fitness, loisirs
- `"Hygiène et Santé"` - 🧴 Soins corporels, santé
- `"Jardin"` - 🌱 Jardinage, extérieur
- `"Jeux et Jouets"` - 🧸 Jouets enfants, jeux
- `"Beauté et Soins"` - 💅 Cosmétiques, coiffure

## 💡 Conseils pour bien remplir les champs

### 📝 **Nom du produit**
- Garde le nom d'origine Amazon (c'est optimisé pour la recherche)
- Maximum 150 caractères pour un bon affichage

### 📄 **Description**
- Résume les points forts en 1-2 phrases
- Mentionne les caractéristiques importantes
- Évite les répétitions du nom

**Exemples de bonnes descriptions :**
```
"Sèche-cheveux professionnel 2400W avec technologie ionique, diffuseur et accessoires pour boucles"
"Smartwatch avec écran AMOLED, étanche 3ATM, 100+ modes sport et suivi santé complet"
"Kit coiffure 5 en 1 avec brosse chauffante, brushing et boucleur automatique"
```

### 💰 **Prix**
- **price** : Ton prix de vente (en euros, sans le €)
- **originalPrice** : Prix Amazon original (pour montrer la remise)
- Assure-toi que ton prix soit inférieur au prix original

### ⭐ **Rating et Reviews**
- **rating** : Entre 4.0 et 4.8 (évite 5.0, pas crédible)
- **reviews** : Entre 15 et 60 avis (cohérent avec un produit populaire)

### 🖼️ **Image**
- Utilise l'URL de l'image Amazon directement
- Format : `https://m.media-amazon.com/images/...`
- L'image doit être claire et sur fond blanc

### 🔗 **Lien Amazon**
- Format : `https://www.amazon.fr/dp/XXXXXXX`
- Tu peux ajouter ton tag d'affiliation si tu en as un

## 📋 Exemple complet d'ajout

Voici un exemple concret d'ajout d'un nouveau produit :

```javascript
  {
    id: 52,
    name: "Aspirateur Robot Intelligent 3-en-1, Navigation Laser, Aspiration 4000Pa, Compatible WiFi App Contrôle",
    description: "Robot aspirateur intelligent avec navigation laser, aspiration puissante 4000Pa, contrôle via app WiFi et fonction 3-en-1",
    price: 180,
    originalPrice: 399.99,
    rating: 4.4,
    reviews: 42,
    category: "Cuisine et Maison",
    image: "https://m.media-amazon.com/images/I/71XYZ123ABC._AC_SX679_.jpg",
    amazonLink: "https://www.amazon.fr/dp/B0EXAMPLE123"
  },
```

## ✅ Vérification avant publication

Avant de sauvegarder, vérifie :

- [ ] L'ID est unique et suit la séquence
- [ ] La catégorie existe exactement comme écrite
- [ ] Le prix est cohérent (price < originalPrice)
- [ ] L'image s'affiche correctement
- [ ] Le lien Amazon fonctionne
- [ ] Pas de virgule manquante ou en trop

## 🔄 Tester ton ajout

1. Sauvegarde le fichier `src/app/page.tsx`
2. Recharge ton site
3. Vérifie que le produit s'affiche bien
4. Teste le filtrage par catégorie
5. Clique sur le lien Amazon pour vérifier

## 🆘 En cas de problème

**Erreur de syntaxe ?**
- Vérifie les virgules (chaque ligne sauf la dernière doit finir par une virgule)
- Vérifie les guillemets (toujours par paires)

**Produit qui ne s'affiche pas ?**
- Vérifie que la catégorie est exactement comme dans la liste
- Vérifie que l'ID est unique

**Image qui ne s'affiche pas ?**
- Teste l'URL de l'image dans ton navigateur
- Utilise une image Amazon directe

## 🎯 Prochaines étapes

Une fois que tu maîtrises l'ajout de produits, tu peux :
- Ajouter plusieurs produits d'un coup
- Créer de nouvelles catégories si besoin
- Optimiser les descriptions pour tes clients

---

💬 **Besoin d'aide ?** N'hésite pas à demander si tu rencontres des difficultés !