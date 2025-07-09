import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Search, Phone, User, CheckCircle, XCircle, MapPin } from 'lucide-react';
import AddBDEModal from '@/components/modal/AddBDEModal';
interface BDEEmployee {
  id: string;
  name: string;
  location: string;
  phone: string;
}

interface AttendanceRecord {
  id: string;
  name: string;
  inTime: string;
  outTime: string;
  date: string;
  present: boolean;
}

const ManageBDE = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [showAddModal, setShowAddModal] = useState(false);

  // Dummy franchise data for modal
  const franchises = [
    { franchiseId: 'F0002', franchiseName: 'Franchise 2' },
    { franchiseId: 'F0003', franchiseName: 'Franchise 3' },
  ];

  const handleAddBDE = async (data: any) => {
    // TODO: Implement API call
    console.log('Add BDE:', data);
  };

  const bdeEmployees: BDEEmployee[] = [
    {
      id: '1',
      name: 'Deep Boro',
      location: 'Location',
      phone: '+91 9876543210'
    },
    {
      id: '2', 
      name: 'Deep Boro',
      location: 'Location',
      phone: '+91 9876543210'
    }
  ];

  const attendanceRecords: AttendanceRecord[] = [
    {
      id: '1',
      name: 'Deep Boro',
      inTime: '00:00',
      outTime: '00:00',
      date: '06-09-2025',
      present: false
    },
    {
      id: '2',
      name: 'Gyandoop Maan',
      inTime: '08:11 am',
      outTime: '06:09 pm',
      date: '06-09-2025',
      present: true
    },
    {
      id: '3',
      name: 'Amit Boro',
      inTime: '09:21 pm',
      outTime: '06:00 pm',
      date: '06-09-2025',
      present: true
    },
    {
      id: '4',
      name: 'John Brahma',
      inTime: '07:00 am',
      outTime: '05:10 pm',
      date: '06-09-2025',
      present: true
    },
    {
      id: '5',
      name: 'Akash Saha',
      inTime: '08:11 am',
      outTime: '06:09 pm',
      date: '06-09-2025',
      present: true
    },
    {
      id: '6',
      name: 'Abhijit Sarkar',
      inTime: '08:11 am',
      outTime: '07:00 pm',
      date: '06-09-2025',
      present: true
    }
  ];

  const filteredRecords = attendanceRecords.filter(record =>
    record.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedRecords = filteredRecords.slice(startIndex, startIndex + itemsPerPage);

  return (
    <MainLayout>
      <AddBDEModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddBDE}
        franchises={franchises}
      />
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Manage BDE</h1>
          <div className="flex gap-2">
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setShowAddModal(true)}>Add BDE</Button>
            <Button className="bg-green-600 hover:bg-green-700">Add Sales</Button>
          </div>
        </div>

        {/* Search */}
        <div className="relative w-80">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search BDE"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Overall Stats Card */}
        <Card className="bg-white shadow-sm">
          <CardContent className="p-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <div className="w-8 h-8 bg-yellow-400 rounded-md flex items-center justify-center">
                    <span className="text-sm font-bold text-white">65</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Overall Attendance</p>
                  <p className="text-2xl font-bold">65</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center">
                  <div className="w-8 h-8 bg-cyan-400 rounded-md flex items-center justify-center">
                    <span className="text-sm font-bold text-white">65</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Employees</p>
                  <p className="text-2xl font-bold">65</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* BDE Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {bdeEmployees.map((employee) => (
            <Card key={employee.id} className="bg-white shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{employee.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                      <MapPin className="h-4 w-4" />
                      <span>{employee.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="h-4 w-4" />
                      <span>{employee.phone}</span>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <Button className="bg-orange-500 hover:bg-orange-600 text-white py-3">
                    Manage BDE
                  </Button>
                  <Button className="bg-purple-600 hover:bg-purple-700 text-white py-3">
                    View Attendance
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Attendance Table */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">All Attendance</h2>
            
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>In time</TableHead>
                    <TableHead>Out time</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Present</TableHead>
                    <TableHead>Absent</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedRecords.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell className="font-medium">{record.name}</TableCell>
                      <TableCell>{record.inTime}</TableCell>
                      <TableCell>{record.outTime}</TableCell>
                      <TableCell>{record.date}</TableCell>
                      <TableCell>
                        {record.present && (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        )}
                      </TableCell>
                      <TableCell>
                        {!record.present && (
                          <XCircle className="h-5 w-5 text-red-500" />
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>Showing</span>
                <select className="border border-gray-300 rounded px-2 py-1">
                  <option>1</option>
                  <option>5</option>
                  <option>10</option>
                </select>
                <span>of 50</span>
              </div>
              
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentPage(Math.max(1, currentPage - 1));
                      }}
                    />
                  </PaginationItem>
                  {[1, 2, 3, 4, 5].map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        href="#"
                        isActive={currentPage === page}
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage(page);
                        }}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentPage(Math.min(totalPages, currentPage + 1));
                      }}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default ManageBDE;