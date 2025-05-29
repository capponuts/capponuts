# 🛍️ La Boutique de Capponuts

Site web simple et élégant pour présenter vos produits de brocante en ligne.

## 🚀 Démarrage rapide

1. **Installer les dépendances :**
   ```bash
   npm install
   ```

2. **Lancer le serveur de développement :**
   ```bash
   npm run dev
   ```

3. **Ouvrir votre navigateur :**
   Allez sur [http://localhost:3000](http://localhost:3000)

## 📝 Comment modifier vos produits

### Ajouter/modifier des produits

Éditez le fichier `src/app/page.tsx` et modifiez le tableau `products` :

```javascript
const products = [
  {
    id: 1,
    name: "Nom de votre produit",
    description: "Description détaillée de votre produit",
    price: 25, // Prix en euros
    image: "/products/votre-image.jpg"
  },
  // Ajoutez d'autres produits ici...
];
```

### Ajouter des images

1. Placez vos photos de produits dans le dossier `public/products/`
2. Nommez-les de manière claire (ex: `vase-vintage.jpg`)
3. Mettez à jour le chemin dans le tableau des produits
4. Décommentez le composant `Image` dans le code pour afficher vos vraies photos

### Personnaliser les couleurs et le style

Le site utilise une palette de couleurs ambrées. Pour changer :
- Modifiez les classes Tailwind dans `src/app/page.tsx`
- Couleurs principales : `amber-50`, `amber-200`, `amber-500`, `amber-600`, `amber-800`

## 📱 Fonctionnalités

- ✅ Design responsive (mobile, tablette, desktop)
- ✅ Interface simple et directe
- ✅ Grille de produits avec images, descriptions et prix
- ✅ Boutons de contact pour chaque produit
- ✅ Optimisé pour le SEO

## 🎨 Prochaines améliorations possibles

- Ajouter un système de contact par email
- Intégrer WhatsApp pour les messages directs
- Ajouter un système de catégories
- Créer une galerie d'images pour chaque produit
- Ajouter un système de recherche

## 📞 Contact

Pour toute question sur le site, contactez Capponuts !

---

*Site créé avec Next.js 15, TypeScript et Tailwind CSS*
