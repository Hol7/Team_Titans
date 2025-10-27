"""
Validateurs personnalisés pour la sécurité des entrées
Prévention XSS, injection SQL, et autres attaques

Politique de Sécurité:
- Valider et filtrer toutes les entrées utilisateurs
- Prévenir XSS (Cross-Site Scripting)
- Prévenir les injections SQL
- Valider les formats de données
"""

import re
from django.core.exceptions import ValidationError
from django.core.validators import RegexValidator
from django.utils.translation import gettext_lazy as _
import html
import bleach


# Configuration Bleach pour le nettoyage HTML
ALLOWED_TAGS = []  # Aucune balise HTML autorisée par défaut
ALLOWED_ATTRIBUTES = {}
ALLOWED_PROTOCOLS = []


def sanitize_html(value):
    """
    Nettoie le HTML et retire toutes les balises et scripts potentiellement dangereux
    """
    if not value:
        return value
    
    # Nettoyer avec bleach
    cleaned = bleach.clean(
        value,
        tags=ALLOWED_TAGS,
        attributes=ALLOWED_ATTRIBUTES,
        protocols=ALLOWED_PROTOCOLS,
        strip=True
    )
    
    # Échapper les caractères HTML restants
    return html.escape(cleaned)


def validate_no_html(value):
    """
    Valide qu'une chaîne ne contient pas de balises HTML
    """
    if not value:
        return
    
    # Vérifier la présence de balises HTML
    html_pattern = re.compile(r'<[^>]+>')
    if html_pattern.search(str(value)):
        raise ValidationError(
            _('Les balises HTML ne sont pas autorisées.'),
            code='html_not_allowed'
        )


def validate_no_sql_keywords(value):
    """
    Détecte les tentatives d'injection SQL basiques
    """
    if not value:
        return
    
    # Mots-clés SQL dangereux
    sql_keywords = [
        'SELECT', 'INSERT', 'UPDATE', 'DELETE', 'DROP', 'CREATE', 'ALTER',
        'EXEC', 'EXECUTE', 'UNION', 'DECLARE', '--', '/*', '*/', 'xp_',
        'sp_', 'GRANT', 'REVOKE', 'TRUNCATE', 'SCRIPT'
    ]
    
    value_upper = str(value).upper()
    
    # Vérifier chaque mot-clé
    for keyword in sql_keywords:
        if keyword in value_upper:
            raise ValidationError(
                _('Contenu suspect détecté dans votre saisie.'),
                code='suspicious_content'
            )


def validate_no_script_tags(value):
    """
    Valide qu'une chaîne ne contient pas de tags <script>
    """
    if not value:
        return
    
    script_pattern = re.compile(r'<script[\s\S]*?>[\s\S]*?</script>', re.IGNORECASE)
    if script_pattern.search(str(value)):
        raise ValidationError(
            _('Les scripts ne sont pas autorisés.'),
            code='script_not_allowed'
        )


def validate_safe_filename(value):
    """
    Valide qu'un nom de fichier est sûr (pas de path traversal)
    """
    if not value:
        return
    
    # Caractères dangereux dans les noms de fichiers
    dangerous_patterns = [
        '..',  # Path traversal
        '/',   # Directory separator
        '\\',  # Windows directory separator
        ':',   # Drive letter (Windows)
        '*',   # Wildcard
        '?',   # Wildcard
        '"',   # Quote
        '<',   # Redirection
        '>',   # Redirection
        '|',   # Pipe
    ]
    
    for pattern in dangerous_patterns:
        if pattern in str(value):
            raise ValidationError(
                _('Le nom de fichier contient des caractères non autorisés.'),
                code='unsafe_filename'
            )


def validate_alphanumeric_with_spaces(value):
    """
    Valide que la valeur ne contient que des caractères alphanumériques et espaces
    """
    if not value:
        return
    
    pattern = re.compile(r'^[a-zA-Z0-9\sÀ-ÿ\'-]+$')
    if not pattern.match(str(value)):
        raise ValidationError(
            _('Seuls les lettres, chiffres et espaces sont autorisés.'),
            code='invalid_characters'
        )


def validate_username_secure(value):
    """
    Valide un nom d'utilisateur sécurisé
    - 3-50 caractères
    - Lettres, chiffres, tirets, underscores uniquement
    - Pas de caractères spéciaux dangereux
    """
    if not value:
        raise ValidationError(_('Le nom d\'utilisateur est requis.'))
    
    if len(value) < 3:
        raise ValidationError(_('Le nom d\'utilisateur doit contenir au moins 3 caractères.'))
    
    if len(value) > 50:
        raise ValidationError(_('Le nom d\'utilisateur ne peut pas dépasser 50 caractères.'))
    
    pattern = re.compile(r'^[a-zA-Z0-9_-]+$')
    if not pattern.match(value):
        raise ValidationError(
            _('Le nom d\'utilisateur ne peut contenir que des lettres, chiffres, tirets et underscores.'),
            code='invalid_username'
        )


def validate_phone_number(value):
    """
    Valide un numéro de téléphone (format international)
    """
    if not value:
        return
    
    # Retirer les espaces et autres caractères de formatage
    cleaned = re.sub(r'[\s\-\(\)\.]', '', str(value))
    
    # Vérifier le format
    pattern = re.compile(r'^\+?[0-9]{8,15}$')
    if not pattern.match(cleaned):
        raise ValidationError(
            _('Format de numéro de téléphone invalide.'),
            code='invalid_phone'
        )


def validate_email_secure(value):
    """
    Validation d'email renforcée
    """
    if not value:
        return
    
    # Pattern email basique mais strict
    pattern = re.compile(
        r'^[a-zA-Z0-9][a-zA-Z0-9._-]*@[a-zA-Z0-9][a-zA-Z0-9.-]*\.[a-zA-Z]{2,}$'
    )
    
    if not pattern.match(value):
        raise ValidationError(
            _('Format d\'email invalide.'),
            code='invalid_email'
        )
    
    # Vérifier les domaines suspects
    suspicious_domains = ['tempmail', 'throwaway', '10minutemail', 'guerrillamail']
    email_domain = value.split('@')[1].lower() if '@' in value else ''
    
    for suspicious in suspicious_domains:
        if suspicious in email_domain:
            raise ValidationError(
                _('Ce domaine email n\'est pas autorisé.'),
                code='suspicious_email_domain'
            )


def validate_password_strength(value):
    """
    Valide la force d'un mot de passe
    - Au moins 8 caractères
    - Au moins une majuscule
    - Au moins une minuscule
    - Au moins un chiffre
    - Au moins un caractère spécial (optionnel mais recommandé)
    """
    if not value:
        raise ValidationError(_('Le mot de passe est requis.'))
    
    if len(value) < 8:
        raise ValidationError(
            _('Le mot de passe doit contenir au moins 8 caractères.'),
            code='password_too_short'
        )
    
    if len(value) > 128:
        raise ValidationError(
            _('Le mot de passe ne peut pas dépasser 128 caractères.'),
            code='password_too_long'
        )
    
    # Vérifier la présence de majuscules
    if not re.search(r'[A-Z]', value):
        raise ValidationError(
            _('Le mot de passe doit contenir au moins une lettre majuscule.'),
            code='password_no_upper'
        )
    
    # Vérifier la présence de minuscules
    if not re.search(r'[a-z]', value):
        raise ValidationError(
            _('Le mot de passe doit contenir au moins une lettre minuscule.'),
            code='password_no_lower'
        )
    
    # Vérifier la présence de chiffres
    if not re.search(r'\d', value):
        raise ValidationError(
            _('Le mot de passe doit contenir au moins un chiffre.'),
            code='password_no_digit'
        )


def validate_no_common_passwords(value):
    """
    Vérifie que le mot de passe n'est pas un mot de passe commun
    """
    if not value:
        return
    
    common_passwords = [
        'password', 'password123', '123456', '12345678', 'qwerty',
        'abc123', 'monkey', '1234567', 'letmein', 'trustno1',
        'dragon', 'baseball', 'iloveyou', 'master', 'sunshine',
        'ashley', 'bailey', 'shadow', 'superman', 'qwertyuiop',
        'admin', 'root', 'toor', 'administrator'
    ]
    
    if value.lower() in common_passwords:
        raise ValidationError(
            _('Ce mot de passe est trop courant. Veuillez en choisir un plus sécurisé.'),
            code='password_too_common'
        )


def validate_input_length(value, min_length=0, max_length=None):
    """
    Valide la longueur d'une chaîne
    """
    if not value:
        if min_length > 0:
            raise ValidationError(
                _(f'Ce champ doit contenir au moins {min_length} caractères.'),
                code='min_length'
            )
        return
    
    length = len(str(value))
    
    if length < min_length:
        raise ValidationError(
            _(f'Ce champ doit contenir au moins {min_length} caractères.'),
            code='min_length'
        )
    
    if max_length and length > max_length:
        raise ValidationError(
            _(f'Ce champ ne peut pas dépasser {max_length} caractères.'),
            code='max_length'
        )


class SecureInputValidator:
    """
    Classe de validation pour appliquer plusieurs validations en une seule fois
    """
    
    @staticmethod
    def validate_text_input(value, allow_html=False, max_length=None):
        """
        Valide une entrée texte générique
        """
        if not allow_html:
            validate_no_html(value)
            validate_no_script_tags(value)
        
        validate_no_sql_keywords(value)
        
        if max_length:
            validate_input_length(value, max_length=max_length)
        
        return sanitize_html(value) if not allow_html else value
    
    @staticmethod
    def validate_user_input(username=None, email=None, password=None, phone=None):
        """
        Valide les données d'un utilisateur
        """
        errors = {}
        
        if username:
            try:
                validate_username_secure(username)
            except ValidationError as e:
                errors['username'] = e.messages
        
        if email:
            try:
                validate_email_secure(email)
            except ValidationError as e:
                errors['email'] = e.messages
        
        if password:
            try:
                validate_password_strength(password)
                validate_no_common_passwords(password)
            except ValidationError as e:
                errors['password'] = e.messages
        
        if phone:
            try:
                validate_phone_number(phone)
            except ValidationError as e:
                errors['phone'] = e.messages
        
        if errors:
            raise ValidationError(errors)
        
        return True


# Validateurs Django réutilisables
username_validator = RegexValidator(
    regex=r'^[a-zA-Z0-9_-]+$',
    message='Le nom d\'utilisateur ne peut contenir que des lettres, chiffres, tirets et underscores.',
    code='invalid_username'
)

alphanumeric_validator = RegexValidator(
    regex=r'^[a-zA-Z0-9\sÀ-ÿ\'-]+$',
    message='Seuls les lettres, chiffres et espaces sont autorisés.',
    code='invalid_characters'
)
