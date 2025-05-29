# 📋 Guide pour ajouter vos produits

## 🔄 Étapes rapides pour ajouter un nouveau produit

### 1. Préparer votre photo
- Prenez une belle photo de votre produit
- Renommez-la avec un nom clair (ex: `lampe-vintage-rouge.jpg`)
- Placez-la dans le dossier `public/products/`

### 2. Ajouter le produit au site
Ouvrez le fichier `src/app/page.tsx` et ajoutez votre produit dans le tableau :

```javascript
{
  id: 7, // Numéro suivant
  name: "Nom de votre produit",
  description: "Description attrayante qui donne envie d'acheter",
  price: 30, // Prix en euros
  image: "/products/votre-photo.jpg"
},
```

### 3. Exemples de descriptions qui marchent bien

**Pour un vase :**
```
"Magnifique vase en céramique des années 70, couleur turquoise, parfait état. Idéal pour décorer votre salon."
```

**Pour un livre :**
```
"Livre de recettes traditionelles de grand-mère, édition 1960. Pages en excellent état, reliure solide."
```

**Pour un objet déco :**
```
"Cadre photo vintage en bois doré, style baroque, 20x30cm. Apportera une touche d'élégance à vos souvenirs."
```

## 💡 Conseils pour de bonnes photos

- ✅ Éclairage naturel (près d'une fenêtre)
- ✅ Fond neutre (blanc ou beige)
- ✅ Montrer l'objet sous son meilleur angle
- ✅ Inclure une photo de détail si nécessaire
- ✅ Format JPG, taille raisonnable (pas plus de 2MB)

## 🏷️ Conseils pour les prix

- Regardez les prix similaires sur Le Bon Coin ou Vinted
- N'hésitez pas à mettre un prix légèrement négociable
- Pensez à l'état de l'objet (excellent, bon, correct)

## 📱 Tester votre ajout

Après avoir ajouté un produit :
1. Sauvegardez le fichier
2. Rechargez votre navigateur
3. Vérifiez que tout s'affiche bien
4. Testez sur mobile aussi !

---

*Besoin d'aide ? N'hésitez pas à demander !* 