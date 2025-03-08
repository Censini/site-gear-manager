
import { useNavigate, useLocation } from "react-router-dom";
import { IPRangeForm } from "@/components/iprange/IPRangeForm";

const AddIPRange = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get site ID from URL query parameter
  const queryParams = new URLSearchParams(location.search);
  const siteIdFromQuery = queryParams.get("siteId") || "";

  const handleCancel = () => {
    if (siteIdFromQuery) {
      navigate(`/sites/${siteIdFromQuery}`);
    } else {
      navigate("/ipam");
    }
  };

  const handleSuccess = (siteId: string) => {
    // Navigate back to site detail if siteId is provided, otherwise to IPAM
    if (siteId) {
      navigate(`/sites/${siteId}`);
    } else {
      navigate("/ipam");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Add IP Range</h1>
          <p className="text-muted-foreground">Add a new IP range to your inventory</p>
        </div>
      </div>

      <IPRangeForm 
        defaultSiteId={siteIdFromQuery}
        onCancel={handleCancel}
        onSuccess={handleSuccess}
      />
    </div>
  );
};

export default AddIPRange;
