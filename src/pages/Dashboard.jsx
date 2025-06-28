import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Users, GraduationCap, Heart, TrendingUp } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();

  const stats = [
    {
      title: 'Total Families',
      value: '156',
      icon: Users,
      change: '+12%',
      changeType: 'positive'
    },
    {
      title: 'Active Students',
      value: '342',
      icon: GraduationCap,
      change: '+8%',
      changeType: 'positive'
    },
    {
      title: 'Women Empowered',
      value: '89',
      icon: Heart,
      change: '+15%',
      changeType: 'positive'
    },
    {
      title: 'Skill Training Completed',
      value: '67%',
      icon: TrendingUp,
      change: '+5%',
      changeType: 'positive'
    }
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'student',
      message: 'New student Aisha Khan enrolled in Math program',
      time: '2 hours ago',
      status: 'success'
    },
    {
      id: 2,
      type: 'women',
      message: 'Fatima completed tailoring certification',
      time: '4 hours ago',
      status: 'success'
    },
    {
      id: 3,
      type: 'family',
      message: 'New family registered: The Shaikh Family',
      time: '1 day ago',
      status: 'info'
    },
    {
      id: 4,
      type: 'attendance',
      message: 'Weekly attendance report generated',
      time: '2 days ago',
      status: 'info'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="neumorphic-card p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-gray-600">
          Here's what's happening with your Kalam Foundation dashboard today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className="neumorphic-card p-3">
                  <stat.icon className="h-6 w-6 text-primary-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <Badge variant="success" className="text-xs">
                  {stat.change}
                </Badge>
                <span className="text-xs text-gray-500 ml-2">from last month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3 p-3 neumorphic-card">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    activity.status === 'success' ? 'bg-green-500' : 'bg-blue-500'
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{activity.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <button className="w-full p-4 text-left neumorphic-button rounded-xl hover:shadow-neumorphic-sm transition-all">
                <div className="flex items-center space-x-3">
                  <Users className="h-5 w-5 text-primary-600" />
                  <div>
                    <p className="font-medium text-gray-900">Add New Family</p>
                    <p className="text-sm text-gray-600">Register a new family to the program</p>
                  </div>
                </div>
              </button>
              
              <button className="w-full p-4 text-left neumorphic-button rounded-xl hover:shadow-neumorphic-sm transition-all">
                <div className="flex items-center space-x-3">
                  <GraduationCap className="h-5 w-5 text-primary-600" />
                  <div>
                    <p className="font-medium text-gray-900">Take Attendance</p>
                    <p className="text-sm text-gray-600">Record student attendance for today</p>
                  </div>
                </div>
              </button>
              
              <button className="w-full p-4 text-left neumorphic-button rounded-xl hover:shadow-neumorphic-sm transition-all">
                <div className="flex items-center space-x-3">
                  <Heart className="h-5 w-5 text-primary-600" />
                  <div>
                    <p className="font-medium text-gray-900">Update Skills Training</p>
                    <p className="text-sm text-gray-600">Update women's training progress</p>
                  </div>
                </div>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
