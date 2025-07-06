"use client";

import { useState } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { analyzeClothingImage, type AnalyzeClothingImageOutput } from "@/ai/flows/analyze-clothing-image";
import { generateAiModel } from "@/ai/flows/generate-ai-model";
import { compositeClothingOnModel } from "@/ai/flows/composite-clothing-on-model";
import { toBase64 } from "@/lib/image-utils";
import { useToast } from "@/hooks/use-toast";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { Upload, Sparkles, Shirt, Download, Loader2 } from "lucide-react";

const modelFormSchema = z.object({
  pose: z.string().min(1, "Please select a pose."),
  bodyType: z.string().min(1, "Please select a body type."),
  skinTone: z.string().min(1, "Please specify a skin tone."),
});

type ModelFormValues = z.infer<typeof modelFormSchema>;

export default function VirtualVoguePage() {
  const [clothingImage, setClothingImage] = useState<string | null>(null);
  const [clothingAnalysis, setClothingAnalysis] = useState<AnalyzeClothingImageOutput | null>(null);
  
  const [modelImage, setModelImage] = useState<string | null>(null);
  
  const [compositeImage, setCompositeImage] = useState<string | null>(null);

  const [loadingStates, setLoadingStates] = useState({
    analyzing: false,
    generatingModel: false,
    compositing: false,
  });

  const { toast } = useToast();

  const modelForm = useForm<ModelFormValues>({
    resolver: zodResolver(modelFormSchema),
    defaultValues: {
      pose: "standing confidently, hands on hips",
      bodyType: "athletic build",
      skinTone: "light brown skin",
    },
  });

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoadingStates(prev => ({ ...prev, analyzing: true }));
    setClothingAnalysis(null);
    setCompositeImage(null);
    try {
      const dataUri = await toBase64(file);
      setClothingImage(dataUri);
      const analysisResult = await analyzeClothingImage({ photoDataUri: dataUri });
      setClothingAnalysis(analysisResult);
    } catch (error) {
      console.error("Error analyzing image:", error);
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: "Could not analyze the uploaded image. Please try another one.",
      });
      setClothingImage(null);
    } finally {
      setLoadingStates(prev => ({ ...prev, analyzing: false }));
    }
  };

  const handleGenerateModel = async (values: ModelFormValues) => {
    setLoadingStates(prev => ({ ...prev, generatingModel: true }));
    setModelImage(null);
    setCompositeImage(null);
    try {
      const description = `A full-body studio portrait of a female model with ${values.skinTone} and an ${values.bodyType}. The model is ${values.pose}. The background is plain white.`;
      const result = await generateAiModel({ description });
      setModelImage(result.modelImage);
    } catch (error) {
      console.error("Error generating model:", error);
      toast({
        variant: "destructive",
        title: "Model Generation Failed",
        description: "Could not generate the AI model. Please try again.",
      });
    } finally {
      setLoadingStates(prev => ({ ...prev, generatingModel: false }));
    }
  };

  const handleCreateTryOn = async () => {
    if (!clothingImage || !modelImage) {
      toast({
        variant: "destructive",
        title: "Missing Images",
        description: "Please upload a clothing item and generate a model first.",
      });
      return;
    }

    setLoadingStates(prev => ({ ...prev, compositing: true }));
    setCompositeImage(null);
    try {
      const result = await compositeClothingOnModel({
        clothingImageDataUri: clothingImage,
        modelImageDataUri: modelImage,
      });
      setCompositeImage(result.compositeImage);
    } catch (error) {
      console.error("Error creating try-on:", error);
      toast({
        variant: "destructive",
        title: "Virtual Try-On Failed",
        description: "Could not create the composite image. Please try again.",
      });
    } finally {
      setLoadingStates(prev => ({ ...prev, compositing: false }));
    }
  };
  
  const downloadImage = () => {
    if (!compositeImage) return;
    const link = document.createElement('a');
    link.href = compositeImage;
    link.download = 'virtual-vogue-try-on.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-10 w-full border-b bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-3">
            <Logo className="h-8 w-8 text-primary" />
            <h1 className="font-headline text-2xl font-bold text-primary">
              Virtual Vogue
            </h1>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto p-4 md:p-8">
        <div className="text-center mb-12">
            <h2 className="font-headline text-4xl md:text-5xl font-bold">AI-Powered Virtual Photoshoots</h2>
            <p className="text-muted-foreground mt-4 max-w-2xl mx-auto text-lg">
                Upload your apparel, generate the perfect AI model, and create stunning virtual try-on images in seconds.
            </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Step 1: Upload Clothing */}
          <Card className="h-full flex flex-col">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary">
                  <Shirt className="w-5 h-5" />
                </div>
                <div>
                  <CardTitle className="font-headline text-2xl">Step 1: Upload Apparel</CardTitle>
                  <CardDescription>Select an image of your clothing item.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col items-center justify-center text-center gap-4">
              <div className="w-full aspect-square rounded-lg border-2 border-dashed bg-muted/50 flex items-center justify-center relative overflow-hidden">
                {loadingStates.analyzing && (
                  <div className="absolute inset-0 bg-background/80 flex flex-col items-center justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    <p className="mt-2 text-muted-foreground">Analyzing...</p>
                  </div>
                )}
                {clothingImage ? (
                  <Image src={clothingImage} alt="Uploaded clothing" layout="fill" objectFit="contain" />
                ) : (
                  <div className="text-muted-foreground flex flex-col items-center">
                    <Upload className="w-12 h-12 mb-2" />
                    <p>Image preview will appear here.</p>
                  </div>
                )}
              </div>
              <Label htmlFor="clothing-upload" className="w-full">
                <Button asChild className="w-full cursor-pointer">
                  <span><Upload className="mr-2 h-4 w-4" /> Choose File</span>
                </Button>
                <Input id="clothing-upload" type="file" className="sr-only" accept="image/*" onChange={handleFileChange} disabled={loadingStates.analyzing} />
              </Label>
              {clothingAnalysis && (
                <div className="text-left w-full space-y-2 pt-4">
                  <h4 className="font-semibold">Analysis Results:</h4>
                  <p><span className="font-medium">Type:</span> {clothingAnalysis.garmentType}</p>
                  <div className="flex flex-wrap gap-2">
                    {clothingAnalysis.clothingFeatures.map(feature => (
                      <Badge key={feature} variant="secondary">{feature}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Step 2: Generate Model */}
          <Card className="h-full flex flex-col">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <CardTitle className="font-headline text-2xl">Step 2: Generate Model</CardTitle>
                  <CardDescription>Customize and create your AI model.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col items-center justify-center text-center gap-4">
              <div className="w-full aspect-square rounded-lg border-2 border-dashed bg-muted/50 flex items-center justify-center relative overflow-hidden">
                 {loadingStates.generatingModel && (
                  <div className="absolute inset-0 bg-background/80 flex flex-col items-center justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    <p className="mt-2 text-muted-foreground">Generating...</p>
                  </div>
                )}
                {modelImage ? (
                   <Image src={modelImage} alt="AI Generated Model" layout="fill" objectFit="contain" />
                ) : (
                  <div className="text-muted-foreground flex flex-col items-center">
                    <Sparkles className="w-12 h-12 mb-2" />
                    <p>AI model will appear here.</p>
                  </div>
                )}
              </div>
              <Form {...modelForm}>
                <form onSubmit={modelForm.handleSubmit(handleGenerateModel)} className="w-full space-y-4">
                  <FormField
                    control={modelForm.control}
                    name="pose"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pose</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a pose" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="standing confidently, hands on hips">Confident Stance</SelectItem>
                            <SelectItem value="walking forward, smiling">Walking Pose</SelectItem>
                            <SelectItem value="leaning against a wall, casual">Casual Lean</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={modelForm.control}
                    name="skinTone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Skin Tone</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                           <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a skin tone" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="light brown skin">Light Brown</SelectItem>
                            <SelectItem value="dark chocolate skin">Dark Chocolate</SelectItem>
                            <SelectItem value="pale ivory skin">Pale Ivory</SelectItem>
                            <SelectItem value="olive skin">Olive</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={loadingStates.generatingModel}>
                    {loadingStates.generatingModel ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                    Generate AI Model
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* Step 3: Virtual Try-On */}
          <Card className="h-full flex flex-col bg-primary/5">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary">
                  <Download className="w-5 h-5" />
                </div>
                <div>
                  <CardTitle className="font-headline text-2xl">Step 3: Get Result</CardTitle>
                  <CardDescription>Your virtual try-on image.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col items-center justify-center text-center gap-4">
              <div className="w-full aspect-square rounded-lg border-2 border-dashed bg-muted/50 flex items-center justify-center relative overflow-hidden">
                {loadingStates.compositing && (
                  <div className="absolute inset-0 bg-background/80 flex flex-col items-center justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    <p className="mt-2 text-muted-foreground">Creating...</p>
                  </div>
                )}
                {compositeImage ? (
                  <Image src={compositeImage} alt="Virtual Try-On Result" layout="fill" objectFit="contain" />
                ) : (
                  <div className="text-muted-foreground flex flex-col items-center">
                    <Download className="w-12 h-12 mb-2" />
                    <p>Your final image will appear here.</p>
                  </div>
                )}
              </div>
              <Button onClick={handleCreateTryOn} className="w-full" disabled={!clothingImage || !modelImage || loadingStates.compositing}>
                {loadingStates.compositing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                Create Virtual Try-On
              </Button>
            </CardContent>
            <CardFooter>
              <Button onClick={downloadImage} variant="outline" className="w-full" disabled={!compositeImage}>
                <Download className="mr-2 h-4 w-4" /> Download Image
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>

      <footer className="py-6 border-t">
        <div className="container mx-auto text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Virtual Vogue. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
}
