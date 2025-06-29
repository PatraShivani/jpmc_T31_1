import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { useVolunteers } from '../hooks/useFirebase';
import { 
  Users, 
  Mail, 
  Phone, 
  Calendar, 
  CheckCircle, 
  XCircle, 
  Clock,
  Filter,
  Download
} from 'lucide-react';

const Volunteers = () => {
  const { volunteers, loading, error, updateVolunteer } = useVolunteers();
  const [statusFilter, setStatusFilter] = useState('all');

  const updateVolunteerStatus = async (id, newStatus) => {
    try {
      await updateVolunteer(id, { status: newStatus });
    } catch (err) {
      alert(`Error updating volunteer status: ${err.message}`);
    }
  };

  const filteredVolunteers = volunteers.filter(volunteer => {
    if (statusFilter === 'all') return true;
    return volunteer.status === statusFilter;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return <Badge variant="success" className="flex items-center"><CheckCircle className="h-3 w-3 mr-1" />Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive" className="flex items-center"><XCircle className="h-3 w-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge variant="warning" className="flex items-center"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
    }
  };

  const exportVolunteers = () => {
    const csvContent = [
      ['Name', 'Email', 'Phone', 'Skills', 'Availability', 'Experience', 'Status', 'Registration Date'],
      ...filteredVolunteers.map(v => [
        v.name, v.email, v.phone, v.skills, v.availability, v.experience, v.status, v.registrationDate
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'kalams_volunteers.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const stats = {
    total: volunteers.length,
    pending: volunteers.filter(v => v.status === 'pending').length,
    approved: volunteers.filter(v => v.status === 'approved').length,
    rejected: volunteers.filter(v => v.status === 'rejected').length
  };

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-kalams-blue mx-auto mb-4"></div>
          <p className="text-gray-600">Loading volunteers from Firebase...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading volunteers: {error}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Volunteer Management</h1>
          <p className="text-gray-600">Manage volunteer registrations and applications</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={exportVolunteers}
            className="flex items-center"
          >
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Volunteers</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <Users className="h-8 w-8 text-kalams-blue" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Rejected</p>
                <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <Filter className="h-5 w-5 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filter by status:</span>
            <div className="flex space-x-2">
              {['all', 'pending', 'approved', 'rejected'].map((status) => (
                <Button
                  key={status}
                  variant={statusFilter === status ? 'kalam' : 'outline'}
                  size="sm"
                  onClick={() => setStatusFilter(status)}
                  className="capitalize"
                >
                  {status}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Volunteers List */}
      <div className="grid grid-cols-1 gap-6">
        {filteredVolunteers.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No volunteers found</h3>
              <p className="text-gray-600">
                {statusFilter === 'all' 
                  ? 'No volunteer registrations yet.' 
                  : `No ${statusFilter} volunteers found.`}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredVolunteers.map((volunteer) => (
            <Card key={volunteer.id} className="neumorphic-card">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-1">
                          {volunteer.name}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <div className="flex items-center">
                            <Mail className="h-4 w-4 mr-1" />
                            {volunteer.email}
                          </div>
                          <div className="flex items-center">
                            <Phone className="h-4 w-4 mr-1" />
                            {volunteer.phone}
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {volunteer.registrationDate}
                          </div>
                        </div>
                      </div>
                      {getStatusBadge(volunteer.status)}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">Skills</p>
                        <p className="text-sm text-gray-600">{volunteer.skills || 'Not specified'}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">Availability</p>
                        <p className="text-sm text-gray-600 capitalize">{volunteer.availability || 'Not specified'}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">Experience</p>
                        <p className="text-sm text-gray-600">{volunteer.experience || 'No experience mentioned'}</p>
                      </div>
                    </div>
                  </div>

                  {volunteer.status === 'pending' && (
                    <div className="flex space-x-2">
                      <Button
                        variant="success"
                        size="sm"
                        onClick={() => updateVolunteerStatus(volunteer.id, 'approved')}
                        className="flex items-center"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => updateVolunteerStatus(volunteer.id, 'rejected')}
                        className="flex items-center"
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default Volunteers;
