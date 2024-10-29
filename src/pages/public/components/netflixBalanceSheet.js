export const translations = {
    pending: 'Pending',
    success: 'Processed',
    failed: 'Failed',
  };
  
  export function addLabels(series) {
    return series.map((item) => ({
      ...item,
      label: translations[item.dataKey],
      valueFormatter: (v) => (v ? `${v.toLocaleString()}` : '-'),
    }));
  }
  
  export const balanceSheet = [
    {
        year: '1/2023',
        success: 3000,
        failed: 100,
        pending: 0,
      },
      {
        year: '2/2023',
        success: 3000,
        failed: 100,
        pending: 0,
      },
      {
        year: '3/2023',
        success: 3000,
        failed: 100,
        pending: 0,
      },
      {
        year: '4/2023',
        success: 3000,
        failed: 100,
        pending: 0,
      },
      {
        year: '5/2023',
        success: 3400,
        failed: 90,
        pending: 0,
      },
      {
        year: '6/2023',
        success: 2900,
        failed: 75,
        pending: 0,
      },
      {
        year: '7/2023',
        success: 3700,
        failed: 80,
        pending: 0,
      },
      {
        year: '8/2023',
        success: 2800,
        failed: 95,
        pending: 0,
      },
      {
        year: '9/2023',
        success: 3200,
        failed: 60,
        pending: 0,
      },
      {
        year: '10/2023',
        success: 3100,
        failed: 85,
        pending: 0,
      },
      {
        year: '11/2023',
        success: 3600,
        failed: 70,
        pending: 0,
      },
      {
        year: '12/2023',
        success: 3000,
        failed: 65,
        pending: 0,
      },
      {
        year: '1/2024',
        success: 3200,
        failed: 50,
        pending: 0,
      },
      {
        year: '2/2024',
        success: 3100,
        failed: 80,
        pending: 0,
      },
      {
        year: '3/2024',
        success: 3300,
        failed: 95,
        pending: 0,
      },
      {
        year: '4/2024',
        success: 2900,
        failed: 70,
        pending: 0,
      },
      {
        year: '5/2024',
        success: 3400,
        failed: 85,
        pending: 0,
      },
      {
        year: '6/2024',
        success: 3550,
        failed: 60,
        pending: 0,
      },
      {
        year: '7/2024',
        success: 3700,
        failed: 75,
        pending: 0,
      },
      {
        year: '8/2024',
        success: 0,
        failed: 0,
        pending: 3500,
      },
      {
        year: '9/2024',
        success: 0,
        failed: 0,
        pending: 1000,
      },
      {
        year: '10/2024',
        success: 0,
        failed: 0,
        pending: 2000,
      },
  ];