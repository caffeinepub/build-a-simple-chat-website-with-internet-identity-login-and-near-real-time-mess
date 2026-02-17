import { useState } from 'react';
import { useAnswerQuestion } from '../hooks/useAnswerQuestion';
import { useTextToSpeech } from '../hooks/useTextToSpeech';
import type { Question } from '../backend';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Volume2, VolumeX, Edit, Save, X, Loader2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';

const MAX_ANSWER_LENGTH = 1000;

interface QAItemCardProps {
  question: Question;
}

export function QAItemCard({ question }: QAItemCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [answerText, setAnswerText] = useState(question.answer || '');
  const answerQuestion = useAnswerQuestion();
  const { 
    speak, 
    stop, 
    isSpeaking, 
    isSupported: ttsSupported,
    error: ttsError 
  } = useTextToSpeech();

  const handleSaveAnswer = async () => {
    const trimmed = answerText.trim();
    if (!trimmed || trimmed.length === 0) return;
    if (trimmed.length > MAX_ANSWER_LENGTH) return;

    try {
      await answerQuestion.mutateAsync({
        questionId: question.id,
        answer: trimmed,
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to save answer:', error);
    }
  };

  const handlePlayQuestion = () => {
    if (isSpeaking) {
      stop();
    } else {
      const textToSpeak = question.answer 
        ? `Question: ${question.content}. Answer: ${question.answer}`
        : `Question: ${question.content}`;
      speak(textToSpeak);
    }
  };

  const remainingChars = MAX_ANSWER_LENGTH - answerText.length;
  const isOverLimit = remainingChars < 0;

  return (
    <Card className="animate-fade-in">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <CardTitle className="text-lg font-semibold flex-1">
            {question.content}
          </CardTitle>
          {ttsSupported && (
            <Button
              size="icon"
              variant="outline"
              onClick={handlePlayQuestion}
              className="h-8 w-8 shrink-0"
            >
              {isSpeaking ? (
                <VolumeX className="h-4 w-4" />
              ) : (
                <Volume2 className="h-4 w-4" />
              )}
            </Button>
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          {new Date(Number(question.created) / 1000000).toLocaleString()}
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        {!ttsSupported && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Text-to-speech is not supported in your browser.
            </AlertDescription>
          </Alert>
        )}

        {ttsError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {ttsError}
            </AlertDescription>
          </Alert>
        )}

        {isEditing ? (
          <div className="space-y-3">
            <Textarea
              value={answerText}
              onChange={(e) => setAnswerText(e.target.value)}
              placeholder="Type your answer in Nepali..."
              className="min-h-[100px] resize-none"
              disabled={answerQuestion.isPending}
            />
            <div className="flex items-center justify-between">
              <span className={`text-sm ${isOverLimit ? 'text-destructive' : 'text-muted-foreground'}`}>
                {remainingChars} characters remaining
              </span>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false);
                    setAnswerText(question.answer || '');
                  }}
                  disabled={answerQuestion.isPending}
                >
                  <X className="w-4 h-4 mr-1" />
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleSaveAnswer}
                  disabled={
                    answerQuestion.isPending || 
                    !answerText.trim() || 
                    isOverLimit
                  }
                >
                  {answerQuestion.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-1" />
                      Save
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {question.answer ? (
              <div className="bg-muted/50 rounded-lg p-3">
                <p className="text-sm font-medium text-muted-foreground mb-1">Answer:</p>
                <p className="text-sm whitespace-pre-wrap">{question.answer}</p>
                {question.modified && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Updated: {new Date(Number(question.modified) / 1000000).toLocaleString()}
                  </p>
                )}
              </div>
            ) : (
              <div className="bg-muted/30 rounded-lg p-3 text-center">
                <p className="text-sm text-muted-foreground">No answer yet</p>
              </div>
            )}
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsEditing(true)}
              className="w-full gap-2"
            >
              <Edit className="w-4 h-4" />
              {question.answer ? 'Edit Answer' : 'Add Answer'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
