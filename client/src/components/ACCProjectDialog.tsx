import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
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

  // Get OAuth URL
  const { data: authData } = trpc.acc.getAuthUrl.useQuery(
    { redirectUri: window.location.origin + "/api/acc/oauth/callback" },
    { enabled: open && !accessToken }
  );

  // List hubs
  const { data: hubs, isLoading: isLoadingHubs } = trpc.acc.listHubs.useQuery(
    { accessToken: accessToken! },
    { enabled: !!accessToken }
  );

  // List projects
  const { data: projects, isLoading: isLoadingProjects } = trpc.acc.listProjects.useQuery(
    { accessToken: accessToken!, hubId: selectedHub },
    { enabled: !!accessToken && !!selectedHub }
  );

  // Upload mutation
  const uploadMutation = trpc.acc.uploadAssets.useMutation({
    onSuccess: (result) => {
      toast.success(`Successfully uploaded ${result.count} assets to ACC!`);
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

    // Listen for OAuth callback
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === "ACC_AUTH_SUCCESS") {
        // Fetch the access token from the server
        fetch("/api/acc/oauth/token")
          .then((res) => res.json())
          .then((data) => {
            setAccessToken(data.accessToken);
            setIsAuthenticating(false);
            toast.success("Successfully authenticated with ACC!");
          })
          .catch(() => {
            setIsAuthenticating(false);
            toast.error("Failed to get access token");
          });

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
    if (!accessToken || !selectedProject) return;

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
