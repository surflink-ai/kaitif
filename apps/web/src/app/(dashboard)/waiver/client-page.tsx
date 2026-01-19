"use client";

import { useState, useRef } from "react";
import SignatureCanvas from "react-signature-canvas";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Button, Badge, Checkbox, Label, useToast } from "@kaitif/ui";
import { FileText, Check, Download, AlertTriangle, Eraser, Loader2 } from "lucide-react";
import type { Waiver, WaiverVersion, User } from "@kaitif/db";
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { padding: 30 },
  header: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  text: { fontSize: 12, marginBottom: 10 },
  signature: { width: 200, height: 100, marginTop: 20 },
  footer: { fontSize: 10, marginTop: 30, color: 'grey', textAlign: 'center' }
});

const WaiverDocument = ({ waiver, user, content }: { waiver: Waiver, user: User, content: string }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.header}>Liability Waiver & Release</Text>
      <Text style={styles.text}>Participant: {user.name || user.email}</Text>
      <Text style={styles.text}>Signed Date: {new Date(waiver.signedAt).toLocaleDateString()}</Text>
      <Text style={styles.text}>Expiration Date: {new Date(waiver.expiresAt).toLocaleDateString()}</Text>
      <View style={{ marginVertical: 20 }}>
          <Text style={styles.text}>{content}</Text>
      </View>
      <Text style={styles.text}>Signature:</Text>
      {/* react-pdf Image not working easily with data uri in all envs, but let's try */}
      {/* <Image src={waiver.signature} style={styles.signature} /> */} 
      <Text style={styles.text}>[Digital Signature on File]</Text>
      <Text style={styles.footer}>Kaitif Skatepark • {waiver.id}</Text>
    </Page>
  </Document>
);

interface WaiverClientPageProps {
  activeVersion: WaiverVersion | null;
  validWaiver: Waiver | null;
  user: User;
}

export default function WaiverClientPage({ activeVersion, validWaiver, user }: WaiverClientPageProps) {
  const [agreed, setAgreed] = useState(false);
  const sigPad = useRef<SignatureCanvas>(null);
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const clearSignature = () => {
    sigPad.current?.clear();
  };

  const submitWaiver = async () => {
    if (!agreed) return;
    if (sigPad.current?.isEmpty()) {
       toast({ title: "Error", description: "Please sign the waiver", variant: "destructive" });
       return;
    }
    const signatureData = sigPad.current?.getTrimmedCanvas().toDataURL("image/png");

    setIsSubmitting(true);
    try {
        const res = await fetch("/api/waivers", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                waiverVersionId: activeVersion?.id,
                signature: signatureData
            })
        });

        if (!res.ok) throw new Error("Failed to sign waiver");

        toast({ title: "Success", description: "Waiver signed successfully" });
        window.location.reload(); 
    } catch (e) {
        toast({ title: "Error", description: "Failed to sign waiver", variant: "destructive" });
    } finally {
        setIsSubmitting(false);
    }
  };

  if (validWaiver) {
    const daysUntilExpiry = Math.ceil(
      (new Date(validWaiver.expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );

    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold uppercase tracking-tight mb-2">
            Liability <span className="text-[#FFCC00]">Waiver</span>
          </h1>
          <p className="text-[#F5F5F0]/60">
            Your waiver is on file and valid. You're all set to skate!
          </p>
        </div>

        <Card className="border-green-500">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 bg-green-500/20 border-2 border-green-500 flex items-center justify-center shrink-0">
                <Check className="h-6 w-6 text-green-500" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h2 className="text-xl font-bold uppercase tracking-wider">Waiver Active</h2>
                  <Badge variant="success">Valid</Badge>
                </div>
                <p className="text-[#F5F5F0]/60 mb-4">
                  Your signed waiver is valid until{" "}
                  {new Date(validWaiver.expiresAt).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-xs text-[#F5F5F0]/40 uppercase tracking-wider mb-1">Signed On</p>
                    <p className="font-bold">
                      {new Date(validWaiver.signedAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-[#F5F5F0]/40 uppercase tracking-wider mb-1">Expires</p>
                    <p className="font-bold">
                      {new Date(validWaiver.expiresAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-[#F5F5F0]/40 uppercase tracking-wider mb-1">Days Remaining</p>
                    <p className="font-bold text-green-500">{daysUntilExpiry} days</p>
                  </div>
                  <div>
                    {/* <p className="text-xs text-[#F5F5F0]/40 uppercase tracking-wider mb-1">Version</p>
                    <p className="font-bold">v{activeVersion?.version}</p> */}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <div className="flex gap-2">
                 <PDFDownloadLink document={<WaiverDocument waiver={validWaiver} user={user} content={activeVersion?.content || ""} />} fileName="kaitif-waiver.pdf">
                  {({ blob, url, loading, error }) => (
                    <Button variant="outline" disabled={loading}>
                        <Download className="h-5 w-5 mr-2" />
                        {loading ? 'Loading document...' : 'Download PDF'}
                    </Button>
                  )}
                </PDFDownloadLink>
            </div>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (!activeVersion) {
      return <div>No active waiver version found. Please contact support.</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold uppercase tracking-tight mb-2">
          Liability <span className="text-[#FFCC00]">Waiver</span>
        </h1>
        <p className="text-[#F5F5F0]/60">
          Please read and sign the waiver to access the park.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-[#FFCC00]" />
            <CardTitle>Liability Waiver & Release (v{activeVersion.version})</CardTitle>
          </div>
          <CardDescription>Last updated: {new Date(activeVersion.createdAt).toLocaleDateString()}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-96 overflow-y-auto bg-[#0A0A0A] border-2 border-[#F5F5F0]/10 p-4 mb-6 custom-scrollbar">
             <div className="prose prose-invert prose-sm max-w-none whitespace-pre-wrap">
                {activeVersion.content}
             </div>
          </div>

          <div className="flex items-start gap-3 mb-6">
            <Checkbox
              id="agree"
              checked={agreed}
              onCheckedChange={(checked) => setAgreed(checked as boolean)}
            />
            <Label htmlFor="agree" className="text-sm text-[#F5F5F0]/60 font-normal leading-relaxed">
              I have read and understand the liability waiver. I voluntarily agree to its terms and 
              conditions and assume all risks associated with using Kaitif Skatepark.
            </Label>
          </div>

          <div className="border-2 border-dashed border-[#F5F5F0]/20 p-8 text-center bg-white rounded-md">
            <p className="text-sm text-black/40 mb-2">Draw your signature below</p>
            <div className="border border-gray-300 inline-block bg-white">
                <SignatureCanvas 
                    ref={sigPad}
                    penColor="black"
                    canvasProps={{width: 500, height: 200, className: 'sigCanvas'}} 
                />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-4">
          <Button variant="outline" className="w-full sm:w-auto" onClick={clearSignature}>
            <Eraser className="h-4 w-4 mr-2" />
            Clear Signature
          </Button>
          <Button className="w-full sm:w-auto" disabled={!agreed || isSubmitting} onClick={submitWaiver}>
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Check className="h-5 w-5 mr-2" />}
            Sign Waiver
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
