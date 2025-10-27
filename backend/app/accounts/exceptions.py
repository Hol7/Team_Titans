"""
Gestionnaire d'exceptions personnalisé pour TMTT
Masque les détails techniques en production et renvoie des messages génériques

Politique de Sécurité:
- Ne pas envoyer les messages de debug ou détails techniques dans les réponses HTTP
- Ne pas afficher les erreurs 500 avec message interne
- Renvoyer des messages génériques et sécurisés
"""

from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings
from django.core.exceptions import PermissionDenied, ValidationError
from django.http import Http404
import logging
import traceback

logger = logging.getLogger('security_audit')


def custom_exception_handler(exc, context):
    """
    Gestionnaire d'exceptions personnalisé pour Django REST Framework
    """
    # Appeler le gestionnaire d'exceptions par défaut de DRF
    response = exception_handler(exc, context)
    
    # Récupérer les informations de la requête
    request = context.get('request')
    view = context.get('view')
    
    # Logger l'exception
    _log_exception(exc, context)
    
    # Si DRF n'a pas géré l'exception, créer une réponse personnalisée
    if response is None:
        response = _handle_generic_error(exc, context)
    else:
        # Masquer les détails en production
        if not settings.DEBUG:
            response.data = _sanitize_error_response(response.data, exc)
    
    # Ajouter des en-têtes de sécurité
    if response:
        response['X-Content-Type-Options'] = 'nosniff'
        response['X-Frame-Options'] = 'DENY'
        response['X-XSS-Protection'] = '1; mode=block'
    
    return response


def _sanitize_error_response(data, exc):
    """
    Masque les détails techniques dans les réponses d'erreur en production
    """
    if not settings.DEBUG:
        # Messages génériques par type d'erreur
        if isinstance(exc, PermissionDenied):
            return {'detail': 'Accès refusé. Vous n\'avez pas les permissions nécessaires.'}
        elif isinstance(exc, Http404):
            return {'detail': 'Ressource non trouvée.'}
        elif isinstance(exc, ValidationError):
            return {'detail': 'Les données fournies sont invalides.'}
        else:
            # Pour toutes les autres erreurs, message générique
            if isinstance(data, dict):
                # Garder uniquement le champ "detail" si présent
                if 'detail' in data:
                    return {'detail': 'Une erreur s\'est produite lors du traitement de votre requête.'}
                # Sinon, remplacer tous les détails par un message générique
                return {'detail': 'Une erreur s\'est produite. Veuillez réessayer ultérieurement.'}
    
    return data


def _handle_generic_error(exc, context):
    """
    Gère les exceptions non gérées par DRF
    """
    request = context.get('request')
    
    # Déterminer le code de statut approprié
    if isinstance(exc, PermissionDenied):
        status_code = status.HTTP_403_FORBIDDEN
        detail = 'Accès refusé.'
    elif isinstance(exc, Http404):
        status_code = status.HTTP_404_NOT_FOUND
        detail = 'Ressource non trouvée.'
    elif isinstance(exc, ValidationError):
        status_code = status.HTTP_400_BAD_REQUEST
        detail = 'Données invalides.'
    else:
        status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        detail = 'Erreur interne du serveur.'
    
    # En mode debug, inclure plus de détails
    if settings.DEBUG:
        detail = str(exc)
    
    return Response(
        {'detail': detail},
        status=status_code
    )


def _log_exception(exc, context):
    """
    Logger les exceptions avec détails pour analyse
    """
    request = context.get('request')
    view = context.get('view')
    
    # Informations sur l'exception
    exc_info = {
        'exception_type': type(exc).__name__,
        'exception_message': str(exc),
        'view': str(view.__class__.__name__) if view else 'Unknown',
        'path': request.path if request else 'Unknown',
        'method': request.method if request else 'Unknown',
        'user': str(request.user) if request and request.user.is_authenticated else 'Anonymous',
    }
    
    # Logger l'erreur avec la stack trace en mode debug
    if settings.DEBUG:
        logger.error(
            f"[EXCEPTION] {exc_info['exception_type']}: {exc_info['exception_message']}",
            extra=exc_info,
            exc_info=True
        )
    else:
        # En production, logger sans stack trace complète
        logger.error(
            f"[EXCEPTION] {exc_info['exception_type']} at {exc_info['path']}",
            extra=exc_info
        )


class SecureErrorResponse:
    """
    Classe utilitaire pour créer des réponses d'erreur sécurisées
    """
    
    @staticmethod
    def bad_request(message="Mauvaise requête", field_errors=None):
        """Erreur 400 - Mauvaise requête"""
        data = {'detail': message}
        if field_errors and settings.DEBUG:
            data['errors'] = field_errors
        return Response(data, status=status.HTTP_400_BAD_REQUEST)
    
    @staticmethod
    def unauthorized(message="Non authentifié"):
        """Erreur 401 - Non authentifié"""
        return Response({'detail': message}, status=status.HTTP_401_UNAUTHORIZED)
    
    @staticmethod
    def forbidden(message="Accès refusé"):
        """Erreur 403 - Accès refusé"""
        return Response({'detail': message}, status=status.HTTP_403_FORBIDDEN)
    
    @staticmethod
    def not_found(message="Ressource non trouvée"):
        """Erreur 404 - Non trouvé"""
        return Response({'detail': message}, status=status.HTTP_404_NOT_FOUND)
    
    @staticmethod
    def conflict(message="Conflit détecté"):
        """Erreur 409 - Conflit"""
        return Response({'detail': message}, status=status.HTTP_409_CONFLICT)
    
    @staticmethod
    def too_many_requests(message="Trop de requêtes. Veuillez réessayer plus tard."):
        """Erreur 429 - Trop de requêtes"""
        return Response({'detail': message}, status=status.HTTP_429_TOO_MANY_REQUESTS)
    
    @staticmethod
    def internal_error(message="Erreur interne du serveur"):
        """Erreur 500 - Erreur interne"""
        # En production, toujours utiliser un message générique
        if not settings.DEBUG:
            message = "Erreur interne du serveur"
        return Response({'detail': message}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    @staticmethod
    def service_unavailable(message="Service temporairement indisponible"):
        """Erreur 503 - Service indisponible"""
        return Response({'detail': message}, status=status.HTTP_503_SERVICE_UNAVAILABLE)


class APIErrorCodes:
    """
    Codes d'erreur standardisés pour l'API
    """
    # Erreurs d'authentification
    INVALID_CREDENTIALS = 'INVALID_CREDENTIALS'
    TOKEN_EXPIRED = 'TOKEN_EXPIRED'
    TOKEN_INVALID = 'TOKEN_INVALID'
    ACCOUNT_LOCKED = 'ACCOUNT_LOCKED'
    ACCOUNT_DISABLED = 'ACCOUNT_DISABLED'
    
    # Erreurs de permissions
    PERMISSION_DENIED = 'PERMISSION_DENIED'
    INSUFFICIENT_ROLE = 'INSUFFICIENT_ROLE'
    
    # Erreurs de validation
    VALIDATION_ERROR = 'VALIDATION_ERROR'
    REQUIRED_FIELD_MISSING = 'REQUIRED_FIELD_MISSING'
    INVALID_FORMAT = 'INVALID_FORMAT'
    
    # Erreurs de ressources
    RESOURCE_NOT_FOUND = 'RESOURCE_NOT_FOUND'
    RESOURCE_ALREADY_EXISTS = 'RESOURCE_ALREADY_EXISTS'
    RESOURCE_CONFLICT = 'RESOURCE_CONFLICT'
    
    # Erreurs de sécurité
    RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED'
    SUSPICIOUS_ACTIVITY = 'SUSPICIOUS_ACTIVITY'
    
    # Erreurs système
    INTERNAL_ERROR = 'INTERNAL_ERROR'
    SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE'


def create_error_response(error_code, message, status_code=status.HTTP_400_BAD_REQUEST, extra_data=None):
    """
    Crée une réponse d'erreur standardisée avec code d'erreur
    
    Usage:
        return create_error_response(
            error_code=APIErrorCodes.INVALID_CREDENTIALS,
            message="Identifiants invalides",
            status_code=status.HTTP_401_UNAUTHORIZED
        )
    """
    data = {
        'error_code': error_code,
        'detail': message if settings.DEBUG else _get_safe_message(error_code)
    }
    
    if extra_data and settings.DEBUG:
        data['extra'] = extra_data
    
    return Response(data, status=status_code)


def _get_safe_message(error_code):
    """
    Retourne un message sécurisé basé sur le code d'erreur
    """
    safe_messages = {
        APIErrorCodes.INVALID_CREDENTIALS: "Identifiants invalides",
        APIErrorCodes.TOKEN_EXPIRED: "Session expirée. Veuillez vous reconnecter.",
        APIErrorCodes.TOKEN_INVALID: "Token invalide",
        APIErrorCodes.ACCOUNT_LOCKED: "Compte temporairement verrouillé",
        APIErrorCodes.ACCOUNT_DISABLED: "Compte désactivé",
        APIErrorCodes.PERMISSION_DENIED: "Accès refusé",
        APIErrorCodes.INSUFFICIENT_ROLE: "Permissions insuffisantes",
        APIErrorCodes.VALIDATION_ERROR: "Données invalides",
        APIErrorCodes.REQUIRED_FIELD_MISSING: "Champs requis manquants",
        APIErrorCodes.INVALID_FORMAT: "Format de données invalide",
        APIErrorCodes.RESOURCE_NOT_FOUND: "Ressource non trouvée",
        APIErrorCodes.RESOURCE_ALREADY_EXISTS: "Ressource déjà existante",
        APIErrorCodes.RESOURCE_CONFLICT: "Conflit détecté",
        APIErrorCodes.RATE_LIMIT_EXCEEDED: "Trop de requêtes. Veuillez réessayer plus tard.",
        APIErrorCodes.SUSPICIOUS_ACTIVITY: "Activité suspecte détectée",
        APIErrorCodes.INTERNAL_ERROR: "Erreur interne du serveur",
        APIErrorCodes.SERVICE_UNAVAILABLE: "Service temporairement indisponible",
    }
    
    return safe_messages.get(error_code, "Une erreur s'est produite")
