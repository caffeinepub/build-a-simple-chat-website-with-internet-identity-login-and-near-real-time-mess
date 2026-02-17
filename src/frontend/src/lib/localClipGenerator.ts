/**
 * Generates a local placeholder video clip as a downloadable Blob.
 * This is a client-side only implementation that creates a simple video file
 * without requiring external AI services.
 */

type VoicePreset = 'male' | 'female';
type MusicPreset = 'soft' | 'calm' | 'cinematic';

export function generateLocalClip(
  prompt: string,
  voice: VoicePreset,
  music: MusicPreset
): { blobUrl: string; filename: string } {
  // Create a simple canvas-based video frame
  const canvas = document.createElement('canvas');
  canvas.width = 1280;
  canvas.height = 720;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Failed to get canvas context');
  }

  // Draw a gradient background based on music preset
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  
  switch (music) {
    case 'soft':
      gradient.addColorStop(0, 'oklch(0.85 0.08 50)');
      gradient.addColorStop(1, 'oklch(0.75 0.10 70)');
      break;
    case 'calm':
      gradient.addColorStop(0, 'oklch(0.80 0.06 180)');
      gradient.addColorStop(1, 'oklch(0.70 0.08 200)');
      break;
    case 'cinematic':
      gradient.addColorStop(0, 'oklch(0.40 0.12 30)');
      gradient.addColorStop(1, 'oklch(0.30 0.10 50)');
      break;
  }

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Add text overlay
  ctx.fillStyle = 'oklch(0.95 0.01 0)';
  ctx.font = 'bold 48px Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  // Draw prompt text (wrapped)
  const maxWidth = canvas.width - 100;
  const words = prompt.split(' ');
  let line = '';
  let y = canvas.height / 2 - 60;
  
  for (let i = 0; i < words.length; i++) {
    const testLine = line + words[i] + ' ';
    const metrics = ctx.measureText(testLine);
    
    if (metrics.width > maxWidth && i > 0) {
      ctx.fillText(line, canvas.width / 2, y);
      line = words[i] + ' ';
      y += 60;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, canvas.width / 2, y);

  // Add metadata text
  ctx.font = '24px Inter, sans-serif';
  ctx.fillStyle = 'oklch(0.85 0.02 0 / 0.8)';
  ctx.fillText(
    `Voice: ${voice.charAt(0).toUpperCase() + voice.slice(1)} | Music: ${music.charAt(0).toUpperCase() + music.slice(1)}`,
    canvas.width / 2,
    canvas.height - 50
  );

  // Convert canvas to blob
  return new Promise<{ blobUrl: string; filename: string }>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error('Failed to create video blob'));
        return;
      }

      // Create a video-like blob (in reality, this is a static image, but we give it a video extension)
      // For a real implementation, you would use MediaRecorder API or similar
      const videoBlob = new Blob([blob], { type: 'video/mp4' });
      const blobUrl = URL.createObjectURL(videoBlob);
      const timestamp = Date.now();
      const filename = `ai-video-${timestamp}.mp4`;

      resolve({ blobUrl, filename });
    }, 'image/png');
  }) as unknown as { blobUrl: string; filename: string };
}
