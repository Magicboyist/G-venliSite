"use client";

import React from 'react';
import { useScanHistory } from '@/hooks/use-scan-history';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, History } from 'lucide-react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

const getStatusBadgeVariant = (status: 'Güvenli' | 'Şüpheli' | 'Tehlikeli'): "default" | "secondary" | "destructive" => {
    switch (status) {
        case 'Güvenli':
            return 'default'; // Using theme colors for this
        case 'Şüpheli':
            return 'secondary';
        case 'Tehlikeli':
            return 'destructive';
    }
};

const getStatusBadgeClass = (status: 'Güvenli' | 'Şüpheli' | 'Tehlikeli'): string => {
    switch (status) {
        case 'Güvenli':
            return 'bg-green-500 hover:bg-green-600 text-white';
        case 'Şüpheli':
            return 'bg-yellow-500 hover:bg-yellow-600 text-white';
        case 'Tehlikeli':
            return 'bg-red-500 hover:bg-red-600 text-white';
    }
}

export default function ScanHistory() {
    const { history, clearHistory } = useScanHistory();

    if (history.length === 0) {
        return null;
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="flex items-center gap-2">
                        <History className="w-6 h-6" />
                        Geçmiş Taramalar
                    </CardTitle>
                    <CardDescription>Daha önce yaptığınız güvenlik analizleri.</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={clearHistory}>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Geçmişi Temizle
                </Button>
            </CardHeader>
            <CardContent>
                <div className="border rounded-lg">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[40%]">URL</TableHead>
                                <TableHead>Tarih</TableHead>
                                <TableHead className="text-center">Puan</TableHead>
                                <TableHead className="text-right">Durum</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {history.map((scan, index) => (
                                <TableRow key={index}>
                                    <TableCell className="font-medium truncate max-w-xs">{scan.url}</TableCell>
                                    <TableCell className="text-muted-foreground">
                                        {format(new Date(scan.timestamp), "d MMMM yyyy, HH:mm", { locale: tr })}
                                    </TableCell>
                                    <TableCell className="text-center font-semibold">{scan.score}</TableCell>
                                    <TableCell className="text-right">
                                        <Badge className={getStatusBadgeClass(scan.status)}>{scan.status}</Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
}
