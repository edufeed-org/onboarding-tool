// NOTE: This file is stable and usually should not be modified.
// It is important that all functionality in this file is preserved, and should only be modified if explicitly requested.

import React, { useRef, useState, useEffect } from 'react';
import { Shield, AlertTriangle, KeyRound, Cloud } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useLoginActions } from '@/hooks/useLoginActions';
import { cn } from '@/lib/utils';

interface LoginDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: () => void;
  onSignup?: () => void;
}

const validateNsec = (nsec: string) => {
  return /^nsec1[a-zA-Z0-9]{58}$/.test(nsec);
};

const validateBunkerUri = (uri: string) => {
  return uri.startsWith('bunker://');
};

const LoginDialog: React.FC<LoginDialogProps> = ({ isOpen, onClose, onLogin }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [_isFileLoading, setIsFileLoading] = useState(false);
  const [nsec, setNsec] = useState('');
  const [bunkerUri, setBunkerUri] = useState('');
  const [errors, setErrors] = useState<{
    nsec?: string;
    bunker?: string;
    file?: string;
    extension?: string;
  }>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const login = useLoginActions();

  // Reset all state when dialog opens/closes
  useEffect(() => {
    if (isOpen) {
      // Reset state when dialog opens
      setIsLoading(false);
      setIsFileLoading(false);
      setNsec('');
      setBunkerUri('');
      setErrors({});
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, [isOpen]);

  const handleExtensionLogin = async () => {
    setIsLoading(true);
    setErrors(prev => ({ ...prev, extension: undefined }));

    try {
      if (!('nostr' in window)) {
        throw new Error('Nostr-Erweiterung nicht gefunden. Bitte installiere eine NIP-07-Erweiterung.');
      }
      await login.extension();
      onLogin();
      onClose();
    } catch (e: unknown) {
      const error = e as Error;
      console.error('Bunker login failed:', error);
      console.error('Nsec login failed:', error);
      console.error('Extension login failed:', error);
      setErrors(prev => ({
        ...prev,
        extension: error instanceof Error ? error.message : 'Anmeldung mit Erweiterung fehlgeschlagen'
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const executeLogin = (key: string) => {
    setIsLoading(true);
    setErrors({});

    // Use a timeout to allow the UI to update before the synchronous login call
    setTimeout(() => {
      try {
        login.nsec(key);
        onLogin();
        onClose();
      } catch {
        setErrors({ nsec: "Anmeldung mit diesem Schlüssel fehlgeschlagen. Bitte überprüfe, ob er korrekt ist." });
        setIsLoading(false);
      }
    }, 50);
  };

  const handleKeyLogin = () => {
    if (!nsec.trim()) {
      setErrors(prev => ({ ...prev, nsec: 'Bitte gib deinen geheimen Schlüssel ein' }));
      return;
    }

    if (!validateNsec(nsec)) {
      setErrors(prev => ({ ...prev, nsec: 'Ungültiges Format für geheimen Schlüssel. Muss ein gültiger nsec sein, der mit nsec1 beginnt.' }));
      return;
    }
    executeLogin(nsec);
  };

  const handleBunkerLogin = async () => {
    if (!bunkerUri.trim()) {
      setErrors(prev => ({ ...prev, bunker: 'Bitte gib eine Bunker-URI ein' }));
      return;
    }

    if (!validateBunkerUri(bunkerUri)) {
      setErrors(prev => ({ ...prev, bunker: 'Ungültiges Bunker-URI-Format. Muss mit bunker:// beginnen' }));
      return;
    }

    setIsLoading(true);
    setErrors(prev => ({ ...prev, bunker: undefined }));

    try {
      await login.bunker(bunkerUri);
      onLogin();
      onClose();
      // Clear the URI from memory
      setBunkerUri('');
    } catch {
      setErrors(prev => ({
        ...prev,
        bunker: 'Verbindung zum Bunker fehlgeschlagen. Bitte überprüfe die URI.'
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const _handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsFileLoading(true);
    setErrors({});

    const reader = new FileReader();
    reader.onload = (event) => {
      setIsFileLoading(false);
      const content = event.target?.result as string;
      if (content) {
        const trimmedContent = content.trim();
        if (validateNsec(trimmedContent)) {
          executeLogin(trimmedContent);
        } else {
          setErrors({ file: 'Datei enthält keinen gültigen geheimen Schlüssel.' });
        }
      } else {
        setErrors({ file: 'Dateiinhalt konnte nicht gelesen werden.' });
      }
    };
    reader.onerror = () => {
      setIsFileLoading(false);
      setErrors({ file: 'Datei konnte nicht gelesen werden.' });
    };
    reader.readAsText(file);
  };

  // const handleSignupClick = () => {
  //   onClose();
  //   if (onSignup) {
  //     onSignup();
  //   }
  // };

  const defaultTab = 'nostr' in window ? 'extension' : 'key';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className={cn("max-w-[95vw] sm:max-w-md max-h-[90vh] max-h-[90dvh] p-0 overflow-hidden rounded-2xl overflow-y-scroll")}
      >
        <DialogHeader className={cn('px-6 pt-6 pb-1 relative')}>

            <DialogDescription className="text-center">
              Login um fortzufahren
            </DialogDescription>
        </DialogHeader>
        <div className='px-6 pt-2 pb-4 space-y-4 overflow-y-auto flex-1'>
          {/* Login Methods */}
          <Tabs defaultValue={defaultTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-muted/80 rounded-lg mb-4">
              <TabsTrigger value="extension" className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <span>Extension</span>
              </TabsTrigger>
              <TabsTrigger value="key" className="flex items-center gap-2">
                <KeyRound className="w-4 h-4" />
                <span>Schlüssel</span>
              </TabsTrigger>
              <TabsTrigger value="bunker" className="flex items-center gap-2">
                <Cloud className="w-4 h-4" />
                <span>Bunker</span>
              </TabsTrigger>
              <TabsTrigger value="keycloak" className="flex items-center gap-2">
                {/* <Shield className="w-4 h-4" /> */}
                <span>KeyCloak</span>
              </TabsTrigger>
            </TabsList>
            <TabsContent value='extension' className='space-y-3'>
              {errors.extension && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>{errors.extension}</AlertDescription>
                </Alert>
              )}
              <div className='text-center p-4'>
                <Shield className='w-12 h-12 mx-auto mb-3 text-primary' />
                <p className='text-sm text-gray-600 dark:text-gray-300 mb-4'>
                  Mit einem Klick über die Browser-Erweiterung anmelden
                </p>
                <div className="flex justify-center mb-4">
                  <Button
                    className='w-full rounded-full py-4'
                    onClick={handleExtensionLogin}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Anmeldung läuft...' : 'Mit Erweiterung anmelden'}
                  </Button>
                </div>
                <p className='text-xs text-gray-500 dark:text-gray-400'>
                  Noch keine Erweiterung?{' '}
                  <a
                    href="https://keys.band"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    keys.band
                  </a>
                  {' oder '}
                  <a
                    href="https://getalby.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Alby
                  </a>
                  {' installieren'}
                </p>
              </div>
            </TabsContent>

            <TabsContent value='key' className='space-y-4'>
              <div className='space-y-4'>
                <div className='space-y-2'>
                  <label htmlFor='nsec' className='text-sm font-medium'>
                    Geheimer Schlüssel (nsec)
                  </label>
                  <Input
                    id='nsec'
                    type="password"
                    value={nsec}
                    onChange={(e) => {
                      setNsec(e.target.value);
                      if (errors.nsec) setErrors(prev => ({ ...prev, nsec: undefined }));
                    }}
                    className={`rounded-lg ${
                      errors.nsec ? 'border-red-500 focus-visible:ring-red-500' : ''
                    }`}
                    placeholder='nsec1...'
                    autoComplete="off"
                  />
                  {errors.nsec && (
                    <p className="text-sm text-red-500">{errors.nsec}</p>
                  )}
                </div>

                <Button
                  className='w-full rounded-full py-3'
                  onClick={handleKeyLogin}
                  disabled={isLoading || !nsec.trim()}
                >
                  {isLoading ? 'Überprüfung läuft...' : 'Anmelden'}
                </Button>

                {/* <div className='relative'>
                  <div className='absolute inset-0 flex items-center'>
                    <div className='w-full border-t border-muted'></div>
                  </div>
                  <div className='relative flex justify-center text-xs'>
                    <span className='px-2 bg-background text-muted-foreground'>
                      oder
                    </span>
                  </div>
                </div>

                <div className='text-center'>
                  <input
                    type='file'
                    accept='.txt'
                    className='hidden'
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                  />
                  <Button
                    variant='outline'
                    className='w-full'
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isLoading || isFileLoading}
                  >
                    <Upload className='w-4 h-4 mr-2' />
                    {isFileLoading ? 'Datei wird gelesen...' : 'Schlüsseldatei hochladen'}
                  </Button>
                  {errors.file && (
                    <p className="text-sm text-red-500 mt-2">{errors.file}</p>
                  )}
                </div> */}
              </div>
            </TabsContent>

            <TabsContent value='bunker' className='space-y-3'>
              <div className='space-y-2'>
                <label htmlFor='bunkerUri' className='text-sm font-medium'>
                  Bunker-URI
                </label>
                <Input
                  id='bunkerUri'
                  value={bunkerUri}
                  onChange={(e) => {
                    setBunkerUri(e.target.value);
                    if (errors.bunker) setErrors(prev => ({ ...prev, bunker: undefined }));
                  }}
                  className={`rounded-lg border-gray-300 dark:border-gray-700 focus-visible:ring-primary ${
                    errors.bunker ? 'border-red-500' : ''
                  }`}
                  placeholder='bunker://'
                  autoComplete="off"
                />
                {errors.bunker && (
                  <p className="text-sm text-red-500">{errors.bunker}</p>
                )}
              </div>

              <div className="flex justify-center">
                <Button
                  className='w-full rounded-full py-4'
                  onClick={handleBunkerLogin}
                  disabled={isLoading || !bunkerUri.trim()}
                >
                  {isLoading ? 'Verbindung wird hergestellt...' : 'Mit Bunker anmelden'}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value='keycloak' className='space-y-3'>
              <div className='p-4 space-y-4'>
                <div className="text-center">
                  <Shield className='w-12 h-12 mx-auto mb-3' />
                  <p className='text-sm'>
                    KeyCloak-Login ist noch nicht implementiert.
                  </p>
                </div>

                <div className="space-y-2">
                  <label htmlFor="keycloak-email" className="text-sm font-medium">
                    E-Mail
                  </label>
                  <Input
                    id="keycloak-email"
                    type="email"
                    placeholder="name@firma.de"
                    disabled
                    autoComplete="off"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="keycloak-password" className="text-sm font-medium">
                    Passwort
                  </label>
                  <Input
                    id="keycloak-password"
                    type="password"
                    placeholder="••••••••"
                    disabled
                    autoComplete="off"
                  />
                </div>

                <Button className='w-full rounded-full py-4' disabled>
                  Anmelden
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
    );
  };

export default LoginDialog;
