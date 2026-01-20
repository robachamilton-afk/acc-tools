import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

export default function DebugLocations() {
  const [accessToken, setAccessToken] = useState("");
  const [showTokenHelp, setShowTokenHelp] = useState(false);
  const [projectId, setProjectId] = useState("f9279835-5cf2-4fb2-96a5-260df390b324");
  const [result, setResult] = useState<any>(null);

  const debugMutation = trpc.acc.debugLocations.useMutation({
    onSuccess: (data) => {
      console.log("[Debug] Location API result:", data);
      setResult(data);
    },
    onError: (error) => {
      console.error("[Debug] Location API error:", error);
      setResult({ success: false, error: error.message });
    },
  });

  const handleTest = () => {
    if (!accessToken || !projectId) {
      alert("Please enter both access token and project ID");
      return;
    }
    debugMutation.mutate({ accessToken, projectId });
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Debug Locations API</h1>

      <Card className="p-6 mb-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Access Token</label>
            <Input
              type="text"
              value={accessToken}
              onChange={(e) => setAccessToken(e.target.value)}
              placeholder="Paste your ACC access token here"
            />
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowTokenHelp(!showTokenHelp)}
            >
              How to get access token?
            </Button>
            {showTokenHelp && (
              <div className="bg-muted p-4 rounded text-sm space-y-2">
                <p>To get your access token:</p>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Go to the Export page for any extraction job</li>
                  <li>Click "Push to ACC" button</li>
                  <li>Complete the authentication (if needed)</li>
                  <li>Open browser DevTools (F12) → Console tab</li>
                  <li>Look for a log message with the token</li>
                  <li>Or check the Network tab for any ACC API request and copy the Bearer token from the Authorization header</li>
                </ol>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Project ID</label>
            <Input
              type="text"
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              placeholder="ACC Project ID"
            />
          </div>

          <Button onClick={handleTest} disabled={debugMutation.isPending}>
            {debugMutation.isPending ? "Testing..." : "Test Location API"}
          </Button>
        </div>
      </Card>

      {result && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Result</h2>
          <pre className="bg-muted p-4 rounded overflow-auto">
            {JSON.stringify(result, null, 2)}
          </pre>
        </Card>
      )}
    </div>
  );
}
