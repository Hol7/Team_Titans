"""
Middleware d'audit et de logging pour TMTT
Enregistre toutes les actions sensibles avec détails utilisateur et timestamp

Politique de Sécurité: 
- Journaliser les actions sensibles (connexion, suppression, modification critique)
- Ne jamais logger les mots de passe ou données sensibles
- Inclure l'IP, le timestamp, l'utilisateur et l'action
"""

import logging
import json
from django.utils.timezone import now
from django.urls import resolve
from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

# Configuration du logger
logger = logging.getLogger('security_audit')


class AuditLog(models.Model):
    """
    Modèle pour stocker les logs d'audit dans la base de données
    """
    class ActionType(models.TextChoices):
        LOGIN = 'login', 'Connexion'
        LOGOUT = 'logout', 'Déconnexion'
        LOGIN_FAILED = 'login_failed', 'Échec de connexion'
        USER_CREATE = 'user_create', 'Création utilisateur'
        USER_UPDATE = 'user_update', 'Modification utilisateur'
        USER_DELETE = 'user_delete', 'Suppression utilisateur'
        ROLE_CHANGE = 'role_change', 'Changement de rôle'
        PASSWORD_CHANGE = 'password_change', 'Changement de mot de passe'
        TEAM_CREATE = 'team_create', 'Création équipe'
        TEAM_UPDATE = 'team_update', 'Modification équipe'
        TEAM_DELETE = 'team_delete', 'Suppression équipe'
        ATTENDANCE_CREATE = 'attendance_create', 'Pointage créé'
        ATTENDANCE_UPDATE = 'attendance_update', 'Pointage modifié'
        ATTENDANCE_DELETE = 'attendance_delete', 'Pointage supprimé'
        REPORT_VIEW = 'report_view', 'Consultation rapport'
        REPORT_EXPORT = 'report_export', 'Export rapport'
        PERMISSION_DENIED = 'permission_denied', 'Accès refusé'
        SECURITY_INCIDENT = 'security_incident', 'Incident de sécurité'
        
    timestamp = models.DateTimeField(auto_now_add=True, db_index=True)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    username = models.CharField(max_length=150, blank=True)  # Pour garder trace même si user supprimé
    action = models.CharField(max_length=50, choices=ActionType.choices)
    resource_type = models.CharField(max_length=50, blank=True)
    resource_id = models.CharField(max_length=50, blank=True)
    ip_address = models.GenericIPAddressField()
    user_agent = models.TextField(blank=True)
    endpoint = models.CharField(max_length=255)
    method = models.CharField(max_length=10)
    status_code = models.IntegerField(null=True, blank=True)
    details = models.JSONField(default=dict, blank=True)
    success = models.BooleanField(default=True)
    
    class Meta:
        verbose_name = "Log d'audit"
        verbose_name_plural = "Logs d'audit"
        ordering = ['-timestamp']
        indexes = [
            models.Index(fields=['-timestamp']),
            models.Index(fields=['user', '-timestamp']),
            models.Index(fields=['action', '-timestamp']),
            models.Index(fields=['ip_address', '-timestamp']),
        ]
    
    def __str__(self):
        return f"{self.timestamp} - {self.username or 'Anonymous'} - {self.get_action_display()}"


class SecurityAuditMiddleware:
    """
    Middleware pour auditer toutes les requêtes et actions sensibles
    """
    
    # Endpoints sensibles à logger
    SENSITIVE_ENDPOINTS = [
        '/api/v1/auth/login',
        '/api/v1/auth/logout',
        '/api/v1/auth/users/create',
        '/api/v1/auth/users/',
        '/api/v1/teams/',
        '/api/v1/attendance/',
        '/api/v1/reports/',
    ]
    
    # Méthodes sensibles à logger
    SENSITIVE_METHODS = ['POST', 'PUT', 'PATCH', 'DELETE']
    
    def __init__(self, get_response):
        self.get_response = get_response
    
    def __call__(self, request):
        # Avant le traitement de la requête
        self._log_request(request)
        
        # Traiter la requête
        response = self.get_response(request)
        
        # Après le traitement de la requête
        self._log_response(request, response)
        
        return response
    
    def _get_client_ip(self, request):
        """Récupère l'adresse IP du client"""
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip
    
    def _is_sensitive_request(self, request):
        """Vérifie si la requête est sensible et doit être loggée"""
        path = request.path
        method = request.method
        
        # Logger toutes les méthodes sensibles
        if method in self.SENSITIVE_METHODS:
            return True
        
        # Logger tous les endpoints sensibles
        for endpoint in self.SENSITIVE_ENDPOINTS:
            if endpoint in path:
                return True
        
        return False
    
    def _sanitize_data(self, data):
        """Retire les données sensibles avant le logging"""
        if isinstance(data, dict):
            sanitized = data.copy()
            # Ne jamais logger les mots de passe
            sensitive_fields = ['password', 'token', 'refresh', 'access', 'secret', 'api_key']
            for field in sensitive_fields:
                if field in sanitized:
                    sanitized[field] = '***REDACTED***'
            return sanitized
        return data
    
    def _log_request(self, request):
        """Log la requête entrante"""
        if not self._is_sensitive_request(request):
            return
        
        user = request.user if request.user.is_authenticated else None
        ip = self._get_client_ip(request)
        
        log_data = {
            'timestamp': now().isoformat(),
            'user': str(user) if user else 'Anonymous',
            'ip': ip,
            'method': request.method,
            'path': request.path,
            'user_agent': request.META.get('HTTP_USER_AGENT', '')[:255],
        }
        
        logger.info(f"[REQUEST] {json.dumps(log_data)}")
    
    def _log_response(self, request, response):
        """Log la réponse et crée un enregistrement d'audit"""
        if not self._is_sensitive_request(request):
            return
        
        user = request.user if request.user.is_authenticated else None
        ip = self._get_client_ip(request)
        
        # Déterminer le type d'action
        action = self._determine_action(request, response)
        
        # Créer l'enregistrement d'audit
        try:
            audit_log = AuditLog.objects.create(
                user=user,
                username=user.username if user else '',
                action=action,
                ip_address=ip,
                user_agent=request.META.get('HTTP_USER_AGENT', '')[:255],
                endpoint=request.path,
                method=request.method,
                status_code=response.status_code,
                success=200 <= response.status_code < 400,
                details=self._get_request_details(request)
            )
            
            # Logger en console également
            log_level = logging.INFO if audit_log.success else logging.WARNING
            logger.log(
                log_level,
                f"[AUDIT] {audit_log.username or 'Anonymous'} - {audit_log.get_action_display()} - "
                f"{audit_log.method} {audit_log.endpoint} - Status: {audit_log.status_code}"
            )
            
        except Exception as e:
            logger.error(f"[AUDIT ERROR] Failed to create audit log: {str(e)}")
    
    def _determine_action(self, request, response):
        """Détermine le type d'action basé sur l'endpoint et la méthode"""
        path = request.path
        method = request.method
        status = response.status_code
        
        # Connexion/Déconnexion
        if '/login' in path:
            return AuditLog.ActionType.LOGIN if status < 400 else AuditLog.ActionType.LOGIN_FAILED
        if '/logout' in path:
            return AuditLog.ActionType.LOGOUT
        
        # Gestion des utilisateurs
        if '/users/' in path:
            if method == 'POST':
                return AuditLog.ActionType.USER_CREATE
            elif method in ['PUT', 'PATCH']:
                return AuditLog.ActionType.USER_UPDATE
            elif method == 'DELETE':
                return AuditLog.ActionType.USER_DELETE
        
        # Gestion des équipes
        if '/teams/' in path:
            if method == 'POST':
                return AuditLog.ActionType.TEAM_CREATE
            elif method in ['PUT', 'PATCH']:
                return AuditLog.ActionType.TEAM_UPDATE
            elif method == 'DELETE':
                return AuditLog.ActionType.TEAM_DELETE
        
        # Pointages
        if '/attendance/' in path:
            if method == 'POST':
                return AuditLog.ActionType.ATTENDANCE_CREATE
            elif method in ['PUT', 'PATCH']:
                return AuditLog.ActionType.ATTENDANCE_UPDATE
            elif method == 'DELETE':
                return AuditLog.ActionType.ATTENDANCE_DELETE
        
        # Rapports
        if '/reports/' in path:
            if 'export' in path:
                return AuditLog.ActionType.REPORT_EXPORT
            return AuditLog.ActionType.REPORT_VIEW
        
        # Accès refusé
        if status == 403:
            return AuditLog.ActionType.PERMISSION_DENIED
        
        # Action générique pour les cas non couverts
        return 'other'
    
    def _get_request_details(self, request):
        """Récupère les détails de la requête (sans données sensibles)"""
        details = {
            'query_params': dict(request.GET),
        }
        
        # Ajouter le body pour POST/PUT/PATCH (sans mots de passe)
        if request.method in ['POST', 'PUT', 'PATCH']:
            try:
                if hasattr(request, 'data'):
                    details['body'] = self._sanitize_data(dict(request.data))
            except:
                pass
        
        return details


def log_security_event(user, action, resource_type='', resource_id='', details=None, success=True, ip_address='0.0.0.0'):
    """
    Fonction utilitaire pour logger manuellement un événement de sécurité
    
    Usage:
        log_security_event(
            user=request.user,
            action=AuditLog.ActionType.PASSWORD_CHANGE,
            success=True,
            ip_address=get_client_ip(request)
        )
    """
    try:
        AuditLog.objects.create(
            user=user,
            username=user.username if user else '',
            action=action,
            resource_type=resource_type,
            resource_id=str(resource_id),
            ip_address=ip_address,
            endpoint='',
            method='MANUAL',
            success=success,
            details=details or {}
        )
        
        logger.info(
            f"[SECURITY EVENT] {user.username if user else 'System'} - "
            f"{action} - {'Success' if success else 'Failed'}"
        )
    except Exception as e:
        logger.error(f"[SECURITY EVENT ERROR] Failed to log event: {str(e)}")
