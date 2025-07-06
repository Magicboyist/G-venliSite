import type { AnalysisResult, AnalysisDetails } from '@/types';

// A simple hash function to create a deterministic number from the URL
const simpleHash = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash);
};

// Function to determine hosting country based on TLD
const getCountryFromTld = (hostname: string): string | null => {
    const tldMap: { [key: string]: string } = {
        '.tr': 'Turkey',
        '.de': 'Germany',
        '.cn': 'China',
        '.ru': 'Russia',
        '.uk': 'United Kingdom',
        '.jp': 'Japan',
        '.fr': 'France',
    };

    const sortedTlds = Object.keys(tldMap).sort((a, b) => b.length - a.length);

    for (const tld of sortedTlds) {
        if (hostname.endsWith(tld)) {
            return tldMap[tld];
        }
    }
    return null;
}


export const analyzeUrl = (url: string): AnalysisResult => {
    let score = 50; // Start with a neutral score
    const hash = simpleHash(url);
    let urlObject: URL;

    try {
        urlObject = new URL(url.startsWith('http') ? url : `http://${url}`);
    } catch (e) {
        // If URL parsing fails, it's definitely dangerous
        return {
            url,
            score: 0,
            status: 'Tehlikeli',
            details: {
                sslValid: false,
                protocol: 'Bilinmiyor',
                isNewDomain: true,
                hasSuspiciousJs: true,
                hasFirewall: false,
                hasBotProtection: false,
                isFromSuspiciousIp: true,
                hostingCountry: 'Bilinmiyor',
                knownBreaches: true,
            },
            timestamp: new Date().toISOString(),
        };
    }

    const hostname = urlObject.hostname;
    
    // Whitelist for trusted government domains
    const trustedGovSuffixes: { [key: string]: { country: string; score: number } } = {
        '.gov.tr': { country: 'Turkey', score: 98 },
        '.gov.uk': { country: 'United Kingdom', score: 98 },
        '.gov': { country: 'United States', score: 95 }, // Generic .gov for US
    };

    const sortedGovSuffixes = Object.keys(trustedGovSuffixes).sort((a, b) => b.length - a.length);

    for (const suffix of sortedGovSuffixes) {
        if (hostname.endsWith(suffix)) {
            const { country, score } = trustedGovSuffixes[suffix];
            return {
                url,
                score,
                status: 'Güvenli',
                details: {
                    sslValid: true,
                    protocol: 'HTTPS',
                    isNewDomain: false,
                    hasSuspiciousJs: false,
                    hasFirewall: true,
                    hasBotProtection: true,
                    isFromSuspiciousIp: false,
                    hostingCountry: country,
                    knownBreaches: false,
                },
                timestamp: new Date().toISOString(),
            };
        }
    }

    const detectedCountry = getCountryFromTld(hostname);

    const details: AnalysisDetails = {
        sslValid: false,
        protocol: 'Bilinmiyor',
        isNewDomain: (hash % 100) > 80,       // ~20% chance
        hasSuspiciousJs: (hash % 100) > 70,    // ~30% chance
        hasFirewall: (hash % 100) > 50,        // ~50% chance
        hasBotProtection: (hash % 100) > 60,   // ~40% chance
        isFromSuspiciousIp: (hash % 100) > 90, // ~10% chance
        hostingCountry: detectedCountry || ['United States', 'Germany', 'Ireland', 'Singapore', 'Brazil'][hash % 5], // Fallback to a safer list
        knownBreaches: (hash % 100) > 85,      // ~15% chance
    };

    // --- Scoring Logic ---
    // Protocol and SSL
    if (urlObject.protocol === 'https:') {
        score += 20;
        details.protocol = 'HTTPS';
        // 95% chance of valid SSL if it's HTTPS, to simulate reality a bit
        details.sslValid = (hash % 100) > 5; 
        if (!details.sslValid) {
            score -= 25; // Invalid SSL on HTTPS is a big red flag
        }
    } else {
        score -= 20;
        details.protocol = 'HTTP';
        details.sslValid = false;
    }

    // Other factors
    if (details.isNewDomain) score -= 10;
    if (details.hasSuspiciousJs) score -= 15;
    if (!details.hasFirewall) score -= 5;
    if (!details.hasBotProtection) score -= 5;
    if (details.isFromSuspiciousIp) score -= 20;
    if (details.hostingCountry && ['China', 'Russia'].includes(details.hostingCountry)) score -= 10; // Penalty for specific countries remains
    if (details.knownBreaches) score -= 25;

    // Final score calculation
    score = Math.max(0, Math.min(100, Math.round(score)));

    let status: 'Güvenli' | 'Şüpheli' | 'Tehlikeli';
    if (score >= 80) { // Increased threshold for 'Güvenli'
        status = 'Güvenli';
    } else if (score > 40) { // Adjusted threshold for 'Şüpheli'
        status = 'Şüpheli';
    } else {
        status = 'Tehlikeli';
    }

    return {
        url,
        score,
        status,
        details,
        timestamp: new Date().toISOString(),
    };
};
