import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Copy, Check } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

interface ACCProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  jobId: number;
  onUploadComplete: () => void;
}

export function ACCProjectDialog({ open, onOpenChange, jobId, onUploadComplete }: ACCProjectDialogProps) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [selectedHub, setSelectedHub] = useState<string>("");
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [tokenCopied, setTokenCopied] = useState(false);

  // Get OAuth URL with client-side callback
  const { data: authData } = trpc.acc.getAuthUrl.useQuery(
    { redirectUri: window.location.origin + "/acc/callback" },
    { enabled: open && !accessToken }
  );

  // Exchange code mutation
  const exchangeCodeMutation = trpc.acc.exchangeCode.useMutation({
    onSuccess: (tokens) => {
      console.log("[ACC Auth] Token received:", tokens.access_token?.substring(0, 20) + "...");
      setAccessToken(tokens.access_token);
      setIsAuthenticating(false);
      toast.success("Successfully authenticated with ACC!");
    },
    onError: (error) => {
      setIsAuthenticating(false);
      toast.error(`Authentication failed: ${error.message}`);
    },
  });

  // Debug: Get raw API response
  const { data: debugData } = trpc.acc.debugHubsRaw.useQuery(
    { accessToken: accessToken! },
    { enabled: !!accessToken }
  );
  console.log("[ACC Debug] Raw API response:", debugData);

  // List hubs
  console.log("[ACC Dialog] Access token state:", accessToken ? "SET" : "NOT SET");
  const { data: hubs, isLoading: isLoadingHubs } = trpc.acc.listHubs.useQuery(
    { accessToken: accessToken! },
    { enabled: !!accessToken }
  );
  console.log("[ACC Dialog] Hubs data:", hubs);

  // List projects
  const { data: projects, isLoading: isLoadingProjects } = trpc.acc.listProjects.useQuery(
    { accessToken: accessToken!, hubId: selectedHub },
    { enabled: !!accessToken && !!selectedHub }
  );

  // Upload mutation
  const uploadMutation = trpc.acc.uploadAssets.useMutation({
    onSuccess: (result) => {
      if (result.success) {
        toast.success(
          `Successfully uploaded ${result.count} assets to ACC!${result.errors.length > 0 ? ` (${result.errors.length} batches had errors)` : ""}`,
          { duration: 5000 }
        );
        if (result.errors.length > 0) {
          console.error("Upload errors:", result.errors);
        }
      } else {
        toast.error(`Upload failed: ${result.message}`);
      }
      onUploadComplete();
      onOpenChange(false);
    },
    onError: (error) => {
      toast.error(`Upload failed: ${error.message}`);
    },
  });

  // Handle OAuth
  const handleAuthenticate = () => {
    if (!authData?.authUrl) return;

    setIsAuthenticating(true);
    const width = 600;
    const height = 700;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;

    const authWindow = window.open(
      authData.authUrl,
      "ACC Authorization",
      `width=${width},height=${height},left=${left},top=${top}`
    );

    // Listen for OAuth callback with authorization code
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === "ACC_AUTH_SUCCESS" && event.data.code) {
        // Exchange the authorization code for an access token
        exchangeCodeMutation.mutate({
          code: event.data.code,
          redirectUri: window.location.origin + "/acc/callback",
        });
        window.removeEventListener("message", handleMessage);
      } else if (event.data.type === "ACC_AUTH_ERROR") {
        setIsAuthenticating(false);
        toast.error(`Authentication error: ${event.data.error}`);
        window.removeEventListener("message", handleMessage);
      }
    };

    window.addEventListener("message", handleMessage);

    // Check if window was closed
    const checkClosed = setInterval(() => {
      if (authWindow?.closed) {
        clearInterval(checkClosed);
        setIsAuthenticating(false);
        window.removeEventListener("message", handleMessage);
      }
    }, 500);
  };

  const handleUpload = () => {
    console.log('[ACC Dialog] handleUpload called', { accessToken: !!accessToken, selectedProject, jobId });
    
    if (!accessToken || !selectedProject) {
      console.log('[ACC Dialog] Upload blocked - missing token or project');
      return;
    }

    console.log('[ACC Dialog] Calling uploadMutation.mutate...');
    uploadMutation.mutate({
      accessToken,
      projectId: selectedProject,
      jobId,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Push to ACC</DialogTitle>
          <DialogDescription>
            Select an ACC project to upload your extracted assets
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {!accessToken ? (
            <div className="text-center space-y-4">
              <p className="text-sm text-muted-foreground">
                You need to authenticate with Autodesk to access your ACC projects
              </p>
              <Button
                onClick={handleAuthenticate}
                disabled={isAuthenticating || !authData}
                className="w-full"
              >
                {isAuthenticating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  "Authenticate with Autodesk"
                )}
              </Button>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2 p-3 bg-muted rounded-lg mb-4">
                <div className="flex-1 text-sm">
                  <div className="font-medium mb-1">Access Token (for debugging)</div>
                  <code className="text-xs break-all">{accessToken.substring(0, 40)}...</code>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    navigator.clipboard.writeText(accessToken);
                    setTokenCopied(true);
                    setTimeout(() => setTokenCopied(false), 2000);
                    toast.success("Token copied to clipboard!");
                  }}
                >
                  {tokenCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              <div className="space-y-2">
                <Label htmlFor="hub">Select Hub</Label>
                <Select value={selectedHub} onValueChange={setSelectedHub} disabled={isLoadingHubs}>
                  <SelectTrigger id="hub">
                    <SelectValue placeholder={isLoadingHubs ? "Loading hubs..." : "Select a hub"} />
                  </SelectTrigger>
                  <SelectContent>
                    {hubs?.hubs?.map((hub: any) => (
                      <SelectItem key={hub.id} value={hub.id}>
                        {hub.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedHub && (
                <div className="space-y-2">
                  <Label htmlFor="project">Select Project</Label>
                  <Select value={selectedProject} onValueChange={setSelectedProject} disabled={isLoadingProjects}>
                    <SelectTrigger id="project">
                      <SelectValue placeholder={isLoadingProjects ? "Loading projects..." : "Select a project"} />
                    </SelectTrigger>
                    <SelectContent>
                      {projects?.projects?.map((project: any) => (
                        <SelectItem key={project.id} value={project.id}>
                          {project.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="flex gap-2 pt-4">
                <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
                  Cancel
                </Button>
                <Button
                  onClick={handleUpload}
                  disabled={!selectedProject || uploadMutation.isPending}
                  className="flex-1 bg-orange-500 hover:bg-orange-600"
                >
                  {uploadMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    "Upload to ACC"
                  )}
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
