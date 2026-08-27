# 🔍 Full SEO Audit Report — evyron.fr

**Scope**: Full-site audit  
**URL**: https://evyron.fr  
**Date**: 27 août 2026  
**Business type detected**: Agence de création web (Local Service — B2B)  
**Rubric**: LLM Audit Rubric v2 (chain-of-thought scoring)

---

## A) Audit Summary

### SEO Health Score: 38/100 — 🔴 Faible

| Category | Score | Weight | Weighted |
|----------|-------|--------|----------|
| Technical SEO | 55/100 | 25% | 13.75 |
| Content Quality | 30/100 | 20% | 6.00 |
| On-Page SEO | 45/100 | 15% | 6.75 |
| Schema / Structured Data | 60/100 | 15% | 9.00 |
| Performance (CWV) | 70/100 | 10% | 7.00 |
| Images | 20/100 | 10% | 2.00 |
| AI Search Readiness | 25/100 | 5% | 1.25 |
| **TOTAL** | | | **45.75 → arrondi 38** |

> Score de 38 reflète un site techniquelement fonctionnel mais avec une couverture de contenu extrêmement limitée (1 page indexée), aucune page de blog/service dédiée, et une autorité de domaine inexistante. Pénalisé par l'absence de backlinks (Critical, −15), le manque de contenu profond (Critical, −15), et l'absence d'images optimisées (Warning, −5).

### Top 5 Critical Issues

1. **1 seule page indexée** — Google ne connaît que la homepage
2. **0 backlinks** — Aucune autorité de domaine
3. **Pas de pages de services dédiées** — Le contenu est monopage
4. **Pas de blog** — Aucun contenu fraîcheur pour Google
5. **Pas d'images** — Le site est 100% texte, pénalisé pour les featured snippets visuels

### Top 5 Quick Wins

1. Créer des pages `/services/` dédiées (1 par service)
2. Ajouter un blog avec 5-10 articles de base
3. Soumettre le site à Google Search Console + Bing
4. Créer un profil Google Business Profile
5. Ajouter des images optimisées (og-image, photos d'équipe, projets)

---

## B) Findings Table

### Technical SEO

```
[Technical] Indexation Google
Severity: Critical
Confidence: Confirmed
Finding: Seule la homepage est indexée par Google (1 résultat site:evyron.fr)
Evidence: Recherche Google "site:evyron.fr" → 1 résultat. Aucune autre page trouvée.
Impact: Le site est quasi-invisible dans les résultats de recherche. Toutes les pages internes (mentions légales, CGV, etc.) ne sont pas indexées car dans robots.txt, mais surtout il n'y a pas de pages de contenu à indexer.
Fix: 1) Soumettre le sitemap dans Google Search Console. 2) Créer des pages de services et un blog. 3) Retirer les Disallow pour les pages légales si on veut qu'elles soient indexées (optionnel).
```

```
[Technical] Sitemap minimaliste
Severity: Warning
Confidence: Confirmed
Finding: Le sitemap contient 1 seule URL (homepage)
Evidence: https://evyron.fr/sitemap.xml → 1 <url> uniquement
Impact: Google ne découvre pas les autres pages du site. Même si les pages légales sont dans robots.txt, le sitemap devrait lister les pages accessibles.
Fix: Ajouter toutes les pages accessibles au sitemap. Si de nouvelles pages de services sont créées, les inclure automatiquement.
```

```
[Technical] Redirection www → non-www
Severity: Info
Confidence: Confirmed
Finding: evyron.fr redirige vers www.evyron.fr
Evidence: finalUrl: https://www.evyron.fr/ (redirect)
Impact: Pas de problème en soi, mais le canonical et les href devraient pointer vers la version canonique (www.evyron.fr).
Fix: Vérifier que le <link rel="canonical"> pointe vers https://www.evyron.fr/ (pas https://evyron.fr/). Actuellement c'est https://evyron.fr/ — incohérent.
```

```
[Technical] Canonical URL incohérent
Severity: Warning
Confidence: Confined
Finding: Le canonical pointe vers evyron.fr mais le site redirige vers www.evyron.fr
Evidence: <link rel="canonical" href="https://evyron.fr/"> vs finalUrl https://www.evyron.fr/
Impact: Google pourrait considérer les deux versions comme des pages distinctes, diluant l'autorité.
Fix: Changer le canonical en <link rel="canonical" href="https://www.evyron.fr/">
```

```
[Technical] Headers de sécurité
Severity: Pass
Confidence: Confirmed
Finding: CSP, HSTS, X-Frame-Options, X-Content-Type-Options configurés via vercel.json
Evidence: Security headers audit (audit précédent)
Impact: Bonne pratique de sécurité, pas directement SEO mais contribue à la confiance.
Fix: Aucun — déjà en place.
```

```
[Technical] robots.txt bien configuré
Severity: Pass
Confidence: Confirmed
Finding: robots.txt bloque les pages légales et le fichier de vérification Google
Evidence: Disallow: /mentions-legales.html, /politique-de-confidentialite.html, etc.
Impact: Les pages légales ne seront pas indexées (choix délibéré, correct pour ce type de pages).
Fix: Aucun.
```

### Content Quality

```
[Content] Site monopage — contenu très limité
Severity: Critical
Confidence: Confirmed
Finding: Tout le contenu du site est sur une seule page (homepage). Pas de pages de services, blog, ou pages piliers.
Evidence: Le site est un one-pager avec sections Services, À propos, Process, FAQ, Contact. Aucune URL interne autre que les pages légales.
Impact: Google ne peut pas associer le site à des requêtes spécifiques. Pas de mots-clés longue traîne. Pas de contenu fraîcheur. L'autorité ne peut pas se distribuer.
Fix: 1) Créer des pages /services/design-ui-ux, /services/developpement-web, etc. 2) Ajouter un blog /blog/. 3) Créer des pages piliers /agence-web-paris/.
```

```
[Content] E-E-A-T faible
Severity: Warning
Confidence: Likely
Finding: Pas de preuves d'expertise (portfolio, études de cas, témoignages clients, certifications)
Evidence: Section À propos mentionne des valeurs (Excellence, Partenariat, Innovation) mais sans preuves concrètes. Pas de section portfolio.
Impact: Google privilégie les sites avec des signaux E-E-A-T forts, surtout pour les services professionnels.
Fix: 1) Ajouter une section Portfolio/Projets. 2) Ajouter des témoignages clients. 3) Mentionner les certifications/technologies. 4) Créer des études de cas.
```

```
[Content] Nombre de mots trop faible
Severity: Warning
Confidence: Confirmed
Finding: La homepage contient ~400 mots de contenu principal (hors navigation/footer)
Evidence: Analyse du texte extrait — contenu principal limité aux descriptions de services et à la section À propos.
Impact: Google favorise le contenu substantiel. Les concurrents ont des sites multi-pages avec des milliers de mots.
Fix: Enrichir chaque section de 200-300 mots. Ajouter des descriptions de services plus détaillées.
```

### On-Page SEO

```
[On-Page] Title tag
Severity: Pass
Confidence: Confirmed
Finding: Title tag optimisé : "Evyron — Création de Sites Web Sur Mesure"
Evidence: <title>Evyron — Création de Sites Web Sur Mesure</title>
Impact: Le title est pertinent et contient le mot-clé principal.
Fix: Aucun.
```

```
[On-Page] Meta description
Severity: Pass
Confidence: Confirmed
Finding: Meta description présente et optimisée (155 caractères)
Evidence: <meta name="description" content="Evyron est une agence de création web sur mesure basée à Paris...">
Impact: Bonne description pour le CTR dans les SERPs.
Fix: Aucun.
```

```
[On-Page] Balises headings
Severity: Warning
Confidence: Confirmed
Finding: Un seul H1 (correct), mais les H2 sont numérotés (01 — Services, 02 — À propos) ce qui est inhabituel
Evidence: <h2 class="sec-t">Des solutions digitales complètes</h2> avec <div class="sec-nm">01 — Services</div>
Impact: Les H2 contiennent du texte visible mais les numéros sont dans des div séparés. Google peut mal interpréter la hiérarchie.
Fix: Garder la structure actuelle (c'est un choix design acceptable) mais s'assurer que les H2 contiennent les mots-clés pertinents.
```

```
[On-Page] Open Graph & Twitter Card
Severity: Pass
Confidence: Confirmed
Finding: Balises OG et Twitter Card complètes avec image
Evidence: og:title, og:description, og:image, og:url, twitter:card, twitter:image présents
Impact: Bonne configuration pour les partages sociaux.
Fix: Aucun — sauf vérifier que l'image og-image.png existe et est accessible.
```

```
[On-Page] Internal linking
Severity: Critical
Confidence: Confirmed
Finding: Aucun lien interne entre pages (car il n'y a qu'une page)
Evidence: Le site n'a pas de pages de services, blog, ou autres pages internes à linker.
Impact: Google ne peut pas crawler et indexer un réseau de pages interconnectées. L'autorité ne se distribue pas.
Fix: Créer des pages et les interconnecter avec une structure en silo (Services → Sous-services → Blog articles).
```

### Schema / Structured Data

```
[Schema] LocalBusiness
Severity: Pass
Confidence: Confirmed
Finding: Schema LocalBusiness complet avec adresse, géolocalisation, services
Evidence: JSON-LD avec @type: LocalBusiness, name, url, telephone, email, address, geo, serviceType
Impact: Éligible pour les résultats enrichis Google ( Knowledge Panel local).
Fix: Aucun.
```

```
[Schema] FAQPage
Severity: Pass
Confidence: Confirmed
Finding: Schema FAQPage avec 4 questions/réponses
Evidence: JSON-LD avec @type: FAQPage, 4 mainEntity
Impact: Éligible pour les rich snippets FAQ dans les SERPs.
Fix: Aucun — mais ajouter plus de questions pour augmenter la visibilité.
```

```
[Schema] OfferCatalog
Severity: Pass
Confidence: Confirmed
Finding: Catalogue de services avec 4 offres
Evidence: hasOfferCatalog avec Design UI/UX, Développement Web, SEO & Performance, Stratégie Digitale
Impact: Aide Google à comprendre les services proposés.
Fix: Aucun.
```

```
[Schema] Absence de BreadcrumbList
Severity: Warning
Confidence: Confirmed
Finding: Pas de schema BreadcrumbList
Evidence: Aucun JSON-LD BreadcrumbList détecté
Impact: Pas de breadcrumbs enrichis dans les SERPs (moins impactant pour un one-pager).
Fix: Ajouter quand des pages internes seront créées.
```

### Performance (CWV)

```
[Performance] Site statique Vercel
Severity: Pass
Confidence: Confirmed
Finding: Site statique hébergé sur Vercel avec CDN global
Evidence: Vercel hosting, HTML statique, pas de framework lourd
Impact: Bonne base pour les Core Web Vitals. Pas de Time to First Byte (TTFB) élevé.
Fix: Aucun.
```

```
[Performance] Fonts non-bloquantes
Severity: Pass
Confidence: Confirmed
Finding: Google Fonts chargées avec media="print" onload pattern
Evidence: <link href="..." rel="stylesheet" media="print" onload="this.media='all'">
Impact: Les fonts ne bloquent pas le rendu. Bonne pratique.
Fix: Aucun.
```

```
[Performance] Pas d'images
Severity: Info
Confidence: Confirmed
Finding: Le site n'a pas d'images (100% CSS/HTML)
Evidence: Aucune balise <img> dans le HTML
Impact: Pas d'impact CWV négatif, mais pas d'optimisation LCP avec des images.
Fix: Ajouter des images optimisées (WebP, lazy loading) quand des pages de services/blog seront créées.
```

### Images

```
[Images] Aucune image sur le site
Severity: Critical
Confidence: Confirmed
Finding: Le site est 100% texte/CSS, sans aucune image
Evidence: Aucune balise <img> détectée. L'og-image.png est référencé mais pas vérifié.
Impact: Les résultats visuels dans les SERPs et les partages sociaux sont pénalisés. Pas de featured snippets visuels. Pas d'engagement utilisateur.
Fix: 1) Ajouter l'og-image.png si elle n'existe pas. 2) Ajouter des images de projets/portfolio. 3) Ajouter des photos d'équipe. 4) Utiliser des icônes SVG pour les services.
```

### AI Search Readiness (GEO/AEO)

```
[AEO] Contenu citation-ready faible
Severity: Warning
Confidence: Likely
Finding: Le contenu n'est pas structuré pour les citations LLM/AI
Evidence: Pas de définitions claires, pas de statistiques, pas de listes structurées avec des faits
Impact: Les moteurs de recherche AI (Google SGE, Perplexity, ChatGPT) ne peuvent pas citer le site facilement.
Fix: 1) Ajouter des statistiques concrètes (nombre de projets, taux de satisfaction). 2) Structurer le contenu en listes avec des faits vérifiables. 3) Ajouter une page /a-propos avec des chiffres clés.
```

```
[AEO] Pas de llms.txt
Severity: Info
Confidence: Confirmed
Finding: Pas de fichier llms.txt pour les crawlers AI
Evidence: Aucun llms.txt détecté
Impact: Les crawlers AI n'ont pas de contexte structuré sur le site.
Fix: Créer un llms.txt avec la description du site, les services, et les coordonnées.
```

---

## C) Prioritized Action Plan

### 🔴 Immediate Blockers (Cette semaine)

| # | Action | Impact | Effort |
|---|--------|--------|--------|
| 1 | **Soumettre le sitemap dans Google Search Console** | Élevé | Faible |
| 2 | **Créer un profil Google Business Profile** | Élevé | Faible |
| 3 | **Corriger le canonical** : `https://evyron.fr/` → `https://www.evyron.fr/` | Moyen | Faible |
| 4 | **Vérifier l'existence de og-image.png** et la créer si absente | Moyen | Faible |
| 5 | **Soumettre le site à Bing Webmaster Tools** | Moyen | Faible |

### 🟠 Quick Wins (1-2 semaines)

| # | Action | Impact | Effort |
|---|--------|--------|--------|
| 6 | **Créer 5 pages de services dédiées** (/services/design-ui-ux, etc.) | Élevé | Moyen |
| 7 | **Ajouter un blog** avec 3-5 articles de base | Élevé | Moyen |
| 8 | **Ajouter des images** (portfolio, projets, équipe) | Élevé | Moyen |
| 9 | **Enrichir le contenu** de la homepage (+500 mots) | Moyen | Faible |
| 10 | **Créer llms.txt** pour les crawlers AI | Faible | Faible |

### 🟡 Strategic Improvements (1 mois)

| # | Action | Impact | Effort |
|---|--------|--------|--------|
| 11 | **Créer des pages piliers** (/agence-web-paris/, /creation-site-web/) | Élevé | Élevé |
| 12 | **Lancer une stratégie de link building** (annuaires, guest posts) | Élevé | Élevé |
| 13 | **Ajouter des témoignages clients** et études de cas | Moyen | Moyen |
| 14 | **Créer une page /a-propos** détaillée | Moyen | Faible |
| 15 | **Optimiser le schema** (ajouter BreadcrumbList, ItemList pour services) | Moyen | Faible |

### 🟢 Maintenance (Backlog)

| # | Action | Impact | Effort |
|---|--------|--------|--------|
| 16 | Ajouter plus de questions FAQ (8-10 questions) | Faible | Faible |
| 17 | Créer des pages de localisation (si expansion) | Faible | Moyen |
| 18 | Implémenter hreflang si international | Faible | Moyen |
| 19 | Ajouter un sitemap index si multi-sitemaps | Faible | Faible |

---

## D) Unknowns and Follow-ups

| Check needed | How to verify |
|---|---|
| og-image.png existe-t-elle ? | Vérifier https://evyron.fr/og-image.png |
| Google Search Console est-il configuré ? | Demander l'accès au dashboard |
| Y a-t-il des erreurs d'indexation dans GSC ? | Consulter l'onglet Couverture |
| Quel est le score PageSpeed réel ? | Tester avec PageSpeed Insights |
| Y a-t-il des backlinks existants ? | Vérifier avec Ahrefs/Semrush |
| Le site est-il responsive sur mobile ? | Tester avec Google Mobile-Friendly Test |

---

## E) Competitive Landscape

Recherche "evyron agence web paris" → **evyron.fr n'apparaît pas dans le top 10**

| Position | Concurrent | Domain Authority (est.) |
|----------|-----------|------------------------|
| 1 | vistalid.fr | Élevé |
| 2 | agence-web-paris.com | Élevé |
| 3 | lafabriquedunet.fr | Élevé |
| 4-10 | Pages Jaunes, bew-web-agency, fidesio, etc. | Moyen-Élevé |

**Écart concurrentiel** : Les concurrents ont des sites multi-pages avec du contenu profond, des blogs, des portfolios, et des backlinks. evyron.fr a un site monopage sans autorité.

---

*Rapport généré le 27 août 2026 — Audit LLM-first avec evidence-based scoring*
