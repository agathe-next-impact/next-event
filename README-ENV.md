# 🔧 Configuration des Variables d'Environnement

## 📋 Guide de Configuration

### 1. **Fichiers d'environnement**
- `.env` - Variables par défaut (committé dans Git)
- `.env.local` - Variables locales sensibles (ignoré par Git)
- `.env.production` - Variables de production (sur Vercel)

### 2. **Configuration minimale requise**

\`\`\`bash
# Dans .env.local
WP_GRAPHQL_ENDPOINT=https://your-wordpress-site.com/wp-json/wp/v2
RESEND_API_KEY=re_your_resend_api_key
FROM_EMAIL=noreply@your-domain.com
NEXTAUTH_SECRET=your-super-secret-key
\`\`\`

### 3. **Configuration WordPress**

#### Option A: WordPress.com ou WordPress hébergé
\`\`\`bash
WP_GRAPHQL_ENDPOINT=https://your-site.wordpress.com/wp-json/wp/v2
\`\`\`

#### Option B: WordPress auto-hébergé
\`\`\`bash
WP_GRAPHQL_ENDPOINT=https://your-domain.com/wp-json/wp/v2
WP_AUTH_USERNAME=your-username
WP_AUTH_PASSWORD=your-app-password
\`\`\`

### 4. **Configuration Resend (Email)**

1. Créez un compte sur [resend.com](https://resend.com)
2. Obtenez votre clé API
3. Vérifiez votre domaine d'envoi

\`\`\`bash
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxx
FROM_EMAIL=noreply@your-verified-domain.com
ADMIN_EMAIL=admin@your-domain.com
\`\`\`

### 5. **Déploiement sur Vercel**

#### Via l'interface Vercel:
1. Allez dans Settings > Environment Variables
2. Ajoutez chaque variable une par une

#### Via Vercel CLI:
\`\`\`bash
vercel env add WP_GRAPHQL_ENDPOINT
vercel env add RESEND_API_KEY
vercel env add FROM_EMAIL
vercel env add NEXTAUTH_SECRET
\`\`\`

### 6. **Variables optionnelles**

#### Analytics
\`\`\`bash
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_VERCEL_ANALYTICS=true
\`\`\`

#### Base de données
\`\`\`bash
DATABASE_URL=postgresql://user:pass@host:5432/db
\`\`\`

#### Paiements Stripe
\`\`\`bash
STRIPE_PUBLIC_KEY=pk_test_xxxxx
STRIPE_SECRET_KEY=sk_test_xxxxx
\`\`\`

### 7. **Sécurité**

⚠️ **Important:**
- Ne jamais committer `.env.local`
- Utilisez des clés différentes en production
- Régénérez les secrets régulièrement
- Limitez les permissions des clés API

### 8. **Test de configuration**

Utilisez DevTools dans l'application pour tester:
- Connexion WordPress
- Envoi d'emails
- Toutes les intégrations

### 9. **Dépannage**

#### WordPress ne répond pas:
- Vérifiez l'URL (sans slash final)
- Testez l'API: `curl https://your-site.com/wp-json/wp/v2/posts`
- Vérifiez les permissions CORS

#### Emails ne s'envoient pas:
- Vérifiez la clé Resend
- Confirmez que le domaine est vérifié
- Regardez les logs dans DevTools

#### Variables non reconnues:
- Redémarrez le serveur de développement
- Vérifiez la syntaxe (pas d'espaces autour du =)
- Assurez-vous que le fichier est bien `.env.local`
