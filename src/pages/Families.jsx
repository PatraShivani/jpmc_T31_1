import React, { useState, useEffect } from 'react';
import { Plus, Filter, Users, Phone, MapPin, Calendar } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Select } from '../components/ui/Select';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { mockFamilies, centers } from '../data/mockData';

const Families = () => {
  const [families, setFamilies] = useState(() => {
    // Try to load from localStorage first
    const savedFamilies = localStorage.getItem('kalams_families_data');
    if (savedFamilies) {
      try {
        return JSON.parse(savedFamilies);
      } catch (error) {
        console.error('Error parsing saved families data:', error);
      }
    }

    // Use mock data if no saved data exists
    localStorage.setItem('kalams_families_data', JSON.stringify(mockFamilies));
    return mockFamilies;
  });
  const [selectedCenter, setSelectedCenter] = useState('All Centers');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newFamily, setNewFamily] = useState({
    name: '',
    contact: '',
    center: '',
    address: ''
  });

  // Save families data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('kalams_families_data', JSON.stringify(families));
  }, [families]);

  const filteredFamilies = selectedCenter === 'All Centers'
    ? families
    : families.filter(family => family.center === selectedCenter);

  // Function to reset families data (for testing/development)
  const resetFamiliesData = () => {
    localStorage.removeItem('kalams_families_data');
    window.location.reload();
  };

  const handleAddFamily = (e) => {
    e.preventDefault();
    const family = {
      id: families.length + 1,
      ...newFamily,
      registrationDate: new Date().toISOString().split('T')[0],
      members: []
    };
    setFamilies([...families, family]);
    setNewFamily({ name: '', contact: '', center: '', address: '' });
    setIsAddModalOpen(false);

    // Show success message
    alert(`✅ Family added successfully!\n\nFamily: ${newFamily.name}\nCenter: ${newFamily.center}\nContact: ${newFamily.contact}`);
  };

  const getProgressBadge = (member) => {
    if (member.role === 'student') {
      if (member.attendance >= 90) return { variant: 'success', text: 'Excellent' };
      if (member.attendance >= 75) return { variant: 'primary', text: 'Good' };
      return { variant: 'warning', text: 'Needs Attention' };
    } else {
      if (member.trainingStatus === 'completed') return { variant: 'success', text: 'Completed' };
      if (member.trainingStatus === 'in-progress') return { variant: 'primary', text: 'In Progress' };
      return { variant: 'warning', text: 'Started' };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Family Management</h1>
          <p className="text-gray-600">Manage and track KALAMS families and their members</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={resetFamiliesData}
            className="text-xs"
          >
            Reset Data
          </Button>
          <Button onClick={() => setIsAddModalOpen(true)} variant="kalam">
            <Plus className="h-4 w-4 mr-2" />
            Add Family
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <Filter className="h-5 w-5 text-gray-500" />
            <Select
              value={selectedCenter}
              onChange={(e) => setSelectedCenter(e.target.value)}
              className="w-full sm:w-auto"
            >
              {centers.map(center => (
                <option key={center} value={center}>{center}</option>
              ))}
            </Select>
            <div className="text-sm text-gray-600">
              Showing {filteredFamilies.length} families
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Families Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredFamilies.map((family) => (
          <Card key={family.id} className="hover:shadow-neumorphic-lg transition-all duration-200">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="text-lg">{family.name}</span>
                <Badge variant="primary">{family.members.length} members</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {/* Family Info */}
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="h-4 w-4 mr-2" />
                    {family.contact}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    {family.center}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    Registered: {new Date(family.registrationDate).toLocaleDateString()}
                  </div>
                </div>

                {/* Members */}
                <div className="pt-3 border-t border-gray-200">
                  <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                    <Users className="h-4 w-4 mr-2" />
                    Family Members
                  </h4>
                  <div className="space-y-2">
                    {family.members.map((member) => {
                      const badge = getProgressBadge(member);
                      return (
                        <div key={member.id} className="neumorphic-card p-3 rounded-lg">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium text-gray-900">{member.name}</p>
                              <p className="text-sm text-gray-600">
                                {member.role === 'student' ? member.education : member.skill}
                              </p>
                              {member.role === 'student' && (
                                <p className="text-xs text-gray-500">
                                  Attendance: {member.attendance}% | Last Score: {member.lastTestScore}
                                </p>
                              )}
                            </div>
                            <Badge variant={badge.variant} className="text-xs">
                              {badge.text}
                            </Badge>
                          </div>
                        </div>
                      );
                    })}
                    {family.members.length === 0 && (
                      <p className="text-sm text-gray-500 italic">No members added yet</p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add Family Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Family"
        className="max-w-lg"
      >
        <form onSubmit={handleAddFamily} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Family Name
            </label>
            <Input
              value={newFamily.name}
              onChange={(e) => setNewFamily({...newFamily, name: e.target.value})}
              placeholder="Enter family name"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contact Number
            </label>
            <Input
              value={newFamily.contact}
              onChange={(e) => setNewFamily({...newFamily, contact: e.target.value})}
              placeholder="Enter contact number"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Center
            </label>
            <Select
              value={newFamily.center}
              onChange={(e) => setNewFamily({...newFamily, center: e.target.value})}
              required
            >
              <option value="">Select a center</option>
              {centers.slice(1).map(center => (
                <option key={center} value={center}>{center}</option>
              ))}
            </Select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address
            </label>
            <Input
              value={newFamily.address}
              onChange={(e) => setNewFamily({...newFamily, address: e.target.value})}
              placeholder="Enter address"
              required
            />
          </div>
          
          <div className="flex gap-3 pt-4">
            <Button type="submit" variant="kalam" className="flex-1">
              Add Family
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsAddModalOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Families;
