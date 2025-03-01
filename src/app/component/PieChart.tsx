import React, { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';

const PieChart = ({ leadsCountByCourseId }: { leadsCountByCourseId?: any }) => {
    const data = useMemo(() => {
        return {
            Follow_up_Leads: parseInt(leadsCountByCourseId?.[0]?.count ? leadsCountByCourseId?.[0]?.count : 0),
            Opportunity_leads: parseInt(leadsCountByCourseId?.[1]?.count ? leadsCountByCourseId?.[1]?.count : 0),
            Warm_Leads: parseInt(leadsCountByCourseId?.[2]?.count ? leadsCountByCourseId?.[2]?.count : 0)
        };
    }, [leadsCountByCourseId]);


    const total =
        data.Follow_up_Leads + data.Opportunity_leads + data.Warm_Leads;
    const FollowupLeads = total > 0 ? (data.Follow_up_Leads / total) * 100 : 0;
    const OpportunityLeads = total > 0 ? (data.Opportunity_leads / total) * 100 : 0;
    const WarmLeads = total > 0 ? (data.Warm_Leads / total) * 100 : 0;

    const chartData = useMemo(
        () => [
            { value: FollowupLeads, name: 'Follow up Leads' },
            { value: OpportunityLeads, name: 'Opportunity Leads' },
            { value: WarmLeads, name: 'Warm Leads' },
        ],
        [FollowupLeads, OpportunityLeads, WarmLeads]
    );

    const option = useMemo(
        () => ({
            tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b}: {c} ({d}%)',
            },
            legend: {
                bottom: '5%',
                left: 'center',
            },
            color: ['#5B93FF', '#FFD66B', '#FF8F6B'],
            series: [
                {
                    name: 'Leads',
                    type: 'pie',
                    radius: ['40%', '70%'],
                    avoidLabelOverlap: false,
                    itemStyle: {
                        borderRadius: 10,
                        borderColor: '#fff',
                        borderWidth: 2,
                    },
                    label: {
                        show: false,
                        position: 'center',
                    },
                    emphasis: {
                        label: {
                            show: true,
                            fontSize: 20,
                            fontWeight: 'bold',
                            formatter: `{b}\n{c} ({d}%)`,
                        },
                    },
                    labelLine: {
                        show: false,
                    },
                    data: chartData,
                },
            ],
        }),
        [chartData]
    );

    return (
        <div className='bg-white p-7 rounded-2xl'>
            <h1 className='text-2xl font-bold'>Analytics</h1>
            <div className='-my-7'>
                <ReactECharts option={option} style={{ height: 450, width: 450 }} />
            </div>
        </div>
    );
};

export default PieChart;
