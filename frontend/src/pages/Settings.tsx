import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';

interface BusinessDetails {
  businessName: string;
  businessAddress: string;
  contactPersonName: string;
  phoneNumber: string;
  emailAddress: string;
  gstNumber: string;
}

const Settings: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [businessDetails, setBusinessDetails] = useState<BusinessDetails>({
    businessName: '',
    businessAddress: '',
    contactPersonName: '',
    phoneNumber: '',
    emailAddress: '',
    gstNumber: '',
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setBusinessDetails(prev => ({
      ...prev,
      [id]: value,
    }));
  };
  
  const handleSaveChanges = () => {
    // Here you would typically send the data to your backend API
    console.log('Saving business details:', businessDetails);
    
    // Show success toast
    toast({
      title: "Settings Saved",
      description: "Your business details have been updated successfully.",
      variant: "default",
    });
  };
  
  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Settings</h1>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm p-6">
        <Tabs defaultValue="business-details" className="w-full">
          <TabsList className="mb-6 border-b w-full justify-start rounded-none bg-transparent p-0">
            <TabsTrigger 
              value="business-details" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-2"
            >
              Business Details
            </TabsTrigger>
            <TabsTrigger 
              value="notification" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-2"
            >
              Notification
            </TabsTrigger>
            <TabsTrigger 
              value="security" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-2"
            >
              Security
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="business-details" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="mb-4">
                  <Label htmlFor="businessName" className="block mb-2">
                    Business Name
                  </Label>
                  <Input
                    id="businessName"
                    value={businessDetails.businessName}
                    onChange={handleInputChange}
                    placeholder="Enter your business name"
                    className="w-full"
                  />
                </div>
                
                <div className="mb-4">
                  <Label htmlFor="contactPersonName" className="block mb-2">
                    Contact Person Name
                  </Label>
                  <Input
                    id="contactPersonName"
                    value={businessDetails.contactPersonName}
                    onChange={handleInputChange}
                    placeholder="Enter contact person name"
                    className="w-full"
                  />
                </div>
                
                <div className="mb-4">
                  <Label htmlFor="phoneNumber" className="block mb-2">
                    Phone Number
                  </Label>
                  <Input
                    id="phoneNumber"
                    value={businessDetails.phoneNumber}
                    onChange={handleInputChange}
                    placeholder="Enter phone number"
                    className="w-full"
                  />
                </div>
                
                <div className="mb-4">
                  <Label htmlFor="emailAddress" className="block mb-2">
                    Email Address
                  </Label>
                  <Input
                    id="emailAddress"
                    type="email"
                    value={businessDetails.emailAddress}
                    onChange={handleInputChange}
                    placeholder="Enter email address"
                    className="w-full"
                  />
                </div>
                
                <div className="mb-4">
                  <Label htmlFor="gstNumber" className="block mb-2">
                    GST Number
                  </Label>
                  <Input
                    id="gstNumber"
                    value={businessDetails.gstNumber}
                    onChange={handleInputChange}
                    placeholder="Enter GST number"
                    className="w-full"
                  />
                </div>
              </div>
              
              <div>
                <div className="mb-4">
                  <Label htmlFor="businessAddress" className="block mb-2">
                    Business Address
                  </Label>
                  <Textarea
                    id="businessAddress"
                    value={businessDetails.businessAddress}
                    onChange={handleInputChange}
                    placeholder="Enter your business address"
                    className="w-full h-[200px] resize-none"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex justify-start mt-6 space-x-4">
              <Button 
                onClick={handleSaveChanges}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                Save Changes
              </Button>
              <Button 
                variant="outline"
                onClick={() => navigate('/')}
              >
                Cancel
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="notification" className="mt-0">
            <div className="min-h-[300px] flex items-center justify-center">
              <p className="text-gray-500">Notification settings will be implemented in a future update.</p>
            </div>
          </TabsContent>
          
          <TabsContent value="security" className="mt-0">
            <div className="min-h-[300px] flex items-center justify-center">
              <p className="text-gray-500">Security settings will be implemented in a future update.</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Settings;
