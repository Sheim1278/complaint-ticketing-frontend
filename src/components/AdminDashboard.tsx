import { useState, useEffect } from 'react';
import { Filter, Search, Calendar, TrendingUp, Clock, ThumbsUp, Package2, Download } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';
import html2canvas from 'html2canvas';
import ComplaintCard from './ComplaintCard';
import type { Complaint } from '../types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface AdminDashboardProps {
  complaints: Complaint[];
  onStatusChange: (complaintId: string, newStatus: 'pending' | 'in-progress' | 'resolved') => void;
  onSendMessage: (complaintId: string, message: string) => void;
  userRole: 'admin';
}

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const currentYear = new Date().getFullYear();

const categories = {
  academic: 'Account Issues',
  technical: 'CONTACT Problems',
  facilities: 'FEEDBACK Problems',
  administrative: 'ORDER',
  financial: 'REFUND',
  library: 'SHIPPING',
  other: 'Other'
};

const mockComplaintTrends = Array(12).fill(0).map(() => Math.floor(Math.random() * 40 + 10));
const mockResolvedTrends = Array(12).fill(0).map((_, i) => Math.floor((i + 1) * 5 + Math.random() * 10));
const mockSatisfactionTrends = Array(12).fill(0).map(() => Math.floor(Math.random() * 40 + 20));

export default function AdminDashboard({ complaints, onStatusChange, onSendMessage, userRole }: AdminDashboardProps) {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState(`${currentYear}-01-01`);
  const [endDate, setEndDate] = useState(`${currentYear}-12-31`);

  const stats = {
    totalComplaints: 500,
    avgResolutionTime: 2.5,
    satisfactionRate: 85,
    topCategory: 'Academic Issues'
  };

  const complaintTrendData = {
    labels: months,
    datasets: [
      {
        label: 'Complaints',
        data: mockComplaintTrends,
        borderColor: 'rgb(79, 70, 229)',
        tension: 0.4,
      },
    ],
  };

  const resolvedTrendData = {
    labels: months,
    datasets: [
      {
        label: 'Resolved Complaints',
        data: mockResolvedTrends,
        borderColor: 'rgb(34, 197, 94)',
        tension: 0.4,
      },
    ],
  };

  const satisfactionTrendData = {
    labels: months,
    datasets: [
      {
        label: 'Satisfaction Rate',
        data: mockSatisfactionTrends,
        borderColor: 'rgb(249, 115, 22)',
        backgroundColor: 'rgba(249, 115, 22, 0.5)',
        tension: 0.4,
      },
    ],
  };

  const statusDistributionData = {
    labels: ['Pending', 'In Progress', 'Resolved'],
    datasets: [
      {
        data: [25, 10, 65],
        backgroundColor: [
          'rgb(234, 179, 8)',
          'rgb(79, 70, 229)',
          'rgb(34, 197, 94)',
        ],
        borderWidth: 0,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    cutout: '75%',
  };

  const downloadDashboardSection = async (elementId: string, filename: string) => {
    const element = document.getElementById(elementId);
    if (element) {
      try {
        const canvas = await html2canvas(element);
        const link = document.createElement('a');
        link.download = `${filename}-${new Date().toISOString().split('T')[0]}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      } catch (error) {
        console.error('Error generating image:', error);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Complaints Dashboard</h2>
        <button
          onClick={() => downloadDashboardSection('admin-dashboard', 'dashboard')}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Download className="h-5 w-5" />
          Download Report
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="flex items-center bg-white p-4 rounded-lg shadow">
          <Search className="h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search complaints..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="ml-2 flex-1 border-0 focus:ring-0 focus:outline-none"
          />
        </div>
        
        <div className="flex items-center space-x-4 bg-white p-4 rounded-lg shadow">
          <Calendar className="h-5 w-5 text-gray-400" />
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          <span>to</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center space-x-4 bg-white p-4 rounded-lg shadow">
          <Filter className="h-5 w-5 text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="flex-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>
      </div>

      <div id="stats-section" className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Complaints</p>
              <p className="mt-1 text-3xl font-semibold text-gray-900">{stats.totalComplaints}</p>
              <p className="mt-1 text-sm text-green-600">+16% from previous</p>
            </div>
            <div className="p-3 bg-indigo-50 rounded-full">
              <TrendingUp className="h-6 w-6 text-indigo-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Avg Resolution Time</p>
              <p className="mt-1 text-3xl font-semibold text-gray-900">{stats.avgResolutionTime} Days</p>
              <p className="mt-1 text-sm text-red-600">-10% from previous</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-full">
              <Clock className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Satisfaction Rate</p>
              <p className="mt-1 text-3xl font-semibold text-gray-900">{stats.satisfactionRate}%</p>
              <p className="mt-1 text-sm text-green-600">+4% from previous</p>
            </div>
            <div className="p-3 bg-green-50 rounded-full">
              <ThumbsUp className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Top Category</p>
              <p className="mt-1 text-3xl font-semibold text-gray-900">{stats.topCategory}</p>
              <p className="mt-1 text-sm text-gray-500">45% of total</p>
            </div>
            <div className="p-3 bg-orange-50 rounded-full">
              <Package2 className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      <div id="charts-section" className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">Complaints Trend Over Time</h3>
            <button
              onClick={() => downloadDashboardSection('complaints-trend', 'complaints-trend')}
              className="p-2 text-gray-500 hover:text-gray-700"
            >
              <Download className="h-5 w-5" />
            </button>
          </div>
          <div id="complaints-trend">
            <Line data={complaintTrendData} options={chartOptions} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">Resolved Complaints Over Time</h3>
            <button
              onClick={() => downloadDashboardSection('resolved-trend', 'resolved-trend')}
              className="p-2 text-gray-500 hover:text-gray-700"
            >
              <Download className="h-5 w-5" />
            </button>
          </div>
          <div id="resolved-trend">
            <Line data={resolvedTrendData} options={chartOptions} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">Complaints by Status</h3>
            <button
              onClick={() => downloadDashboardSection('status-distribution', 'status-distribution')}
              className="p-2 text-gray-500 hover:text-gray-700"
            >
              <Download className="h-5 w-5" />
            </button>
          </div>
          <div id="status-distribution" className="flex items-center justify-center">
            <div className="w-64">
              <Doughnut data={statusDistributionData} options={doughnutOptions} />
            </div>
            <div className="ml-8">
              <div className="flex items-center mb-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                <span>Pending (25%)</span>
              </div>
              <div className="flex items-center mb-2">
                <div className="w-3 h-3 rounded-full bg-indigo-600 mr-2"></div>
                <span>In Progress (10%)</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                <span>Resolved (65%)</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">Cosumter Satisfaction Trend</h3>
            <button
              onClick={() => downloadDashboardSection('satisfaction-trend', 'satisfaction-trend')}
              className="p-2 text-gray-500 hover:text-gray-700"
            >
              <Download className="h-5 w-5" />
            </button>
          </div>
          <div id="satisfaction-trend">
            <Line data={satisfactionTrendData} options={chartOptions} />
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-lg font-medium text-gray-900">Recent Complaints</h3>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {complaints.map((complaint) => (
            <ComplaintCard
              key={complaint.id}
              complaint={complaint}
              userRole={userRole}
              onSendMessage={onSendMessage}
            />
          ))}
        </div>
      </div>
    </div>
  );
}