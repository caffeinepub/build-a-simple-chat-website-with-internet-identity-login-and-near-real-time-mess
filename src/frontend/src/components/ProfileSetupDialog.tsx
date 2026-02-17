import { useState } from 'react';
import { useSaveCallerUserProfile } from '../hooks/useCallerUserProfile';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Loader2 } from 'lucide-react';

interface ProfileSetupDialogProps {
  open: boolean;
}

export function ProfileSetupDialog({ open }: ProfileSetupDialogProps) {
  const [name, setName] = useState('');
  const saveProfile = useSaveCallerUserProfile();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;

    try {
      await saveProfile.mutateAsync({ name: trimmed });
    } catch (error) {
      console.error('Failed to save profile:', error);
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-md" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Welcome!</DialogTitle>
          <DialogDescription>
            Please enter your name to get started with your private Q&A collection.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Your Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              disabled={saveProfile.isPending}
              autoFocus
            />
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={saveProfile.isPending || !name.trim()}
          >
            {saveProfile.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              'Continue'
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
