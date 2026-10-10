import re
from typing import List, Optional
from urllib.parse import urlparse

URL_REGEX = re.compile(
    r'(?:https?://)?(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(?:/[^\s]*)?'
)

DOMAIN_REGEX = re.compile(
    r'^[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z]{2,})+$'
)

PHONE_REGEX = re.compile(
    r'^\+?[1-9]\d{1,14}$'
)

EMAIL_REGEX = re.compile(
    r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
)

CRYPTO_WALLET_REGEX = re.compile(
    r'^(0x[a-fA-F0-9]{40}|[13][a-km-zA-HJ-NP-Z1-9]{25,34}|bc1[a-z0-9]{39,59})$'
)

def extract_urls(text: str) -> List[str]:
    """Extract all URLs and domain links from a text string."""
    if not text:
        return []
    matches = URL_REGEX.findall(text)
    # Filter out common false positives like email domains or file extensions without path
    clean = []
    for m in matches:
        # Strip trailing punctuation
        m_clean = m.rstrip('.,!?:;')
        if m_clean and '.' in m_clean:
            clean.append(m_clean)
    return list(set(clean))

def extract_phone_numbers(text: str) -> List[str]:
    """Extract phone numbers from text."""
    if not text:
        return []
    # Match standard international/domestic phone patterns
    pattern = re.compile(r'(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}')
    return pattern.findall(text)

def extract_emails(text: str) -> List[str]:
    """Extract emails from text."""
    if not text:
        return []
    pattern = re.compile(r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}')
    return pattern.findall(text)

def extract_crypto_wallets(text: str) -> List[str]:
    """Extract BTC or ETH crypto wallets from text."""
    if not text:
        return []
    matches = []
    # ETH
    eth_pattern = re.compile(r'0x[a-fA-F0-9]{40}')
    matches.extend(eth_pattern.findall(text))
    # BTC
    btc_pattern = re.compile(r'\b(bc1|[13])[a-km-zA-HJ-NP-Z1-9]{25,39}\b')
    matches.extend([m.group(0) for m in btc_pattern.finditer(text)])
    return list(set(matches))

def get_domain_from_url(url: str) -> Optional[str]:
    """Parse domain name from URL."""
    try:
        if not url.startswith(("http://", "https://")):
            url = "http://" + url
        parsed = urlparse(url)
        domain = parsed.netloc.split(':')[0]
        return domain.lower() if domain else None
    except Exception:
        return None

def is_ip_address(host: str) -> bool:
    """Check if host is raw IP address."""
    if not host:
        return False
    ip_pattern = re.compile(r'^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$')
    return bool(ip_pattern.match(host))

def is_private_or_local_target(target: str) -> bool:
    """Check if URL or hostname targets private IP ranges, localhost, or non-HTTP schemes (SSRF protection)."""
    if not target:
        return False
        
    target_clean = target.strip().lower()
    
    # Check unsafe schemes
    if ":" in target_clean and not target_clean.startswith(("http://", "https://")):
        scheme = target_clean.split(":")[0]
        if scheme in ["file", "ftp", "gopher", "dict", "ldap", "tftp", "php"]:
            return True

    domain = get_domain_from_url(target) or target_clean
    
    # Remove port if present
    if ":" in domain:
        domain = domain.split(":")[0]
        
    # Check localhost and local hostnames
    local_hosts = ["localhost", "127.0.0.1", "0.0.0.0", "::1", "169.254.169.254", "metadata.google.internal"]
    if domain in local_hosts or domain.endswith(".local") or domain.endswith(".internal"):
        return True

    # Check private IP ranges (10.x.x.x, 172.16-31.x.x, 192.168.x.x, 169.254.x.x)
    if is_ip_address(domain):
        parts = [int(p) for p in domain.split(".")]
        if len(parts) == 4:
            if parts[0] == 10:
                return True
            if parts[0] == 172 and 16 <= parts[1] <= 31:
                return True
            if parts[0] == 192 and parts[1] == 168:
                return True
            if parts[0] == 169 and parts[1] == 254:
                return True
            if parts[0] == 127:
                return True
            if parts[0] == 0:
                return True

    return False

