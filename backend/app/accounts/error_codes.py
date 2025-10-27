"""
Configuration des codes d'erreur HTTP et messages standardisés
Conforme à la politique de sécurité TMTT
"""

from rest_framework import status

# ===============================================
# CODES HTTP STANDARDS - Politique TMTT
# ===============================================

HTTP_STATUS_CODES = {
    # 2xx - Succès
    200: {
        'code': status.HTTP_200_OK,
        'meaning': 'Succès',
        'description': 'La requête a été traitée avec succès',
        'use_case': 'Lecture, mise à jour réussie'
    },
    201: {
        'code': status.HTTP_201_CREATED,
        'meaning': 'Créé',
        'description': 'La ressource a été créée avec succès',
        'use_case': 'Création d\'utilisateur, équipe, pointage'
    },
    204: {
        'code': status.HTTP_204_NO_CONTENT,
        'meaning': 'Pas de contenu',
        'description': 'Requête réussie sans contenu à retourner',
        'use_case': 'Suppression réussie'
    },
    
    # 4xx - Erreurs client
    400: {
        'code': status.HTTP_400_BAD_REQUEST,
        'meaning': 'Mauvaise requête',
        'description': 'Les données envoyées sont invalides ou incomplètes',
        'use_case': 'Validation échouée, champs manquants',
        'message_prod': 'Requête invalide. Veuillez vérifier vos données.',
        'message_dev': 'Données invalides : {details}'
    },
    401: {
        'code': status.HTTP_401_UNAUTHORIZED,
        'meaning': 'Non authentifié',
        'description': 'Authentification requise ou token invalide',
        'use_case': 'Token manquant, expiré ou invalide',
        'message_prod': 'Authentification requise.',
        'message_dev': 'Token JWT invalide ou expiré'
    },
    403: {
        'code': status.HTTP_403_FORBIDDEN,
        'meaning': 'Accès refusé',
        'description': 'L\'utilisateur n\'a pas les permissions nécessaires',
        'use_case': 'Rôle insuffisant, action non autorisée',
        'message_prod': 'Accès refusé.',
        'message_dev': 'Permissions insuffisantes pour {action}'
    },
    404: {
        'code': status.HTTP_404_NOT_FOUND,
        'meaning': 'Ressource non trouvée',
        'description': 'La ressource demandée n\'existe pas',
        'use_case': 'Utilisateur, équipe, pointage introuvable',
        'message_prod': 'Ressource non trouvée.',
        'message_dev': '{resource} avec id {id} non trouvé'
    },
    409: {
        'code': status.HTTP_409_CONFLICT,
        'meaning': 'Conflit',
        'description': 'Conflit avec l\'état actuel de la ressource',
        'use_case': 'Email/username déjà existant',
        'message_prod': 'Cette ressource existe déjà.',
        'message_dev': '{field} déjà utilisé : {value}'
    },
    429: {
        'code': status.HTTP_429_TOO_MANY_REQUESTS,
        'meaning': 'Trop de requêtes',
        'description': 'Limite de taux dépassée',
        'use_case': 'Rate limiting, brute force',
        'message_prod': 'Trop de requêtes. Veuillez réessayer plus tard.',
        'message_dev': 'Rate limit dépassé : {limit} requêtes/{period}'
    },
    
    # 5xx - Erreurs serveur
    500: {
        'code': status.HTTP_500_INTERNAL_SERVER_ERROR,
        'meaning': 'Erreur interne du serveur',
        'description': 'Une erreur s\'est produite côté serveur',
        'use_case': 'Exception non gérée, erreur critique',
        'message_prod': 'Erreur interne du serveur.',
        'message_dev': 'Erreur serveur : {error}'
    },
    503: {
        'code': status.HTTP_503_SERVICE_UNAVAILABLE,
        'meaning': 'Service indisponible',
        'description': 'Le service est temporairement indisponible',
        'use_case': 'Maintenance, surcharge',
        'message_prod': 'Service temporairement indisponible.',
        'message_dev': 'Service en maintenance ou surchargé'
    },
}


# ===============================================
# MESSAGES D'ERREUR PAR CONTEXTE
# ===============================================

ERROR_MESSAGES = {
    # Authentication
    'AUTH': {
        'INVALID_CREDENTIALS': {
            'code': 401,
            'prod': 'Identifiants invalides.',
            'dev': 'Username ou password incorrect'
        },
        'TOKEN_EXPIRED': {
            'code': 401,
            'prod': 'Session expirée. Veuillez vous reconnecter.',
            'dev': 'JWT token expiré'
        },
        'TOKEN_INVALID': {
            'code': 401,
            'prod': 'Token invalide.',
            'dev': 'JWT token malformé ou signature invalide'
        },
        'ACCOUNT_LOCKED': {
            'code': 403,
            'prod': 'Compte temporairement verrouillé.',
            'dev': 'Compte bloqué après {attempts} tentatives. Déblocage dans {minutes} minutes.'
        },
        'ACCOUNT_DISABLED': {
            'code': 403,
            'prod': 'Compte désactivé.',
            'dev': 'Compte utilisateur désactivé'
        },
    },
    
    # Permissions
    # IMPORTANT: Ne jamais révéler les rôles dans les messages d'erreur (stratégie de sécurité)
    'PERMISSION': {
        'DENIED': {
            'code': 403,
            'prod': 'Accès refusé.',
            'dev': 'Accès refusé pour l\'action: {action}'
        },
        'INSUFFICIENT_ROLE': {
            'code': 403,
            'prod': 'Permissions insuffisantes.',
            'dev': 'Permissions insuffisantes pour cette action'
        },
        'NOT_OWNER': {
            'code': 403,
            'prod': 'Vous ne pouvez modifier que vos propres données.',
            'dev': 'Tentative d\'accès à des données non autorisées'
        },
    },
    
    # Validation
    'VALIDATION': {
        'REQUIRED_FIELD': {
            'code': 400,
            'prod': 'Champs requis manquants.',
            'dev': 'Champs manquants: {fields}'
        },
        'INVALID_FORMAT': {
            'code': 400,
            'prod': 'Format de données invalide.',
            'dev': 'Champ {field}: format attendu {expected}, reçu {received}'
        },
        'XSS_DETECTED': {
            'code': 400,
            'prod': 'Contenu non autorisé détecté.',
            'dev': 'Tentative XSS détectée dans le champ {field}'
        },
        'SQL_INJECTION': {
            'code': 400,
            'prod': 'Contenu suspect détecté.',
            'dev': 'Tentative d\'injection SQL détectée dans {field}'
        },
        'PASSWORD_WEAK': {
            'code': 400,
            'prod': 'Le mot de passe ne respecte pas les exigences de sécurité.',
            'dev': 'Password requirements: min 8 chars, 1 upper, 1 lower, 1 digit'
        },
    },
    
    # Resources
    'RESOURCE': {
        'NOT_FOUND': {
            'code': 404,
            'prod': 'Ressource non trouvée.',
            'dev': '{resource_type} avec id {id} non trouvé'
        },
        'ALREADY_EXISTS': {
            'code': 409,
            'prod': 'Cette ressource existe déjà.',
            'dev': '{resource_type} avec {field}={value} existe déjà'
        },
        'CONFLICT': {
            'code': 409,
            'prod': 'Conflit détecté.',
            'dev': 'Conflit: {description}'
        },
    },
    
    # Rate Limiting
    'RATE_LIMIT': {
        'EXCEEDED': {
            'code': 429,
            'prod': 'Trop de requêtes. Veuillez réessayer plus tard.',
            'dev': 'Rate limit: {limit} req/{period}. Réessayez dans {retry_after}s'
        },
        'LOGIN_ATTEMPTS': {
            'code': 429,
            'prod': 'Trop de tentatives de connexion.',
            'dev': '{attempts} tentatives en {period}. Compte bloqué pour {lockout_time}min'
        },
    },
    
    # Security
    'SECURITY': {
        'SUSPICIOUS_ACTIVITY': {
            'code': 403,
            'prod': 'Activité suspecte détectée.',
            'dev': 'Suspicious activity from IP {ip}: {reason}'
        },
        'CSRF_FAILED': {
            'code': 403,
            'prod': 'Vérification de sécurité échouée.',
            'dev': 'CSRF token invalide ou manquant'
        },
    },
    
    # System
    'SYSTEM': {
        'INTERNAL_ERROR': {
            'code': 500,
            'prod': 'Erreur interne du serveur.',
            'dev': 'Internal error: {error_type} - {message}'
        },
        'SERVICE_UNAVAILABLE': {
            'code': 503,
            'prod': 'Service temporairement indisponible.',
            'dev': 'Service unavailable: {reason}'
        },
        'DATABASE_ERROR': {
            'code': 500,
            'prod': 'Erreur de base de données.',
            'dev': 'Database error: {error}'
        },
    },
}


# ===============================================
# FONCTION HELPER POUR RÉCUPÉRER LES MESSAGES
# ===============================================

def get_error_message(category, error_type, is_production=False, **kwargs):
    """
    Récupère le message d'erreur approprié
    
    Args:
        category: Catégorie d'erreur (AUTH, PERMISSION, etc.)
        error_type: Type d'erreur spécifique
        is_production: True si en mode production (messages génériques)
        **kwargs: Variables à injecter dans le message
    
    Returns:
        tuple: (http_code, message)
    
    Example:
        code, msg = get_error_message('AUTH', 'INVALID_CREDENTIALS', is_production=True)
    """
    try:
        error_def = ERROR_MESSAGES[category][error_type]
        code = error_def['code']
        
        if is_production:
            message = error_def['prod']
        else:
            message = error_def['dev'].format(**kwargs) if kwargs else error_def['dev']
        
        return code, message
    except (KeyError, IndexError):
        # Fallback en cas d'erreur inconnue
        return 500, "Une erreur s'est produite."


# ===============================================
# EXEMPLES D'UTILISATION
# ===============================================

"""
# Dans une vue Django REST Framework:

from app.accounts.error_codes import get_error_message, ERROR_MESSAGES
from rest_framework.response import Response
from django.conf import settings

# Exemple 1: Credentials invalides
code, msg = get_error_message('AUTH', 'INVALID_CREDENTIALS', is_production=not settings.DEBUG)
return Response({'detail': msg}, status=code)

# Exemple 2: Permission refusée (SANS révéler les rôles)
code, msg = get_error_message(
    'PERMISSION', 
    'INSUFFICIENT_ROLE',
    is_production=not settings.DEBUG
)
return Response({'detail': msg}, status=code)

# Exemple 3: Permission refusée avec action (mais pas de rôles)
code, msg = get_error_message(
    'PERMISSION',
    'DENIED',
    is_production=not settings.DEBUG,
    action='modification_utilisateur'
)
return Response({'detail': msg}, status=code)

# Exemple 4: Validation XSS
code, msg = get_error_message(
    'VALIDATION',
    'XSS_DETECTED',
    is_production=not settings.DEBUG,
    field='username'
)
return Response({'detail': msg}, status=code)

# IMPORTANT: Pour des raisons de sécurité, ne jamais inclure:
# - Les noms de rôles (GCA, CA, Pirates, Luffy, Kira, Jarvis)
# - Les usernames dans les erreurs de permission
# - Les détails sur la structure des permissions
# Ces informations pourraient aider un attaquant à comprendre le système
"""
