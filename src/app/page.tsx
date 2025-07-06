"use client";

import React, { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Loader2, Shield } from 'lucide-react';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import AnalysisResults from '@/components/analysis-results';
import ScanHistory from '@/components/scan-history';
import { useScanHistory } from '@/hooks/use-scan-history';
import { analyzeDomain } from '@/ai/flows/analyze-domain-flow';
import type { AnalysisResult } from '@/types';
import { useToast } from '@/hooks/use-toast';

const FormSchema = z.object({
  url: z.string().min(1, { message: "Lütfen analiz edilecek bir URL veya alan adı girin." }),
});

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const { addScanToHistory } = useScanHistory();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      url: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    setIsLoading(true);
    setAnalysisResult(null);

    let userUrl = data.url.trim();
    if (!/^(https?:\/\/)/i.test(userUrl)) {
      userUrl = 'http://' + userUrl;
    }

    try {
        new URL(userUrl);
    } catch(e) {
        form.setError("url", {
            type: "manual",
            message: "Lütfen geçerli bir URL girin.",
        });
        setIsLoading(false);
        return;
    }
    
    try {
        const result = await analyzeDomain({ url: userUrl });
        setAnalysisResult(result);
        addScanToHistory({
            url: result.url,
            score: result.score,
            status: result.status,
            timestamp: result.timestamp,
        });
    } catch (error) {
        console.error("Analysis failed:", error);
        toast({
            variant: "destructive",
            title: "Analiz Başarısız Oldu",
            description: "Alan adı bilgileri alınırken bir hata oluştu. Lütfen tekrar deneyin.",
        });
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <main className="container mx-auto px-4 py-8 md:py-12">
      <div className="max-w-3xl mx-auto text-center">
        <div className="flex justify-center items-center gap-3 mb-4">
            <Shield className="w-12 h-12 text-primary" />
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-card-foreground">
                GüvenliSite
            </h1>
        </div>
        <p className="mt-2 text-lg text-muted-foreground">
          İstediğiniz websitenin güvenlik puanını anında öğrenin. Başlamak için bir URL girin.
        </p>
      </div>

      <div className="max-w-xl mx-auto mt-10">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="sr-only">URL</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="ornek.com" 
                      {...field} 
                      className="h-12 text-base text-center"
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button 
              type="submit" 
              className="w-full h-12 text-lg font-semibold"
              disabled={isLoading}
              size="lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                  Analiz Ediliyor...
                </>
              ) : (
                "Analiz Et"
              )}
            </Button>
          </form>
        </Form>
      </div>

      <div className="mt-12">
        {isLoading && (
            <div className="flex flex-col items-center justify-center text-center p-8 bg-card/50 rounded-lg">
                <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
                <p className="text-muted-foreground">Gerçek zamanlı verilerle güvenlik analizi yapılıyor, lütfen bekleyin...</p>
            </div>
        )}
        {analysisResult && <AnalysisResults result={analysisResult} />}
      </div>

      <div className="max-w-4xl mx-auto mt-16">
          <ScanHistory />
      </div>

      <footer className="text-center mt-16 text-sm text-muted-foreground">
        <p>© Tekno Ömer</p>
      </footer>
    </main>
  );
}
