"""
Système de permissions basé sur la matrice RACI
Politique de Sécurité Applicative - Projet TMTT

Matrice RACI:
- R (Responsable): exécute la tâche
- A (Autorité): valide ou supervise
- C (Consulté): apporte son expertise
- I (Informé): reçoit l'information

Rôles:
- GCA
- CA
- Pirates
- Luffy
- Kira
- Jarvis
"""
from rest_framework.permissions import BasePermission
from rest_framework import permissions
from .models import User


class IsGCA(permissions.BasePermission):
    """
    Permission pour GCA
    Responsable de la création, modification et suppression des comptes
    """
    message = "Accès refusé. Seul le GCA peut effectuer cette action."
    
    def has_permission(self, request, view):
        return (
            request.user and 
            request.user.is_authenticated and 
            request.user.is_gca()
        )


class IsCA(permissions.BasePermission):
    """
    Permission pour CA
    Chargé de la structuration des équipes
    """
    message = "Accès refusé. Seul le CA peut effectuer cette action."
    
    def has_permission(self, request, view):
        return (
            request.user and 
            request.user.is_authenticated and 
            request.user.is_ca()
        )


class IsPirates(permissions.BasePermission):
    """
    Permission pour Pirates
    Accès limité à ses propres données et pointages
    """
    message = "Accès refusé. Fonctionnalité réservée aux utilisateurs de base."
    
    def has_permission(self, request, view):
        return (
            request.user and 
            request.user.is_authenticated and 
            request.user.role == User.Role.PIRATES
        )
    
    def has_object_permission(self, request, view, obj):
        # Les Pirates ne peuvent accéder qu'à leurs propres données
        return obj == request.user or (hasattr(obj, 'user') and obj.user == request.user)


class IsLuffy(permissions.BasePermission):
    """
    Permission pour Luffy
    Gestion des membres rattachés uniquement à sa team
    """
    message = "Accès refusé. Fonctionnalité réservée aux responsables d'équipe."
    
    def has_permission(self, request, view):
        return (
            request.user and 
            request.user.is_authenticated and 
            request.user.is_luffy()
        )


class IsKira(permissions.BasePermission):
    """
    Permission pour Kira
    Lecture globale des rapports, sans modification
    """
    message = "Accès refusé. Fonctionnalité réservée à Kira."
    
    def has_permission(self, request, view):
        return (
            request.user and 
            request.user.is_authenticated and 
            request.user.is_kira()
        )


class IsJarvis(permissions.BasePermission):
    """
    Permission pour Jarvis
    Supervision de la sécurité, analyse des logs et détection d'incidents
    """
    message = "Accès refusé. Fonctionnalité réservée à Jarvis."
    
    def has_permission(self, request, view):
        return (
            request.user and 
            request.user.is_authenticated and 
            request.user.is_jarvis()
        )

class IsCyber(permissions.BasePermission):
    """
    Permission pour Cyber
    Générer les codes qr pour le pointage
    """
    message = "Accès refusé. Fonctionnalité réservée à Cyber."
    
    def has_permission(self, request, view):
        return (
            request.user and 
            request.user.is_authenticated and 
            request.user.is_cyber()
        )


class CanManageAccounts(permissions.BasePermission):
    """
    Gestion des comptes utilisateurs
    RACI: GCA (R), Jarvis (I)
    """
    message = "Accès refusé. Vous n'avez pas les permissions pour gérer les comptes."
    
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        
        # GCA est responsable
        if request.user.is_gca():
            return True
        
        # Jarvis peut consulter (lecture seule pour audit)
        if request.user.is_jarvis() and request.method in permissions.SAFE_METHODS:
            return True
        
        return False


class CanManageTeams(permissions.BasePermission):
    """
    Gestion des équipes
    RACI: CA (R, A), Jarvis (I)
    """
    message = "Accès refusé. Vous n'avez pas les permissions pour gérer les équipes."
    
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        
        # CA est responsable
        if request.user.is_ca():
            return True
        
        # GCA a autorité
        if request.user.is_gca():
            return True
        
        # Jarvis peut consulter (lecture seule)
        if request.user.is_jarvis() and request.method in permissions.SAFE_METHODS:
            return True
        
        return False


class CanAccessAttendance(permissions.BasePermission):
    """
    Connexion et pointage
    RACI: Pirates (R), Luffy (I)
    """
    message = "Accès refusé. Fonctionnalité de pointage non accessible."
    
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        
        # Pirates peuvent pointer
        if request.user.role == User.Role.PIRATES:
            return True
        
        # Luffy peut consulter les pointages de son équipe
        if request.user.is_luffy():
            return True
        
        # GCA et Jarvis peuvent consulter (lecture seule)
        if (request.user.is_gca() or request.user.is_jarvis()) and request.method in permissions.SAFE_METHODS:
            return True
        
        return False


class CanManageTeamMembers(permissions.BasePermission):
    """
    Gestion des membres de sa team
    RACI: Luffy (R), Kira (I)
    """
    message = "Accès refusé. Vous ne pouvez gérer que les membres de votre équipe."
    
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        
        # Luffy est responsable de sa team
        if request.user.is_luffy():
            return True
        
        # GCA a autorité globale
        if request.user.is_gca():
            return True
        
        # CA (RH) peut gérer toutes les équipes
        if request.user.is_ca():
            return True
        
        return False


class CanViewReports(permissions.BasePermission):
    """
    Visualisation générale des données
    RACI: Kira (R), Jarvis (I)
    """
    message = "Accès refusé. Vous n'avez pas accès aux rapports."
    
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        
        # Lecture seule uniquement
        if request.method not in permissions.SAFE_METHODS:
            return False
        
        # Kira est responsable de l'analyse
        if request.user.is_kira():
            return True
        
        # Jarvis peut consulter pour la sécurité
        if request.user.is_jarvis():
            return True
        
        # GCA et CA peuvent consulter
        if request.user.is_gca() or request.user.is_ca():
            return True
        
        # Luffy peut voir les rapports de sa team
        if request.user.is_luffy():
            return True
        
        return False


class CanManageLogs(permissions.BasePermission):
    """
    Gestion des logs et sécurité
    RACI: Jarvis (R)
    """
    message = "Accès refusé. Seul Jarvis peut gérer les logs."
    
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        
        # Jarvis est responsable de la sécurité
        if request.user.is_jarvis():
            return True
        
        # GCA peut consulter (lecture seule)
        if request.user.is_gca() and request.method in permissions.SAFE_METHODS:
            return True
        
        return False
    
class CanGenerateQRCode(BasePermission):
    """
    Permission : autorise uniquement le rôle 'Cyber' à générer les QR codes
    de pointage (utilisés pour les arrivées et départs des employés).
    """

    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        
        if request.user.is_cyber():
            return True

        return False


class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Permission pour permettre aux utilisateurs de modifier uniquement leurs propres données
    """
    message = "Vous ne pouvez modifier que vos propres données."
    
    def has_object_permission(self, request, view, obj):
        # Lecture autorisée pour tous les utilisateurs authentifiés
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # Écriture autorisée uniquement pour le propriétaire
        if hasattr(obj, 'user'):
            return obj.user == request.user
        
        return obj == request.user


class RoleBasedPermission(permissions.BasePermission):
    """
    Permission générique basée sur les rôles
    Utilise un mapping des rôles autorisés par action
    """
    
    # Mapping des actions vers les rôles autorisés
    ROLE_PERMISSIONS = {
        'list': [User.Role.GCA, User.Role.CA, User.Role.KIRA, User.Role.JARVIS, User.Role.LUFFY, User.Role.CYBER],
        'retrieve': [User.Role.GCA, User.Role.CA, User.Role.KIRA, User.Role.JARVIS, User.Role.LUFFY],
        'create': [User.Role.GCA, User.Role.CA],
        'update': [User.Role.GCA, User.Role.CA, User.Role.LUFFY],
        'partial_update': [User.Role.GCA, User.Role.CA, User.Role.LUFFY],
        'destroy': [User.Role.GCA],
    }
    
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        
        # Obtenir l'action de la vue
        action = getattr(view, 'action', None)
        
        if action is None:
            # Pour les vues basées sur des fonctions
            if request.method == 'GET':
                action = 'list'
            elif request.method == 'POST':
                action = 'create'
            elif request.method in ['PUT', 'PATCH']:
                action = 'update'
            elif request.method == 'DELETE':
                action = 'destroy'
        
        # Vérifier si l'utilisateur a le rôle requis
        allowed_roles = self.ROLE_PERMISSIONS.get(action, [])
        return request.user.role in allowed_roles or request.user.is_superuser
