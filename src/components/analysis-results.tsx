"use client";

import React from 'react';
import type { AnalysisResult } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
    CheckCircle2, 
    XCircle, 
    ShieldQuestion, 
    FileCode,
    AlertTriangle,
    ShieldCheck,
    ShieldOff,
    Fingerprint,
    CalendarClock,
    Signal,
    History,
    Network,
    MapPin,
    Building2,
    UserSquare
} from 'lucide-react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

interface AnalysisResultsProps {
    result: AnalysisResult;
}

const getStatusStyles = (status: 'Güvenli' | 'Şüpheli' | 'Tehlikeli') => {
    switch (status) {
        case 'Güvenli':
            return {
                badge: 'bg-green-100 text-green-800 border-green-300 dark:bg-green-900/50 dark:text-green-300 dark:border-green-700',
                progress: 'bg-green-500',
                text: 'text-green-600 dark:text-green-400',
                icon: <ShieldCheck className="w-16 h-16 text-green-500" />
            };
        case 'Şüpheli':
            return {
                badge: 'bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900/50 dark:text-yellow-300 dark:border-yellow-700',
                progress: 'bg-yellow-500',
                text: 'text-yellow-600 dark:text-yellow-400',
                icon: <ShieldQuestion className="w-16 h-16 text-yellow-500" />
            };
        case 'Tehlikeli':
            return {
                badge: 'bg-red-100 text-red-800 border-red-300 dark:bg-red-900/50 dark:text-red-300 dark:border-red-700',
                progress: 'bg-red-500',
                text: 'text-red-600 dark:text-red-400',
                icon: <ShieldOff className="w-16 h-16 text-red-500" />
            };
    }
};

const DetailItem: React.FC<{ icon: React.ReactNode; label: string; value: string | boolean; isSafe?: boolean }> = ({ icon, label, value, isSafe }) => {
    const valueText = typeof value === 'boolean' ? (value ? 'Evet' : 'Hayır') : value;
    const valueColor = typeof isSafe === 'boolean' ? (isSafe ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400') : 'text-card-foreground';
    const ValueIcon = typeof isSafe === 'boolean' ? (isSafe ? CheckCircle2 : XCircle) : null;
    
    return (
        <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg">
            <div className="flex items-center gap-3">
                <div className="text-primary">{icon}</div>
                <span className="text-sm font-medium text-muted-foreground">{label}</span>
            </div>
            <div className="flex items-center gap-2 text-right">
                {ValueIcon && <ValueIcon className={`w-5 h-5 ${valueColor}`} />}
                <span className={`text-sm font-semibold truncate ${valueColor}`}>{valueText}</span>
            </div>
        </div>
    );
};


export default function AnalysisResults({ result }: AnalysisResultsProps) {
    const statusStyles = getStatusStyles(result.status);
    const { details } = result;

    const handleReport = () => {
        window.open('https://www.usom.gov.tr/ihbar', '_blank');
    };

    const formattedCreationDate = details.domainCreationDate && !details.domainCreationDate.startsWith('1970')
    ? format(new Date(details.domainCreationDate), "d MMMM yyyy", { locale: tr })
    : 'Bilinmiyor';

    return (
        <Card className="w-full max-w-4xl mx-auto overflow-hidden shadow-lg border-2">
            <CardHeader className="p-6 bg-card/50">
                <div className="flex flex-col md:flex-row items-center gap-6">
                    <div className="flex-shrink-0">
                        {statusStyles.icon}
                    </div>
                    <div className="flex-1 text-center md:text-left">
                        <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                            <Badge variant="outline" className={`text-lg font-bold px-4 py-1 ${statusStyles.badge}`}>{result.status}</Badge>
                        </div>
                        <CardTitle className="text-3xl font-extrabold tracking-tight">Güvenlik Puanı</CardTitle>
                        <CardDescription className="truncate max-w-full text-base">{result.url}</CardDescription>
                    </div>
                    <div className="flex-shrink-0 text-center">
                        <div className={`text-7xl font-bold ${statusStyles.text}`}>{result.score}</div>
                        <div className="text-muted-foreground">/ 100</div>
                    </div>
                </div>
                <Progress value={result.score} className="w-full h-3 mt-4" indicatorClassName={statusStyles.progress} />
            </CardHeader>
            <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4 text-card-foreground">Detaylı Analiz</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* WHOIS & Sunucu Bilgileri */}
                    <DetailItem icon={<Network className="w-5 h-5" />} label="IP Adresi" value={details.ipAddress} />
                    <DetailItem icon={<MapPin className="w-5 h-5" />} label="Sunucu Konumu" value={details.hostingCity && details.hostingCountry ? `${details.hostingCity}, ${details.hostingCountry}` : 'Bilinmiyor'} />
                    <DetailItem icon={<Building2 className="w-5 h-5" />} label="Barındırma Firması" value={details.hostingCompany} />
                    <DetailItem icon={<UserSquare className="w-5 h-5" />} label="Domain Kayıt Firması" value={details.domainRegistrar} />
                    <DetailItem icon={<CalendarClock className="w-5 h-5" />} label="Domain Kayıt Tarihi" value={formattedCreationDate} isSafe={details.domainCreationDate !== 'Bilinmiyor' && !details.domainCreationDate.startsWith('1970') && new Date().getFullYear() - new Date(details.domainCreationDate).getFullYear() > 1} />
                    
                    {/* Güvenlik Kontrolleri */}
                    <DetailItem icon={<Fingerprint className="w-5 h-5" />} label="SSL Sertifikası Geçerli" value={details.sslValid} isSafe={details.sslValid} />
                    <DetailItem icon={<Signal className="w-5 h-5" />} label="Protokol" value={details.protocol} isSafe={details.protocol === 'HTTPS'} />
                    <DetailItem icon={<FileCode className="w-5 h-5" />} label="Şüpheli JavaScript" value={details.hasSuspiciousJs} isSafe={!details.hasSuspiciousJs} />
                    <DetailItem icon={<ShieldCheck className="w-5 h-5" />} label="Güvenlik Duvarı" value={details.hasFirewall} isSafe={details.hasFirewall} />
                    <DetailItem icon={<ShieldQuestion className="w-5 h-5" />} label="Bot Koruması" value={details.hasBotProtection} isSafe={details.hasBotProtection} />
                    <DetailItem icon={<History className="w-5 h-5" />} label="Bilinen Güvenlik İhlali" value={details.knownBreaches} isSafe={!details.knownBreaches} />
                </div>

                {result.status === 'Tehlikeli' && (
                    <div className="mt-8 p-4 bg-destructive/10 border-l-4 border-destructive rounded-r-lg">
                        <div className="flex items-center">
                            <AlertTriangle className="h-6 w-6 text-destructive mr-3" />
                            <div className="flex-1">
                                <h4 className="font-bold text-destructive">Bu Site Tehlikeli!</h4>
                                <p className="text-sm text-destructive/80">
                                    Bu sitenin tehlikeli olduğu tespit edildi. Kişisel bilgilerinizi girmemeniz ve dikkatli olmanız önerilir.
                                </p>
                            </div>
                            <Button variant="destructive" onClick={handleReport} className="ml-4 shrink-0">
                                USOM'a İhbar Et
                            </Button>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
