import React from 'react';
import ReactECharts from 'echarts-for-react';
import { useWindowDimensions } from '@/CommonData';

const LineCharts = ({ xLable, yLable, Top3Services }: { xLable?: string, yLable?: string, Top3Services: any }) => {
  const { width } = useWindowDimensions();

  // Prepare dynamic data for ECharts
  const xAxisData = Top3Services?.map((item: any) => item.ratingreceived) || [];
  const seriesData = Top3Services?.map((item: any) => item.spatreatments) || [];

  const option = {
    title: {
      text: 'Today Leads',
      left: 'center',
      textStyle: {
        fontSize: 18,
      },
    },
    xAxis: {
      type: 'category',
      data: xAxisData,
      axisLabel: {
        rotate: 45, // Optional: Rotate labels for better visibility
      },
      name: xLable || '', // Dynamic x-axis label
      nameLocation: 'middle',
      nameGap: 30,
    },
    yAxis: {
      type: 'value',
      name: yLable || '', // Dynamic y-axis label
      nameLocation: 'middle',
      nameGap: 50,
    },
    series: [
      {
        data: seriesData,
        type: 'line',
        smooth: true, // Makes the line smooth
        name: 'Today Leads',
        lineStyle: {
          color: '#605BFF',
        },
        itemStyle: {
          color: '#605BFF',
        },
      },
    ],
    tooltip: {
      trigger: 'axis',
      formatter: (params: any) => {
        const [dataPoint] = params;
        return `${dataPoint.marker} ${dataPoint.name}: ${dataPoint.value}`;
      },
    },
  };

  return (
    <div className='w-full bg-white p-7 rounded-2xl'>
      <h1 className="text-2xl font-bold mb-4">Today Tasks</h1>
      <div className='relative'>
        {xLable && <span className='absolute z-10 rotate-[270deg] bottom-2/4 -left-[45px]'>{xLable}</span>}
        {yLable && <span className='absolute z-10 bottom-[15px] left-2/4'>{yLable}</span>}
        <ReactECharts option={option} style={{ height: 450 }} className='w-full' />
      </div>
    </div>
  );
};

export default LineCharts;
