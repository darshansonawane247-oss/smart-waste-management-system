// Realistic Mock Data for SWM - Nashik Municipal Corporation Waste Monitoring

export const NASHIK_AREAS = [
  'Panchavati',
  'College Road',
  'Gangapur Road',
  'Satpur',
  'Indira Nagar',
  'CIDCO',
  'Dwarka',
  'Nashik Road',
  'Makhmalabad'
];

export const WASTE_CATEGORIES = [
  'Overflowing Dustbin',
  'Garbage Dump',
  'Plastic Waste',
  'Food Waste',
  'Construction Waste',
  'E-Waste',
  'Roadside Garbage',
  'Other'
];

export const WORKERS = [
  {
    id: 'W-01',
    name: 'Ramesh Shinde',
    employeeId: 'NMC-SAN-401',
    phone: '+91 98230 11223',
    assignedArea: 'CIDCO',
    status: 'Available',
    activeTasks: 1,
    rating: 4.8
  },
  {
    id: 'W-02',
    name: 'Suresh Patil',
    employeeId: 'NMC-SAN-402',
    phone: '+91 98230 44556',
    assignedArea: 'Panchavati',
    status: 'Busy',
    activeTasks: 2,
    rating: 4.6
  },
  {
    id: 'W-03',
    name: 'Ganesh Gaikwad',
    employeeId: 'NMC-SAN-403',
    phone: '+91 98230 77889',
    assignedArea: 'Gangapur Road',
    status: 'Available',
    activeTasks: 1,
    rating: 4.9
  },
  {
    id: 'W-04',
    name: 'Santosh Jadhav',
    employeeId: 'NMC-SAN-404',
    phone: '+91 98230 99112',
    assignedArea: 'Nashik Road',
    status: 'Available',
    activeTasks: 0,
    rating: 4.7
  },
  {
    id: 'W-05',
    name: 'Deepak More',
    employeeId: 'NMC-SAN-405',
    phone: '+91 98230 33445',
    assignedArea: 'Indira Nagar',
    status: 'Available',
    activeTasks: 1,
    rating: 4.5
  }
];

// Realistic Initial Reports
export const INITIAL_REPORTS = [
  {
    id: 'SWM-2026-00121',
    category: 'Overflowing Dustbin',
    description: 'Community dustbin near KTHM college bus stop is overflowing onto the main pavement. Stray animals gathering.',
    location: 'Gangapur Road, near KTHM College',
    area: 'Gangapur Road',
    lat: 20.0063,
    lng: 73.7635,
    citizenName: 'Aarav Deshmukh',
    citizenEmail: 'aarav.deshmukh@gmail.com',
    citizenPhone: '+91 98221 44556',
    reportedDate: '2026-09-06 08:30 AM',
    status: 'In Progress',
    assignedWorkerId: 'W-03',
    assignedWorkerName: 'Ganesh Gaikwad',
    imageUrl: 'https://images.unsplash.com/photo-1605600659908-0ef719419d41?w=600&auto=format&fit=crop&q=80',
    completionImageUrl: null,
    timeline: [
      { step: 'Reported', date: '06 Sep 2026, 08:30 AM', completed: true },
      { step: 'Assigned', date: '06 Sep 2026, 10:15 AM', completed: true },
      { step: 'In Progress', date: '07 Sep 2026, 09:00 AM', completed: true },
      { step: 'Completed', date: null, completed: false }
    ],
    notes: 'Worker Ganesh dispatched with collection vehicle MH-15-AB-4122.'
  },
  {
    id: 'SWM-2026-00122',
    category: 'Garbage Dump',
    description: 'Illegal dumping of market organic and plastic waste behind Ramkund ghat area.',
    location: 'Panchavati, Near Ramkund Ghat',
    area: 'Panchavati',
    lat: 20.0112,
    lng: 73.7915,
    citizenName: 'Pooja Kulkarni',
    citizenEmail: 'pooja.kulkarni@yahoo.com',
    citizenPhone: '+91 94220 88991',
    reportedDate: '2026-09-06 11:45 AM',
    status: 'Pending',
    assignedWorkerId: null,
    assignedWorkerName: null,
    imageUrl: 'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?w=600&auto=format&fit=crop&q=80',
    completionImageUrl: null,
    timeline: [
      { step: 'Reported', date: '06 Sep 2026, 11:45 AM', completed: true },
      { step: 'Assigned', date: null, completed: false },
      { step: 'In Progress', date: null, completed: false },
      { step: 'Completed', date: null, completed: false }
    ],
    notes: 'Under municipal supervisor review.'
  },
  {
    id: 'SWM-2026-00123',
    category: 'Plastic Waste',
    description: 'Bulk single-use plastics and packaging discarded along open drainage line near Rajiv Gandhi Bhavan.',
    location: 'CIDCO, Sector 4, Near Rajiv Gandhi Bhavan',
    area: 'CIDCO',
    lat: 19.9882,
    lng: 73.7621,
    citizenName: 'Rahul Joshi',
    citizenEmail: 'rahul.joshi@rediffmail.com',
    citizenPhone: '+91 97654 33211',
    reportedDate: '2026-09-05 02:15 PM',
    status: 'Completed',
    assignedWorkerId: 'W-01',
    assignedWorkerName: 'Ramesh Shinde',
    imageUrl: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=600&auto=format&fit=crop&q=80',
    completionImageUrl: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=600&auto=format&fit=crop&q=80',
    timeline: [
      { step: 'Reported', date: '05 Sep 2026, 02:15 PM', completed: true },
      { step: 'Assigned', date: '05 Sep 2026, 03:40 PM', completed: true },
      { step: 'In Progress', date: '06 Sep 2026, 08:30 AM', completed: true },
      { step: 'Completed', date: '06 Sep 2026, 11:10 AM', completed: true }
    ],
    notes: 'Drainage line cleared by sanitary team CIDCO Division.'
  },
  {
    id: 'SWM-2026-00124',
    category: 'Construction Waste',
    description: 'Cement debris and broken bricks dumped on pedestrian walkway blocking vehicular passage.',
    location: 'College Road, Model Colony Lane 3',
    area: 'College Road',
    lat: 20.0028,
    lng: 73.7610,
    citizenName: 'Sneha Bhamre',
    citizenEmail: 'sneha.bhamre@gmail.com',
    citizenPhone: '+91 98810 55677',
    reportedDate: '2026-09-07 09:10 AM',
    status: 'Assigned',
    assignedWorkerId: 'W-03',
    assignedWorkerName: 'Ganesh Gaikwad',
    imageUrl: 'https://images.unsplash.com/photo-1584467735815-f778f274e296?w=600&auto=format&fit=crop&q=80',
    completionImageUrl: null,
    timeline: [
      { step: 'Reported', date: '07 Sep 2026, 09:10 AM', completed: true },
      { step: 'Assigned', date: '07 Sep 2026, 10:00 AM', completed: true },
      { step: 'In Progress', date: null, completed: false },
      { step: 'Completed', date: null, completed: false }
    ],
    notes: 'JCB crane requisitioned for debris clearance.'
  },
  {
    id: 'SWM-2026-00125',
    category: 'Roadside Garbage',
    description: 'Rotting vegetable residues and plastic bags scattered near vegetable market junction.',
    location: 'Satpur MIDC, Near ITI Signal',
    area: 'Satpur',
    lat: 19.9985,
    lng: 73.7312,
    citizenName: 'Sachin Jagtap',
    citizenEmail: 'sachin.jagtap@gmail.com',
    citizenPhone: '+91 99234 66778',
    reportedDate: '2026-09-07 04:00 PM',
    status: 'Pending',
    assignedWorkerId: null,
    assignedWorkerName: null,
    imageUrl: 'https://images.unsplash.com/photo-1605600659908-0ef719419d41?w=600&auto=format&fit=crop&q=80',
    completionImageUrl: null,
    timeline: [
      { step: 'Reported', date: '07 Sep 2026, 04:00 PM', completed: true },
      { step: 'Assigned', date: null, completed: false },
      { step: 'In Progress', date: null, completed: false },
      { step: 'Completed', date: null, completed: false }
    ],
    notes: 'Awaiting ward supervisor assignment.'
  },
  {
    id: 'SWM-2026-00126',
    category: 'Food Waste',
    description: 'Commercial banquet food scraps dumped in open plot producing pungent odor.',
    location: 'Dwarka Circle, Near Old Agra Road',
    area: 'Dwarka',
    lat: 19.9875,
    lng: 73.8010,
    citizenName: 'Aarav Deshmukh',
    citizenEmail: 'aarav.deshmukh@gmail.com',
    citizenPhone: '+91 98221 44556',
    reportedDate: '2026-09-08 09:30 AM',
    status: 'Pending',
    assignedWorkerId: null,
    assignedWorkerName: null,
    imageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&auto=format&fit=crop&q=80',
    completionImageUrl: null,
    timeline: [
      { step: 'Reported', date: '08 Sep 2026, 09:30 AM', completed: true },
      { step: 'Assigned', date: null, completed: false },
      { step: 'In Progress', date: null, completed: false },
      { step: 'Completed', date: null, completed: false }
    ],
    notes: 'Reported by citizen Aarav Deshmukh.'
  },
  {
    id: 'SWM-2026-00127',
    category: 'E-Waste',
    description: 'Broken computer monitors and electronic hardware left abandoned near commercial complex.',
    location: 'Indira Nagar, Near Jogging Track',
    area: 'Indira Nagar',
    lat: 19.9678,
    lng: 73.7745,
    citizenName: 'Vikram Sonawane',
    citizenEmail: 'vikram.sonawane@gmail.com',
    citizenPhone: '+91 98500 12345',
    reportedDate: '2026-09-08 11:20 AM',
    status: 'Assigned',
    assignedWorkerId: 'W-05',
    assignedWorkerName: 'Deepak More',
    imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&auto=format&fit=crop&q=80',
    completionImageUrl: null,
    timeline: [
      { step: 'Reported', date: '08 Sep 2026, 11:20 AM', completed: true },
      { step: 'Assigned', date: '08 Sep 2026, 12:00 PM', completed: true },
      { step: 'In Progress', date: null, completed: false },
      { step: 'Completed', date: null, completed: false }
    ],
    notes: 'E-waste vehicle scheduled for pickup.'
  },
  {
    id: 'SWM-2026-00128',
    category: 'Roadside Garbage',
    description: 'Discarded domestic trash sacks left near railway flyover pillar.',
    location: 'Nashik Road, Near Bitco Hospital',
    area: 'Nashik Road',
    lat: 19.9542,
    lng: 73.8340,
    citizenName: 'Meena Wagh',
    citizenEmail: 'meena.wagh@gmail.com',
    citizenPhone: '+91 97632 99881',
    reportedDate: '2026-09-04 10:00 AM',
    status: 'Rejected',
    assignedWorkerId: null,
    assignedWorkerName: null,
    imageUrl: 'https://images.unsplash.com/photo-1605600659908-0ef719419d41?w=600&auto=format&fit=crop&q=80',
    completionImageUrl: null,
    timeline: [
      { step: 'Reported', date: '04 Sep 2026, 10:00 AM', completed: true },
      { step: 'Rejected', date: '04 Sep 2026, 03:00 PM', completed: true }
    ],
    notes: 'Duplicate complaint filed for the same coordinate.'
  }
];

export const INITIAL_NOTIFICATIONS = [
  {
    id: 'N-1',
    userId: 'aarav.deshmukh@gmail.com',
    role: 'citizen',
    title: 'Report Assigned',
    message: 'Your report SWM-2026-00121 has been assigned to worker Ganesh Gaikwad.',
    date: '06 Sep 2026, 10:15 AM',
    read: false
  },
  {
    id: 'N-2',
    userId: 'aarav.deshmukh@gmail.com',
    role: 'citizen',
    title: 'Work In Progress',
    message: 'Worker Ganesh Gaikwad has started collection for SWM-2026-00121.',
    date: '07 Sep 2026, 09:00 AM',
    read: true
  },
  {
    id: 'N-3',
    userId: 'admin@nashik-swm.gov.in',
    role: 'admin',
    title: 'New Citizen Complaint',
    message: 'Aarav Deshmukh submitted complaint SWM-2026-00126 in Dwarka Circle.',
    date: '08 Sep 2026, 09:30 AM',
    read: false
  },
  {
    id: 'N-4',
    userId: 'W-03',
    role: 'worker',
    title: 'New Task Assigned',
    message: 'New waste collection task assigned to you: SWM-2026-00124 (College Road).',
    date: '07 Sep 2026, 10:00 AM',
    read: false
  },
  {
    id: 'N-5',
    userId: 'W-01',
    role: 'worker',
    title: 'Task Completed Verified',
    message: 'Task SWM-2026-00123 has been verified and closed by Ward Supervisor.',
    date: '06 Sep 2026, 11:30 AM',
    read: true
  }
];

export const DEMO_USERS = {
  citizen: {
    name: 'Aarav Deshmukh',
    email: 'aarav.deshmukh@gmail.com',
    phone: '+91 98221 44556',
    role: 'citizen',
    area: 'Gangapur Road',
    address: 'Flat 302, Sai Residency, Gangapur Road, Nashik - 422013'
  },
  admin: {
    name: 'Pradeep Suryawanshi',
    email: 'admin@nashik-swm.gov.in',
    phone: '+91 94222 10001',
    role: 'admin',
    department: 'Solid Waste Management Dept, NMC Head Office',
    designation: 'Executive Sanitary Inspector'
  },
  worker: {
    name: 'Ramesh Shinde',
    workerId: 'W-01',
    employeeId: 'NMC-SAN-401',
    phone: '+91 98230 11223',
    role: 'worker',
    assignedArea: 'CIDCO',
    division: 'Zone 4 Sanitary Division'
  }
};
