import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Key, Copy, Eye, EyeOff, Download, AlertCircle, CheckCircle2 } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSeoMeta } from '@unhead/react';
import { useState, useEffect } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { generateSecretKey, getPublicKey, nip19 } from 'nostr-tools';
import { useLoginActions } from "@/hooks/useLoginActions";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { PageHeader } from "@/components/PageHeader";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const userType = searchParams.get('type') || 'user';
  const loginActions = useLoginActions();
  const { user } = useCurrentUser();

  const [privateKey, setPrivateKey] = useState<string>("");
  const [publicKey, setPublicKey] = useState<string>("");
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  useSeoMeta({
    title: 'Registrierung - Nostr Onboarding',
    description: 'Erstellen Sie Ihr Nostr-Schlüsselpaar.',
  });

  // Check if user is already logged in
  useEffect(() => {
    if (user) {
      // User is already logged in, redirect to appropriate dashboard
      if (userType === 'operator') {
        navigate('/platform-dashboard');
      } else {
        navigate('/user-dashboard');
      }
    }
  }, [user, userType, navigate]);

  // Generate keys on mount
  useEffect(() => {
    const secretKey = generateSecretKey();
    const pubKey = getPublicKey(secretKey);
    
    const nsec = nip19.nsecEncode(secretKey);
    const npub = nip19.npubEncode(pubKey);
    
    setPrivateKey(nsec);
    setPublicKey(npub);
  }, []);

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  const downloadKeys = () => {
    const content = `Ihre Nostr-Schlüssel
=====================

Öffentlicher Schlüssel (Public Key / npub):
${publicKey}

Privater Schlüssel (Private Key / nsec):
${privateKey}

WICHTIG: Bewahren Sie Ihren privaten Schlüssel sicher auf!
- Teilen Sie ihn niemals mit anderen
- Speichern Sie ihn an einem sicheren Ort
- Wenn Sie ihn verlieren, verlieren Sie den Zugriff auf Ihr Konto
- Mit diesem Schlüssel kann jeder in Ihrem Namen handeln

Generiert am: ${new Date().toLocaleString('de-DE')}
`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nostr-keys-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleContinue = () => {
    if (confirmed && privateKey) {
      // Log in the user with the generated private key
      loginActions.nsec(privateKey);
      
      // Navigate to appropriate dashboard
      if (userType === 'operator') {
        navigate('/platform-dashboard');
      } else {
        navigate('/user-dashboard');
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <PageHeader />

      <div className="container mx-auto px-4 py-20">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center space-y-6 mb-12">
          <Key className="h-16 w-16 mx-auto text-purple-600" />
          <h1 className="text-4xl lg:text-5xl font-bold tracking-tight">
            Ihr{" "}
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Schlüsselpaar
            </span>
          </h1>
          <p className="text-xl text-muted-foreground">
            Für dich wurde ein persönliches Schlüsselpaar erstellt.
            <br></br>
            Damit gehört deine digitale Identität nur dir und funktioniert auch in anderen Nostr-Apps.
          </p>
        </div>


        {/* Keys Display */}
        <div className="max-w-2xl mx-auto space-y-6 mb-8">
                    {/* Private Key */}
          <Card className="border-2 border-red-200 dark:border-red-900">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600">
                <AlertCircle className="h-5 w-5" />
                Privater Schlüssel (nsec)
              </CardTitle>
              <CardDescription>
                Dies ist Ihr Passwort. Teilen Sie es NIEMALS mit anderen!
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="bg-muted p-4 rounded-lg font-mono text-sm break-all relative">
                {showPrivateKey ? privateKey : '•'.repeat(63)}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => setShowPrivateKey(!showPrivateKey)}
                >
                  {showPrivateKey ? (
                    <>
                      <EyeOff className="mr-2 h-4 w-4" />
                      Verbergen
                    </>
                  ) : (
                    <>
                      <Eye className="mr-2 h-4 w-4" />
                      Anzeigen
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => copyToClipboard(privateKey, 'private')}
                >
                  {copied === 'private' ? (
                    <>
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Kopiert!
                    </>
                  ) : (
                    <>
                      <Copy className="mr-2 h-4 w-4" />
                      Kopieren
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Warning Alert */}
          <div className="max-w-2xl mx-auto mb-8">
            <Alert className="border-orange-500 bg-orange-50 dark:bg-orange-950/20">
              <AlertCircle className="h-4 w-4 text-orange-600" />
              <AlertDescription className="text-sm">
                <strong>Wichtig:</strong> Ihr privater Schlüssel ist wie ein Passwort. 
                Bewahren Sie ihn sicher auf und teilen Sie ihn mit niemandem. 
                Wenn Sie ihn verlieren, verlieren Sie den Zugriff auf Ihr Konto.
              </AlertDescription>
            </Alert>
          </div>

          {/* Download Button */}
          <Button
            variant="outline"
            size="lg"
            className="w-full"
            onClick={downloadKeys}
          >
            <Download className="mr-2 h-5 w-5" />
            Schlüssel als Textdatei herunterladen
          </Button>

          {/* Public Key */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-green-600">✓</span> Öffentlicher Schlüssel (npub)
              </CardTitle>
              <CardDescription>
                Dies ist Ihre öffentliche Identität. Sie können sie mit anderen teilen.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="bg-muted p-4 rounded-lg font-mono text-sm break-all">
                {publicKey}
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => copyToClipboard(publicKey, 'public')}
              >
                {copied === 'public' ? (
                  <>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Kopiert!
                  </>
                ) : (
                  <>
                    <Copy className="mr-2 h-4 w-4" />
                    Kopieren
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Confirmation */}
        <div className="max-w-2xl mx-auto mb-8">
          <Card className="border-2">
            <CardContent className="pt-6">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={confirmed}
                  onChange={(e) => setConfirmed(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-gray-300"
                />
                <span className="text-sm">
                  Ich habe meinen privaten Schlüssel sicher gespeichert und verstehe, 
                  dass ich ohne ihn keinen Zugriff mehr auf mein Konto habe. 
                  Ich weiß, dass niemand mir helfen kann, wenn ich ihn verliere.
                </span>
              </label>
            </CardContent>
          </Card>
        </div>

        {/* Continue Button */}
        <div className="max-w-md mx-auto space-y-4">
          <Button
            size="lg"
            className="w-full text-lg h-14"
            onClick={handleContinue}
            disabled={!confirmed}
          >
            Weiter
          </Button>
        </div>
      </div>
    </div>
  );
}
