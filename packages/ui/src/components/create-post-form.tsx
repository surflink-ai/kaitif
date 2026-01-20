"use client";

import { useState, useRef } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "./dialog";
import { Button } from "./button";
import { Input } from "./input";
import { Textarea } from "./textarea";
import { Avatar } from "./avatar";
import { Image as ImageIcon, Video, Tag, Loader2, Plus, X } from "lucide-react";
import { Label } from "./label";

interface CreatePostFormProps {
  onPostCreated: (post: any) => void;
}

export function CreatePostForm({ onPostCreated }: CreatePostFormProps) {
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [trickTag, setTrickTag] = useState("");
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState<"TEXT" | "MEDIA" | "CLIP">("TEXT");
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setMediaUrl(URL.createObjectURL(selectedFile)); // Preview
    }
  };

  const clearFile = () => {
    setFile(null);
    setMediaUrl("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content && !file && !mediaUrl) return;

    setLoading(true);
    try {
      let finalMediaUrl = mediaUrl;

      // Upload file if selected
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        
        const uploadRes = await fetch("/api/feed/media", {
          method: "POST",
          body: formData
        });
        
        if (!uploadRes.ok) throw new Error("Failed to upload media");
        
        const data = await uploadRes.json();
        finalMediaUrl = data.url;
      }

      // Determine type
      let postType = type;
      if (finalMediaUrl) {
        postType = trickTag ? "CLIP" : "MEDIA";
      } else {
        postType = "TEXT";
      }

      const res = await fetch("/api/feed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content,
          mediaUrl: finalMediaUrl || undefined,
          trickTag: trickTag || undefined,
          type: postType
        }),
      });

      if (res.ok) {
        const post = await res.json();
        onPostCreated(post);
        setOpen(false);
        // Reset form
        setContent("");
        setMediaUrl("");
        setFile(null);
        setTrickTag("");
        setType("TEXT");
      }
    } catch (error) {
      console.error("Failed to create post", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          className="fixed bottom-20 right-4 h-14 w-14 rounded-full shadow-lg bg-[#FFCC00] text-[#080808] hover:bg-[#FFCC00]/90 z-40 md:hidden"
        >
          <Plus className="h-6 w-6" />
        </Button>
      </DialogTrigger>
      
      {/* Desktop trigger */}
      <div className="hidden md:block mb-6">
        <Button 
          onClick={() => setOpen(true)}
          className="w-full h-12 justify-start px-4 text-[#F5F5F0]/60 bg-[#1A1A1A] border border-[#F5F5F0]/10 hover:bg-[#1A1A1A]/80 hover:text-[#F5F5F0] rounded-xl"
        >
          <Avatar className="h-8 w-8 mr-3" name="+" size="sm" />
          What's happening at the park?
        </Button>
      </div>

      <DialogContent className="bg-[#1A1A1A] border-[#F5F5F0]/10 text-[#F5F5F0] sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create Post</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Textarea
              placeholder="What's on your mind?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="bg-[#080808] border-[#F5F5F0]/10 min-h-[100px] resize-none"
            />
          </div>

          <div className="space-y-2">
            {!mediaUrl ? (
              <div className="flex gap-2">
                <Input
                  type="file"
                  accept="image/*,video/*"
                  onChange={handleFileChange}
                  className="hidden"
                  ref={fileInputRef}
                  id="file-upload"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full border-dashed border-[#F5F5F0]/20 hover:border-[#F5F5F0]/40 text-[#F5F5F0]/60"
                >
                  <ImageIcon className="mr-2 h-4 w-4" />
                  Add Photo/Video
                </Button>
              </div>
            ) : (
              <div className="relative rounded-lg overflow-hidden border border-[#F5F5F0]/10 bg-black aspect-video flex items-center justify-center">
                {file?.type.startsWith('video') || mediaUrl.match(/\.(mp4|mov|webm)$/i) ? (
                  <video src={mediaUrl} className="max-h-full max-w-full" controls />
                ) : (
                  <img src={mediaUrl} alt="Preview" className="max-h-full max-w-full object-contain" />
                )}
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 h-8 w-8 rounded-full"
                  onClick={clearFile}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          {mediaUrl && (
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wider text-[#F5F5F0]/60">Trick Tag (Optional)</Label>
              <div className="flex gap-2">
                <Tag className="h-4 w-4 text-[#FFCC00] mt-3" />
                <Input
                  placeholder="e.g. Kickflip"
                  value={trickTag}
                  onChange={(e) => setTrickTag(e.target.value)}
                  className="bg-[#080808] border-[#F5F5F0]/10"
                />
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-[#FFCC00] text-[#080808] hover:bg-[#FFCC00]/90"
              disabled={(!content && !mediaUrl) || loading}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Post
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
