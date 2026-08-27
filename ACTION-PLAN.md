# 🎯 Action Plan SEO — evyron.fr

**Score actuel** : 38/100  
**Objectif** : 65/100 dans 3 mois  
**Date** : 27 août 2026

---

## Semaine 1 — Fondations

### 1.1 Google Search Console 🔴
- [ ] Aller sur https://search.google.com/search-console
- [ ] Ajouter la propriété `https://www.evyron.fr`
- [ ] Vérifier la propriété (fichier HTML déjà déployé ✅)
- [ ] Soumettre le sitemap : `https://www.evyron.fr/sitemap.xml`
- [ ] Demander l'indexation de la homepage

### 1.2 Bing Webmaster Tools 🔴
- [ ] Aller sur https://www.bing.com/webmasters
- [ ] Ajouter `https://www.evyron.fr`
- [ ] Vérifier avec le fichier BingSiteAuth.xml ✅
- [ ] Soumettre le sitemap

### 1.3 Google Business Profile 🔴
- [ ] Créer/revendiquer le profil sur https://business.google.com
- [ ] Remplir : nom (Evyron), catégorie (Agence de création web), adresse, téléphone
- [ ] Ajouter des photos (logo, équipe, bureaux)
- [ ] Demander les premiers avis clients

### 1.4 Canonical URL 🔴
- [ ] Dans `index.html`, changer :
  ```html
  <!-- AVANT -->
  <link rel="canonical" href="https://evyron.fr/">
  <!-- APRÈS -->
  <link rel="canonical" href="https://www.evyron.fr/">
  ```

### 1.5 Vérifier og-image.png 🟠
- [ ] Vérifier que https://evyron.fr/og-image.png existe
- [ ] Si non, créer une image 1200×630px avec le logo et le titre du site

---

## Semaine 2-3 — Pages de Services

Créer 5 pages de services dédiées, chacune optimisée pour un mot-clé :

### 2.1 Page : /services/design-ui-ux
- [ ] Title : "Design UI/UX Sur Mesure — Agence Web Paris | Evyron"
- [ ] Meta description : 155 caractères avec "design UI/UX", "agence web Paris"
- [ ] Contenu : 800-1200 mots détaillant le service, processus, bénéfices
- [ ] Image hero optimisée (WebP, < 100KB)
- [ ] CTA vers le formulaire de contact
- [ ] Schema : Service (JSON-LD)
- [ ] Lien interne depuis la homepage

### 2.2 Page : /services/developpement-web
- [ ] Title : "Développement Web Sur Mesure — React, Next.js | Evyron"
- [ ] Contenu : technologies, exemples de projets, processus
- [ ] Image hero + screenshots de projets

### 2.3 Page : /services/seo-performance
- [ ] Title : "SEO & Performance Web — Optimisation Référencement | Evyron"
- [ ] Contenu : audit SEO, optimisation CWV, stratégie de contenu

### 2.4 Page : /services/maintenance-support
- [ ] Title : "Maintenance & Support Web — Suivi Post-Lancement | Evyron"
- [ ] Contenu : plans de maintenance, Support dédié

### 2.5 Page : /services/strategie-digitale
- [ ] Title : "Stratégie Digitale — Conseil & Consulting | Evyron"
- [ ] Contenu : audit digital, stratégie de présence en ligne

### Mise à jour du sitemap
- [ ] Ajouter les 5 pages de services dans `sitemap.xml`
- [ ] Ajouter les liens dans la navigation header/footer

---

## Semaine 3-4 — Blog

Créer un blog avec 5 articles de base pour établir l'expertise :

### 3.1 Article 1 : "Combien coûte un site web en 2026 ? Guide complet"
- [ ] URL : /blog/cout-creation-site-web-2026
- [ ] 1500+ mots, ciblé "coût site web"
- [ ] Schema : Article (JSON-LD)
- [ ] Images illustratives optimisées

### 3.2 Article 2 : "Comment choisir une agence web à Paris ?"
- [ ] URL : /blog/choisir-agence-web-paris
- [ ] 1200+ mots, ciblé "agence web Paris"
- [ ] Liste de critères, comparatif

### 3.3 Article 3 : "Site vitrine vs e-commerce : lequel choisir ?"
- [ ] URL : /blog/site-vitrine-vs-e-commerce
- [ ] 1000+ mots, comparatif

### 3.4 Article 4 : "Les Core Web Vitals expliqués simplement"
- [ ] URL : /blog/core-web-vitals-expliques
- [ ] 1200+ mots, contenu technique accessible

### 3.5 Article 5 : "Pourquoi le SEO est essentiel pour votre entreprise"
- [ ] URL : /blog/seo-entreprise-importance
- [ ] 1000+ mots, ciblé "SEO entreprise"

### Mise à jour
- [ ] Ajouter le blog au sitemap
- [ ] Créer une page /blog/index.html ou une listing page
- [ ] Ajouter les liens dans la nav

---

## Semaine 4-5 — Contenu & Images

### 5.1 Enrichir la homepage
- [ ] Ajouter +500 mots de contenu principal
- [ ] Détailler chaque service (200 mots chacun)
- [ ] Ajouter une section "Pourquoi nous choisir" avec des chiffres

### 5.2 Ajouter des images
- [ ] Photos de projets (portfolio) — 5-10 images
- [ ] Photo d'équipe (si applicable)
- [ ] Images pour chaque service
- [ ] Toutes en WebP, < 100KB, avec alt text descriptif
- [ ] Lazy loading sur les images hors-viewport

### 5.3 Page /a-propos
- [ ] Title : "À Propos — Agence Web Paris | Evyron"
- [ ] Contenu : histoire, équipe, valeurs, chiffres clés
- [ ] Photos d'équipe
- [ ] Schema : Organization (JSON-LD)

---

## Mois 2 — Autorité & Link Building

### 6.1 Annuaire & Citations NAP
- [ ] Inscrire Evyron sur 20-30 annuaires français
- [ ] Pages Jaunes, Societe.com, GoCard, Kompass, etc.
- [ ] Cohérence NAP (Nom, Adresse, Téléphone) partout

### 6.2 Guest Posting
- [ ] Identifier 5 blogs tech/business français
- [ ] Proposer des articles invités avec lien retour
- [ ] Cibler : journalduweb.com, linuxfr.org,etc.

### 6.3 Partenariats
- [ ] Lister sur les sites de partenaires/clients
- [ ] Demander des témoignages avec lien

### 6.4 Social Signals
- [ ] Créer/activer un profil LinkedIn pour Evyron
- [ ] Partager chaque article de blog
- [ ] Créer un profil Twitter/X

---

## Mois 3 — Optimisation & Monitoring

### 7.1 Monitoring
- [ ] Configurer les alertes Google Search Console
- [ ] Vérifier le ranking des mots-clés cibles chaque semaine
- [ ] Suivre le trafic dans Google Analytics

### 7.2 Optimisation continue
- [ ] Analyser les pages qui performent (GSC → Performance)
- [ ] Optimiser les pages avec un CTR faible (< 2%)
- [ ] Ajouter du contenu aux pages qui rankent en position 5-20

### 7.3 Schema avancé
- [ ] Ajouter BreadcrumbList
- [ ] Ajouter ItemList pour les services
- [ ] Vérifier avec Google Rich Results Test

---

## KPIs à suivre

| KPI | Actuel | Objectif 3 mois |
|-----|--------|-----------------|
| Pages indexées | 1 | 15+ |
| Backlinks | 0 | 20+ |
| Score SEO | 38/100 | 65/100 |
| Position "agence web paris" | Non classé | Top 30 |
| Trafic organique mensuel | ~0 | 200+ visites |
| Nombre de mots total | ~400 | 10 000+ |

---

## Outils recommandés

| Outil | Usage | Prix |
|-------|-------|------|
| Google Search Console | Monitoring indexation | Gratuit |
| Google Analytics 4 | Trafic | Gratuit |
| Google Business Profile | SEO local | Gratuit |
| PageSpeed Insights | CWV | Gratuit |
| Ubersuggest | Recherche de mots-clés | Freemium |
| Screaming Frog | Audit technique | Gratuit (< 500 pages) |

---

*Plan généré le 27 août 2026 — basé sur l'audit SEO complet de evyron.fr*
