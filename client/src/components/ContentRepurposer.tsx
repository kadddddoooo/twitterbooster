import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { FiFileText, FiLink, FiYoutube, FiRss, FiCheck } from 'react-icons/fi';
import axios from 'axios';

interface ContentRepurposerProps {
  onTweetCreated?: (tweet: string) => void;
}

const ContentRepurposer = ({ onTweetCreated }: ContentRepurposerProps) => {
  const { toast } = useToast();
  const [url, setUrl] = useState('');
  const [content, setContent] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [contentType, setContentType] = useState<'url' | 'text' | 'file'>('url');
  const [file, setFile] = useState<File | null>(null);
  const [generatedTweets, setGeneratedTweets] = useState<string[]>([]);
  const [outputFormat, setOutputFormat] = useState<'thread' | 'single'>('thread');

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleRepurpose = async () => {
    try {
      setIsProcessing(true);
      
      let payload: any = {
        outputFormat
      };
      
      // Determine what content source to use
      if (contentType === 'url' && url) {
        payload.sourceType = 'url';
        payload.sourceContent = url;
      } else if (contentType === 'text' && content) {
        payload.sourceType = 'text';
        payload.sourceContent = content;
      } else if (contentType === 'file' && file) {
        // For file upload, we need FormData
        const formData = new FormData();
        formData.append('file', file);
        formData.append('outputFormat', outputFormat);
        
        // In a real app, we'd upload the file first, then process it
        // For now, we'll simulate the result
        setGeneratedTweets([
          "🔥 Just published a new article on AI and automation! #TwitterBooster",
          "The key to effective social media is consistency and quality content. Here's how our AI can help you achieve both...",
          "Automation doesn't replace human creativity - it enhances it. Our tools help you focus on what matters most.",
          "Check out the full article here: [Your Link] #AI #SocialMediaTips"
        ]);
        
        if (onTweetCreated) {
          onTweetCreated("🔥 Just published a new article on AI and automation! #TwitterBooster");
        }
        
        toast({
          title: "Content Repurposed",
          description: "Your content has been successfully converted into tweets.",
        });
        
        setIsProcessing(false);
        return;
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Please provide content to repurpose."
        });
        setIsProcessing(false);
        return;
      }
      
      // In a production app, we'd call an API here
      // const response = await axios.post('/api/repurpose-content', payload);
      // setGeneratedTweets(response.data.tweets);
      
      // For now, we'll simulate the API response
      setTimeout(() => {
        const simulatedTweets = [
          "📊 The latest data shows that AI-powered tweets get 37% more engagement! #TwitterTips",
          "Want to grow your audience? Consistency is key. Here's how our scheduler can help you maintain a regular posting schedule.",
          "Smart marketers are using trend analysis to stay ahead of the curve. Our tools make this accessible to everyone.",
          "Try our new AI content generator today and see the difference! #ContentCreation #SocialMedia"
        ];
        
        setGeneratedTweets(simulatedTweets);
        
        if (onTweetCreated) {
          onTweetCreated(simulatedTweets[0]);
        }
        
        toast({
          title: "Content Repurposed",
          description: "Your content has been successfully converted into tweets.",
        });
        
        setIsProcessing(false);
      }, 2000);
      
    } catch (error) {
      console.error("Error repurposing content:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to repurpose content. Please try again.",
      });
      setIsProcessing(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Content Repurposer</CardTitle>
        <CardDescription>
          Transform your existing content into engaging tweets automatically
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="url" onValueChange={(value) => setContentType(value as 'url' | 'text' | 'file')}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="url" className="flex items-center gap-2">
              <FiLink className="text-sm" />
              <span>URL</span>
            </TabsTrigger>
            <TabsTrigger value="text" className="flex items-center gap-2">
              <FiFileText className="text-sm" />
              <span>Text</span>
            </TabsTrigger>
            <TabsTrigger value="file" className="flex items-center gap-2">
              <FiRss className="text-sm" />
              <span>Upload</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="url">
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-2">
                  Enter a URL of a blog post, article, or any web content
                </p>
                <Input
                  placeholder="https://example.com/your-content"
                  value={url}
                  onChange={handleUrlChange}
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="text">
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground mb-2">
                Paste your content here
              </p>
              <Textarea 
                placeholder="Paste your article, newsletter, or any content here..."
                value={content}
                onChange={handleContentChange}
                rows={6}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="file">
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground mb-2">
                Upload a document (PDF, DOCX, TXT)
              </p>
              <div className="border-2 border-dashed border-muted-foreground/20 rounded-md p-6 text-center">
                <Input 
                  type="file" 
                  className="hidden" 
                  id="file-upload" 
                  onChange={handleFileChange}
                  accept=".pdf,.docx,.txt,.md"
                />
                <label 
                  htmlFor="file-upload" 
                  className="cursor-pointer flex flex-col items-center justify-center"
                >
                  <FiYoutube className="h-10 w-10 text-muted-foreground mb-2" />
                  <span className="text-sm font-medium">
                    {file ? file.name : 'Click to upload a document'}
                  </span>
                  <span className="text-xs text-muted-foreground mt-1">
                    PDF, DOCX, TXT up to 10MB
                  </span>
                </label>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm font-medium">Output Format</p>
            <Select 
              value={outputFormat} 
              onValueChange={(value) => setOutputFormat(value as 'thread' | 'single')}
            >
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="thread">Thread</SelectItem>
                <SelectItem value="single">Single Tweet</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {generatedTweets.length > 0 && (
          <div className="mt-6 p-4 bg-muted rounded-md">
            <p className="text-sm font-medium mb-3">Generated Tweets</p>
            <div className="space-y-3">
              {generatedTweets.map((tweet, index) => (
                <div key={index} className="p-3 bg-card rounded-md border">
                  <p className="text-sm">{tweet}</p>
                  <div className="flex justify-end mt-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-xs"
                      onClick={() => {
                        navigator.clipboard.writeText(tweet);
                        toast({
                          title: "Copied",
                          description: "Tweet copied to clipboard",
                        });
                      }}
                    >
                      Copy
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-xs"
                      onClick={() => {
                        // In a real app, we'd call an API to schedule the tweet
                        toast({
                          title: "Tweet Scheduled",
                          description: "Your tweet has been scheduled",
                        });
                      }}
                    >
                      Schedule
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button 
          onClick={handleRepurpose} 
          disabled={isProcessing}
          className="flex items-center gap-2"
        >
          {isProcessing ? (
            <>Processing...</>
          ) : (
            <>
              <FiCheck className="h-4 w-4" />
              <span>Repurpose Content</span>
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ContentRepurposer; 