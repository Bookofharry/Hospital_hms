export type Role = 'ADMIN' | 'MANAGER' | 'TECHNICIAN' | 'STAFF';

export const demoUsers = [
    {
        id: 'u-001',
        name: 'Dr. Amina Kone',
        email: 'amina.kone@hmms.demo',
        role: 'ADMIN' as Role,
        department: 'Facilities',
        createdAt: '2025-10-02T08:12:00Z',
        status: 'Active'
    },
    {
        id: 'u-002',
        name: 'Samuel Otieno',
        email: 'samuel.otieno@hmms.demo',
        role: 'MANAGER' as Role,
        department: 'Radiology',
        createdAt: '2025-11-14T09:30:00Z',
        status: 'Active'
    },
    {
        id: 'u-003',
        name: 'Lena Park',
        email: 'lena.park@hmms.demo',
        role: 'TECHNICIAN' as Role,
        department: 'Biomedical',
        createdAt: '2025-09-18T13:45:00Z',
        status: 'Active'
    },
    {
        id: 'u-004',
        name: 'Joseph Wanjala',
        email: 'joseph.wanjala@hmms.demo',
        role: 'TECHNICIAN' as Role,
        department: 'Electrical',
        createdAt: '2025-08-21T07:20:00Z',
        status: 'Active'
    },
    {
        id: 'u-005',
        name: 'Grace Njeri',
        email: 'grace.njeri@hmms.demo',
        role: 'STAFF' as Role,
        department: 'Ward 3A',
        createdAt: '2025-12-04T15:05:00Z',
        status: 'Active'
    }
];

export const demoAssets = [
    {
        id: 'a-1001',
        name: 'MRI Scanner - West Wing',
        model: 'Siemens Magnetom Aera',
        serialNumber: 'MRI-8891-AX',
        location: 'Radiology - Room 2',
        department: 'Radiology',
        status: 'Operational',
        warrantyEndDate: '2027-03-30'
    },
    {
        id: 'a-1002',
        name: 'ICU Ventilator',
        model: 'Puritan Bennett 980',
        serialNumber: 'ICU-VENT-551',
        location: 'ICU - Bay 6',
        department: 'ICU',
        status: 'In Service',
        warrantyEndDate: '2026-11-15'
    },
    {
        id: 'a-1003',
        name: 'CT Scanner - East Wing',
        model: 'GE Revolution EVO',
        serialNumber: 'CT-3377-ER',
        location: 'Radiology - Room 1',
        department: 'Radiology',
        status: 'Operational',
        warrantyEndDate: '2028-01-10'
    },
    {
        id: 'a-1004',
        name: 'Autoclave Sterilizer',
        model: 'Tuttnauer 3870EA',
        serialNumber: 'STER-1103-CT',
        location: 'CSSD - Sterile Room',
        department: 'Sterile Services',
        status: 'Under Review',
        warrantyEndDate: '2026-05-22'
    },
    {
        id: 'a-1005',
        name: 'Generator Unit - Backup',
        model: 'Cummins C200D5',
        serialNumber: 'GEN-2207-DZ',
        location: 'Utilities - Basement',
        department: 'Facilities',
        status: 'Operational',
        warrantyEndDate: '2029-08-01'
    }
];

export const demoWorkOrders = [
    {
        id: 'wo-2001',
        title: 'MRI cooling system alert',
        description: 'Chiller temperature rising above threshold. Inspect coolant flow and compressor pressure.',
        priority: 'HIGH',
        status: 'IN_PROGRESS',
        createdAt: '2026-02-02T08:30:00Z',
        asset: { id: 'a-1001', name: 'MRI Scanner - West Wing', location: 'Radiology - Room 2' },
        assignedTo: { id: 'u-003', name: 'Lena Park' },
        createdBy: { name: 'Samuel Otieno' },
        attachments: [
            {
                id: 'att-1',
                url: '/demo/wo/mri-alert.jpg',
                fileName: 'temperature-log.jpg',
                fileType: 'image/jpeg',
                createdAt: '2026-02-02T09:10:00Z'
            }
        ],
        timeLogs: [
            {
                id: 'log-1',
                minutes: 45,
                description: 'Checked compressor readings and reset warning state.',
                user: { name: 'Lena Park' },
                createdAt: '2026-02-02T10:00:00Z'
            }
        ]
    },
    {
        id: 'wo-2002',
        title: 'Ventilator calibration due',
        description: 'Quarterly calibration per compliance schedule.',
        priority: 'MEDIUM',
        status: 'PENDING',
        createdAt: '2026-02-03T07:40:00Z',
        asset: { id: 'a-1002', name: 'ICU Ventilator', location: 'ICU - Bay 6' },
        assignedTo: { id: 'u-004', name: 'Joseph Wanjala' },
        createdBy: { name: 'Dr. Amina Kone' },
        attachments: [],
        timeLogs: []
    },
    {
        id: 'wo-2003',
        title: 'Generator fuel sensor mismatch',
        description: 'Diesel sensor reading inconsistent with manual gauge.',
        priority: 'CRITICAL',
        status: 'ASSIGNED',
        createdAt: '2026-02-01T18:20:00Z',
        asset: { id: 'a-1005', name: 'Generator Unit - Backup', location: 'Utilities - Basement' },
        assignedTo: { id: 'u-004', name: 'Joseph Wanjala' },
        createdBy: { name: 'Grace Njeri' },
        attachments: [],
        timeLogs: []
    },
    {
        id: 'wo-2004',
        title: 'Autoclave door seal inspection',
        description: 'Replace worn gasket to maintain pressure seal.',
        priority: 'LOW',
        status: 'COMPLETED',
        createdAt: '2026-01-29T11:05:00Z',
        asset: { id: 'a-1004', name: 'Autoclave Sterilizer', location: 'CSSD - Sterile Room' },
        assignedTo: { id: 'u-003', name: 'Lena Park' },
        createdBy: { name: 'Samuel Otieno' },
        attachments: [],
        timeLogs: [
            {
                id: 'log-2',
                minutes: 70,
                description: 'Replaced seal and tested pressure retention.',
                user: { name: 'Lena Park' },
                createdAt: '2026-01-29T12:30:00Z'
            }
        ]
    }
];

export const demoInventoryItems = [
    {
        id: 'inv-3001',
        name: 'HVAC Air Filter 24x24',
        sku: 'HVAC-FLT-2424',
        description: 'MERV 13 replacement filters',
        quantity: 36,
        minimumStock: 20,
        unit: 'pcs',
        supplier: { name: 'MedSupply East' }
    },
    {
        id: 'inv-3002',
        name: 'Infusion Pump Tubing Set',
        sku: 'INF-TUBE-900',
        description: 'Sterile single-use tubing',
        quantity: 12,
        minimumStock: 25,
        unit: 'packs',
        supplier: { name: 'CareLine Supplies' }
    },
    {
        id: 'inv-3003',
        name: 'Generator Fuel Sensor',
        sku: 'GEN-SNS-441',
        description: 'Analog sensor replacement kit',
        quantity: 8,
        minimumStock: 5,
        unit: 'kits',
        supplier: { name: 'PowerTech Global' }
    },
    {
        id: 'inv-3004',
        name: 'Autoclave Door Gasket',
        sku: 'AUTO-SEAL-12',
        description: 'High-temp silicone gasket',
        quantity: 3,
        minimumStock: 6,
        unit: 'pcs',
        supplier: { name: 'SterilePro' }
    }
];

export const demoSuppliers = [
    {
        id: 'sup-1',
        name: 'MedSupply East',
        email: 'orders@medsupplyeast.demo',
        phone: '+1 (202) 555-0175',
        address: '2300 M St NW, Washington, DC'
    },
    {
        id: 'sup-2',
        name: 'CareLine Supplies',
        email: 'hello@careline.demo',
        phone: '+1 (202) 555-0112',
        address: '4800 Georgia Ave NW, Washington, DC'
    },
    {
        id: 'sup-3',
        name: 'PowerTech Global',
        email: 'support@powertech.demo',
        phone: '+1 (202) 555-0191',
        address: '1410 14th St NW, Washington, DC'
    }
];

export const demoPreventivePlans = [
    {
        id: 'pm-01',
        name: 'MRI Cooling System Check',
        description: 'Inspect coolant levels, compressor pressures, and filter cleanliness.',
        frequency: 'WEEKLY' as const,
        assetId: 'a-1001',
        assignedToId: 'u-003',
        nextDue: '2026-02-07T09:00:00Z',
        isActive: true,
        asset: { name: 'MRI Scanner - West Wing' },
        assignedTo: { name: 'Lena Park' }
    },
    {
        id: 'pm-02',
        name: 'Generator Load Test',
        description: 'Run load test and record output stability.',
        frequency: 'MONTHLY' as const,
        assetId: 'a-1005',
        assignedToId: 'u-004',
        nextDue: '2026-02-15T10:00:00Z',
        isActive: true,
        asset: { name: 'Generator Unit - Backup' },
        assignedTo: { name: 'Joseph Wanjala' }
    },
    {
        id: 'pm-03',
        name: 'Sterilizer Seal Audit',
        description: 'Inspect autoclave door seal and replace if needed.',
        frequency: 'MONTHLY' as const,
        assetId: 'a-1004',
        assignedToId: 'u-003',
        nextDue: '2026-02-12T08:30:00Z',
        isActive: true,
        asset: { name: 'Autoclave Sterilizer' },
        assignedTo: { name: 'Lena Park' }
    }
];

export const demoOxygenCylinders = [
    {
        id: 'ox-01',
        serialNumber: 'O2-4421',
        status: 'FULL' as const,
        location: 'Main Store',
        size: 'Jumbo',
        logs: []
    },
    {
        id: 'ox-02',
        serialNumber: 'O2-4479',
        status: 'IN_USE' as const,
        location: 'Ward 3A',
        size: 'Small',
        logs: []
    },
    {
        id: 'ox-03',
        serialNumber: 'O2-4402',
        status: 'EMPTY' as const,
        location: 'Main Store',
        size: 'Jumbo',
        logs: []
    }
];

export const demoUtilityReadings = [
    {
        id: 'ut-01',
        type: 'ELECTRICITY' as const,
        value: 1320,
        unit: 'kWh',
        recordedAt: '2026-02-01T18:00:00Z',
        recordedBy: { name: 'Samuel Otieno' }
    },
    {
        id: 'ut-02',
        type: 'WATER' as const,
        value: 540,
        unit: 'Liters',
        recordedAt: '2026-02-02T18:00:00Z',
        recordedBy: { name: 'Grace Njeri' }
    },
    {
        id: 'ut-03',
        type: 'DIESEL' as const,
        value: 210,
        unit: 'Liters',
        recordedAt: '2026-02-03T18:00:00Z',
        recordedBy: { name: 'Joseph Wanjala' }
    },
    {
        id: 'ut-04',
        type: 'ELECTRICITY' as const,
        value: 1385,
        unit: 'kWh',
        recordedAt: '2026-02-04T18:00:00Z',
        recordedBy: { name: 'Samuel Otieno' }
    }
];

export const demoRequisitions = [
    {
        id: 'req-01',
        title: 'Procure spare ventilator valves',
        description: 'Need 12 replacement valves for ICU ventilators.',
        status: 'PENDING' as const,
        requesterId: 'u-005',
        requester: { name: 'Grace Njeri', email: 'grace.njeri@hmms.demo' },
        createdAt: '2026-02-02T09:50:00Z'
    },
    {
        id: 'req-02',
        title: 'Replace CT gantry coolant',
        description: 'Monthly coolant replacement for CT scanner.',
        status: 'APPROVED' as const,
        requesterId: 'u-002',
        requester: { name: 'Samuel Otieno', email: 'samuel.otieno@hmms.demo' },
        approverId: 'u-001',
        approver: { name: 'Dr. Amina Kone' },
        createdAt: '2026-01-28T16:15:00Z'
    },
    {
        id: 'req-03',
        title: 'Request new autoclave gasket',
        description: 'Seal worn; needs replacement stock.',
        status: 'REJECTED' as const,
        requesterId: 'u-003',
        requester: { name: 'Lena Park', email: 'lena.park@hmms.demo' },
        approverId: 'u-001',
        approver: { name: 'Dr. Amina Kone' },
        createdAt: '2026-01-20T14:10:00Z'
    }
];

export const demoAssetHealth = [
    { name: 'Operational', value: 68 },
    { name: 'Needs Attention', value: 22 },
    { name: 'Out of Service', value: 10 }
];

export const demoWorkOrderStats = [
    { name: 'Pending', value: 6 },
    { name: 'Assigned', value: 9 },
    { name: 'In Progress', value: 12 },
    { name: 'Completed', value: 7 },
    { name: 'Closed', value: 4 }
];

export const demoDashboardStats = {
    totalAssets: 124,
    activeWorkOrders: 28,
    lowStockItems: 6,
    emptyCylinders: 3
};

export const demoPriorityStats = [
    { name: 'LOW', count: 8 },
    { name: 'MEDIUM', count: 14 },
    { name: 'HIGH', count: 6 },
    { name: 'CRITICAL', count: 2 }
];

export const demoStatusStats = [
    { name: 'PENDING', count: 6 },
    { name: 'ASSIGNED', count: 9 },
    { name: 'IN_PROGRESS', count: 12 },
    { name: 'COMPLETED', count: 7 },
    { name: 'CLOSED', count: 4 }
];
