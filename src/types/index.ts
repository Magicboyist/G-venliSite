export interface AnalysisDetails {
    ipAddress: string;
    hostingCountry: string;
    hostingCity: string;
    hostingCompany: string;
    domainRegistrar: string;
    domainCreationDate: string;
    sslValid: boolean;
    protocol: 'HTTP' | 'HTTPS' | 'Bilinmiyor';
    hasSuspiciousJs: boolean;
    hasFirewall: boolean;
    hasBotProtection: boolean;
    knownBreaches: boolean;
}

export interface AnalysisResult {
    url: string;
    score: number;
    status: 'Güvenli' | 'Şüpheli' | 'Tehlikeli';
    details: AnalysisDetails;
    timestamp: string;
}

export interface ScanHistoryItem {
    url: string;
    score: number;
    status: 'Güvenli' | 'Şüpheli' | 'Tehlikeli';
    timestamp: string;
}
