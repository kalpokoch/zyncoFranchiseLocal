import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import zyncoLogo from '@/assets/icons/zyncoLogoText.png';
import { useToast } from "@/hooks/use-toast";
import { authApi } from '@/api/authApi';
import { AxiosError } from 'axios';

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await authApi.login({ employeeId, password });
      console.log('Access Token:', response.accessToken);
      toast({
        title: "Login Successful",
        description: `Welcome back, ${response.name}!`,
      });

      // Navigate based on user type
      if (response.userType === 'ADMIN') {
        navigate('/franchise-select');
      } else {
        navigate('/franchise-select');
      }
    } catch (error) {
      console.error('Login error:', error);
      const axiosError = error as AxiosError<{ message: string }>;
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: axiosError.response?.data?.message || "Invalid employee ID or password",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    // Handle forgot password logic
    toast({
      title: "Password Reset",
      description: "Password reset functionality will be implemented soon.",
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      {/* Logo outside the tile */}
      <div className="mb-6">
        <img src={zyncoLogo} alt="Zynco Logo" className="h-16" />
      </div>
      
      {/* Login tile with shadow in all 4 directions */}
      <div className="w-full max-w-md bg-white rounded-lg shadow-[0_0_15px_rgba(0,0,0,0.1)] p-8">
        <h1 className="text-2xl font-semibold text-center mb-6">Login to your account</h1>
        
        <form onSubmit={handleLogin}>
          <div className="space-y-4">
            <div>
              <label htmlFor="employeeId" className="block text-sm font-medium text-gray-700 mb-1">
                Employee ID
              </label>
              <Input
                id="employeeId"
                type="text"
                placeholder="Enter your employee ID"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                required
                className="w-full"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full"
              />
            </div>
            
            <div className="text-right">
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-[#5E17EB] text-sm hover:underline"
              >
                Forgot Password?
              </button>
            </div>
            
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#5E17EB] hover:bg-[#5E17EB]/90 text-white py-2"
            >
              {isLoading ? 'Logging in...' : 'Login now'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
