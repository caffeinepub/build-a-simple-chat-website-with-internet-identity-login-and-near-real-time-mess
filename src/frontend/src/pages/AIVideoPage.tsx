import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Video, Download, Loader2, Sparkles, Music, Mic, Share2, CheckCircle2 } from 'lucide-react';
import { SiFacebook, SiInstagram, SiYoutube, SiX } from 'react-icons/si';
import { generateLocalClip } from '@/lib/localClipGenerator';
import { downloadFile } from '@/lib/download';

type VoicePreset = 'male' | 'female';
type MusicPreset = 'soft' | 'calm' | 'cinematic';

interface GeneratedClip {
  id: string;
  prompt: string;
  voice: VoicePreset;
  music: MusicPreset;
  blobUrl: string;
  filename: string;
  timestamp: number;
  status: 'success' | 'error';
  error?: string;
}

export function AIVideoPage() {
  const [prompt, setPrompt] = useState('');
  const [voice, setVoice] = useState<VoicePreset | ''>('');
  const [music, setMusic] = useState<MusicPreset | ''>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [clips, setClips] = useState<GeneratedClip[]>([]);
  const [validationErrors, setValidationErrors] = useState<{
    prompt?: string;
    voice?: string;
    music?: string;
  }>({});

  const validateForm = (): boolean => {
    const errors: typeof validationErrors = {};
    
    if (!prompt.trim()) {
      errors.prompt = 'Please enter a prompt for your video';
    }
    
    if (!voice) {
      errors.voice = 'Please select a voice preset';
    }
    
    if (!music) {
      errors.music = 'Please select a music preset';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleGenerate = async () => {
    if (!validateForm()) {
      return;
    }

    setIsGenerating(true);
    
    try {
      // Simulate generation time
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const { blobUrl, filename } = generateLocalClip(
        prompt,
        voice as VoicePreset,
        music as MusicPreset
      );
      
      const newClip: GeneratedClip = {
        id: `clip-${Date.now()}`,
        prompt,
        voice: voice as VoicePreset,
        music: music as MusicPreset,
        blobUrl,
        filename,
        timestamp: Date.now(),
        status: 'success'
      };
      
      setClips(prev => [newClip, ...prev]);
    } catch (error) {
      const errorClip: GeneratedClip = {
        id: `clip-${Date.now()}`,
        prompt,
        voice: voice as VoicePreset,
        music: music as MusicPreset,
        blobUrl: '',
        filename: '',
        timestamp: Date.now(),
        status: 'error',
        error: error instanceof Error ? error.message : 'Failed to generate video'
      };
      
      setClips(prev => [errorClip, ...prev]);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = (clip: GeneratedClip) => {
    downloadFile(clip.blobUrl, clip.filename);
  };

  return (
    <div className="flex-1 container mx-auto max-w-6xl p-4 space-y-6">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-lg">
        <img 
          src="/assets/generated/video-hero.dim_1600x600.png" 
          alt="AI Video Generation" 
          className="w-full h-48 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 to-background/50 flex items-center">
          <div className="px-8 space-y-2">
            <div className="flex items-center gap-3">
              <img 
                src="/assets/generated/video-icon.dim_256x256.png" 
                alt="Video Icon" 
                className="w-12 h-12"
              />
              <h1 className="text-3xl font-bold text-foreground">AI Video Generator</h1>
            </div>
            <p className="text-muted-foreground max-w-xl">
              Create unlimited video clips with AI-powered voices and cinematic music
            </p>
          </div>
        </div>
      </div>

      {/* Generation Form */}
      <Card className="shadow-warm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Create Your Video
          </CardTitle>
          <CardDescription>
            Enter a prompt and select your preferred voice and music to generate a video clip
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="prompt">Video Prompt *</Label>
            <Input
              id="prompt"
              placeholder="Describe the video you want to create..."
              value={prompt}
              onChange={(e) => {
                setPrompt(e.target.value);
                if (validationErrors.prompt) {
                  setValidationErrors(prev => ({ ...prev, prompt: undefined }));
                }
              }}
              className={validationErrors.prompt ? 'border-destructive' : ''}
            />
            {validationErrors.prompt && (
              <p className="text-sm text-destructive">{validationErrors.prompt}</p>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="voice" className="flex items-center gap-2">
                <Mic className="w-4 h-4" />
                Voice Preset *
              </Label>
              <Select
                value={voice}
                onValueChange={(value) => {
                  setVoice(value as VoicePreset);
                  if (validationErrors.voice) {
                    setValidationErrors(prev => ({ ...prev, voice: undefined }));
                  }
                }}
              >
                <SelectTrigger 
                  id="voice"
                  className={validationErrors.voice ? 'border-destructive' : ''}
                >
                  <SelectValue placeholder="Select a voice" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male Voice</SelectItem>
                  <SelectItem value="female">Female Voice</SelectItem>
                </SelectContent>
              </Select>
              {validationErrors.voice && (
                <p className="text-sm text-destructive">{validationErrors.voice}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="music" className="flex items-center gap-2">
                <Music className="w-4 h-4" />
                Music Preset *
              </Label>
              <Select
                value={music}
                onValueChange={(value) => {
                  setMusic(value as MusicPreset);
                  if (validationErrors.music) {
                    setValidationErrors(prev => ({ ...prev, music: undefined }));
                  }
                }}
              >
                <SelectTrigger 
                  id="music"
                  className={validationErrors.music ? 'border-destructive' : ''}
                >
                  <SelectValue placeholder="Select music" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="soft">Soft</SelectItem>
                  <SelectItem value="calm">Calm</SelectItem>
                  <SelectItem value="cinematic">Cinematic</SelectItem>
                </SelectContent>
              </Select>
              {validationErrors.music && (
                <p className="text-sm text-destructive">{validationErrors.music}</p>
              )}
            </div>
          </div>

          <Button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full gap-2"
            size="lg"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Video className="w-4 h-4" />
                Generate Video
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Generated Clips */}
      {clips.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Video className="w-6 h-6 text-primary" />
            Your Videos
          </h2>
          
          <div className="grid gap-4">
            {clips.map((clip) => (
              <Card key={clip.id} className="shadow-warm">
                <CardContent className="p-6">
                  {clip.status === 'success' ? (
                    <div className="space-y-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-primary" />
                            <h3 className="font-semibold text-lg">Video Generated</h3>
                          </div>
                          <p className="text-sm text-muted-foreground">{clip.prompt}</p>
                          <div className="flex gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Mic className="w-3 h-3" />
                              {clip.voice === 'male' ? 'Male' : 'Female'} Voice
                            </span>
                            <span className="flex items-center gap-1">
                              <Music className="w-3 h-3" />
                              {clip.music.charAt(0).toUpperCase() + clip.music.slice(1)} Music
                            </span>
                          </div>
                        </div>
                        <Button
                          onClick={() => handleDownload(clip)}
                          className="gap-2"
                        >
                          <Download className="w-4 h-4" />
                          Download
                        </Button>
                      </div>
                      
                      {/* Video Preview */}
                      <div className="bg-muted rounded-lg p-4 flex items-center justify-center min-h-[200px]">
                        <video
                          src={clip.blobUrl}
                          controls
                          className="max-w-full max-h-[300px] rounded"
                        >
                          Your browser does not support the video tag.
                        </video>
                      </div>
                    </div>
                  ) : (
                    <Alert variant="destructive">
                      <AlertDescription>
                        {clip.error || 'Failed to generate video. Please try again.'}
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Sharing Help Section */}
      <Card className="shadow-warm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-primary" />
            Sharing & Upload Help
          </CardTitle>
          <CardDescription>
            Follow these steps to upload your downloaded videos to social media platforms
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <SiYoutube className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 space-y-2">
                <h3 className="font-semibold">YouTube</h3>
                <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                  <li>Download your video using the Download button above</li>
                  <li>Go to YouTube Studio and click "Create" → "Upload videos"</li>
                  <li>Select your downloaded video file</li>
                  <li>Add title, description, and tags</li>
                  <li>Choose visibility settings and publish</li>
                </ol>
              </div>
            </div>

            <Separator />

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <SiInstagram className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 space-y-2">
                <h3 className="font-semibold">Instagram</h3>
                <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                  <li>Download your video to your mobile device</li>
                  <li>Open Instagram and tap the "+" icon</li>
                  <li>Select "Reel" or "Post"</li>
                  <li>Choose your downloaded video from your gallery</li>
                  <li>Add filters, music, and captions, then share</li>
                </ol>
              </div>
            </div>

            <Separator />

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <SiX className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 space-y-2">
                <h3 className="font-semibold">X (Twitter)</h3>
                <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                  <li>Download your video file</li>
                  <li>Go to X and click "Post" or the compose button</li>
                  <li>Click the media icon and select your video</li>
                  <li>Add your text and hashtags</li>
                  <li>Click "Post" to share</li>
                </ol>
              </div>
            </div>

            <Separator />

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <SiFacebook className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 space-y-2">
                <h3 className="font-semibold">Facebook</h3>
                <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                  <li>Download your video file</li>
                  <li>Go to your Facebook profile or page</li>
                  <li>Click "Photo/Video" in the create post section</li>
                  <li>Select your downloaded video</li>
                  <li>Add a description and choose your audience, then post</li>
                </ol>
              </div>
            </div>
          </div>

          <Alert>
            <AlertDescription className="text-sm">
              <strong>Tip:</strong> For best results, ensure your video meets each platform's requirements 
              (aspect ratio, duration, file size). Most platforms support MP4 format with H.264 codec.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}
